# Promote the selected corpus to Antfly Cloud

This is the build and acceptance contract for the workshop’s **local prototype → Cloud corpus → deployed support agent** path. It describes the Cloud-capable working copy to build from the supplied reference starter. The shipped app and adapter still implement the optional [local-tunnel path](LOCAL-TUNNEL.md); the enrichment checker and publisher are supplied, while the Cloud-mode web app remains to be built. Execute [PIPELINE-QUICKSTART.md](PIPELINE-QUICKSTART.md) for the actual commands. Complete implementation and a clean-account rehearsal before running this as a hands-on deployment lab.

## 1. Freeze the local baseline

Use the Atlas packet as the main-session corpus. Pass the existing local local native-MCP diagnostic and all four cases in `corpus-checks.json`. Record the seven source files, extraction state and checks without collecting personal content. The PDF and two PNGs must have their actual extracted body/OCR text; titles and generated summaries alone are insufficient. Preserve the original local index.

This workshop publishes a **selected corpus snapshot**, not the entire SearchAF database. Google Drive and personal corpora are optional extensions with separate upload authorization.

## 2. Select the approved Cloud destination

Obtain the participant’s organization, instance, region/tier or approved existing instance, dedicated workshop table, and spending limit. Provision only within that authorization and wait for `ready`. Keep provisioning/publication credentials separate from the app’s read-only retrieval key. Configure instance/table grants and check the actual tools visible to that retrieval key.

Official sources: [Cloud setup](https://antfly.io/docs/cloud/getting-started), [access control](https://antfly.io/docs/cloud/access-control), and [Cloud MCP](https://antfly.io/docs/cloud/mcp). Verify current instance and index schemas before writing commands; this guide does not invent a new migration API.

## 3. Run the supplied publication command

Run `local/export_corpus.py` and `local/publish_corpus.py` as documented in PIPELINE-QUICKSTART.md. Review the zero-network plan before explicit publication. The supplied commands implement this contract:

- Enumerate the complete approved folder/file manifest using the selected local scope; a top-k search is not a corpus export. Reject unexpected files or missing selected bodies. Do not scan or publish unrelated SearchAF rows.
- Export the selected full extracted text from native Antfly retrieval, including PDF and PNG-derived text. Do not use the 2,400-character answer snippets as document bodies. Support artifacts explicitly if later extending beyond the verified row-text packet.
- Store stable document IDs derived from corpus-relative source identifiers, filenames, source format, extracted text, content hashes, extraction provenance and an explicit corpus version. Exclude absolute personal paths, account bindings, credentials and local runtime configuration. Store originals only when explicitly authorized; the main packet needs extracted text and provenance.
- Produce a manifest of expected documents and hashes outside the indexed corpus. For this packet, require exactly seven selected sources. Permit dry-run/check output to show synthetic filenames and counts; keep private bodies and secrets out of logs.
- Publish to a dedicated Cloud table using reviewed table/index definitions. Make retries idempotent. Define a visible published-version boundary so the app does not serve a partially published corpus. The small workshop packet can pause serving during an update; do not imply cross-row atomic publication without verifying it.
- Recreate full-text and document-vector retrieval with a supported Cloud model/index configuration. Record that configuration. Do not copy local vector bytes or database files on the assumption that model, dimensions and storage are portable. Any model change requires the evaluation suite to pass again.
- Read every selected Cloud row back and compare body hashes/counts to the manifest. Run all four named-source passage checks through the intended Cloud retrieval function, using the same expected passages as the local baseline.

Name and document the actual resulting command, arguments, safe credential-entry method, output and repeat/update behavior in the working copy. Run it twice to prove idempotence. Do not present a hypothetical command as shipped tooling.

## 4. Build server-side Cloud retrieval into the app

Use the public authenticated REST query endpoint. Cloud v0.2.5 native MCP failed actual write denial in rehearsal; REST passed. Verify enforcement on the interface used:

```text
https://platform.antfly.io/cloud/v1/<instance_id>/db/v1/tables/<table>/query
Authorization: Bearer <instance-scoped-read-only-key>
```

The recommended serving path is **private app → server-side bounded retrieval → Antfly Cloud REST query API**, with OpenAI calling only the app’s search function for its evidence. Host retrieval in the app’s server runtime. The Cloud API key belongs to that server, never the browser or a model-visible prompt.

Preserve the reference app’s evidence contract: a bounded query, exact source excerpts with stable citation IDs, tool-evidence capture, rejection of unknown/missing citations, and fail-closed errors. Use explicit instance/table/corpus-version scope and read-only Cloud credentials. Reject a request for another table or corpus. The model must never receive database write/admin tools. Enforce the actual Cloud permissions; filtering UI options is insufficient.

Replace the reference starter’s `tunnel_id` tool wiring in Cloud mode with server-executed retrieval. Adapt request handlers, status/configuration checks, smoke scripts and development environment loading together. Choose and document the Cloud configuration fields in the implementation; they are not present in the shipped `.env.example`. Preserve the citation tests and add meaningful scope/error-path checks. The model provider’s current tool API determines the tool loop; do not blindly substitute the Cloud REST URL for the workshop gateway URL, because native database tools do not emit the reference app’s `sources` evidence shape.

Remove Cloud mode’s dependency on `swarm-owner.json`, SearchAF configuration, local roots, filesystem existence, local ports and tunnel processes. No automatic fallback to local retrieval is allowed. Missing or failed Cloud retrieval must show an error and withhold unsupported answers.

For another agent variant, complete the same Cloud adaptation before claiming it can reuse this Cloud corpus. The three unchanged reference starters remain local-tunnel implementations.

## 5. Deploy, then prove independence

Run the selected app’s scope/citation tests, typecheck, build, Cloud passage checks and real known-answer smoke check. Deploy the app and its retrieval code privately. Configure server-only OpenAI and read-only Antfly credentials plus the approved endpoint, table, corpus version, model and trusted site URL. Follow the hosting environment’s actual tools and secret mechanisms.

Stop only the dedicated workshop local retrieval runtime and any optional tunnel. From another device, sign in to the deployed app and make fresh requests for the approved plan, PDF, screenshot, scan and unsupported budget. Open citations. Confirm unauthenticated requests are denied, and simulate an unavailable Cloud endpoint in a test environment to verify visible failure without local fallback. Record each check as pass/fail/blocked/not run in [ACCEPTANCE.md](ACCEPTANCE.md).

**Serving-independence gate:** real hosted requests still succeed after the local serving runtime stops. A saved result, build pass or local preview is insufficient. Do not stop unrelated services or power down the user’s machine through automation.

## 6. Define the next production steps

Assign an owner and cadence for corpus updates, deletion propagation and republishing. Removing a source locally does not automatically delete its Cloud copy. Demonstrate update/removal on a disposable test corpus under explicit authorization and verify exclusion from search, direct reads and generated answers.

Keep the first deployment private to its owner and workspace admins. A shared service key does not implement per-viewer source authorization. Define and test a separate authorization design before granting team access. Add backups, recovery, monitoring and spending limits using the Cloud controls. The workshop’s snapshot and Mac-off pass establish an operational demo, not complete production readiness.
