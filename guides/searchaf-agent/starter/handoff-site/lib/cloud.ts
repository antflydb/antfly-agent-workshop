import type { AnswerConfig } from './config.ts';
import type { Source } from './answer.ts';

// The text SearchAF extracts for every file. Images carry their screenshot
// text and caption in `content` as well, so one field holds the evidence.
const matchFields = ['filename', 'filename_tokens', 'content', 'ocr_text', 'caption'];
const fields = ['filename', 'content'];

export function cloudQuery(query: string, limit = 6) {
  return {
    full_text_search: { disjuncts: matchFields.flatMap(field => [{ match: query, field }, ...(query.includes(' ') ? [{ match_phrase: query, field }] : [])]) },
    semantic_search: query,
    indexes: ['document_vectors'],
    merge_config: { strategy: 'rrf', rank_constant: 60 },
    fields,
    limit,
  };
}

export async function searchCloud(query: string, config: AnswerConfig): Promise<Source[]> {
  let response: Response;
  try {
    response = await fetch(`${config.apiBase}/db/v1/tables/${config.table}/query`, {
      method: 'POST', headers: { Authorization: `ApiKey ${config.cloudKey}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(30_000),
      body: JSON.stringify(cloudQuery(query)),
    });
  } catch { throw new Error('Antfly Cloud retrieval is unavailable. Check the Cloud connection.'); }
  if (!response.ok) throw new Error('Antfly Cloud retrieval failed. Check the Antfly key and table configuration.');
  let result: {responses?: {error?: unknown; hits?: {hits?: unknown[]}}[]};
  try { result = await response.json() as typeof result; } catch { throw new Error('Antfly Cloud returned an invalid retrieval response.'); }
  if (result?.responses?.[0]?.error) throw new Error('Antfly Cloud retrieval did not complete.');
  const hits = result?.responses?.[0]?.hits?.hits;
  if (!Array.isArray(hits) || result.responses!.length !== 1) throw new Error('Antfly Cloud returned an invalid retrieval response.');
  const sources: Source[] = [];
  for (const value of hits) {
    const hit = value as {_id?: unknown; _source?: Record<string, unknown>};
    const row = hit?._source;
    if (typeof hit?._id !== 'string' || !row || typeof row.filename !== 'string' || !row.filename || row.filename.length > 250) throw new Error('Antfly Cloud returned an unexpected row.');
    const body = typeof row.content === 'string' ? row.content : '';
    if (!body.trim()) continue; // a file SearchAF could not extract text from is not evidence
    // The excerpt is a literal slice of the returned body, never a model-written summary.
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
    sources.push({ id, title: row.filename, excerpt, source: 'Antfly Cloud', location: {kind:'character', value:String(offset)} });
  }
  return sources;
}
