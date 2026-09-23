import { getChatGPTUser } from '@/app/chatgpt-auth';
import { parseMeetingInput, prepareBrief } from '@/lib/brief';
const headers={'Cache-Control':'no-store'};
export async function POST(request:Request){
 if(!await getChatGPTUser())return Response.json({error:'Sign in to prepare a meeting brief.'},{status:401,headers});
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Request origin is not allowed.'},{status:403,headers});
 if(!request.headers.get('content-type')?.startsWith('application/json'))return Response.json({error:'JSON required.'},{status:415,headers});
 const raw=await request.text();if(raw.length>7000)return Response.json({error:'Meeting details are too long.'},{status:413,headers});
 let meeting;try{meeting=parseMeetingInput(JSON.parse(raw));}catch{return Response.json({error:'Enter a topic, participants, goal, and a valid duration.'},{status:400,headers});}
 const key=process.env.OPENAI_API_KEY;const tunnel=process.env.ANTFLY_TUNNEL_ID;
 if(!key||!tunnel)return Response.json({error:'The private Antfly connection needs configuration.'},{status:503,headers});
 try{return Response.json(await prepareBrief(meeting,{key,tunnel,model:process.env.OPENAI_MODEL||'gpt-6-astra'}),{headers});}
 catch(error){return Response.json({error:error instanceof Error&&error.name!=='TimeoutError'?error.message:'Preparation timed out. Check SearchAF and the tunnel, then try a narrower topic.'},{status:502,headers});}
}
