# Team build plan and timeline

The hosted prototype has been confirmed working by the user. The next work is to make setup repeatable for someone with a different Mac, account, corpus, and API organization.

## Ownership

Assign actual people at kickoff. These are proposed responsibilities, not existing commitments.

| Role | Responsibility | Deliverable |
| --- | --- | --- |
| Workshop lead | Audience, outcome, pacing, go/no-go | Agenda, rehearsal findings, final scope |
| SearchAF owner | Installation, folders, permissions, Drive behavior | Verified download instructions and ingestion checks |
| Integration engineer | Portable adapter, tunnel setup, readiness checks | Setup tooling, diagnostics, restart/cleanup commands |
| App engineer | Sites template, configuration, auth, citations | Tested app template and private deployment instructions |
| Developer education owner | Participant guide and facilitator materials | Antfly Guide/Skill draft, exercise sheets, troubleshooting |
| QA/rehearsal owner | Clean-machine and fresh-account validation | Timed test report and launch-readiness decision |

## Proposed five-day preparation sprint

| Day | Work | Exit condition |
| --- | --- | --- |
| 1 | Confirm audience and Sites/tunnel access; choose sample corpus; inventory prototype assumptions | Named owners, access checklist, sample corpus plan, fixed core scope |
| 2 | Make adapter/setup portable; add explicit root selection; package diagnostics and restart steps | A second machine can configure its own paths and native Antfly endpoint without editing source |
| 3 | Package the Sites app template; prepare safe sample documents and expected answers | Private deployment works with a different authorized key/tunnel; secrets stay out of source |
| 4 | Run a clean-machine rehearsal; test unsupported questions, disconnection, restart, and access control | Measured timings, documented failures, no unresolved core-path blocker |
| 5 | Run a small internal pilot; revise guide and agenda; freeze tested versions | Go/no-go and a complete participant kit |

Allow contingency for account permissions and service access. The event date should follow readiness, rather than forcing untested setup into the live session.

## Participant/event timeline

| When | Action | Owner |
| --- | --- | --- |
| T−7 days | Send prerequisites, account/access check, supported environment, safe-data guidance | Workshop lead |
| T−3 days | Send frozen template, small sample corpus, and prework instructions | Education owner |
| T−2 days | Run setup office hours; resolve billing, tunnel, Sites, and installation issues | Technical helper |
| T−1 day | Collect pass/fail readiness results without secrets or document content; assign fallback participants | QA/helper |
| T−30 minutes | Verify facilitator app, model access, sample corpus, tunnel, and fallback audience | Facilitator |
| Session | Run the 60-minute agenda | Facilitator/helper |
| T+1 day | Send guide, restart/cleanup instructions, optional labs, and feedback request | Education owner |

## Required changes from the prototype

| Priority | Gap | Required change |
| --- | --- | --- |
| P0 | Machine-specific paths and filenames | Resolve paths from the participant’s environment; support configurable app, Python/runtime, and env-file locations |
| P0 | Prototype automatically selects Desktop and enabled Drive roots | Require explicit approved folder selection; default to one workshop folder; show the selected scope before enabling retrieval |
| P0 | Downloads is not included in the demonstrated adapter | Add generic root configuration and test Downloads separately; do not promise it is enabled automatically |
| P0 | Native Antfly MCP exposes database operations beyond retrieval | Keep the scoped read-only adapter, fixed table, root/grant filtering and loopback endpoint; never tunnel unrestricted database tools |
| P0 | Setup spans several tools | Package one documented sequence with clear checks; any convenience command is a deliverable to build and test, not an existing feature |
| P0 | Account eligibility is unknown for attendees | Verify Sites creation/deployment access, tunnel permissions, API billing, and model access per participant |
| P0 | Local readiness previously hid missing configuration | Make sign-in and missing server configuration actionable; distinguish “configured” from verified live retrieval |
| P0 | Prototype instructions contain stale setup state | Reconcile documentation with actual behavior; separate local preview instructions from hosted deployment |
| P0 | Hosting currently relies on owner-only access | Preserve owner-only deployment in the template; require a separate authorization design before team/shared access |
| P0 | No fresh-user timing | Rehearse with a person who did not build the prototype and record active versus waiting time |
| P0 | No prepared sample-only fallback | Build and test a separate demo with approved access and no personal corpus |
| P1 | Direct Antfly retrieval uses indexed permission snapshots | Google Doc retrieval passed with native Antfly MCP. Rehearse source removal/account changes and document permission-refresh limits before the optional Drive lab |
| P1 | Workshop assets not yet in Antfly Skills | Publish a general file-retrieval-agent Guide/Skill and harness-specific references after review |

## Release gates

The core workshop is ready only when all of these pass:

- A fresh participant can complete prework with the guide and no source edits.
- The installed versions, download URLs, dependency lockfiles, and app template are recorded and tested together.
- A known document is retrieved; a factual answer and a synthesis answer have genuinely supporting citations.
- An unsupported question produces an appropriate lack-of-evidence response. Relevant-looking but insufficient passages must not be treated as proof.
- A document containing instruction-like text cannot expand the adapter’s allowed roots or invoke unsupported tools.
- Signed-in hosted use succeeds; unauthorized hosted requests fail.
- Tunnel stop, Mac sleep/reconnect, and restart behavior are tested and documented. Tunnel health alone is not accepted as proof of document retrieval.
- Secrets are absent from browser bundles, committed source, sample config, screenshots, and support reports.
- The fallback works for someone who cannot complete setup.
- The clean run fits the planned live time; otherwise reduce scope or deliver a guided demo.

## Rehearsal measurement sheet

Record environment/version and pass/fail with brief failure categories. Keep credentials and real document content out of the sheet.

| Milestone | Active minutes | Waiting minutes | Result / issue |
| --- | --- | --- | --- |
| Download/install/permissions | | | |
| Folder selected and known document searchable | | | |
| API account/billing/key ready | | | |
| MCP client and scoped adapter ready | | | |
| Tunnel created and usable | | | |
| App configured and privately deployed | | | |
| First hosted cited answer | | | |
| Unsupported question | | | |
| Disconnect and recovery | | | |

Suggested planning target: a prepared participant gets a first cited answer within the first 25 minutes of the live session. Confirm or revise after the pilot; do not market it as measured performance yet.

## Assets the team must deliver

1. Versioned app template and portable local adapter/setup tooling.
2. Workshop-safe sample corpus, expected answers, and a small evaluation set.
3. Prework guide, readiness checklist, facilitator agenda, and troubleshooting sheet.
4. App specification/prompt suitable for reproducing the experience in Sites.
5. Short recorded demonstration and screenshots from the sample-only app.
6. Rehearsal report, supported-version manifest, and fallback instructions.
7. Antfly Guide/Skill package describing the reusable pattern: onboard files → index in Antfly → expose scoped retrieval through MCP → connect an agent → verify evidence. Keep Sites/OpenAI-specific details in the appropriate implementation reference.

The kit should explain why each step exists as well as the exact tested command or UI action. Do not distribute the current personal API key, token file, tunnel configuration, or source excerpts.

## Current implementation status (September 23, 2026)

All three portable starters (Knowledge, Meeting prep, Project Handoff), sample data, diagnostics, scoped adapter and the Guide/Skill are included in this repository. The original gap table above is the preparation backlog; completed implementation should not be confused with a completed independent participant rehearsal. Use the current acceptance record in `guides/searchaf-agent/ACCEPTANCE.md` for measured results. Remaining release gates include a second Mac/account rehearsal, semantic evaluation, hosted sign-in for each path, recovery and a sample-only fallback.
