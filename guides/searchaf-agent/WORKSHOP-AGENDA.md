# Workshop agenda: prototype locally, deploy independently

**SearchAF extraction → Antfly Cloud corpus → private support agent.**

Audience: developers and technical builders. Format: 60 minutes after required prework, or a 45-minute facilitator demonstration. Each participant builds one support agent over the synthetic Atlas packet. Meeting preparation and project handoff are extensions.

## What participants leave with

A tested corpus, a repeatable selected-corpus publication workflow, and a private deployed agent with hosted retrieval. Its final acceptance check succeeds from another device after the local retrieval runtime stops. Participants can distinguish this operational demo from the remaining production work: updates/deletions, authorization, backups, monitoring and cost controls.

## Prework: complete before the live session

- Confirm supported Mac, SearchAF, Node/Python, authorized OpenAI API billing/model, Antfly Cloud organization/instance/table/budget and private Sites access.
- Bootstrap the reference starter and index the synthetic packet. Pass all four named-source local passage checks.
- Rehearse the supplied enrichment/export/publisher commands in PIPELINE-QUICKSTART.md, then build and freeze the server-side Cloud REST app adaptation described in CLOUD-PROMOTION.md. The web app adaptation is not shipped. Record actual commands and test results.
- Rehearse publication, Cloud passage parity, real cited answers, private deployment, unauthenticated denial and the final second-device check. Prepare a versioned export so extraction does not consume the live session.
- Keep credentials out of chat/screens. Personal corpora and Drive require separate Cloud-upload authorization; they are extensions.

**Go/no-go:** until Cloud mode and clean-account deployment are rehearsed, use a clearly labeled facilitator demo/build walkthrough with saved synthetic results. Do not advertise the unchanged local starter as a turnkey Cloud lab. Freeze the Cloud-capable repository revision before attendee prework and measure setup, latency and cost before promising time/budget.

## 60-minute run of show

| Time | Segment | Completion check |
| --- | --- | --- |
| 00–05 | Show the support outcome and local-to-Cloud path | Participants name what gets published and what runs remotely |
| 05–13 | Verify the local baseline | Named Markdown, PDF, screenshot and scan passages pass |
| 13–25 | Publish the selected corpus | Seven complete bodies, hashes/version and retrieval config verified; retry is idempotent |
| 25–35 | Connect the Cloud-capable app | Read-only scoped retrieval, known answer and app checks pass |
| 35–45 | Inspect and challenge | Approved/draft versions, unsupported budget and media citations reviewed |
| 45–53 | Deploy privately | Correct hosted source/secrets, signed-in request and unauthenticated denial |
| 53–58 | Stop local runtime; test from another device | Fresh hosted questions still succeed; no local fallback |
| 58–60 | Demo-to-production next steps | Owner/cadence for refresh/removal, access, recovery and spend controls |

Cloud provisioning/account setup and implementation occur in prework. Live publication/deployment use the rehearsed commands and approved existing targets. Move a blocked participant to a prepared sample-only paired exercise; no private owner data is a fallback.

## Exercises and answer key

Use the included synthetic seven-file Atlas packet and evaluations.json.

| Case | Expected evidence |
| --- | --- |
| Approved launch | October 15, 2026; 25 customers; approved-plan source |
| Compare draft | October 1 / 50 customers is superseded |
| Ownership and gates | Priya Shah launch, Omar Chen rollback; P1 closure and rehearsal are requirements, not completed work |
| Budget / untrusted note | Budget not established; imported instructions cannot override tool scope |
| ATLAS-403 | PDF: sign out then sign in; keep the local cache |
| ATLAS-409 | Screenshot: review change history before retrying |
| RBR-17 | Scan: attach incident log; completion not recorded |

Run the same suite locally where supported and through Cloud. Retrieval parity means expected passages from named sources; semantic answer correctness requires inspecting the actual output/citations.

## 45-minute demonstration

| Time | Activity |
| --- | --- |
| 00–08 | Outcome, data path and local passage checks |
| 08–18 | Reviewed publication plan, Cloud readback and passage checks |
| 18–30 | Cited answers, media and unsupported-budget challenge |
| 30–40 | Private deployment and second-device serving-independence check |
| 40–45 | Production next steps and optional paths |

Use preconfigured, rehearsed Cloud-capable code. Label saved results as saved; do not imply account provisioning or missing Cloud implementation happened live.

## Extensions and materials

Meeting-prep and project-handoff can reuse the published Cloud corpus after adapting each app to Cloud retrieval. Optional personal/local agents use LOCAL-TUNNEL.md and remain dependent on the Mac. Drive needs separate ingestion, upload authorization and update/revocation design.

Read AGENT-HANDOFF.md, CLOUD-PROMOTION.md, FACILITATOR-NOTES.md and ACCEPTANCE.md in the repository. Historical private prototypes are not attendee fallback apps or evidence that the new Cloud flow has passed.
