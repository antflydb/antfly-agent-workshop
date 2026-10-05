# Antfly Project Handoff

A private project-handoff app over the same published Antfly corpus as the support agent. Enter a project, recipient and focus to generate a cited dossier with background, decisions, documented work, dated history, gaps, suggested checks and a reading list.

Unknown owners and current status require verification. Recipient input does not grant access. Copy and Print/PDF are manual exports; no tasks are assigned or messages sent.

## Connection

Configure server-only `OPENAI_API_KEY`, `ANTFLY_CLOUD_API_BASE`, `ANTFLY_CLOUD_TABLE`, and `ANTFLY_CLOUD_API_KEY`, the same four values as the knowledge app (see `../.env.example` and `../../HANDOFF.md`).


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
node --experimental-strip-types smoke-handoff.mjs --project "Project Atlas pilot" --recipient "Product and engineering" --focus "Confirm launch gates and ownership"
```

The smoke check reports counts rather than private source content. Feature-detected WebMCP uses the same visible workflow; browser support and hosted generation require separate verification. Optional `MEETING_AGENT_URL` links your existing meeting-prep app.
