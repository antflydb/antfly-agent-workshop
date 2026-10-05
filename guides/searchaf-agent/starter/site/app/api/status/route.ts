import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { configurationFromEnv } from '@/lib/answer';
import { isLocalEngine } from '@/lib/config';
export async function GET() {
  if (!await getChatGPTUser()) return Response.json({ configured: false }, { status: 401 });
  let configured = false, mode = 'cloud';
  try { const config = configurationFromEnv(env as Record<string, string | undefined>); configured = true; mode = isLocalEngine(config.apiBase) ? 'local' : 'cloud'; } catch { /* Configuration presence only, not a live probe. */ }
  return Response.json({ configured, mode }, { headers: { 'Cache-Control': 'no-store' } });
}
