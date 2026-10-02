export type AnswerConfig = { mode: 'cloud'; key: string; model: string; apiBase: string; table: string; corpusVersion: string; cloudKey: string } | { mode: 'local-tunnel'; key: string; model: string; tunnel: string };
export type LegacyConfig = { key: string; model: string; tunnel: string };
export function configurationFromEnv(env: Record<string, string | undefined>): AnswerConfig {
  const key = env.OPENAI_API_KEY?.trim();
  const model = env.OPENAI_MODEL?.trim() || 'gpt-6-astra';
  if (!key) throw new Error('Set the server-side OpenAI API key.');
  const mode = env.ANTFLY_RETRIEVAL_MODE?.trim() || 'cloud';
  if (mode === 'local-tunnel') {
    const tunnel = env.ANTFLY_TUNNEL_ID?.trim();
    if (!tunnel) throw new Error('Local tunnel mode requires a tunnel ID.');
    return { mode, key, model, tunnel };
  }
  if (mode !== 'cloud') throw new Error('Choose cloud or local-tunnel retrieval mode.');
  const apiBase = env.ANTFLY_CLOUD_API_BASE?.trim().replace(/\/$/, '') || '';
  const table = env.ANTFLY_CLOUD_TABLE?.trim() || '';
  const corpusVersion = env.ANTFLY_CORPUS_VERSION?.trim() || '';
  const cloudKey = env.ANTFLY_CLOUD_API_KEY?.trim() || '';
  if (!/^https:\/\/platform\.antfly\.io\/cloud\/v1\/[0-9a-f-]{36}$/.test(apiBase) || !/^atlas_workshop_[a-zA-Z0-9_]+$/.test(table) || !/^atlas-[a-f0-9]{16}$/.test(corpusVersion) || !cloudKey) throw new Error('Configure the Cloud instance, dedicated workshop table, corpus version, and read-only key on the server.');
  return { mode, key, model, apiBase, table, corpusVersion, cloudKey };
}
