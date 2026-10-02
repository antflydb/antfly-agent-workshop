import { configurationFromEnv } from '@/lib/answer';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { parseHandoffInput, prepareHandoff } from '@/lib/brief';
const headers={'Cache-Control':'no-store'};
export async function POST(request:Request){
 if(!await getChatGPTUser())return Response.json({error:'Sign in to prepare a project handoff.'},{status:401,headers});
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Request origin is not allowed.'},{status:403,headers});
 if(!request.headers.get('content-type')?.startsWith('application/json'))return Response.json({error:'JSON required.'},{status:415,headers});
 const raw=await request.text();if(raw.length>7000)return Response.json({error:'Project details are too long.'},{status:413,headers});
 let meeting;try{meeting=parseHandoffInput(JSON.parse(raw));}catch{return Response.json({error:'Enter a project, recipient, and handoff focus.'},{status:400,headers});}
 let config;
 try{config=configurationFromEnv(process.env);}catch{return Response.json({error:'The private Antfly connection needs configuration.'},{status:503,headers});}
 try{return Response.json(await prepareHandoff(meeting,config),{headers});}
 catch(error){return Response.json({error:error instanceof Error&&error.name!=='TimeoutError'?error.message:'Preparation timed out. Check the Antfly connection, then try a narrower topic.'},{status:502,headers});}
}
