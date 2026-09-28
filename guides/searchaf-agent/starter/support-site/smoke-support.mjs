import {readFileSync} from 'node:fs';
import {parseArgs,parseEnv} from 'node:util';
import {prepareSupport,parseSupportInput} from './lib/support.ts';
const {values}=parseArgs({options:{'env-file':{type:'string',default:'../.env.local'},issue:{type:'string'},status:{type:'string',default:'answered'},expect:{type:'string'}}});
const input=parseSupportInput({messages:[values.issue]});
const file=parseEnv(readFileSync(values['env-file'],'utf8'));const get=k=>process.env[k]||file[k];
if(!get('OPENAI_API_KEY')||!get('ANTFLY_TUNNEL_ID')||!get('OPENAI_MODEL'))throw Error('Configure the authorized key, support-only tunnel, and model.');
try{const r=await prepareSupport(input,{key:get('OPENAI_API_KEY'),tunnel:get('ANTFLY_TUNNEL_ID'),model:get('OPENAI_MODEL')});if(r.reply.status!==values.status)throw Error('Unexpected support outcome.');if(values.expect&&!JSON.stringify(r.reply).toLowerCase().includes(values.expect.toLowerCase()))throw Error('Expected documented detail was absent.');console.log(JSON.stringify({passed:true,status:r.reply.status,citedSources:r.sources.length,retrieved:r.retrieved,elapsedMs:r.elapsedMs,requestId:r.requestId}));}catch(e){console.error(e.message);process.exitCode=1;}
