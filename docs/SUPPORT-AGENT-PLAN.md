# Support Desk: fourth workshop option

Plan and implementation record · September 28, 2026 · bundle v0.4.0 experimental

## Outcome

Participants ingest a fictional support corpus through SearchAF and build a private support conversation over the same local Antfly database. Native Antfly MCP provides evidence; OpenAI produces documented steps, focused clarification questions, or a support handoff draft. This is an additional agent pattern, not a new ingestion product.

## Build sequence

1. **Define the support corpus.** Five short Lumen Sync documents: current authentication, import limits, recovery/escalation, archived version guidance, and an explicitly untrusted injection fixture. Use fictional data for the workshop.
2. **Scope retrieval.** Select only the support folder in a new adapter configuration. Reuse the existing database. A separate tunnel is needed when the existing agents use broader personal-data roots; never repoint their connection. A shared sample-only tunnel is possible if all agents have the same deliberately approved scope.
3. **Build Support Desk.** Distinct lavender conversation layout, numbered cited steps, follow-up messages, evidence sidebar, reset, and copyable escalation draft. No ticket sending, account changes, or write tools.
4. **Verify behavior.** Offline input/citation/error tests; native MCP retrieval and source boundaries; then real model cases for documented, ambiguous, unsupported, conflicting-version and adversarial questions. Citation membership is a structural check, not semantic proof: read every cited passage.
5. **Publish privately.** Configure server-side credentials and the support-only tunnel. Build, publish owner-only, verify unauthenticated denial, then run a signed-in hosted question. Report local, live and hosted results separately.
6. **Package the workshop.** Fourth bootstrap choice, updated handoff, agenda, facilitator prompts, support evaluations and distributable ZIP. Rehearse on a second participant's machine before broad rollout.

## Participant timing

Complete accounts, SearchAF ingestion, tunnel setup and one live answer as prework. Keep the existing 60-minute workshop: 0–10 architecture and choice; 10–25 build one agent; 25–40 run the three support cases; 40–50 inspect evidence and escalation; 50–60 demonstrate and discuss. Do not add a fourth full build to everyone's agenda. For a 45-minute event, use the facilitator's working sample-only connection and demonstrate account setup rather than doing it live.

## Acceptance and constraints

- E401/version 2.4 yields cited re-authorization instructions, without deleting data or claiming resolution.
- “Import failed” asks for version, error and source details, without guessing a procedure.
- Ninety-day recovery escalates without promising recovery or asserting permanent loss.
- Version 1.8 and 2.4 limits stay distinct; missing version prompts clarification.
- Imported malicious instructions do not change scope or produce unsafe instructions.
- Out-of-scope sources never reach the model; retrieval errors fail closed.
- Escalation remains a manual draft and clearly labels user reports.
- Owner-only indexed-snapshot access; no live Drive ACL guarantee or multi-user authorization claim.

See [Support workshop instructions](../guides/searchaf-agent/SUPPORT.md) and [verification status](SUPPORT-STATUS.md).
