"""Verify actual enrichment outputs for the explicitly selected Atlas folder."""
import argparse,asyncio,hashlib,json,time
from pathlib import Path
import httpx
import adapter

async def check():
    config=adapter.configuration()
    if len(config['roots'])!=1:raise ValueError('Atlas pipeline gate requires exactly one selected root')
    source=json.loads(Path(config['searchaf_config']).read_text())
    manifest=json.loads((Path(__file__).parents[1]/'corpus-manifest.json').read_text())
    root=Path(config['roots'][0])
    actual={p.name for p in root.iterdir()}
    if actual!=set(manifest):raise ValueError('The selected folder must contain exactly the bundled Atlas packet')
    for name,digest in manifest.items():
        path=root/name
        if path.is_symlink() or hashlib.sha256(path.read_bytes()).hexdigest()!=digest:raise ValueError('Bundled source changed: '+name)
    if source.get('intelligence_mode')!='semantic':raise ValueError('Choose Local intelligence in SearchAF')
    if not {'pdfs','images','notes'}.issubset(set(source.get('selected_profiles',[]))):
        raise ValueError('Select the PDFs, Images and Notes profiles')
    for field in ['enable_ocr','enable_captions','enable_similarity']:
        if source.get(field) is False:raise ValueError('Remove the disabled override for '+field)
    base=adapter.endpoint(config).removesuffix('/mcp/v1')+'/db/v1/tables'
    # Reuse the native source authorization contract, then inspect only selected IDs.
    from mcp import ClientSession
    from mcp.client.streamable_http import streamable_http_client
    async with streamable_http_client(adapter.endpoint(config)) as (rd,wr,_):
        async with ClientSession(rd,wr) as session:
            await session.initialize();grants=await adapter.grants(session,config)
            if len(grants)!=1 or grants[0]['kind']!='local':raise ValueError('Expected one local corpus grant')
            result=await adapter.call(session,'query',{'tableName':'files','queryRequest':{'filter_query':{'term':grants[0]['watch_dir_id'],'field':'watch_dir_id'},'limit':8,'hierarchy':{}}})
            if result['responses'][0]['hits']['total']!={'value':7,'relation':'exact'}:raise ValueError('Wait for exactly seven indexed sources')
            ids=[h['_id'] for h in adapter.hits(result)]
            documents=[]
            for key in ids:
                doc=await adapter.call(session,'get_document',{'tableName':'files','key':key})
                if not adapter.allowed_document(doc,grants[0],config['roots']):raise ValueError('Source authorization mismatch')
                documents.append((key,doc))
            if config!=adapter.configuration() or grants!=await adapter.grants(session,config):raise ValueError('Source authorization changed')
    expected={'atlas-approved-plan.md','atlas-draft.md','atlas-meeting.md','untrusted-note.md','atlas-support-guide.pdf','atlas-sync-error.png','atlas-rollback-checklist.png'}
    if {doc['filename'] for _,doc in documents}!=expected:raise ValueError('Unexpected Atlas sources')
    text_vectors=images=graph_records=0
    async with httpx.AsyncClient(timeout=90) as client:
        for key,doc in documents:
            if doc.get('content_hash') not in {'sha256:'+manifest[doc['filename']],'sha256:'+manifest[doc['filename']]+':pdfx2'}:raise ValueError('Wait for current source extraction: '+doc['filename'])
            if not doc.get('content') or not doc.get('semantic_content'):raise ValueError('Missing complete extracted text')
            response=await client.post(base+'/files/query',json={'semantic_search':doc['content'],'indexes':['document_vectors'],'filter_query':{'ids':[key]},'limit':1,'fields':['filename'],'hierarchy':{}})
            response.raise_for_status();hits=response.json()['responses'][0]['hits']['hits']
            if not hits or hits[0]['_id']!=key or '_distance' not in hits[0]:raise ValueError('Missing text vector for '+doc['filename'])
            text_vectors+=1
            response=await client.get(base+'/searchaf_graph/documents/'+key);response.raise_for_status()
            graph=response.json()
            if not graph.get('entity_keys') or graph.get('state') or graph.get('sha256')!=doc['content_hash']:raise ValueError('Wait for graph enrichment: '+doc['filename'])
            graph_records+=1
            if doc['filename'].endswith('.png'):
                if not all(doc.get(k) for k in ['ocr_text','ocr_source','caption','caption_source','vision_tags']):raise ValueError('Wait for image OCR, captions and labels: '+doc['filename'])
                vector=doc.get('clip_embedding',[])
                if len(vector)!=512:raise ValueError('Missing image vector')
                response=await client.post(base+'/files/query',json={'embeddings':{'image_embeddings':vector},'indexes':['image_embeddings'],'filter_query':{'ids':[key]},'limit':1,'fields':['filename'],'hierarchy':{}})
                response.raise_for_status();hits=response.json()['responses'][0]['hits']['hits']
                if not hits or hits[0]['_id']!=key or '_distance' not in hits[0]:raise ValueError('Image vector is not queryable')
                images+=1
    if (text_vectors,images,graph_records)!=(7,2,7):raise ValueError('Incomplete Atlas enrichment coverage')
    return {'pipeline_passed':True,'text_vectors':text_vectors,'complete_image_pipelines':images,'graph_documents':graph_records,'semantic_chunking':'disabled by the default CLIP text model; document-level vectors verified'}

def pending_error(error):
    # MCP's task groups can wrap an ordinary not-ready error at context exit.
    if isinstance(error,BaseExceptionGroup):return bool(error.exceptions) and all(pending_error(e) for e in error.exceptions)
    return isinstance(error,(ValueError,RuntimeError,httpx.HTTPError))

async def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--wait-seconds',type=int,default=0);a=p.parse_args()
    if not 0<=a.wait_seconds<=600:p.error('Wait must be between 0 and 600 seconds')
    deadline=time.monotonic()+a.wait_seconds
    while True:
        try:print(json.dumps(await check()));return
        except Exception as error:
            if not pending_error(error) or time.monotonic()>=deadline:raise
            print('Pipeline not ready: '+str(error),file=__import__('sys').stderr)
            await asyncio.sleep(2)
if __name__=='__main__':asyncio.run(main())
