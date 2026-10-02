import {configurationFromEnv} from './lib/answer.ts';
import {readFileSync} from 'node:fs';
import {parseArgs,parseEnv} from 'node:util';
import {prepareHandoff,parseHandoffInput} from './lib/brief.ts';
const {values}=parseArgs({options:{'env-file':{type:'string',default:'../.env.local'},project:{type:'string'},recipient:{type:'string',default:''},focus:{type:'string',default:''}}});
const input=parseHandoffInput({project:values.project,recipient:values.recipient,focus:values.focus});
const file=parseEnv(readFileSync(values['env-file'],'utf8'));
const config=configurationFromEnv({...file,...process.env});
try {const r=await prepareHandoff(input,config);if(r.status!=='ready')throw new Error('Insufficient evidence for a grounded handoff.');console.log(JSON.stringify({passed:true,sources:r.sources.length,background:r.dossier.background.length,decisions:r.dossier.decisions.length,work:r.dossier.work.length,sourceTypes:[...new Set(r.sources.map(s=>s.source))]}));}catch(e){console.error(e.message);process.exitCode=1;}
