# Handoff: build the support agent

You are building a small app that answers questions from a folder of documents, with citations. SearchAF extracts the documents on the Mac and runs an Antfly engine there; the app searches that engine first. Then the extracted text is published to an Antfly Cloud table, the app is pointed at it and deployed as a ChatGPT Site, and the same app works with the Mac shut.

The person gives you two prompts. Everything runs with Node 22 or newer; no Python.

## Before the first prompt

The person has already done these, in the workshop:

| Done | What you can rely on |
|---|---|
| Installed SearchAF and added this repository's `guides/searchaf-agent/sample-data` folder during its setup | SearchAF is indexing that folder. You cannot add a folder yourself; there is no command or API for it |
| Created an Antfly Cloud account, an instance, and an instance key | They give you the instance URL and key with the second prompt |
| Has an OpenAI API key | They give it to you with the first prompt |

The person gives you keys in the prompt. Write them only into `$HOME/antfly-workshop/.env.local` (mode 600) and, for the publish step, a one-line key file. Never into Git, the indexed folder, or any file that is committed.

`<repo>` below is this repository's clone.

## Prompt 1: "Build the support agent from HANDOFF.md and run it locally"

### Working copy

```sh
mkdir -p "$HOME/antfly-workshop" && cd "$HOME/antfly-workshop"
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

prints the three Antfly lines for the local engine (its port, table `files`, no key). Write `.env.local` from them:

```
OPENAI_API_KEY=<the person's key>
OPENAI_MODEL=gpt-6-astra
ANTFLY_API_BASE=http://127.0.0.1:<port>
ANTFLY_TABLE=files
ANTFLY_API_KEY=
```

One `.env.local` at the working-copy root; the app reads `../.env.local`.

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

## Prompt 2: "Deploy everything to the cloud" (with the instance URL and key)

"Everything" is the engine and the app: the documents go to the person's Antfly Cloud instance, and `site` goes to ChatGPT Sites pointed at that instance. The other two starter apps are not part of this prompt.

### Publish the documents

```sh
cd "$HOME/antfly-workshop"
export ANTFLY_API_KEY_FILE="$HOME/.antfly-workshop-key"   # write the instance key from the prompt there, one line, chmod 600
node promote.mjs publish --root <repo>/guides/searchaf-agent/sample-data --instance "<instance url>" --table atlas_workshop
node promote.mjs check --instance "<instance url>" --table atlas_workshop --checks ./corpus-checks.json
```

The instance URL looks like `https://platform.antfly.io/cloud/v1/<instance id>`. `publish` creates the table with the same indexes SearchAF used locally (full text plus document vectors on the same embedding model), copies the extracted text and image captions, and leaves the Mac's paths behind. Cloud computes the vectors itself. Run it again with `--recreate` after changing the documents. `check` runs the same four queries against Cloud; they pass when the Cloud copy answers like the local one.

### Point the app at Cloud

Change the three Antfly lines in `.env.local`; the OpenAI lines stay:

```
ANTFLY_API_BASE=<instance url>
ANTFLY_TABLE=atlas_workshop
ANTFLY_API_KEY=<instance key>
```

Then, in `site`, `npm run build` and the same `smoke-answer.mjs` command as before. It should pass exactly as it did locally.

### Deploy the app

Deploy `site` as a private ChatGPT Site named `atlas-support`, with the same five `.env.local` variables set as the Site's server-side secrets. On Sites those arrive as Worker bindings, which is why the API routes read `env` from `cloudflare:workers` rather than `process.env`. The build output is `dist/`; `.openai/hosting.json` records the Site's project id once it exists. Give the person the URL.

The person quits SearchAF and asks the same three questions on the deployed Site. If the page looks stale after a redeploy, hard refresh.

## Afterward

- `starter/meeting-site` and `starter/handoff-site` use the same `lib/retrieval.ts`, the same table, and the same `.env.local`, copied next to `site`. Each has `npm test` and a smoke script (`smoke-brief.mjs --topic ...`, `smoke-handoff.mjs --project ...`).
- Before other people use the deployed app, replace the instance key with a read-only API key granted on `atlas_workshop` only, created in the dashboard. The instance key can create and delete tables; the app only ever needs to read one. (A browser key is a different thing; the app's key stays server-side.)

## Things the platform will do to you

- `platform.antfly.io` returns Cloudflare error 1010 to Python's `urllib`. Node `fetch` and `curl` are fine.
- Hybrid queries take `merge_config: {"strategy": "rrf"}`; `merge_strategy` is rejected. Responses arrive as `responses[0].hits.hits`.
- The instance key works on `/db/v1` routes only. Creating keys or enabling browser access needs the dashboard.
- The reranker may report "temporarily unavailable"; the app does not use it.
