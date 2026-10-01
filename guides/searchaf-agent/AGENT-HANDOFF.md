# Agent handoff: local prototype → Antfly Cloud → deployed agent

Package version: **0.5.0 experimental**, September 30, 2026.

Read this file before executing in the repository/package root. For Harnessing Your First Agent, build a **support agent** using the knowledge starter and synthetic Atlas packet. Meeting preparation and project handoff are later extensions.

## Outcome and implementation status

SearchAF extracts the selected packet into its existing local Antfly index. Verify that baseline, publish only the selected extracted corpus and retrieval configuration to Antfly Cloud, then deploy a private agent with hosted bounded retrieval. The final gate is a fresh cited answer from the deployed app with the local runtime stopped.

**Local enrichment checks and the selected-corpus publisher are supplied.** Execute [PIPELINE-QUICKSTART.md](PIPELINE-QUICKSTART.md) for the rehearsed SearchAF → Antfly Cloud path. The shipped web app is still the optional local-tunnel reference; its server-side Cloud REST retrieval/configuration/smoke checks must be built and rehearsed before the hosted-app lab. [LOCAL-TUNNEL.md](LOCAL-TUNNEL.md) preserves that optional path.

Preserve local documents, indexes, accounts and unrelated connections. Do not reset SearchAF or upload its entire database. This exercise publishes selected extracted bodies to Cloud; permission to index locally is not automatically permission to publish personal data. Use the repository’s synthetic packet for the main session. Never put keys in prompts, source control, browser bundles or reports.

Create an owner-private deployment with workspace-admin access as required by the host. Team sharing, public access, provisioning costs and uploads of personal corpora require their own explicit authorization. This documentation-editing task itself creates no instance, publishes no corpus and deploys no app.

## Gather only missing inputs

| Input | Required selection |
| --- | --- |
| Workspace | A new isolated destination |
| Corpus | Bundled `sample-data`; any other source needs explicit selection and Cloud-upload authorization |
| Local SearchAF state | Default `~/.searchaf` or discovered override |
| Antfly Cloud target | Approved organization, ready instance, dedicated table and spending limit; region/tier if provisioning |
| Credentials | Authorized provisioning/publication credentials and separate table-scoped read-only retrieval key; secure entry |
| OpenAI | Authorized API key/billing and tested available model |
| Hosting | Sites tools/access and a new private site, or an explicitly selected existing target |

Tools: supported Mac and SearchAF for the prototype; Node >=22.13, npm and Python 3.12 (or `uv`); Antfly Cloud access; Sites publishing tools. The optional local-tunnel path additionally needs `tmux`, Platform tunnel permissions and the pinned client. Complete account setup and the Cloud-mode working implementation before the timed session.

## 1. Create an isolated working copy

From the repository/package root:

```sh
python3 guides/searchaf-agent/scripts/bootstrap.py --agent knowledge --destination "$HOME/antfly-files-workshop"
cd "$HOME/antfly-files-workshop"
uv venv --python 3.12 local/.venv
uv pip install --python local/.venv/bin/python -r local/requirements.lock
cd site
npm ci
cd ..
local/.venv/bin/python -m unittest discover -s local -p 'test_*.py'
```

Bootstrap refuses an existing destination and makes no database/account changes. It copies the reference app, sample packet, enrichment checker and Cloud publisher; it does not adapt the web app to Cloud mode. Read CLOUD-PROMOTION.md in the original repository while adapting the working copy. Use `--agent meeting-prep` or `--agent project-handoff` only for an explicitly selected extension; each requires the same Cloud adaptation before independent deployment. Preserve lockfiles.

## 2. Ingest and verify the local baseline

Follow PIPELINE-QUICKSTART.md: choose Local intelligence and the PDFs, Images and Notes profiles, select the working copy’s **sample-data** folder, wait for model readiness and complete setup. Wait for indexing, then run:

```sh
local/.venv/bin/python local/configure.py --root "$PWD/sample-data"
local/.venv/bin/python local/check_pipeline.py --wait-seconds 180
local/.venv/bin/python local/check.py --corpus-checks corpus-checks.json
```

Use `--searchaf-home` for an override. Intentional configuration changes require `--replace` with the complete root list. Discover the local managed Antfly endpoint and verify its schema; do not change an existing index to hide incompatibility. No SearchAF MCP Manual token is needed.

The checker requires passages from the named Markdown, PDF, screenshot and scan, not merely matching filenames. The verified packet uses row-level extracted PDF/PNG text. Image captions can be inferred: inspect source images/OCR for exact instructions. Office-artifact retrieval is a separate extension. See [CORPUS.md](CORPUS.md).

**Gate:** all four local passage checks pass independently of the model.

## 3. Run Cloud promotion

Execute PIPELINE-QUICKSTART.md sections 3–4 using the supplied `local/export_corpus.py` and `local/publish_corpus.py`. Plan first, publish with the approved scoped keys, run the same publish command twice, verify Cloud independently and revoke the temporary publisher. The exporter requires actual local enrichment coverage; the publisher verifies complete Cloud bodies and the same four passages.

**Gate:** seven exact current-source bodies, idempotent publication, four Cloud passage checks and enforced Read-only/table scope on REST. A ready instance or matching count alone is insufficient.

## 4. Build the Cloud-capable app and preview it

Follow CLOUD-PROMOTION.md section 4. Implement bounded server-side retrieval over authenticated Cloud REST queries with a table-scoped read-only key. Replace the local tunnel wiring and filesystem grants in Cloud mode; retain exact excerpts, tool-evidence capture and citation validation. Update configuration/status, request handlers and smoke scripts coherently. Test scope restriction and failure without local fallback.

Run the selected app’s tests, typecheck and production build in the working copy. Start the development preview bound to loopback. The shipped starter’s `npm test`, `npm run typecheck` and `npm run build` remain the app checks; document any added Cloud diagnostics and their real command paths. Development environment files do not configure hosted secrets.

Make a real model request using the authorized API key. Ask the approved pilot date/customer count, then approved budget. Expect October 15, 2026 and 25 customers from the approved plan; no approved budget is established. Exercise the PDF, screenshot and scan questions in [evaluations.json](evaluations.json). Read the cited passages; valid IDs alone do not establish factual support.

**Gate:** a fresh answer passes through the app’s bounded Cloud retrieval and OpenAI, with correct evidence, and app tests/build pass.

## 5. Deploy privately and prove serving independence

Use the environment’s actual Sites tools and hosting workflow. Create/select the approved private Site, set its returned identity, configure server-only OpenAI and read-only Antfly credentials plus the Cloud connection/corpus settings, and deploy the exact tested Cloud-capable source. Host retrieval with the app. Keep private owner/workspace-admin access and trusted site URL checks. Do not retain the local tunnel as the production retrieval path.

Open the deployed app as the owner and verify a fresh cited answer and unauthenticated API denial. Then stop only the dedicated workshop local retrieval runtime and any optional tunnel. From another device, repeat the approved-plan, PDF, screenshot, scan and unsupported-budget cases. Verify citations, and verify visible failure on Cloud unavailability in a test environment. Do not simulate sign-in headers or call a backend-only result a hosted browser pass.

**Gate:** hosted requests work with the local runtime stopped and no local fallback. Saved outputs and configuration indicators are insufficient.

If Sites tools/access are unavailable, finish implementable local/Cloud checks and hand the tested app to a Sites-enabled agent. Report the missing capability and unrun hosting gates precisely. Do not publish on another host or broaden access without authorization.

## 6. Evaluate, operate and report

Run [evaluations.json](evaluations.json), including Cloud parity, scope, serving independence and failure. Record each gate and its actual evidence in [ACCEPTANCE.md](ACCEPTANCE.md); no historical prototype success can satisfy a new Cloud gate. Keep private excerpts, credentials and account identity out of shared reports.

Assign an owner for refreshes/removals and document how the versioned snapshot is republished. A local deletion does not revoke the Cloud copy. Keep production updates/deletions, multi-user authorization, backups, monitoring and spending limits as explicit next steps with tests. Cloud hosting and a Mac-off pass establish serving independence, not full production readiness.

For cleanup, stop only owned temporary processes and follow the normal deployment/key/instance lifecycle. Do not delete a corpus or paid resource without its applicable authorization. Stop an optional tunnel using the command in LOCAL-TUNNEL.md; stopping it does not delete Cloud evidence or exported answers.

## Facilitated workshop

Use [WORKSHOP-AGENDA.md](WORKSHOP-AGENDA.md) and [FACILITATOR-NOTES.md](FACILITATOR-NOTES.md). Rehearse a Cloud-capable working copy and the final second-device check before the live session. The main exercise is one support agent; variants, Drive and the optional local-tunnel route follow later.
