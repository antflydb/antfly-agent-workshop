import { readFileSync } from 'node:fs';
import { parseArgs, parseEnv } from 'node:util';
import { answerQuestion, configurationFromEnv } from './lib/answer.ts';
const { values } = parseArgs({options:{'env-file':{type:'string',default:'../.env.local'},question:{type:'string'},expect:{type:'string'}}});
if (!values.question) throw new Error('Provide --question; optional --expect checks answer text.');
const fileValues=parseEnv(readFileSync(values['env-file'],'utf8'));
const config=configurationFromEnv({...fileValues,...process.env});
try {
  const result=await answerQuestion(values.question,config);
  if (!result.sources.length || !result.cited.length) throw new Error('No supported, cited answer returned.');
  if (values.expect && !result.answer.toLowerCase().includes(values.expect.toLowerCase())) throw new Error('Answer did not contain the expected fact.');
  console.log(JSON.stringify({passed:true,sources:result.sources.length,citations:result.cited.length,sourceTypes:[...new Set(result.sources.map(s=>s.source))]}));
} catch (error) { console.error(error.message); process.exitCode=1; }
