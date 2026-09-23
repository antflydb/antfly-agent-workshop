import { getChatGPTUser } from '@/app/chatgpt-auth';
export async function GET() {
  if (!await getChatGPTUser()) return Response.json({ configured: false }, { status: 401 });
  return Response.json({ configured: Boolean(process.env.OPENAI_API_KEY && process.env.ANTFLY_TUNNEL_ID) }, { headers: { 'Cache-Control': 'no-store' } });
}
