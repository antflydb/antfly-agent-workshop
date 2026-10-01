# Verified pipeline: SearchAF → local Antfly → Antfly Cloud

This path creates and verifies the selected corpus without an OpenAI key or hosted app. It supplies the commands; do not ask the coding agent to invent a publisher. App creation and deployment are subsequent gates in AGENT-HANDOFF.md.

## Preconditions

The September 30, 2026 rehearsal used installed SearchAF **0.1.31**, its bundled Antfly **0.2.4** runtime, and Cloud Antfly **0.2.5**. Use a supported Mac, sufficient disk/memory for the required models, model-download connectivity, and an approved ready Cloud instance/table with CLIPCLAP available. Record actual versions. Rehearse a changed version/model before a live workshop.

Use only the repository’s synthetic Atlas packet. Get an approved dedicated `atlas_workshop_...` table, a temporary table-scoped Admin publisher key and a separate table-scoped Read-only key. Save keys privately outside Git and the indexed folder (mode 600); enter them using the Cloud UI/host secret mechanism, never a model prompt. Preserve existing SearchAF data and sources. Do not create a paid instance without its approved organization/tier/budget.

## 1. Bootstrap

From the package/repository root:

```sh
python3 guides/searchaf-agent/scripts/bootstrap.py --agent knowledge --destination "$HOME/antfly-files-workshop"
cd "$HOME/antfly-files-workshop"
uv venv --python 3.12 local/.venv
uv pip install --python local/.venv/bin/python -r local/requirements.lock
local/.venv/bin/python -m unittest discover -s local -p 'test_*.py'
```

Bootstrap refuses an existing destination and copies all seven sources, their hashes, passage checks, enrichment checker and publication commands. No account or database is modified by bootstrap.

## 2. Create/enrich through SearchAF

Choose **Local intelligence**, and the **PDFs, Images and Notes** profiles. Select only this working copy's `sample-data` folder; do not accept Desktop/Downloads by default. If using an existing SearchAF installation, add the folder and review the effective feature settings without replacing unrelated sources. Disabled explicit OCR/caption/similarity overrides must be resolved deliberately. Wait for all required models to be ready, complete setup, and wait for indexing. Cached models can still need runtime activation; “installed” is not “ready”.

```sh
local/.venv/bin/python local/configure.py --root "$PWD/sample-data"
local/.venv/bin/python local/check_pipeline.py --wait-seconds 180
local/.venv/bin/python local/check.py --corpus-checks corpus-checks.json
local/.venv/bin/python local/export_corpus.py --output "$PWD/publication"
```

For an explicit SearchAF state override, add `--searchaf-home /approved/state/path` to configure. Do not reset the user's installation or manually mark onboarding complete.

**Required result:** seven current-source rows; seven queryable document vectors; two complete image pipelines (OCR with provenance, captions with provenance, visual labels and queryable image vectors); seven graph records matching the indexed source revision; all four named-source passages; complete exported bodies and hashes. The exporter runs the enrichment gate itself. Missing/stale data must fail the command, never become a warning-only success.

Document extraction, image OCR/captioning, document vectors, image vectors and graph extraction are verified stages. Semantic embedding chunking is disabled by the default CLIP-family text embedder. This is a document-vector pipeline; it does not claim chunk-level semantic retrieval, Office-artifact coverage, audio transcription or reranking. Extending to those capabilities requires a compatible model/runtime and new coverage gates; do not merely enable a toggle or relabel a failed stage as complete.

The publication is a selected extracted-text snapshot, including image-derived text, hashes and provenance. It does not transfer original PDF/image bytes, personal paths/account bindings, graph tables or local vector bytes. Cloud recreates the document retrieval index. OCR is checked against source passages; generated captions remain inferred descriptions.

## 3. Plan, publish, verify, repeat

Set the non-secret `ANTFLY_CLOUD_API_BASE`, `ANTFLY_CLOUD_TABLE`, `CLOUD_PUBLISHER_KEY_FILE` and `CLOUD_READER_KEY_FILE` to the approved endpoint/table and private key-file paths. The instance API base is `https://platform.antfly.io/cloud/v1/<instance_id>`.

```sh
local/.venv/bin/python local/publish_corpus.py --bundle publication/corpus.json --api-base "$ANTFLY_CLOUD_API_BASE" --table "$ANTFLY_CLOUD_TABLE"
local/.venv/bin/python local/publish_corpus.py --bundle publication/corpus.json --api-base "$ANTFLY_CLOUD_API_BASE" --table "$ANTFLY_CLOUD_TABLE" --publish --publisher-key "$CLOUD_PUBLISHER_KEY_FILE" --reader-key "$CLOUD_READER_KEY_FILE"
```

The first command is a zero-network plan. The explicit publish command creates only the dedicated table, relies on its implicit full-text index, adds a 512-dimensional managed `document_vectors` index on `content` with `antflydb/clipclap:gguf:Q4_K`, and upserts stable IDs with `sync_level: full_index`. It refuses incompatible indexes or unrelated existing rows. It reads all seven rows back, checks exact bodies/count/version, runs four hybrid passage tests, and verifies REST write/table-scope denials using the Read-only key.

Run the exact publish command again. Expect the same seven IDs and version, seven complete readbacks, four passing passages, and both permission denials. Keep serving paused during updates; activate the new corpus version only after the command passes. Do not change the model to hide a failed check.

## 4. Prove Cloud independence and clean up

Stop only the owned workshop local runtime, or leave the participant's shared SearchAF service intact and test from an independent machine. Run the supplied read-only verification command after stopping the owned local runtime:

```sh
local/.venv/bin/python local/publish_corpus.py --bundle publication/corpus.json --api-base "$ANTFLY_CLOUD_API_BASE" --table "$ANTFLY_CLOUD_TABLE" --verify-only --reader-key "$CLOUD_READER_KEY_FILE"
```

This verifies the four queries and complete direct document reads through Cloud REST using the Read-only key. This proves Cloud corpus independence; hosted agent answers/citations/authentication remain separate tests.

REST routes are `<api_base>/db/v1/tables/<table>/query` and `/documents/<id>`. Use bounded limits, explicit fields and `hierarchy: {}`. `/tables` without `/db/v1` returned dashboard HTML in rehearsal.

**Permission finding:** on Cloud v0.2.5, native MCP accepted an identical upsert with a Read-only key. REST denied writes and out-of-table requests. Use REST for workshop Cloud access until native MCP passes equivalent enforcement tests. Never expose database write/admin tools to the model; do not infer enforcement from tool listings or key labels.

After successful verification, revoke only the temporary publisher, verify its authentication fails, and retain the private Read-only connection. Record actual versions, corpus version, counts, gates and transport. Do not call the pipeline successful if any required gate is failed or unrun.
