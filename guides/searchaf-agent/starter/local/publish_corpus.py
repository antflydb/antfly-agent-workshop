"""Plan or publish the exported synthetic Atlas packet to a dedicated Cloud table."""
import argparse,asyncio,hashlib,json,re,stat
from pathlib import Path
import httpx

def load_bundle(path):
    bundle=json.loads(path.read_text())
    rows=bundle['documents']
    if bundle['corpus']!='atlas-support-packet' or len(rows)!=7 or len({r['id'] for r in rows})!=7:
        raise ValueError('Expected the complete seven-document Atlas export')
    expected={'atlas-approved-plan.md','atlas-draft.md','atlas-meeting.md','untrusted-note.md','atlas-support-guide.pdf','atlas-sync-error.png','atlas-rollback-checklist.png'}
    if {r['document']['filename'] for r in rows}!=expected:raise ValueError('Unexpected Atlas filenames')
    for row in rows:
        doc=row['document']
        if set(doc)!={'filename','source_format','content','content_sha256','source_sha256','source_relative_path','extraction_provenance','corpus_version'}:raise ValueError('Export contains unexpected fields')
        expected_id='atlas-'+hashlib.sha256(('atlas-support-packet/'+doc['filename']).encode()).hexdigest()[:24]
        if row['id']!=expected_id or doc['source_relative_path']!=doc['filename']:raise ValueError('Source identity mismatch')
        if hashlib.sha256(doc['content'].encode()).hexdigest()!=doc['content_sha256'] or doc['corpus_version']!=bundle['version']:
            raise ValueError('Export body hash/version mismatch')
    return bundle

def secret(path):
    if path.is_symlink() or not stat.S_ISREG(path.stat().st_mode) or stat.S_IMODE(path.stat().st_mode)&0o077:
        raise ValueError('Credential must be a private regular file (chmod 600)')
    return path.read_text().strip()

async def publish(a,bundle):
    base=a.api_base.rstrip('/')
    if not re.fullmatch(r'https://platform\.antfly\.io/cloud/v1/[0-9a-f-]{36}',base):
        raise ValueError('Use the approved Antfly Cloud instance API base')
    if not re.fullmatch(r'atlas_workshop_[a-zA-Z0-9_]+',a.table):
        raise ValueError('Use a dedicated atlas_workshop_ table')
    url=base+'/db/v1/tables/'+a.table
    headers={'Authorization':'Bearer '+secret(a.publisher_key)}
    async with httpx.AsyncClient(headers=headers,timeout=180) as client:
        response=await client.get(url)
        if response.status_code==404:
            response=await client.post(url,json={'num_shards':1,'indexes':{'document_vectors':{'type':'embeddings','dimension':512,'field':'content','embedder':{'provider':'antfly','model':'antflydb/clipclap:gguf:Q4_K'}}}})
            response.raise_for_status()
        else:
            response.raise_for_status()
            indexes=response.json()['indexes']
            idx=indexes.get('document_vectors',{})
            if idx.get('field')!='content' or idx.get('dimension')!=512 or idx.get('embedder',{}).get('model')!='antflydb/clipclap:gguf:Q4_K':
                raise ValueError('Existing table has incompatible index configuration; nothing changed')
            response=await client.post(url+'/query',json={'filter_query':{'match_all':{}},'limit':8,'fields':['corpus_version'],'hierarchy':{}})
            response.raise_for_status(); result=response.json()['responses'][0]['hits']
            if result['total']['relation']!='exact' or result['total']['value']>7 or any(h['_id'] not in {r['id'] for r in bundle['documents']} for h in result['hits']):
                raise ValueError('Existing table contains unexpected rows; nothing changed')
        response=await client.post(url+'/batch',json={'inserts':{r['id']:r['document'] for r in bundle['documents']},'sync_level':'full_index'})
        response.raise_for_status()
    await verify(a,bundle)

async def verify(a,bundle):
    base=a.api_base.rstrip('/')
    if not re.fullmatch(r'https://platform\.antfly\.io/cloud/v1/[0-9a-f-]{36}',base) or not re.fullmatch(r'atlas_workshop_[a-zA-Z0-9_]+',a.table):raise ValueError('Invalid approved Cloud target')
    url=base+'/db/v1/tables/'+a.table
    async with httpx.AsyncClient(headers={'Authorization':'Bearer '+secret(a.reader_key)},timeout=180) as client:
        for row in bundle['documents']:
            response=await client.get(url+'/documents/'+row['id']);response.raise_for_status()
            if response.json()!=row['document']:raise ValueError('Complete Cloud readback mismatch')
            for mode in ['full_text_search','semantic_search']:
                request={'filter_query':{'ids':[row['id']]},'limit':1,'fields':['filename'],'hierarchy':{}}
                if mode=='full_text_search':request[mode]={'match':row['document']['content'],'field':'content'}
                else:request.update({'semantic_search':row['document']['content'],'indexes':['document_vectors']})
                response=await client.post(url+'/query',json=request);response.raise_for_status()
                hits=response.json()['responses'][0]['hits']['hits']
                if not hits or hits[0]['_id']!=row['id'] or (mode=='semantic_search' and '_distance' not in hits[0]):raise ValueError('Missing Cloud index coverage: '+mode+' / '+row['document']['filename'])
        for check in json.loads(a.checks.read_text()):
            response=await client.post(url+'/query',json={'full_text_search':{'match':check['query']},'semantic_search':check['query'],'indexes':['document_vectors'],'filter_query':{'term':bundle['version'],'field':'corpus_version.keyword'},'limit':7,'fields':['filename','content','corpus_version'],'hierarchy':{}})
            response.raise_for_status();result=response.json()
            hits=result['responses'][0]['hits']['hits']
            source=next(h['_source'] for h in hits if h['_source']['filename']==check['file'])
            if not all(' '.join(v.casefold().split()) in ' '.join(source['content'].casefold().split()) for v in check['expect']):
                raise ValueError('Cloud passage check failed: '+check['file'])
        response=await client.post(url+'/query',json={'filter_query':{'match_all':{}},'limit':8,'fields':['corpus_version'],'hierarchy':{}})
        response.raise_for_status();result=response.json()['responses'][0]['hits']
        if result['total']!={'value':7,'relation':'exact'} or any(h['_source']['corpus_version']!=bundle['version'] for h in result['hits']):
            raise ValueError('Cloud corpus publication incomplete')
        response=await client.get(base+'/db/v1/tables/atlas_workshop_permission_probe')
        if response.status_code!=403:raise ValueError('Read-only table-scope denial failed')
        response=await client.post(url+'/batch',json={'inserts':{}})
        if response.status_code!=403:raise ValueError('Read-only write denial failed')
    print(json.dumps({'verified_documents':7,'corpus_version':bundle['version'],'complete_readbacks':7,'cloud_text_vectors':7,'cloud_full_text_rows':7,'cloud_passage_checks':4,'read_only_write_denied':True,'read_only_table_scope_denied':True,'cloud_transport':'REST'}))

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--bundle',type=Path,required=True);p.add_argument('--api-base',required=True);p.add_argument('--table',required=True)
    p.add_argument('--checks',type=Path,default=Path(__file__).parents[1]/'corpus-checks.json')
    mode=p.add_mutually_exclusive_group();mode.add_argument('--publish',action='store_true');mode.add_argument('--verify-only',action='store_true');p.add_argument('--publisher-key',type=Path);p.add_argument('--reader-key',type=Path)
    a=p.parse_args();bundle=load_bundle(a.bundle)
    if a.verify_only:
        if not a.reader_key:p.error('Verification needs a private reader key file')
        asyncio.run(verify(a,bundle));return
    if not a.publish:
        print(json.dumps({'operation':'plan','target':a.api_base,'table':a.table,'documents':7,'version':bundle['version'],'network_requests':0}));return
    if not a.publisher_key or not a.reader_key:p.error('Publication needs private publisher and reader key files')
    asyncio.run(publish(a,bundle))
if __name__=='__main__':main()
