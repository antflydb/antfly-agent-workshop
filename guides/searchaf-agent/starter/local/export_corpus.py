"""Export complete, explicitly selected synthetic Atlas bodies over native MCP."""
import argparse,asyncio,hashlib,json,os,sys
from pathlib import Path
HERE=Path(__file__).parent
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--output',type=Path,required=True)
p.add_argument('--checks',type=Path,default=HERE.parent/'corpus-checks.json')
a=p.parse_args()
import adapter
import check_pipeline
from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client
FORMATS={'.md':'Markdown','.pdf':'PDF','.png':'Image'}
async def main():
 pipeline=await check_pipeline.check()
 config=adapter.configuration(); source=Path(config['roots'][0]); expected={p.name:p for p in source.iterdir() if p.is_file()}
 assert set(expected)=={'atlas-approved-plan.md','atlas-draft.md','atlas-meeting.md','untrusted-note.md','atlas-support-guide.pdf','atlas-sync-error.png','atlas-rollback-checklist.png'},'Unexpected Atlas corpus manifest'
 assert all(not p.is_symlink() for p in expected.values()),'Refusing symlinked corpus source'
 destination=a.output.expanduser().resolve(); assert not destination.is_relative_to(source.resolve()),'Export destination must be outside corpus'; destination.mkdir(parents=True,exist_ok=True,mode=0o700)
 rows=[]
 async with streamable_http_client(adapter.endpoint(config)) as (read,write,_):
  async with ClientSession(read,write) as session:
   await session.initialize();grants=await adapter.grants(session,config)
   assert len(grants)==1 and grants[0]['kind']=='local','Unexpected source grants'
   grant=grants[0]
   data=await adapter.call(session,'query',{'tableName':'files','queryRequest':{'filter_query':{'term':grant['watch_dir_id'],'field':'watch_dir_id'},'limit':100,'fields':adapter.FIELDS,'hierarchy':{}}})
   matches=adapter.hits(data)
   totals=[r['hits']['total'] for r in data['responses']]
   assert len(totals)==1 and totals[0]=={'value':len(expected),'relation':'exact'},'Enumeration must be complete and exact'
   assert len(matches)==len(expected),'Selected indexed source count differs from manifest'
   seen=set()
   for hit in matches:
    doc=await adapter.call(session,'get_document',{'tableName':'files','key':hit['_id']})
    assert adapter.allowed_document(doc,grant,config['roots']),'Out-of-scope document'
    name=doc['filename'];assert name in expected and name not in seen,'Unexpected/duplicate source';seen.add(name)
    body=doc.get('content');assert isinstance(body,str) and body.strip(),'Missing complete body'
    actual_path=Path(doc['path']);assert actual_path.resolve()==expected[name].resolve(),'Source identity mismatch'
    docid='atlas-'+hashlib.sha256(('atlas-support-packet/'+name).encode()).hexdigest()[:24]
    row={'filename':name,'source_format':FORMATS[expected[name].suffix],'content':body,'content_sha256':hashlib.sha256(body.encode()).hexdigest(),'source_sha256':hashlib.sha256(expected[name].read_bytes()).hexdigest(),'source_relative_path':name,'extraction_provenance':{'tool':'SearchAF','representation':'complete extracted row text; image text may include OCR and inferred captions'}}
    rows.append({'id':docid,'document':row})
   assert seen==set(expected),'Missing selected sources'
   assert config==adapter.configuration() and grants==await adapter.grants(session,config),'Source authorization changed during export'
 rows.sort(key=lambda r:r['document']['filename'])
 manifest=[{'id':r['id'],'filename':r['document']['filename'],'content_sha256':r['document']['content_sha256'],'source_sha256':r['document']['source_sha256'],'characters':len(r['document']['content'])} for r in rows]
 version='atlas-'+hashlib.sha256(json.dumps(manifest,sort_keys=True).encode()).hexdigest()[:16]
 for r in rows:r['document']['corpus_version']=version
 bundle={'corpus':'atlas-support-packet','version':version,'documents':rows}
 for name,data in [('corpus.json',bundle),('manifest.json',{'corpus':'atlas-support-packet','version':version,'documents':manifest})]:
  target=destination/name;target.write_text(json.dumps(data,indent=2)+'\n');target.chmod(0o600)
 checks=json.loads(a.checks.read_text())
 for case in checks:
  body=next(r['document']['content'] for r in rows if r['document']['filename']==case['file'])
  normalized=' '.join(body.casefold().split())
  assert all(' '.join(v.casefold().split()) in normalized for v in case['expect']),'Full body failed passage check'
 print(json.dumps({'exported_documents':len(rows),'corpus_version':version,'body_characters':sum(len(r['document']['content']) for r in rows),'full_body_passage_checks':len(checks),'excluded_personal_paths_and_bindings':True,'enrichment':pipeline}))
asyncio.run(main())
