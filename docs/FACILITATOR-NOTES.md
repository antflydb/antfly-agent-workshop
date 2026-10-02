# Facilitator notes: local prototype → Cloud → deployed agent

## The message to repeat

“SearchAF lets us prototype over selected files. We publish the tested extracted corpus to Antfly Cloud, host bounded retrieval with the app, and prove the deployed agent works after the local runtime stops.”

The publication uploads selected document bodies. Answering sends retrieved excerpts to OpenAI. Explain both data boundaries before personal-data extensions.

## Readiness and preparation

The current reference starter is local-tunnel code. Cloud publication, configuration, server-side retrieval and smoke checks must be implemented and frozen following CLOUD-PROMOTION.md before a timed lab. No Cloud implementation or second-device pass is claimed by this documentation revision. Assign a named technical owner for that work and a separate clean-account rehearsal.

| When | Deliverable |
| --- | --- |
| T−5 business days | Audience, approved Cloud targets/budgets, private hosting, Mac/prework requirements |
| T−3 days | Freeze Cloud-capable repository revision; local/Cloud passage parity and app tests/build; publication retry verified |
| T−2 days | Clean-account run, semantic evaluation, private sign-in/denial and local-runtime-off check; measure time/cost |
| T−1 day | Participant readiness list; sample-only paired fallback and saved outputs prepared |
| T−30 minutes | Approved table/corpus version, instance readiness, actual hosted request and second device ready |
| T+1 day | Outcome record and follow-ups without collecting private content |

Until the Cloud-capable repository revision and full path are rehearsed, present a facilitator demo/build walkthrough and label missing/unrun stages. The original local prototypes cannot satisfy Cloud gates.

## Run-of-show cues

Follow WORKSHOP-AGENDA.md. Begin with one support question and the final serving-independence goal. Verify passages from all four formats locally, then inspect the publication dry run: seven selected full bodies, stable identifiers, hashes, extraction provenance, version and index configuration. Ask: “Are these whole document bodies, or merely the snippets from one search?”

Publish to the dedicated approved Cloud table. Verify readback and repeat the four named-source checks through the Cloud retrieval function. A count, filename, successful upload or ready instance is insufficient. Keep publication credentials separate from the read-only application key.

Trace serving as private app → server-side bounded retrieval → Cloud REST query API, with the model receiving exact excerpts. Show actual REST write and out-of-table denials with the retrieval key, and offer only the app’s bounded search function to the model. Native Cloud MCP failed write denial on v0.2.5 in rehearsal; it must pass enforcement tests before becoming a workshop serving route. Local path grants and a new endpoint are not a Cloud authorization design.

Inspect the approved-plan answer, draft comparison, unknown budget and media cases. An existing citation ID does not prove semantic support. Inferred image captions must not override the screenshot/OCR facts. Record failures without changing the answer key to fit them.

Deploy the actual tested Cloud-capable source privately. Verify signed-in generation and unauthenticated API denial separately. Stop only the dedicated workshop local runtime/tunnel; keep unrelated services intact. Make fresh requests from another device and open citations. Saved results, localhost previews and status badges cannot satisfy this gate. If Cloud is unavailable, the app must show failure rather than silently using a laptop endpoint.

## Support triage

| Symptom | First check |
| --- | --- |
| Local passage missing | Extraction/indexing, selected roots and actual body text |
| Cloud passage missing | Full-body publication, hash/version parity, index/model configuration and read-only grants |
| Cloud tools missing | Ready instance, correct /db/v1 table-query route and verified instance/table permissions |
| Site works only while Mac runs | Residual tunnel/local-port/filesystem dependency; incomplete Cloud adaptation |
| Site opens but cannot answer | Hosted server-only secrets, Cloud connection settings, app retrieval logs and actual model access |
| Sites unavailable | Finish possible checks; use a Sites-enabled handoff and report deployment unrun |
| Unsupported claim has a citation | Inspect passage support; record semantic evaluation failure |
| Cloud publication partially fails | Do not serve the incomplete version; retry/reconcile using the reviewed manifest |

Use a prepared sample-only fallback. Do not broaden access, upload private data, change expected results or hide missing implementation to keep the demonstration moving.

## Production and cleanup language

The published packet is a versioned snapshot. Local source deletion does not revoke its Cloud copy. Assign update/removal ownership and cadence; test exclusion on a disposable authorized corpus. A shared read-only key does not provide per-viewer authorization. Team access needs its own design and tests.

Configure backups, recovery, monitoring and spend limits before treating the demo as a production service. Do not promise fixed price, latency or full production readiness from a Cloud instance and successful deployment.

Leave local files/index intact. Stop only owned temporary processes. Retiring a deployment/key/instance is a separate authorized lifecycle action; shutting a local tunnel does not delete the remote corpus or generated exports. For the optional personal-agent path, follow LOCAL-TUNNEL.md and keep the Mac awake while serving.

## Record outcomes

Record corpus version, local passages, publication/readback/retry, Cloud passages, real cited answer, scope/citation tests/build, private deployment, hosted sign-in/denial, local-runtime-off and failure-path checks. Use pass/fail/blocked/not run. Keep secrets, account identity and private bodies out of reports. Each optional agent variant needs its own Cloud serving check.
