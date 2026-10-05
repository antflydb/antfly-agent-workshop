export type AnswerConfig = { key: string; model: string; apiBase: string; table: string; cloudKey: string };

// Everything the app needs lives in four server-side variables. The Antfly key
// is whichever key was used to publish; a table-scoped read-only key is the
// upgrade before other people use the app.
export function configurationFromEnv(env: Record<string, string | undefined>): AnswerConfig {
  const key = env.OPENAI_API_KEY?.trim();
  const model = env.OPENAI_MODEL?.trim() || 'gpt-6-astra';
  if (!key) throw new Error('Set the server-side OpenAI API key.');
  const apiBase = env.ANTFLY_CLOUD_API_BASE?.trim().replace(/\/$/, '') || '';
  const table = env.ANTFLY_CLOUD_TABLE?.trim() || '';
  const cloudKey = env.ANTFLY_CLOUD_API_KEY?.trim() || '';
  if (!/^https:\/\/platform\.antfly\.io\/cloud\/v1\/[0-9a-f-]{36}$/.test(apiBase) || !/^[a-z0-9_]{1,64}$/.test(table) || !cloudKey) throw new Error('Configure the Cloud instance, table, and Antfly key on the server.');
  return { key, model, apiBase, table, cloudKey };
}
