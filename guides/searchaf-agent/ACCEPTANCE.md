# Acceptance record

Package 0.5.0 · September 30, 2026 · experimental

## Current Cloud app implementation (October 2026)

Knowledge/support, meeting-prep and project-handoff now include server-side Antfly Cloud REST retrieval, with `ANTFLY_RETRIEVAL_MODE=cloud` as the default and explicit `local-tunnel` support. Cloud settings pin the instance, table and corpus version; the read-only key stays server-side. Cloud mode has no local-runtime fallback.

Record current automated checks and live Cloud/model/hosted results separately here. The dated evidence below predates this app implementation and does not validate the new app transport or a new deployment.

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
- New Sites deployment, owner and workspace-admin policy, unauthenticated denial and signed-in answer.
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


## 0.3.2: mixed-media support packet

The packet adds a selectable-text support PDF, a synthetic error screenshot, and a synthetic scanned rollback checklist alongside the original Markdown files. The manifest stays outside the indexed folder. The source-specific checker requires the expected passage from each named file; another format cannot satisfy the check.

September 30 verification used an isolated SearchAF state directory containing only this packet, local installed models, and Antfly 0.2.1 (Zig runtime). The unchanged native-MCP gateway returned the expected passages from all four formats, with no oversized-document skips. The PDF used extracted row text; images supplied OCR and caption text. This proves this corpus's ingestion-to-gateway path; it does not establish Office-artifact retrieval or model-answer accuracy.

Twelve adapter/setup/checker tests passed under Python 3.13.7. Repository validation checked text and Markdown links, archive hashes, all three bootstrap paths, inclusion of the media and manifest, and overwrite refusal. The app source and dependency lockfiles are unchanged. No OpenAI model request, new tunnel, or Sites deployment was performed for this revision. Participant semantic evaluations, hosted sign-in and recovery still require rehearsal.


## 0.4.0: Cloud promotion workshop flow (documentation only)

The main teaching path is local corpus verification, selected full-body publication to Antfly Cloud, hosted bounded retrieval and private deployment, then fresh hosted requests with the local runtime stopped. LOCAL-TUNNEL.md preserves the existing runnable reference path. CLOUD-PROMOTION.md records the publisher/app build contract and readiness requirements.

The Cloud publisher, Cloud-capable app and second-device rehearsal are **not implemented or run by this documentation revision**. Earlier local ingestion, model calls and hosted prototypes do not satisfy these new gates. No Cloud resource was provisioned, content uploaded, key created or Site deployed. Documentation/package validation results must be recorded separately from those execution stages.

| Cloud gate | Status | Evidence required |
| --- | --- | --- |
| Publisher and server-side retrieval implementation | Not run | Frozen working code, scope/error tests and build |
| Publication/readback and retry | Not run | Seven complete bodies, hashes, version and idempotence |
| Cloud passage parity | Not run | Same four named-file checks through Cloud retrieval |
| Cited model answers | Not run | Factual/media/unknown-budget review |
| Private hosted sign-in and denial | Not run | Actual browser request and unauthenticated denial |
| Local runtime stopped | Not run | Fresh second-device answers, no local fallback |
| Cloud unavailability | Not run | Visible error in test environment |
| Ongoing update/removal and production controls | Not run | Assigned owner/cadence and operational verification |

Documentation verification: 12 learning-content tests, website typecheck and learning validation passed; all 37 slides were checked for clipping, with the new diagrams inspected in light and dark themes. Package validation checked 125 text files, Markdown links, archive hashes, all three bootstrap paths and overwrite refusal. These are documentation/package checks, not Cloud execution passes.


## 0.5.0: fresh pipeline and supplied Cloud publisher

September 30, 2026. Installed SearchAF 0.1.31, commit 5f18930bf86f62d6b70c915bbd92a9102c095a68, with bundled Antfly 0.2.4 was onboarded using its actual API into an empty isolated state directory. No prior database/config was copied. The synthetic seven-source packet was the only selected folder; profiles were PDFs/Images/Notes and intelligence was semantic. Required models transitioned from pending to ready before CommitOnboarding.

Verified per-source outputs: seven queryable document vectors; two PNG pipelines containing actual OCR, captions/provenance, visual labels and queryable 512-dimensional image vectors; seven graph records matching the indexed source hash; 21 extracted entities observed. The original four known-source passage checks passed. The supplied export command requires the stronger gate and exact bundled source hashes, exporting seven complete bodies (3,612 characters) under corpus version atlas-3066614e6e8512be.

The supplied publisher was run twice against the approved dedicated Cloud table on an existing v0.2.5 instance. Both REST runs passed seven complete row readbacks, exact count/version, all four hybrid passage checks, REST write denial and REST out-of-table denial. The Cloud document index was rebuilt by the managed model rather than copying local vector bytes. Local package tests: 22 passing; package/link/hash/bootstrap validation: 131 text files passing.

Important finding: native Cloud MCP accepted a real identical upsert using the Read-only key (inserted=1; body unchanged). REST denied writes with 403 and out-of-table requests with 403. Workshop Cloud instructions therefore use REST and require actual interface-level permission tests. Tool listings/key labels did not establish enforcement.

Semantic chunking is disabled by the default CLIP-family text embedder. The verified contract is complete enrichment of this packet under the supported document-vector configuration, not all optional media formats/models or chunk-level retrieval. Cloud publication transfers selected full extracted bodies/provenance and recreates document retrieval; it does not migrate originals, image-vector bytes, graph tables or personal account bindings.

Hosted-app adaptation, OpenAI answers/citations, second-device browser authentication and hosted-app independence remain separate unimplemented/unrun stages. Final supplied commands also passed under Python 3.12.11 with requirements.lock installed using uv. All seven Cloud rows had independently queryable full-text and vector coverage. The same final publisher ran twice with the same IDs/version. The verify-only command passed all Cloud checks after both owned local runtimes stopped. The temporary publisher was revoked and subsequent REST authentication returned 401. Existing unrelated keys, sources and instance capacity were preserved.


## October 2, 2026: Cloud-capable example apps

All three examples now default to server-side Cloud REST retrieval. Local-tunnel retrieval remains an explicit configuration option; Cloud failures do not fall back locally. The app exposes only bounded search to the model, retains exact excerpts and validates citations against captured evidence.

Fresh checks: support app 7 tests; meeting-prep 11 tests; project-handoff 11 tests. All three typechecks and production builds passed. A live invocation of the support app's Cloud retrieval function, using the existing workshop table and read-only key, passed all four named-source passage checks (Markdown, PDF, screenshot, scanned checklist). No local gateway or tunnel was used by that invocation.

Live OpenAI generation and new hosted deployment/browser authentication checks were not run: no model credential was supplied for this revision. The dated results above remain historical.
