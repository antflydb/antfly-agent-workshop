import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { configurationFromEnv } from '@/lib/answer';
export async function GET() {
  if (!await getChatGPTUser()) return Response.json({ configured: false }, { status: 401 });
  let configured = false;
  try { configurationFromEnv(env as Record<string, string | undefined>); configured = true; } catch { /* Configuration presence only, not a live probe. */ }
  return Response.json({ configured }, { headers: { 'Cache-Control': 'no-store' } });
}
