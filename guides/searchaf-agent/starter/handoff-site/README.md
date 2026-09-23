# Antfly Project Handoff

Third private workshop agent using the existing SearchAF-ingested index through native Antfly MCP and the shared, scoped `search_workshop_files` tunnel adapter.

Enter a project, recipient, and focus. The agent builds a cited dossier: background, decisions/proposals, documented work and blockers, explicitly dated history, open questions, suggested checks, and a reading list. Unknown owners and current status must be verified. Recipient input does not grant that recipient access. Copy and Print/PDF are manual exports; no tasks are assigned or messages sent.

## Run and check

Use Node 22.13+, `npm ci`, then `WORKSHOP_ENV_FILE=/absolute/path/to/approved.env npm run dev -- --port 3004`. Server-side environment: OPENAI_API_KEY, ANTFLY_TUNNEL_ID, optional OPENAI_MODEL (default gpt-6-astra). Never commit credentials. Reuse the workshop connection; keep SearchAF and the tunnel running.

`npm test`, `npm run typecheck`, `npm run build` validate source. Optional live API test: `node --experimental-strip-types smoke-handoff.mjs --project "Project Atlas pilot" --recipient "Product and engineering" --focus "Confirm launch gates and ownership"` (incurs model usage). It reports counts, not private document contents.

## Evidence and access limits

Facts require IDs from successful allowlisted retrieval calls. Validation checks reference integrity and output structure, not semantic entailment; review the excerpts. The indexed snapshot may be stale, incomplete, or skip oversized documents and does not revalidate live Google ACLs. The Site is owner-only and uses platform sign-in, same-origin JSON POSTs and server-held credentials. This is a workshop prototype, not a multiuser project tracker.

Feature-detected WebMCP `prepare_project_handoff` calls the same visible workflow. Supported-browser WebMCP validation and browser visual QA have not been performed. The first signed-in hosted generation still needs user review.
