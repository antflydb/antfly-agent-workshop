#!/usr/bin/env node
// Moves a folder SearchAF has indexed into an Antfly Cloud table, and checks
// the result. SearchAF does the extraction (PDF text, screenshot text, captions);
// this copies what it produced, rewrites your Mac's paths out of the rows, and
// creates the same indexes on Cloud. No Python, no SearchAF settings changes.
//
//   node tools/promote.mjs local                                                  (where SearchAF's engine is, for .env.local)
//   node tools/promote.mjs check-local --root <folder> --checks ./corpus-checks.json
//   node tools/promote.mjs publish     --root <folder> --instance <url> --table <name> [--recreate]
//   node tools/promote.mjs check       --instance <url> --table <name> --checks ./corpus-checks.json
//
// <url> is the instance's API base: https://platform.antfly.io/cloud/v1/<instance id>.
// The key comes from ANTFLY_API_KEY, or from the file named by ANTFLY_API_KEY_FILE.
// Document keys are each file's path relative to --root.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";

const { values: args, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    root: { type: "string" },
    instance: { type: "string" },
    table: { type: "string" },
    checks: { type: "string" },
    local: { type: "string" },
    recreate: { type: "boolean", default: false },
  },
});
const command = positionals[0];

function need(name) {
  const value = args[name];
  if (!value) fail(`--${name} is required`);
  return value;
}
function fail(message) {
  console.error(message);
  process.exit(1);
}

function cloudKey() {
  if (process.env.ANTFLY_API_KEY) return process.env.ANTFLY_API_KEY.trim();
  const file = process.env.ANTFLY_API_KEY_FILE;
  if (file) return fs.readFileSync(file, "utf8").trim();
  fail("set ANTFLY_API_KEY, or ANTFLY_API_KEY_FILE to a file holding the key");
}

// SearchAF writes where its Antfly is listening each time it starts.
function localBase() {
  if (args.local) return args.local.replace(/\/$/, "");
  const owner = path.join(os.homedir(), ".searchaf", "state", "swarm-owner.json");
  try {
    const { port } = JSON.parse(fs.readFileSync(owner, "utf8"));
    return `http://127.0.0.1:${port}/db/v1`;
  } catch {
    fail(`could not read ${owner}; is SearchAF running? (or pass --local http://127.0.0.1:<port>/db/v1)`);
  }
}

async function call(base, method, route, body, key) {
  const res = await fetch(`${base}${route}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(key ? { Authorization: `ApiKey ${key}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${route}: ${res.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

// The text fields SearchAF fills for every file.
const TEXT_FIELDS = ["filename", "filename_tokens", "content", "ocr_text", "caption"];

function hybridQuery(query, limit) {
  return {
    full_text_search: {
      disjuncts: TEXT_FIELDS.flatMap((field) => [
        { match: query, field },
        ...(query.includes(" ") ? [{ match_phrase: query, field }] : []),
      ]),
    },
    semantic_search: query,
    indexes: ["document_vectors"],
    merge_config: { strategy: "rrf", rank_constant: 60 },
    fields: ["filename", "content"],
    limit,
  };
}

async function localRows(root) {
  const base = localBase();
  const tables = await call(base, "GET", "/tables");
  const files = tables.find((t) => t.name === "files");
  if (!files) fail("SearchAF's Antfly has no `files` table yet; open SearchAF and let it finish setup");
  const all = await call(base, "POST", "/tables/files/query", {
    full_text_search: { match_all: {} },
    limit: 10000,
  });
  const rows = all.responses[0].hits.hits
    .map((h) => h._source)
    .filter((r) => typeof r.path === "string" && r.path.startsWith(`${root}${path.sep}`));
  return { files, rows, base };
}

// Runs the known-answer checks: the named file must come back in the top
// results for its query, and its extracted text must contain each expected
// passage. Reports where it ranked.
async function runChecks(checksPath, search) {
  const checks = JSON.parse(fs.readFileSync(checksPath, "utf8"));
  let failed = 0;
  for (const check of checks) {
    const hits = await search(check.query);
    const rank = hits.findIndex((h) => h._source?.filename === check.file);
    const hit = rank >= 0 ? hits[rank] : undefined;
    const body = `${hit?._source?.content ?? ""}`.toLowerCase();
    const missing = check.expect.filter((s) => !body.includes(s.toLowerCase()));
    const ok = hit !== undefined && missing.length === 0;
    if (!ok) failed++;
    const where = hit ? `#${rank + 1} of ${hits.length}` : `not in top ${hits.length} (first: ${hits[0]?._source?.filename ?? "none"})`;
    console.log(
      `${ok ? "ok  " : "FAIL"} ${JSON.stringify(check.query)} -> ${check.file} ${where}` +
        (missing.length ? `, missing: ${missing.map((m) => JSON.stringify(m)).join(", ")}` : "")
    );
  }
  console.log(failed === 0 ? `all ${checks.length} checks passed` : `${failed} of ${checks.length} checks failed`);
  if (failed > 0) process.exit(1);
}

async function checkLocal() {
  const root = path.resolve(need("root"));
  const { rows, base } = await localRows(root);
  console.log(`SearchAF has indexed ${rows.length} files under ${root}`);
  const nameOnly = rows.filter((r) => `${r.content ?? ""}`.trim() === "");
  for (const r of nameOnly) console.log(`  no text extracted yet: ${path.relative(root, r.path)} (${r.file_type})`);
  await runChecks(need("checks"), async (query) => {
    const r = await call(base, "POST", "/tables/files/query", {
      ...hybridQuery(query, 40),
      fields: ["filename", "content", "path"],
    });
    return r.responses[0].hits.hits.filter((h) => `${h._source.path}`.startsWith(`${root}${path.sep}`));
  });
}

// Fields that only make sense on the Mac that indexed the files.
const LOCAL_ONLY = new Set([
  "path", "directory", "path_tokens", "url", "id", "sha256", "content_hash", "source_path",
  "source_kind", "watch_dir_id", "created_at", "modified_at", "indexed_at", "clip_embedding", "_type",
]);

async function publish() {
  const root = path.resolve(need("root"));
  const instance = need("instance").replace(/\/$/, "");
  const table = need("table");
  const key = cloudKey();
  const cloud = `${instance}/db/v1`;
  const { files, rows } = await localRows(root);
  if (rows.length === 0) fail(`SearchAF has not indexed anything under ${root}; add the folder in SearchAF and wait for it`);

  const inserts = {};
  for (const row of rows) {
    const rel = path.relative(root, row.path);
    const doc = Object.fromEntries(Object.entries(row).filter(([k]) => !LOCAL_ONLY.has(k)));
    doc.path = rel;
    doc.directory = path.dirname(rel) === "." ? "" : path.dirname(rel);
    if (Array.isArray(row.clip_embedding)) doc._embeddings = { image_embeddings: row.clip_embedding };
    inserts[rel] = doc;
  }

  // The same indexes SearchAF made locally. The full-text index is created by
  // Antfly itself; the image index is external and its vectors come with the rows.
  const indexes = {};
  for (const [name, index] of Object.entries(files.indexes)) {
    if (index.type === "embeddings") indexes[name] = index;
  }
  const { version: _version, ...schema } = files.schema;

  const existing = await call(cloud, "GET", "/tables", undefined, key);
  if (existing.some((t) => t.name === table)) {
    if (!args.recreate) fail(`table ${table} already exists on this instance; pass --recreate to replace it`);
    await call(cloud, "DELETE", `/tables/${table}`, undefined, key);
  }
  await call(cloud, "POST", `/tables/${table}`, { schema, indexes }, key);
  const result = await call(cloud, "POST", `/tables/${table}/batch`, { inserts }, key);
  const withText = rows.filter((r) => `${r.content ?? ""}`.trim() !== "").length;
  console.log(`published ${result.inserted} files to ${table}: ${withText} with extracted text`);
  for (const r of rows.filter((r) => `${r.content ?? ""}`.trim() === "")) {
    console.log(`  name only: ${path.relative(root, r.path)} (${r.file_type})`);
  }
}

async function check() {
  const instance = need("instance").replace(/\/$/, "");
  const table = need("table");
  const key = cloudKey();
  const cloud = `${instance}/db/v1`;
  const count = await call(cloud, "POST", `/tables/${table}/query`, {
    full_text_search: { match_all: {} },
    fields: ["filename"],
    limit: 1000,
  }, key);
  console.log(`${table} holds ${count.responses[0].hits.hits.length} documents`);
  await runChecks(need("checks"), async (query) => {
    const r = await call(cloud, "POST", `/tables/${table}/query`, hybridQuery(query, 5), key);
    if (r.responses[0].error) throw new Error(JSON.stringify(r.responses[0].error));
    return r.responses[0].hits.hits;
  });
}

// The app takes the engine without /db/v1 and adds it per request.
function local() {
  const base = localBase().replace(/\/db\/v1$/, "");
  console.log(`ANTFLY_API_BASE=${base}\nANTFLY_TABLE=files\nANTFLY_API_KEY=`);
}

const commands = { local, "check-local": checkLocal, publish, check };
if (!commands[command]) fail(`usage: promote.mjs <local|check-local|publish|check> ...\n${fs.readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 13).join("\n")}`);
await commands[command]();
