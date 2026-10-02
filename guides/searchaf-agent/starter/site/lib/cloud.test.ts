import test from 'node:test';
import assert from 'node:assert/strict';
import { configurationFromEnv, answerQuestion, runEvidenceResponse } from './answer.ts';
import { searchCloud } from './cloud.ts';
const config = {mode:'cloud' as const, key:'openai-fixture-secret', model:'test-model', apiBase:'https://platform.antfly.io/cloud/v1/11111111-1111-1111-1111-111111111111', table:'atlas_workshop_fixture', corpusVersion:'atlas-0123456789abcdef', cloudKey:'cloud-fixture-secret'};
const row = {filename:'atlas-approved-plan.md', content:'Pilot launches October 15 for 25 customers.', corpus_version:config.corpusVersion, source_format:'Markdown', source_relative_path:'atlas-approved-plan.md'};
const hits = (source:unknown=row) => Response.json({responses:[{hits:{hits:[{_id:'atlas-fixture',_source:source}]}}]});
test('configuration defaults to Cloud; local requires explicit opt in', () => {
  const env = {OPENAI_API_KEY:config.key, ANTFLY_CLOUD_API_BASE:config.apiBase, ANTFLY_CLOUD_TABLE:config.table, ANTFLY_CORPUS_VERSION:config.corpusVersion, ANTFLY_CLOUD_API_KEY:config.cloudKey};
  assert.deepEqual(configurationFromEnv(env), {...config,model:'gpt-6-astra'});
  assert.throws(()=>configurationFromEnv({OPENAI_API_KEY:'fixture',ANTFLY_TUNNEL_ID:'legacy'}), /Configure the Cloud/);
  assert.equal(configurationFromEnv({OPENAI_API_KEY:'fixture',ANTFLY_RETRIEVAL_MODE:'local-tunnel',ANTFLY_TUNNEL_ID:'legacy'}).mode,'local-tunnel');
  assert.throws(()=>configurationFromEnv({...env,ANTFLY_CLOUD_API_BASE:'https://untrusted.example'}), /Configure the Cloud/);
});
test('Cloud hybrid requests constrain table, version, fields and evidence provenance', async () => {
  const original = fetch;
  globalThis.fetch = async (url,init) => {
    assert.equal(url,config.apiBase+'/db/v1/tables/'+config.table+'/query');
    assert.equal((init?.headers as Record<string,string>).Authorization,'Bearer '+config.cloudKey);
    const body = JSON.parse(String(init?.body));
    assert.equal(body.limit,6); assert.deepEqual(body.indexes,['document_vectors']);
    assert.deepEqual(body.filter_query,{term:config.corpusVersion,field:'corpus_version.keyword'});
    assert.deepEqual(body.fields,['filename','content','corpus_version','source_format','source_relative_path']);
    assert.deepEqual(body.hierarchy,{}); assert.equal(body.semantic_search,'pilot'); assert.equal(body.full_text_search.match,'pilot');
    return hits();
  };
  try {
    const first = await searchCloud('pilot',config), second = await searchCloud('pilot',config);
    assert.deepEqual(first,second); assert.equal(first[0].excerpt,row.content); assert.match(first[0].id,/^S[a-f0-9]{12}$/);
    for (const bad of [{...row,corpus_version:'other'},{...row,private_path:'/private'},{...row,content:null}]) {
      globalThis.fetch = async ()=>hits(bad);
      await assert.rejects(searchCloud('pilot',config),/outside the configured corpus/);
    }
    globalThis.fetch = async ()=>Response.json({responses:[{error:'failure',hits:{hits:[]}}]});
    await assert.rejects(searchCloud('pilot',config),/did not complete/);
    globalThis.fetch = async ()=>Response.json({responses:[{hits:{hits:'invalid'}}]});
    await assert.rejects(searchCloud('pilot',config),/invalid retrieval/);
    globalThis.fetch = async ()=>new Response('cloud-fixture-secret',{status:403});
    await assert.rejects(searchCloud('pilot',config),e=>e instanceof Error && !e.message.includes(config.cloudKey));
  } finally {globalThis.fetch=original;}
});
test('function loop replays reasoning, executes search on server and validates captured citations', async () => {
  const original = fetch; let responses=0; let searched=0;
  globalThis.fetch = async (url,init) => {
    if (String(url).startsWith(config.apiBase)) {searched++;return hits();}
    const request=JSON.parse(String(init?.body));
    assert.equal(request.store,false); assert.ok(!JSON.stringify(request).includes(config.cloudKey)); assert.ok(!JSON.stringify(request).includes(config.key));
    assert.equal(request.tools[0].strict,true); assert.equal(request.parallel_tool_calls,false);
    responses++;
    if (responses===1) {
      assert.deepEqual(request.tool_choice,{type:'function',name:'search_workshop_files'});
      return Response.json({status:'completed',output:[{type:'reasoning',id:'r1',summary:[]},{type:'function_call',name:'search_workshop_files',call_id:'c1',arguments:'{"query":"pilot"}'}]});
    }
    assert.equal(request.input[1].type,'reasoning');
    const evidence=JSON.parse(request.input[3].output);
    assert.equal(request.input[3].call_id,'c1');
    return Response.json({status:'completed',output:[{type:'message',content:[{type:'output_text',text:'October 15 ['+evidence.sources[0].id+']'}]}]});
  };
  try {const result=await answerQuestion('When?',config); assert.equal(searched,1); assert.equal(result.cited[0],result.sources[0].id);}
  finally {globalThis.fetch=original;}
});
test('invalid tools, query arguments and search-limit violations fail closed', async () => {
  const original = fetch;
  try {
    for (const call of [{name:'other',arguments:'{"query":"pilot"}'},{name:'search_workshop_files',arguments:'{"query":"pilot","table":"other"}'}]) {
      globalThis.fetch=async()=>Response.json({status:'completed',output:[{type:'function_call',call_id:'c',...call}]});
      await assert.rejects(runEvidenceResponse('question',config,'instructions'),/invalid search/);
    }
    let searches=0;
    globalThis.fetch=async url=>String(url).startsWith(config.apiBase) ? (searches++,hits()) : Response.json({status:'completed',output:[{type:'function_call',name:'search_workshop_files',call_id:'c',arguments:'{"query":"pilot"}'}]});
    await assert.rejects(runEvidenceResponse('question',config,'instructions'),/search limit/); assert.equal(searches,4);
    globalThis.fetch=async()=>Response.json({status:'completed',output:[{type:'message',content:[]}]});
    await assert.rejects(runEvidenceResponse('question',config,'instructions'),/did not search/);
  } finally {globalThis.fetch=original;}
});

test('malformed model responses are sanitized rather than exposing parser details', async () => {
  const original = fetch;
  try {
    for (const response of [new Response('private-provider-body'), Response.json({status:'completed',output:[null]}), Response.json(null)]) {
      globalThis.fetch=async()=>response;
      await assert.rejects(answerQuestion('question',config), error=>error instanceof Error && /invalid response|did not finish/.test(error.message) && !error.message.includes('private-provider-body'));
    }
  } finally {globalThis.fetch=original;}
});
