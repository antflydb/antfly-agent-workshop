# Antfly Fieldnotes — meeting-prep agent

A second private agent over the same SearchAF-ingested Antfly database as the knowledge agent. This app takes a meeting topic, participants, goal and duration, then retrieves through the existing scoped Antfly MCP tunnel and produces a structured briefing.

## What it produces

- Source-backed background and prior decisions/proposals, with explicit status.
- Differences between documents and gaps in the retrieved evidence.
- A suggested agenda whose minutes add up to the selected duration.
- Suggested questions and expandable source excerpts.
- Copy and print/PDF actions. No calendar events, email or persistent brief storage.

## Runtime

Use server-only `OPENAI_API_KEY`, `ANTFLY_TUNNEL_ID`, and `OPENAI_MODEL`. Use the participant’s authorized workshop key/tunnel; do not register SearchAF MCP or reimport the corpus. The Site must remain owner-only because all requests share one authorized local index.

Local preview reads the explicitly selected `WORKSHOP_ENV_FILE`; production uses Sites runtime secrets. The preview sign-in is a development convenience, not an internet-facing authentication boundary.

```sh
npm ci
npm test
npm run typecheck
npm run build
```

## Validation

Five unit tests cover citation provenance, input limits, agenda durations, read-only retrieval, errors and empty evidence. A live request through the local authenticated app endpoint returned a brief with 19 excerpts from local files and Google Drive, source-backed context/decisions, and four agenda items totaling 30 minutes.

Citation IDs are checked against actual tool results; factual entailment still requires review. The source is an indexed snapshot and may omit oversized documents. The agent must not claim a proposal was agreed merely because it appears in a document.

The browser automation service was unavailable in this environment. Local HTTP rendering passed and the user-facing preview was opened; visual interaction QA and experimental WebMCP verification are not claimed.

## Workshop choice

Both paths share ingestion, index, scope and tunnel setup:

1. Knowledge agent: ask questions and inspect cited answers.
2. Meeting-prep agent: supply meeting context and inspect an evidence-backed brief.

The application prompts and presentation differ. No new database or source connection is needed.

Optional server setting `KNOWLEDGE_AGENT_URL` links the participant’s own knowledge-agent deployment. Leave unset until that app exists.
