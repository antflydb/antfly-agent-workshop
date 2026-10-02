# Antfly Fieldnotes — meeting-prep agent

A private meeting-prep app over the same published Antfly corpus as the support agent. Supply a topic, participants, goal and duration to generate an evidence-backed brief.

## What it produces

- Source-backed context and decisions, distinguishing proposals from established decisions.
- Supported differences between documents and gaps in retrieved evidence.
- A suggested agenda whose minutes add up to the selected duration.
- Questions, expandable source excerpts, and manual Copy/Print actions.

It does not create calendar events, send messages or store briefs.

## Connection

Cloud retrieval is the default. Configure server-only `OPENAI_API_KEY`, `ANTFLY_CLOUD_API_BASE`, `ANTFLY_CLOUD_TABLE`, `ANTFLY_CORPUS_VERSION`, and `ANTFLY_CLOUD_API_KEY` using the published workshop corpus and its table-scoped read-only key. `OPENAI_MODEL` is optional. The app queries Antfly directly from its server and passes bounded source excerpts to OpenAI; it does not need SearchAF or a tunnel while serving. See [Cloud promotion](../../CLOUD-PROMOTION.md).

To use the optional local reference instead, explicitly set `ANTFLY_RETRIEVAL_MODE=local-tunnel` and `ANTFLY_TUNNEL_ID`; keep SearchAF and that tunnel running. Cloud errors never fall back to local retrieval.

Local preview reads `WORKSHOP_ENV_FILE` (default `../.env.local`); deployment uses server runtime secrets. Never commit credentials or expose them through browser environment variables. Keep the Site owner-only: a shared corpus key does not provide per-viewer source authorization.

## Run and check

Use Node 22.13+ and run:

```sh
npm ci
npm test
npm run typecheck
npm run build
WORKSHOP_ENV_FILE=/absolute/path/to/approved.env npm run dev
```

Citation validation checks source IDs and output structure, not whether every assertion follows from the excerpt. Inspect the evidence and treat the corpus as a snapshot; it cannot establish current status or exhaustive history. Hosted sign-in, browser interaction, and live model checks must be recorded separately from unit tests and builds.

Optional live check (incurs model usage):

```sh
node --experimental-strip-types smoke-brief.mjs --topic "Project Atlas pilot" --goal "Review launch readiness" --duration 30
```

The smoke check reports counts rather than private source content. Optional `KNOWLEDGE_AGENT_URL` links your existing support app; leave unset until that deployment exists.
