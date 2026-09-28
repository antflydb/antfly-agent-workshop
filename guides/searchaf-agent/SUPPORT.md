# Build a grounded Support Desk

Choose `support` as the fourth workshop agent. SearchAF handles ingestion; a scoped read-only adapter queries native Antfly MCP; OpenAI generates responses in the private Sites app. The database can be shared with other agents while the approved source scope differs.

## Setup

Read [AGENT-HANDOFF.md](AGENT-HANDOFF.md), then bootstrap:

```sh
python3 guides/searchaf-agent/scripts/bootstrap.py --agent support --destination "$HOME/antfly-workshop-support"
```

The selected app is copied into `site/` and five fictional Lumen Sync documents into `sample-data/`. In SearchAF, add that sample folder and wait for indexing. Select **only that folder** with `local/configure.py --root "$PWD/sample-data"`. Do not select all of Desktop or Drive merely to make support work.

Follow the common handoff to create the Python environment and configure the connection. Verify retrieval before involving the model:

```sh
local/.venv/bin/python local/check.py --query 'Lumen Sync 2.4 E401 workspace' --expect 'Re-authorize'
```

If an existing tunnel exposes broader personal files, create a separate support tunnel and use a unique alias on every launcher operation (for example `--alias antfly-support-workshop`). Never change the other agents' working tunnel. Use the same authorized OpenAI key if appropriate, but set `ANTFLY_TUNNEL_ID` to the support tunnel in the new ignored environment file. API credentials stay server-side.

## Three live checks

From `site/`:

```sh
node --experimental-strip-types smoke-support.mjs --issue 'Lumen Sync 2.4 shows E401 connecting a workspace. How do I fix it?' --status answered --expect 'Re-authorize'
node --experimental-strip-types smoke-support.mjs --issue 'My Lumen Sync import failed.' --status clarify
node --experimental-strip-types smoke-support.mjs --issue 'Can Lumen Sync restore files deleted 90 days ago?' --status escalate
```

Then run `npm test`, `npm run typecheck`, and `npm run build`. Follow the common private Sites deployment steps and repeat these cases as the signed-in owner. App configuration, a running tunnel, and a successful build do not prove the hosted answer works.

## What participants demonstrate

1. A specific error produces documented next steps with citations.
2. An ambiguous issue produces questions instead of a guessed fix; add a follow-up to continue.
3. An unsupported request produces an escalation draft with user-reported symptoms, cited context and open questions. Copying it does not create or send a ticket.
4. Open a citation and check that its passage supports the entire instruction, including version and limits.

Messages remain in browser memory until reset/reload; this starter does not persist support history. It sends up to six user messages and selected retrieved excerpts to OpenAI. It does not send previous generated answers back as authoritative evidence. Responses API storage is disabled, but that is not a promise of zero provider retention.

## Facilitator checks

Use [support evaluations](support-evaluations.json). Test version conflicts, malicious imported text, out-of-scope requests and tunnel failure. The untrusted note is a clearly labeled evaluation fixture, not product guidance. Remove it for a normal customer demonstration if desired, then wait for SearchAF to update the index. Do not delete or reset the database.

The adapter performs hybrid retrieval through the configured index and validates source scope before returning excerpts. A subset inside a broad watched root can lose recall because the existing adapter limits candidates before applying the narrower path check; an independently watched sample folder is preferable for the participant workshop. Never broaden scope to compensate for missing results.

This pattern adapts the [Antfly Support Agent skill](https://github.com/antflydb/antfly-skills/tree/main/skills/use-cases/build-antfly-support-agent). Workshop-specific constraints: private local document titles rather than public documentation links; fixed hybrid retrieval; no production retry/telemetry service; manual escalation rather than a configured support address. Production rollout needs authorization design, semantic evaluations and operational controls beyond this experimental starter.
