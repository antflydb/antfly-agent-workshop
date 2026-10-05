import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareHandoff} from './brief.ts';
import type {AnswerConfig} from './answer.ts';
test('Generation executes bounded retrieval and preserves structured output and evidence', async()=>{
 const config:AnswerConfig={key:'openai-fixture',model:'test-model',apiBase:'https://platform.antfly.io/cloud/v1/00000000-0000-0000-0000-000000000000',table:'atlas_workshop',apiKey:'cloud-fixture'};
 const original=globalThis.fetch;let calls=0;let schema='';
 globalThis.fetch=async(url,init)=>{
  const request=JSON.parse(String(init?.body));
  if(String(url).includes('platform.antfly.io')){
   assert.equal(new Headers(init?.headers).get('Authorization'),'ApiKey cloud-fixture');
   assert.equal(request.merge_config.strategy,'rrf');
   assert.equal(request.limit,6);
   return Response.json({responses:[{hits:{hits:[{_id:'approved.md',_source:{filename:'approved.md',content:'Approved launch date.'}}]}}]});
  }
  assert.equal(new Headers(init?.headers).get('Authorization'),'Bearer openai-fixture');
  assert.equal(request.store,false);assert.equal(request.text.format.type,'json_schema');
  assert.ok(!JSON.stringify(request).includes('cloud-fixture'));
  assert.equal(request.tools[0].type,'function');
  if(!calls++){schema=JSON.stringify(request.text);return Response.json({status:'completed',output:[{type:'function_call',name:'search_workshop_files',call_id:'call-fixture',arguments:JSON.stringify({query:'Atlas launch'})}]});}
  assert.equal(JSON.stringify(request.text),schema);
  const evidence=JSON.parse(request.input.find((x:{type:string})=>x.type==='function_call_output').output);
  const id=evidence.sources[0].id;
  const result={title:'Atlas',background:[{text:'Approved launch date.',source_ids:[id]}],decisions:[],work:[],timeline:[],gaps:[],suggestions:[],reading:[{source_id:id,reason:'Approved plan'}]};
  return Response.json({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(result)}]}]});
 };
 try {const result=await prepareHandoff({project:'Atlas',recipient:'',focus:''},config);assert.equal(result.status,'ready');assert.equal(result.sources[0].source,'Antfly');assert.equal(result.sources[0].excerpt,'Approved launch date.');assert.equal(calls,2);}
 finally {globalThis.fetch=original;}
});
