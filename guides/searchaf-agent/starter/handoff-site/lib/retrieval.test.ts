import test from 'node:test';
import assert from 'node:assert/strict';
import { configurationFromEnv, answerQuestion, runEvidenceResponse } from './answer.ts';
import { searchDocuments } from './retrieval.ts';
const config = {key:'openai-fixture-secret', model:'test-model', apiBase:'https://platform.antfly.io/cloud/v1/11111111-1111-1111-1111-111111111111', table:'atlas_workshop', apiKey:'cloud-fixture-secret'};
const row = {filename:'atlas-approved-plan.md', content:'Pilot launches October 15 for 25 customers.'};
const hits = (source:unknown=row) => Response.json({responses:[{hits:{hits:[{_id:'atlas-approved-plan.md',_source:source}]}}]});
test('configuration needs the OpenAI key, the instance, the table and the Antfly key', () => {
  const env = {OPENAI_API_KEY:config.key, ANTFLY_API_BASE:config.apiBase, ANTFLY_TABLE:config.table, ANTFLY_API_KEY:config.apiKey};
  assert.deepEqual(configurationFromEnv(env), {...config,model:'gpt-6-astra'});
  assert.throws(()=>configurationFromEnv({OPENAI_API_KEY:'fixture'}), /Configure the Antfly/);
  assert.throws(()=>configurationFromEnv({...env,ANTFLY_API_BASE:'https://untrusted.example'}), /Configure the Antfly/);
  assert.throws(()=>configurationFromEnv({...env,ANTFLY_TABLE:'../other'}), /Configure the Antfly/);
  assert.throws(()=>configurationFromEnv({...env,ANTFLY_API_KEY:''}), /Configure the Antfly/);
  const local = {...env, ANTFLY_API_BASE:'http://127.0.0.1:52341', ANTFLY_TABLE:'files', ANTFLY_API_KEY:''};
  assert.deepEqual(configurationFromEnv(local), {...config, model:'gpt-6-astra', apiBase:'http://127.0.0.1:52341', table:'files', apiKey:''});
});
test('the local engine is queried without an Authorization header', async () => {
  const original = fetch;
  globalThis.fetch = async (_url,init) => { assert.equal((init?.headers as Record<string,string>).Authorization, undefined); return hits(); };
  try { assert.equal((await searchDocuments('pilot', {...config, apiBase:'http://127.0.0.1:52341', table:'files', apiKey:''})).length, 1); }
  finally { globalThis.fetch = original; }
});
test('Cloud requests run the hybrid query and turn rows into literal excerpts', async () => {
  const original = fetch;
  globalThis.fetch = async (url,init) => {
    assert.equal(url,config.apiBase+'/db/v1/tables/'+config.table+'/query');
    assert.equal((init?.headers as Record<string,string>).Authorization,'ApiKey '+config.apiKey);
    const body = JSON.parse(String(init?.body));
    assert.equal(body.limit,6); assert.deepEqual(body.indexes,['document_vectors']);
    assert.deepEqual(body.merge_config,{strategy:'rrf',rank_constant:60});
    assert.deepEqual(body.fields,['filename','content']); assert.equal(body.semantic_search,'pilot');
    assert.ok(body.full_text_search.disjuncts.some((d:{match?:string;field:string})=>d.match==='pilot'&&d.field==='content'));
    return hits();
  };
  try {
    const first = await searchDocuments('pilot',config), second = await searchDocuments('pilot',config);
    assert.deepEqual(first,second); assert.equal(first[0].excerpt,row.content); assert.equal(first[0].title,row.filename); assert.match(first[0].id,/^S[a-f0-9]{12}$/);
    globalThis.fetch = async ()=>hits({...row,content:''});
    assert.deepEqual(await searchDocuments('pilot',config),[]);
    for (const bad of [{...row,filename:null},{...row,filename:'x'.repeat(251)}]) {
      globalThis.fetch = async ()=>hits(bad);
      await assert.rejects(searchDocuments('pilot',config),/unexpected row/);
    }
    globalThis.fetch = async ()=>Response.json({responses:[{error:'failure',hits:{hits:[]}}]});
    await assert.rejects(searchDocuments('pilot',config),/did not complete/);
    globalThis.fetch = async ()=>Response.json({responses:[{hits:{hits:'invalid'}}]});
    await assert.rejects(searchDocuments('pilot',config),/invalid retrieval/);
    globalThis.fetch = async ()=>new Response('cloud-fixture-secret',{status:403});
    await assert.rejects(searchDocuments('pilot',config),e=>e instanceof Error && !e.message.includes(config.apiKey));
  } finally {globalThis.fetch=original;}
});
test('function loop replays reasoning, executes search on server and validates captured citations', async () => {
  const original = fetch; let responses=0; let searched=0;
  globalThis.fetch = async (url,init) => {
    if (String(url).startsWith(config.apiBase)) {searched++;return hits();}
    const request=JSON.parse(String(init?.body));
    assert.equal(request.store,false); assert.ok(!JSON.stringify(request).includes(config.apiKey)); assert.ok(!JSON.stringify(request).includes(config.key));
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
