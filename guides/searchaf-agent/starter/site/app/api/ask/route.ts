import { getChatGPTUser } from '@/app/chatgpt-auth';
import { answerQuestion } from '@/lib/answer';

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: 'Sign in to use your workspace.' }, { status: 401 });
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  if (!request.headers.get('content-type')?.startsWith('application/json')) return Response.json({ error: 'JSON required.' }, { status: 415 });
  const raw = await request.text();
  if (raw.length > 6000) return Response.json({ error: 'Question is too long.' }, { status: 413 });
  let body;
  try { body = JSON.parse(raw); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  if (typeof body.question !== 'string' || !body.question.trim() || body.question.length > 2000) return Response.json({ error: 'Enter a question between 1 and 2,000 characters.' }, { status: 400 });
  const key = process.env.OPENAI_API_KEY;
  const tunnel = process.env.ANTFLY_TUNNEL_ID;
  if (!key || !tunnel) return Response.json({ error: 'The private connection is still being configured.' }, { status: 503 });
  try {
    const answer = await answerQuestion(body.question.trim(), { key, tunnel, model: process.env.OPENAI_MODEL || 'gpt-6-astra' });
    return Response.json(answer, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const message = error instanceof Error && error.name !== 'TimeoutError' ? error.message : 'The request timed out. Check SearchAF and the tunnel, then retry.';
    return Response.json({ error: message }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
