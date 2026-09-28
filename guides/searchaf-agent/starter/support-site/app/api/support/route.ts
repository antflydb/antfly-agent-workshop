import {getChatGPTUser} from '@/app/chatgpt-auth';
import {parseSupportInput,prepareSupport} from '@/lib/support';
const headers={'Cache-Control':'no-store'};
export async function POST(request:Request){
 if(!await getChatGPTUser())return Response.json({error:'Sign in to use Support Desk.'},{status:401,headers});
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Request origin is not allowed.'},{status:403,headers});
 if(!request.headers.get('content-type')?.startsWith('application/json'))return Response.json({error:'JSON required.'},{status:415,headers});
 const raw=await request.text();if(raw.length>9000)return Response.json({error:'The conversation is too long. Start a new issue.'},{status:413,headers});
 let input;try{input=parseSupportInput(JSON.parse(raw));}catch{return Response.json({error:'Use one to six messages, each under 2,500 characters.'},{status:400,headers});}
 const key=process.env.OPENAI_API_KEY,tunnel=process.env.ANTFLY_TUNNEL_ID;
 if(!key||!tunnel)return Response.json({error:'The support-only Antfly connection needs configuration.'},{status:503,headers});
 try{return Response.json(await prepareSupport(input,{key,tunnel,model:process.env.OPENAI_MODEL||'gpt-6-astra'}),{headers});}
 catch{return Response.json({error:'The response could not be completed and verified. Check the support connection or try a more specific issue.'},{status:502,headers});}
}
