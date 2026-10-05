# Handoff: build the support agent

You are building a small app that answers questions from a folder of documents, with citations. SearchAF extracts the documents on the Mac, the extracted text moves to an Antfly Cloud table, and the app searches that table from wherever it runs. The same table then serves two more apps.

Everything here runs with Node 22 or newer. No Python.

## What the person provides

| When | What |
|---|---|
| Now | A Mac with [SearchAF](https://searchaf.com) installed, and an OpenAI API key |
| After step 2 | An Antfly Cloud instance URL and an instance key (created during the session) |

Keys go in private files outside the working copy, mode 600, never in Git or in the indexed folder.

## 1. Set up the working copy

```sh
mkdir -p "$HOME/antfly-workshop" && cd "$HOME/antfly-workshop"
cp -R <repo>/guides/searchaf-agent/sample-data ./sample-data
cp -R <repo>/guides/searchaf-agent/starter/site ./site
cp <repo>/guides/searchaf-agent/corpus-checks.json <repo>/tools/promote.mjs .
```

The sample folder holds seven files: three Markdown notes, a PDF, two screenshots, and `untrusted-note.md`, which contains instructions the app must never follow.

## 2. Index the folder with SearchAF

Open SearchAF. On first run it downloads its models (a few GB, several minutes). In Settings, Folders, add `$HOME/antfly-workshop/sample-data` and nothing else. Wait until the folder shows as indexed, then check what was extracted:

```sh
node promote.mjs check-local --root ./sample-data --checks ./corpus-checks.json
```

All four checks pass when the PDF text and both screenshots' text have been read. If a file still shows "no text extracted yet", wait and rerun. This step needs nothing from Cloud, so it is the moment to create the Cloud account.

**Stop here until you have the instance URL and key.** The person creates these in the Antfly Cloud dashboard: an account, an instance (takes about a minute to become ready), and an instance key. The URL looks like `https://platform.antfly.io/cloud/v1/<instance id>`.

## 3. Publish to Cloud

```sh
export ANTFLY_CLOUD_API_KEY_FILE="$HOME/.antfly-workshop-key"   # the instance key, one line
node promote.mjs publish --root ./sample-data --instance "<instance url>" --table atlas_workshop
node promote.mjs check --instance "<instance url>" --table atlas_workshop --checks ./corpus-checks.json
```

`publish` creates the table with the same indexes SearchAF used locally (full text plus document vectors on the same embedding model), copies the extracted text and image captions, and leaves your Mac's paths behind. Cloud computes the vectors itself. Run it again with `--recreate` after changing the documents. `check` runs the same four queries against Cloud; they pass when the Cloud copy answers like the local one.

## 4. Run the app

One `.env.local` at the working-copy root serves all three apps; each app reads `../.env.local`.

```sh
cp <repo>/guides/searchaf-agent/starter/.env.example .env.local
# fill in OPENAI_API_KEY, ANTFLY_CLOUD_API_BASE, ANTFLY_CLOUD_TABLE=atlas_workshop, ANTFLY_CLOUD_API_KEY
# (the key's value, not the path of the file that holds it)
cd site && npm ci && npm test && npm run typecheck && npm run build
node smoke-answer.mjs --question "When is the Project Atlas pilot launch, and for how many customers?" --expect "October 15"
npm run dev
```

The smoke script asks one question through the full path (search, model, citation check) without the browser; `passed: true` means the answer cited the Cloud rows. Then open the dev server in the browser. The app requires a ChatGPT sign-in; locally, `http://localhost:3000/signin-with-chatgpt?return_to=/` signs in a simulated user.

Ask two questions and check the citations:

- "When is the Project Atlas pilot launch, and for how many customers?" Expect October 15, 2026 and 25 invited customers, cited to `atlas-approved-plan.md`, not the draft.
- "What should support tell a customer who sees ATLAS-403?" Expect sign out, then sign in, cited to the PDF.

Then ask "What does the Atlas pilot cost per seat?" The files say nothing about pricing, so the app must say they do not provide enough evidence rather than guess. The retrieval path is `lib/cloud.ts`: one hybrid query (keyword and vector, fused by RRF), and every excerpt the model sees is a literal slice of a returned row.

## 5. Deploy

Deploy `site` as a private ChatGPT Site named `atlas-support`, with the same four variables set as the Site's server-side secrets. On Sites those arrive as Worker bindings, which is why the API routes read `env` from `cloudflare:workers` rather than `process.env`. Quit SearchAF, then ask the step 4 questions against the deployed URL; if the page looks stale after a redeploy, hard refresh. The deployed app must not depend on the Mac.

## 6. The other apps

Copy `starter/meeting-site` and `starter/handoff-site` next to `site`. They use the same `lib/cloud.ts`, the same table, and the same `.env.local`. Nothing is republished.

```sh
cd meeting-site && npm ci && npm test && node smoke-brief.mjs --topic "Atlas pilot launch readiness" --participants "Priya, Sam" --goal "decide go or no-go"
cd ../handoff-site && npm ci && npm test && node smoke-handoff.mjs --project "Project Atlas" --recipient "the new support lead"
```

## Before other people use the app

Replace the instance key in the deployed app with a read-only key granted on `atlas_workshop` only, created in the dashboard. The instance key can create and delete tables; the app only ever needs to read one.

## Things the platform will do to you

- `platform.antfly.io` returns Cloudflare error 1010 to Python's `urllib`. Node `fetch` and `curl` are fine.
- Hybrid queries take `merge_config: {"strategy": "rrf"}`; `merge_strategy` is rejected. Responses arrive as `responses[0].hits.hits`.
- An admin instance key works on `/db/v1` routes only. Creating keys or enabling browser access needs the dashboard.
- The reranker may report "temporarily unavailable"; the app does not use it.
