import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMeetingInput, prepareBrief, validateBrief } from './brief.ts';
const s={id:'S0123456789ab',title:'Approved plan',excerpt:'The pilot is October 15.',source:'Local files'};
const input={topic:'Pilot planning',participants:'Product team',goal:'Check readiness',duration:30};
const brief={title:'Pilot planning',context:[{text:'The pilot is October 15.',source_ids:[s.id]}],decisions:[],tensions:[],gaps:['Owner not established by retrieved evidence.'],agenda:[{topic:'Review readiness',purpose:'Agree next steps',minutes:30,source_ids:[]}],questions:['What remains before the pilot?']};
test('meeting input bounds and duration are enforced',()=>{
 assert.equal(parseMeetingInput(input).duration,30);
 for(const raw of [null,{...input,topic:''},{...input,duration:29},{...input,goal:'a'.repeat(1001)}])assert.throws(()=>parseMeetingInput(raw));
});
test('facts require real citations and agenda must fit allotted time',()=>{
 assert.equal(validateBrief(brief,[s],30).context.length,1);
 assert.throws(()=>validateBrief({...brief,context:[{text:'Unsupported',source_ids:[]}]},[s],30));
 assert.throws(()=>validateBrief({...brief,context:[{text:'Unknown source',source_ids:['Sffffffffffff']}]},[s],30));
 assert.throws(()=>validateBrief(brief,[s],45));
 assert.throws(()=>validateBrief({...brief,agenda:[{topic:'X',purpose:'Y',minutes:-1,source_ids:[]}]},[s],30));
});
test('brief generation uses read-only tunnel retrieval and rejects failures',async()=>{
 const original=globalThis.fetch;const config={key:'fixture',tunnel:'tunnel_fixture',model:'test'};
 const fake=(sources:unknown[],error?:string)=>{globalThis.fetch=async(_url,init)=>{
  const request=JSON.parse(String(init?.body));assert.equal(request.store,false);assert.equal(request.text.format.strict,true);assert.deepEqual(request.tools[0].allowed_tools,['search_workshop_files']);
  return Response.json({status:'completed',output:[{type:'mcp_call',name:'search_workshop_files',error,output:JSON.stringify({sources})},{type:'message',content:[{type:'output_text',text:JSON.stringify(brief)}]}]});
 };};
 try{fake([s]);assert.equal((await prepareBrief(input,config)).status,'ready');fake([]);assert.equal((await prepareBrief(input,config)).status,'insufficient_evidence');fake([s],'failed');await assert.rejects(prepareBrief(input,config),/retrieval did not complete/);}finally{globalThis.fetch=original;}
});
