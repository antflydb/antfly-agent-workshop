import type { AnswerConfig } from './config.ts';
import type { Source } from './answer.ts';
const fields = ['filename', 'content', 'corpus_version', 'source_format', 'source_relative_path'];
export async function searchCloud(query: string, config: Extract<AnswerConfig, { mode: 'cloud' }>): Promise<Source[]> {
  let response: Response;
  try {
    response = await fetch(`${config.apiBase}/db/v1/tables/${config.table}/query`, {
      method: 'POST', headers: { Authorization: `Bearer ${config.cloudKey}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(30_000),
      body: JSON.stringify({ full_text_search: { match: query }, semantic_search: query, indexes: ['document_vectors'], filter_query: { term: config.corpusVersion, field: 'corpus_version.keyword' }, limit: 6, fields, hierarchy: {} }),
    });
  } catch { throw new Error('Antfly Cloud retrieval is unavailable. Check the Cloud connection.'); }
  if (!response.ok) throw new Error('Antfly Cloud retrieval failed. Check the read-only key and table configuration.');
  let result: {responses?: {error?: unknown; status?: string | number; hits?: {hits?: unknown[]}}[]};
  try { result = await response.json() as typeof result; } catch { throw new Error('Antfly Cloud returned an invalid retrieval response.'); }
  const hits = result?.responses?.[0]?.hits?.hits;
  if (result?.responses?.[0]?.error || (result?.responses?.[0]?.status && result.responses![0].status !== 'success' && result.responses![0].status !== 'completed' && result.responses![0].status !== 200)) throw new Error('Antfly Cloud retrieval did not complete.');
  if (!Array.isArray(hits) || hits.length > 6 || result.responses!.length !== 1) throw new Error('Antfly Cloud returned an invalid retrieval response.');
  const sources: Source[] = [];
  for (const value of hits) {
    const hit = value as {_id?: unknown; _source?: Record<string, unknown>};
    const row = hit?._source;
    if (typeof hit?._id !== 'string' || !row || typeof row !== 'object' || Object.keys(row).some(k => !fields.includes(k)) || fields.some(k => typeof row[k] !== 'string') || row.corpus_version !== config.corpusVersion || !(row.content as string).trim() || !row.filename || (row.filename as string).length > 250 || row.source_relative_path !== row.filename || !/^[\w.-]+$/.test(row.filename as string) || !['PDF', 'Image', 'Markdown'].includes(row.source_format as string)) throw new Error('Antfly Cloud returned evidence outside the configured corpus.');
    // The excerpt is a literal slice of the returned body, never a model-written summary.
    const body = row.content as string;
    const terms = [...new Set(query.toLowerCase().match(/[\p{L}\p{N}_]{4,}/gu) || [])];
    const windows: {offset:number; excerpt:string; score:number}[] = [];
    for (let offset = 0; offset < body.length; offset += 2200) {
      const excerpt = body.slice(offset, offset + 2400);
      windows.push({offset, excerpt, score:terms.reduce((n,t)=>n+excerpt.toLowerCase().split(t).length-1,0)});
    }
    windows.sort((a,b)=>b.score-a.score);
    const {offset, excerpt} = windows[0];
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${hit._id}\0${offset}\0${excerpt}`));
    const id = 'S' + [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 12);
    sources.push({ id, title: row.filename as string, excerpt, source: 'Antfly Cloud', location: {kind:'character', value:String(offset)} });
  }
  return sources;
}
