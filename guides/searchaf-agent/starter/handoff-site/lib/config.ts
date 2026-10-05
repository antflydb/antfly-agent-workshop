export type AnswerConfig = { key: string; model: string; apiBase: string; table: string; apiKey: string };

// The same three Antfly variables point the app at SearchAF's engine on this
// Mac (no key) or at an Antfly Cloud instance (instance key, or a read-only
// key granted on the table before other people use the app).
const LOCAL_BASE = /^http:\/\/(127\.0\.0\.1|localhost):\d{2,5}$/;
const CLOUD_BASE = /^https:\/\/platform\.antfly\.io\/cloud\/v1\/[0-9a-f-]{36}$/;

export function isLocalEngine(apiBase: string): boolean { return LOCAL_BASE.test(apiBase); }

export function configurationFromEnv(env: Record<string, string | undefined>): AnswerConfig {
  const key = env.OPENAI_API_KEY?.trim();
  const model = env.OPENAI_MODEL?.trim() || 'gpt-6-astra';
  if (!key) throw new Error('Set the server-side OpenAI API key.');
  const apiBase = env.ANTFLY_API_BASE?.trim().replace(/\/$/, '') || '';
  const table = env.ANTFLY_TABLE?.trim() || '';
  const apiKey = env.ANTFLY_API_KEY?.trim() || '';
  const validBase = isLocalEngine(apiBase) || (CLOUD_BASE.test(apiBase) && !!apiKey);
  if (!validBase || !/^[a-z0-9_]{1,64}$/.test(table)) throw new Error('Configure the Antfly API base, table, and key on the server.');
  return { key, model, apiBase, table, apiKey };
}
