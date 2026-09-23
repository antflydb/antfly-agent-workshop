import { readFileSync } from 'node:fs';
import { parseArgs, parseEnv } from 'node:util';
import { prepareBrief } from './lib/brief.ts';
const {values}=parseArgs({options:{'env-file':{type:'string',default:'../.env.local'},topic:{type:'string'},participants:{type:'string',default:''},goal:{type:'string',default:''},duration:{type:'string',default:'30'}}});
if(!values.topic)throw new Error('Provide --topic.');
const file=parseEnv(readFileSync(values['env-file'],'utf8'));const get=k=>process.env[k]||file[k];
if(!get('OPENAI_API_KEY')||!get('ANTFLY_TUNNEL_ID')||!get('OPENAI_MODEL'))throw new Error('Configure the authorized key, tunnel and model first.');
try{
 const r=await prepareBrief({topic:values.topic,participants:values.participants,goal:values.goal,duration:Number(values.duration)},{key:get('OPENAI_API_KEY'),tunnel:get('ANTFLY_TUNNEL_ID'),model:get('OPENAI_MODEL')});
 if(r.status!=='ready')throw new Error('Insufficient evidence for a grounded brief.');
 console.log(JSON.stringify({passed:true,sources:r.sources.length,contextPoints:r.brief.context.length,agendaMinutes:r.brief.agenda.reduce((n,a)=>n+a.minutes,0),sourceTypes:[...new Set(r.sources.map(s=>s.source))]}));
}catch(e){console.error(e.message);process.exitCode=1;}
