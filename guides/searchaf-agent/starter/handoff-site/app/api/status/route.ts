import { env } from 'cloudflare:workers';
import { configurationFromEnv } from '@/lib/answer';
import { getChatGPTUser } from '@/app/chatgpt-auth';
export async function GET() {
  if (!await getChatGPTUser()) return Response.json({ configured: false }, { status: 401 });
  let configured=false; try{configurationFromEnv(env as Record<string, string | undefined>);configured=true;}catch{}
  return Response.json({ configured }, { headers: { 'Cache-Control': 'no-store' } });
}
