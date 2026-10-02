import { getChatGPTUser } from '@/app/chatgpt-auth';
import { configurationFromEnv } from '@/lib/answer';
export async function GET() {
  if (!await getChatGPTUser()) return Response.json({ configured: false }, { status: 401 });
  let configured = false;
  const mode = process.env.ANTFLY_RETRIEVAL_MODE || 'cloud';
  try { configurationFromEnv(process.env); configured = true; } catch { /* Configuration presence only, not a live probe. */ }
  return Response.json({ configured, mode }, { headers: { 'Cache-Control': 'no-store' } });
}
