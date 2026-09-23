# Facilitator notes: One index, three agents

## The message to repeat

“SearchAF brings your files into Antfly. Antfly MCP gives the agent access to selected evidence. The same index can power a knowledge answer, a meeting brief, or a project handoff.”

The workshop is a guided build from a working starter. It is not a promise to complete new accounts, Drive authentication, ingestion, tunnel setup and a custom app from scratch in 60 minutes.

## Staffing and preparation timeline

Use one lead facilitator and at least one technical helper for the initial small pilot. Assign a named owner to each item before inviting attendees.

| When | Owner | Deliverable / go-no-go check |
| --- | --- | --- |
| T−5 business days | Workshop lead | Audience, Mac requirements, capacity, format, prework email and three agent choices |
| T−3 days | Technical lead | Freeze bundle version; rehearse on a second Mac/account; approve the sample corpus and evaluation key |
| T−2 days | Facilitator + helper | Run the agenda end to end; record setup time, generation latency and API usage; prepare sample-only outputs as backup |
| T−1 day | Helper | Participant readiness list; each has known-passage retrieval and one model result, or an assigned fallback |
| T−30 minutes | Facilitator | Open demo apps, sample folder, SearchAF, guide and tunnel status; verify the model/tunnel and browser zoom |
| T+1 day | Lead | Send bundle, relevant follow-ups and feedback form; record issues without collecting private source content |

**Go/no-go:** the personal prototypes worked, but a clean-machine/account rehearsal and semantic evaluation suite are still required. If those are not completed, present this as a facilitated pilot/demo rather than a repeatable self-service workshop.

## Before attendees arrive

- Use a dedicated sample-only environment. Never use the owner's private Desktop/Drive apps as an attendee fallback.
- Verify sample ingestion and a known content passage, not only a title or count.
- Confirm the selected root restriction and that the model receives only `search_workshop_files`, not database write/admin tools.
- Check one hosted signed-in generation for each demonstrated app and unauthenticated API denial. A successful build, tunnel health or local backend test is insufficient.
- Prepare fallback access in advance with an explicitly approved audience. Do not make a private-data app public to bypass setup problems.
- Keep a sample-only result/PDF for each path in case live generation is unavailable. Label it as a saved result, not a current live test.
- Close unrelated tabs and hide secrets. Have attendees enter their own credentials securely; do not collect keys in a form, chat or slide.
- Keep the Mac awake, SearchAF running, and the managed tunnel active. Know which tunnel alias is safe to stop.

## Run-of-show cues

### 00–05: show outcomes before architecture

Show the same Atlas corpus in all three experiences. Say: “Choose the job you want the agent to do. We set up the data once.” Have participants select one path; building all three is an extension.

### 05–10: explain just enough architecture

Draw or show: Files → SearchAF → Antfly; Sites → OpenAI → tunnel → scoped adapter → native Antfly MCP.

Say: “The index stays local. Selected passages are sent to OpenAI. SearchAF's Manual MCP client is not involved.” Explain that source permissions are an indexed snapshot, not live Google ACL enforcement. These are owner-private prototypes, not a multiuser permissions system.

### 10–18: readiness checkpoint

Ask attendees to retrieve a known Atlas passage and open their prepared app. A helper gets at most three minutes per blocking problem during the main session. Move the participant to the sample-only fallback or paired exercise, then troubleshoot separately. Do not let one account or install problem consume the room's time.

### 18–30: guide each path

**Knowledge:** ask for the approved launch date and customer count, then compare against the draft. “Find” produces discovery; “explain” or “compare” asks for synthesis.

**Meeting prep:** use a 30-minute readiness meeting. Check context and decision/proposal labels before reviewing the agenda. Suggested agenda items are not prior commitments; participants entered in the form are planning context, not proof of attendance.

**Project Handoff:** prepare for product and engineering. Check documented work and owner citations, then gaps and reading list. A next step in a document is not proof it remains outstanding today. Unknown owners stay unknown. A recipient field does not share the dossier, grant access or assign a task. A timeline may correctly be empty when dates are not supported.

### 30–40: make evidence inspection concrete

Ask: “Which passage supports that sentence? Is this the approved version? Does it prove completion or only list a requirement?”

Expected Atlas facts: approved pilot October 15, 2026, 25 customers; draft October 1, 50 customers is superseded. Priya Shah owns launch and Omar Chen rollback. Gates include closing P1 bugs and a rollback rehearsal. No approved budget is established.

Ask about budget and inspect the outcome. Explain that the untrusted note is an adversarial fixture; it must not control tool access or establish fabricated facts. If the agent fails, record the failure honestly; do not edit the expected answer to match it.

### 40–54: adapt, then compare

Change only the task input first: question → comparison, meeting goal → resolve gaps, or handoff focus → first checks. Leave code customization and redeployment optional. Pair participants across paths using sample data, or demonstrate switching. Explain that links between apps do not grant the viewer access to another Site.

### 54–60: recovery and close

Stop only the facilitator's dedicated sample tunnel. Show a visible retrieval error, restart, and repeat a known-answer request. Never stop an attendee's unrelated runtime. End by having attendees identify their own shutdown command and next step.

## Support triage

| Symptom | First check | Workshop response |
| --- | --- | --- |
| Cannot publish / Sites unavailable | Tool availability, account access, target Site permissions | Complete local tests; use a Sites-enabled handoff later. No alternative public host without authorization |
| API authorization/rate/budget error | Correct organization, authorized key, billing, model and tunnel permissions | Helper handles privately; no key pasted into chat |
| App opens but retrieval fails | SearchAF running, Mac awake, correct tunnel and adapter status | Verify native MCP known-passage retrieval independently of the model |
| Document missing | Selected roots and actual indexed text | Try a small known document; oversized documents may be skipped |
| Google Doc title only | SearchAF Google sign-in and content ingestion | Defer Drive to extension; streaming/placeholder presence alone is not proof of content |
| UI looks tiny | Browser zoom at 100% | Reset zoom before changing CSS |
| Preview fails after configuration change | Development server restart and dependency lockfile | Retry after restart; use the frozen starter |
| Slow response | Retrieval/model request in progress | Budget time; avoid repeated submissions; use a clearly labeled saved sample if necessary |
| Unsupported claim with citations | Read the actual passages | Treat as an evaluation failure; citations are reference checks, not semantic guarantees |

## Data, cost and cleanup language

Use approved documents only. Explain that generated outputs and manual exports may include private excerpts. Keep participant data, API keys and screenshots out of shared issue reports. API calls incur usage; measure a pilot before setting a workshop budget. Do not promise a fixed price or latency.

From a v0.3.0 working copy, stop its runtime with:

```sh
local/.venv/bin/python local/tunnel.py stop
```

If configured with a custom alias, use the same `--alias` value. Do not copy the original owner's alias. Disconnecting a SearchAF MCP client does not revoke this native Antfly MCP route. Leave source documents/index intact. To retire the hosted app, use its normal access/secret/deployment controls; do not assume stopping a tunnel deletes exported results.

## Record the outcome

For each participant record agent choice; ingestion, native retrieval, model generation, private deployment and signed-in hosted result; semantic evaluation results; recovery; blockers and elapsed time. Distinguish pass, fail, blocked and not run. Never call a backend-only test a hosted browser pass.

After the pilot, update the timed agenda using measured setup and support load. Keep unresolved platform/permission issues in the next run's prework, rather than extending the live introduction.

## Project Handoff opening screen (0.3.1)

The four preview cards describe the dossier, not four buttons to click. Select a project example or type a project name into the left form; gray placeholder text does not count as input. Then use Build project dossier. The connected/configured indicator is not proof of a live search: confirm a real generated result before presenting.
