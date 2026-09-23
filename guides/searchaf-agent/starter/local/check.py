"""Verify native MCP capabilities and optionally retrieve a known passage. Print counts only."""
import argparse
import asyncio
import json
import sys
from adapter import configuration, endpoint, grants, search_workshop_files
from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client

async def check(args):
    config=configuration()
    async with streamable_http_client(endpoint(config)) as (read,write,_):
        async with ClientSession(read,write) as session:
            await session.initialize()
            names={t.name for t in (await session.list_tools()).tools}
            missing={'query','get_document','describe_table'}-names
            if missing: raise RuntimeError('Required native Antfly MCP tools are missing')
            description=await session.call_tool('describe_table',{'tableName':'files'})
            if description.isError: raise RuntimeError('Cannot describe files table')
            table=description.structuredContent or json.loads(next(c.text for c in description.content if c.type=='text'))
            if 'document_vectors' not in table.get('indexes',{}):
                raise RuntimeError('Expected document_vectors index is missing; do not silently change search mode')
            active=await grants(session,config)
            if not active: raise RuntimeError('No active grants match the selected roots')
            result={'backend':'antfly_mcp','native_tools_verified':True,'active_scopes':len(active)}
    if args.query:
        evidence=await search_workshop_files(args.query)
        sources=evidence['sources']
        if not sources: raise RuntimeError('No excerpts found; verify content ingestion')
        if args.expect and not any(args.expect.casefold() in s['excerpt'].casefold() for s in sources):
            raise RuntimeError('Expected passage was not retrieved')
        if args.require_source and not any(s['source']==args.require_source for s in sources):
            raise RuntimeError('Required source type was not retrieved')
        result.update(excerpts=len(sources),source_types=sorted({s['source'] for s in sources}),
                      skipped_oversized_documents=evidence['skipped_oversized_documents'])
    print(json.dumps(result))

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--query');p.add_argument('--expect');p.add_argument('--require-source',choices=['Local files','Google Drive']);a=p.parse_args()
    if (a.expect or a.require_source) and not a.query: p.error('--expect/--require-source need --query')
    try: asyncio.run(check(a))
    except Exception:
        print('Check failed. Verify SearchAF runtime, MCP schema/index, selected roots and expected passage. No private evidence printed.',file=sys.stderr)
        sys.exit(1)
