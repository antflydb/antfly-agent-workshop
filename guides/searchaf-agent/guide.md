# Prototype locally, deploy independently

Use SearchAF to extract the synthetic Atlas packet, verify local Antfly retrieval, publish the selected corpus to Antfly Cloud, and deploy a private support agent with hosted retrieval. Finish by making a fresh hosted request from another device after the local runtime stops.

1. Bootstrap the knowledge starter in a new working copy.
2. Index the packet with SearchAF and pass the four named-source local checks.
3. Run the supplied pipeline/publication commands in [Pipeline quickstart](PIPELINE-QUICKSTART.md), then build the Cloud-capable app described in [Cloud promotion](CLOUD-PROMOTION.md).
4. Publish seven full extracted bodies, provenance, hashes and version to the approved Cloud table; recreate its retrieval configuration.
5. Verify Cloud readback, passage parity, cited answers and scope/citation tests/build.
6. Deploy privately with server-only OpenAI and read-only Cloud credentials.
7. Verify sign-in/denial and fresh hosted answers with the local runtime stopped.

**Implementation status:** the shipped starter is the existing local-tunnel reference. Cloud publication and server-side retrieval are specified build steps, not included or rehearsed features. Freeze a Cloud-capable repository revision before a timed hands-on lab. The original local acceptance record is historical; it cannot satisfy the new Cloud gates.

The main session uses a synthetic corpus. Publishing personal extracted bodies to Cloud needs explicit source/target authorization. Preserve the existing SearchAF index; no whole-database migration is assumed. Google Drive, multi-user authorization, continuous updates/deletions and additional agent variants are extensions.

## Hand this to your coding agent

> Read guides/searchaf-agent/AGENT-HANDOFF.md and CLOUD-PROMOTION.md. Bootstrap the support agent in a new workspace. Verify the local sample corpus, run the supplied enrichment and publication commands and build the server-side Cloud REST retrieval adaptation, and proceed only within the approved Cloud target/budget and source authorization. Preserve existing data and connections. Verify each gate separately, including fresh hosted requests after the local runtime stops. Report implemented, passed and unrun stages distinctly.

Read the handoff directly; the optional packaged Skill describes the older local reference path. For a personal agent that keeps retrieval local, follow [LOCAL-TUNNEL.md](LOCAL-TUNNEL.md). That route requires the Mac and tunnel while serving.

## Materials

- [Agent handoff](AGENT-HANDOFF.md), [Cloud promotion](CLOUD-PROMOTION.md) and [corpus guide](CORPUS.md)
- Reference app/adapter, pinned dependencies and bootstrap/package tooling
- Seven-source synthetic packet and [evaluations](evaluations.json)
- [Workshop agenda](WORKSHOP-AGENDA.md), [facilitator notes](FACILITATOR-NOTES.md), [acceptance record](ACCEPTANCE.md)

Meeting preparation and project handoff can reuse the published corpus after their own Cloud adaptation. A recipient field neither shares access nor assigns work. Production follow-through requires refresh/removal ownership, per-viewer authorization where needed, backups, monitoring and spend controls.
