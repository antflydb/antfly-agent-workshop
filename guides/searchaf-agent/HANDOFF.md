# Handoff: build the support agent

You are building a small app that answers questions from a folder of documents, with citations. SearchAF extracts the documents on the Mac and runs an Antfly engine there; the app searches that engine first. Then the extracted text is published to an Antfly Cloud table, the app is pointed at it and deployed as a ChatGPT Site, and the same app works with the Mac shut.

The person gives you two prompts. Everything runs with Node 22 or newer; no Python. The last step of the second prompt, deploying to ChatGPT Sites, requires Codex.

## Before the first prompt

The person has already done these, in the workshop:

| Done | What you can rely on |
|---|---|
| Installed SearchAF and added this repository's `guides/searchaf-agent/sample-data` folder during its setup | SearchAF is indexing that folder. You cannot add a folder yourself; there is no command or API for it |
| Created an Antfly Cloud account, an instance, and an instance key | They put the instance URL and key in `.env.local` before the second prompt |
| Has an OpenAI API key | They put it in `.env.local` before the first prompt |

If the person is not on a Mac, SearchAF is out of the picture: they serve a prebuilt copy of the same documents with `antfly lite serve` instead, and tell you its address in the first prompt. See "Not on a Mac" at the end; the prompts are otherwise the same.

Keys live only in `$HOME/antfly-workshop/.env.local`, which the person fills in themselves. Never print a key, repeat one in chat, or copy one into Git or the indexed folder. If a value you need is missing there, ask the person to add it and wait.

`<repo>` below is this repository's clone.

## When cloning

Before either prompt, the person asks you to clone this repository. Do that, then create the file the person will fill in:

```sh
mkdir -p "$HOME/antfly-workshop" && cp <repo>/guides/searchaf-agent/starter/.env.example "$HOME/antfly-workshop/.env.local" && chmod 600 "$HOME/antfly-workshop/.env.local"
```

Tell them the paths of `.env.local` and of `<repo>/guides/searchaf-agent/sample-data`.

## Prompt 1: "Build the support agent from HANDOFF.md and run it locally"

`OPENAI_API_KEY` is set in `.env.local` by now. If it is empty, ask the person to add it.

### Working copy

```sh
cd "$HOME/antfly-workshop"
cp -R <repo>/guides/searchaf-agent/starter/site ./site
cp <repo>/guides/searchaf-agent/corpus-checks.json <repo>/tools/promote.mjs .
```

The documents stay in the repository, where SearchAF is watching them: seven files, three Markdown notes, a PDF, two screenshots, and `untrusted-note.md`, which contains instructions the app must never follow.

### Wait for extraction

```sh
node promote.mjs check-local --root <repo>/guides/searchaf-agent/sample-data --checks ./corpus-checks.json
```

All four checks pass when the PDF text and both screenshots' text have been read. On a fresh install SearchAF first downloads its models (a few GB, several minutes), then indexes. If a file shows "no text extracted yet", wait and rerun. If nothing appears after a few minutes, ask the person whether the folder shows under Settings, Folders in SearchAF.

### Configure against the engine on this Mac

```sh
node promote.mjs local
```

prints the three Antfly lines for the local engine (its port, table `files`, no key). Put them in `.env.local`, leaving the OpenAI lines as the person wrote them:

```
ANTFLY_API_BASE=http://127.0.0.1:<port>
ANTFLY_TABLE=files
ANTFLY_API_KEY=
```

The app reads `../.env.local`.

### Run it

```sh
cd site && npm ci && npm test && npm run typecheck && npm run build
node smoke-answer.mjs --question "When is the Project Atlas pilot launch, and for how many customers?" --expect "October 15"
npm run dev
```

The smoke script asks one question through the full path (search, model, citation check) without the browser; `passed: true` means the answer cited rows from the engine. Then give the person the dev server URL. The app requires a ChatGPT sign-in; locally, `/signin-with-chatgpt?return_to=/` on the dev server signs in a simulated user.

The person asks three questions:

- "When is the Project Atlas pilot launch, and for how many customers?" Expect October 15, 2026 and 25 invited customers, cited to `atlas-approved-plan.md`, not the draft.
- "What should support tell a customer who sees ATLAS-403?" Expect sign out, then sign in, cited to the PDF.
- "What is the approved Project Atlas budget?" No budget was approved, so the app must say the files do not establish one rather than guess.

The retrieval path is `lib/retrieval.ts`: one hybrid query (keyword and vector, fused by RRF), and every excerpt the model sees is a literal slice of a returned row. Nothing from Cloud is used yet.

## Prompt 2: "Deploy everything to the cloud"

"Everything" is the engine and the app: the documents go to the person's Antfly Cloud instance, and `site` goes to ChatGPT Sites pointed at that instance. The other two starter apps are not part of this prompt.

The person has replaced the local lines in `.env.local`: `ANTFLY_API_BASE` is now the instance URL (`https://platform.antfly.io/cloud/v1/<instance id>`) and `ANTFLY_API_KEY` the instance key. If either is missing or still local, ask them to set it and wait. Set `ANTFLY_TABLE=atlas_workshop` yourself.

### Publish the documents

`promote.mjs` reads the instance URL and key from `.env.local` in the current directory.

```sh
cd "$HOME/antfly-workshop"
node promote.mjs publish --root <repo>/guides/searchaf-agent/sample-data --table atlas_workshop
node promote.mjs check --table atlas_workshop --checks ./corpus-checks.json
```

`publish` creates the table with the same indexes SearchAF used locally (full text plus document vectors on the same embedding model), copies the extracted text and image captions, and leaves the Mac's paths behind. Cloud computes the vectors itself. Run it again with `--recreate` after changing the documents. `check` runs the same four queries against Cloud; they pass when the Cloud copy answers like the local one.

### Point the app at Cloud

`.env.local` already points at Cloud. In `site`, `npm run build` and the same `smoke-answer.mjs` command as before. It should pass exactly as it did locally.

### Deploy the app

This step requires Codex: it deploys to ChatGPT Sites through its own Sites integration, and nothing in this repository can. If you are another agent, stop here, tell the person the Cloud half is done, and hand them `site/` to deploy from ChatGPT themselves.

Deploy `site` as a private ChatGPT Site named `atlas-support`, with the same five `.env.local` variables set as the Site's server-side secrets. On Sites those arrive as Worker bindings, which is why the API routes read `env` from `cloudflare:workers` rather than `process.env`. The build output is `dist/`; `.openai/hosting.json` records the Site's project id once it exists. Give the person the URL.

The person quits SearchAF and asks the same three questions on the deployed Site. If the page looks stale after a redeploy, hard refresh.

## Not on a Mac

`guides/searchaf-agent/atlas.aflite` is an Antfly Lite database holding what SearchAF extracted from the seven sample files, with the same `files` table and full-text index. The person serves it on Linux (Windows through WSL) with the Antfly CLI, from the repository clone:

```sh
curl -L https://github.com/antflydb/antfly/releases/download/v0.2.5/antfly_0.2.5_Linux_x86_64.tar.gz | tar xz   # Linux_arm64 on ARM
./antfly lite serve guides/searchaf-agent/atlas.aflite --addr 127.0.0.1:8080
```

and leaves it running. Their first prompt adds: "I am not on a Mac; the Atlas documents are served by antfly lite at http://127.0.0.1:8080." Then:

- There is nothing to wait for; the text is already extracted. Pass `--local http://127.0.0.1:8080` to `promote.mjs local`, `check-local`, and `publish`, and they use that engine instead of looking for SearchAF.
- The Lite file has no embedder, so locally the app and the checks search by keyword only (`check-local` says so). On publish, Cloud gets the same document vector index SearchAF would have made and computes the vectors itself, so the deployed app is identical to the Mac path.
- Everything else, including the `.env.local` lines from `promote.mjs local --local ...`, the app, and the deploy, is unchanged.

## Afterward

- `starter/meeting-site` and `starter/handoff-site` use the same `lib/retrieval.ts`, the same table, and the same `.env.local`, copied next to `site`. Each has `npm test` and a smoke script (`smoke-brief.mjs --topic ...`, `smoke-handoff.mjs --project ...`).
- Before other people use the deployed app, replace the instance key with a read-only API key granted on `atlas_workshop` only, created in the dashboard. The instance key can create and delete tables; the app only ever needs to read one. (A browser key is a different thing; the app's key stays server-side.)

## Things the platform will do to you

- `platform.antfly.io` returns Cloudflare error 1010 to Python's `urllib`. Node `fetch` and `curl` are fine.
- Hybrid queries take `merge_config: {"strategy": "rrf"}`; `merge_strategy` is rejected. Responses arrive as `responses[0].hits.hits`.
- The instance key works on `/db/v1` routes only. Creating keys or enabling browser access needs the dashboard.
- The reranker may report "temporarily unavailable"; the app does not use it.
