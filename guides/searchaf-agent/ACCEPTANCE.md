# Acceptance record

Package 0.3.1 · September 21, 2026 · experimental

## Portable package verification

- Starter copied into a new isolated working directory; no personal files, connection configuration, credentials or deployment IDs copied.
- Pinned npm and Python dependencies installed successfully in that directory.
- Two app tests passed, covering allowlisted tool evidence and valid/unknown/missing citations.
- TypeScript check and production build passed.
- Ten adapter/setup tests passed, including selected subfolders, spaces in paths, refusing configuration overwrite, secret-free command arguments, and oversized-response handling.
- Packaged diagnostic passed against the existing authorized index: native tools verified, two active scopes, eleven excerpts across local files and Google Drive, one oversized document skipped. No source/configuration changes were made.
- Library validation passed for 15 Skills and four Guides; repository secret scan passed.
- Pinned Apple Silicon tunnel-client archive downloaded, checksum verified, and binary installed in the isolated working copy.
- Bundle extraction, all file hashes, bootstrap, included assets and refusal to overwrite an existing workspace verified.
- Packaged answer smoke script passed using the already authorized key and existing private tunnel: eleven sources, one valid citation, expected positioning term present. This reused the running prototype adapter; it did not create a new participant tunnel or deployment.

## Original prototype evidence (separate from this package)

The September 20 prototype retrieved Desktop and Google Docs through native Antfly MCP and produced a live OpenAI answer citing two Google Docs. The hosted app had previously been confirmed by its owner; the changed native-MCP route was tested through the same tunnel. This does not establish a new participant's hosted deployment.

## Still requires participant rehearsal

- SearchAF installation and fresh sample-corpus ingestion on a second Mac.
- New participant Platform account, billing, tunnel permissions and model access.
- All sample evaluation questions reviewed for semantic accuracy and injection resistance.
- New Sites deployment, owner-only policy, unauthenticated denial and signed-in answer.
- Stop/restart recovery and optional Drive authorization for the participant.
- Intel Mac runtime test (archive checksum is included, but runtime not tested here).

## Copy this result format for each participant

| Stage | Pass / fail / blocked / not run | Evidence without private content |
| --- | --- | --- |
| Ingestion | | Known phrase searchable |
| Native MCP discovery | | Required tools and index |
| Scoped retrieval | | Expected passage, source type, skip count |
| Cited answer | | Citation count and factual review |
| Scope/citation tests and build | | Commands and exit statuses |
| Private deployment | | URL and verified access policy |
| Hosted signed-in answer | | Actual browser result |
| Unsupported/injection cases | | Expected behavior observed |
| Recovery | | Stop/start result |

Known limits: indexed-snapshot permissions, oversized-document skips, no multi-user authorization, and account-specific Sites availability. Never mark an unrun stage passed.

## Meeting-prep variant

The live meeting-prep app passed five tests and a local authenticated endpoint call through the shared Antfly MCP tunnel: 19 evidence excerpts, sourced context/decisions, and four agenda items totaling 30 minutes. The portable variant removes owner-specific URLs and deployment identity; independent participant deployment still requires rehearsal. Browser automation/WebMCP verification was unavailable.

Both `--agent knowledge` and `--agent meeting-prep` bootstrap paths passed. The portable meeting-prep working copy installed pinned dependencies and passed all five app tests, TypeScript and production build. The published private example succeeded and rejected unauthenticated API access; its signed-in hosted generation remains a separate user check.

## Project-handoff variant and workshop revision

The original private third-agent prototype passed five tests, TypeScript and build. A live backend generation through the existing authorized tunnel returned 21 excerpts across Local files and Google Drive, with cited background, decisions and documented work. Its private deployment succeeded and unauthenticated API access was denied. The owner’s signed-in hosted generation has not been verified here.

The 0.3.0 handoff adds `--agent project-handoff`, a sanitized starter, a parameterized live smoke command, and the agenda/facilitator notes. No original owner URLs, credentials or deployment identity belong in the portable starter. New participant account setup, sample-corpus semantic evaluations, hosted sign-in and recovery still need rehearsal. Prior prototype success is not a pass for those stages.

0.3.0 verification: sanitized project-handoff working copy installed pinned dependencies and passed five tests, TypeScript and production build. All three bootstrap paths, existing-destination refusal and archive manifest hashes passed; library validation and credential scan passed. No new live API call or participant deployment was performed for this packaging revision.

## 0.3.1: initial experience and demo guidance

Includes the Project Handoff four-card empty state, matching the September 21 private Site update. The deployed source built successfully; the change only affects introductory markup and CSS. Guides now explain placeholder inputs, configuration versus live connectivity, owner-only demo access and the separate hosted browser check. No access policies, retrieval scope or credentials changed. Browser visual verification is not claimed.
