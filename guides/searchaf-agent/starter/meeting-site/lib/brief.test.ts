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
