# Workshop agenda: One index, three agents

**Build an agent over your files with SearchAF, Antfly MCP and OpenAI Sites.**

Audience: developers and technical builders. Format: 60-minute hands-on session after prework, with a 45-minute demonstration option. First pilot: supported Macs only. Each participant builds **one** agent; all three use the same data setup.

## What participants leave with

A private app that retrieves from their selected SearchAF-ingested Antfly index, produces a useful output, and cites inspectable passages. Participants can explain the data path and stop/restart their connection.

| Choose one | Input | Output | Best for |
| --- | --- | --- | --- |
| Knowledge | A question | Cited answer and source excerpts | Finding and explaining information |
| Meeting prep / Fieldnotes | Topic, participants, goal, duration | Context, prior decisions/proposals, gaps and suggested agenda | Preparing for a conversation |
| Project Handoff | Project, recipient, focus | Background, decisions, documented work, gaps and reading list | Transferring project context |

**Shared architecture:** files → SearchAF ingestion → local Antfly database; Sites app → OpenAI → secure MCP tunnel → scoped adapter → native Antfly MCP. No SearchAF MCP Manual token and no second database. The index stays on the Mac; retrieved excerpts go to OpenAI.

## Prework: send 3–5 days ahead

Reserve approximately 30–60 minutes, potentially longer for new accounts or permissions. This is a planning estimate, not a measured setup time.

- Confirm supported Mac, SearchAF, Node, Python, tunnel client prerequisites and a Codex/Claude environment able to follow the bundled handoff.
- Confirm OpenAI API billing, authorized key, model access, tunnel permissions and Sites publishing access. A ChatGPT subscription alone is not an API-billing readiness check.
- Download the complete v0.3.0 workshop bundle and choose an agent.
- Index its fictional Project Atlas `sample-data` folder in SearchAF. For personal data, select a small approved folder instead.
- Pass known-passage retrieval through native Antfly MCP, then a real model call through the tunnel. Keep credentials out of chat and shared screens.
- Prepare the chosen private app before the workshop; participant publishing is a planned exercise only if the environment has been rehearsed successfully.

**Readiness deadline:** one business day before the workshop. Anyone who cannot pass the checks uses the sample-only fallback or pairs with a ready participant using only sample data. Google Drive is an optional extension, not a dependency for the main session.

## 60-minute live agenda

| Time | Segment | Participant activity | Facilitator completion check |
| --- | --- | --- | --- |
| 00–05 | One index, three outcomes | See the three sample-data agent outputs; choose a path | Each participant names their intended output |
| 05–10 | Explain the connection | Trace ingestion, index, MCP, tunnel, model and app | Understand which excerpts leave the Mac and why it must stay awake |
| 10–18 | Confirm data and readiness | Find a known Atlas passage, check scoped retrieval and open the prepared app | Content is retrievable, not just a filename; use fallback at the support cutoff |
| 18–30 | Generate the first result | Run the chosen path's exercise below | A useful output with at least one supporting source |
| 30–40 | Inspect and challenge | Read citations; compare draft/approved plan; test unsupported budget | No superseded date presented as approved; unknowns stay unknown |
| 40–48 | Make one change | Change the question, meeting goal, or handoff focus; rerun | Explain how the task changed while the index stayed the same |
| 48–54 | Compare agents | Pair with another path or watch the facilitator switch agents | Different workflow and output over the same corpus; no reingestion |
| 54–58 | Recovery and operation | Watch sample-only tunnel stop/restart; review personal shutdown | Error is visible when disconnected; evidence returns after restart |
| 58–60 | Close and take-home | Record result, limits and next action | Knows restart/stop commands and where the complete handoff lives |

Allow roughly two minutes per generation/review cycle in the schedule. Actual latency and cost depend on retrieval and the model; do not promise a fixed response time.

## Exercises and answer key

Use the **bundled fictional Project Atlas corpus**. It includes an approved plan, superseded draft, meeting summary and an explicitly untrusted note. It is already supplied; facilitators do not need to invent a new corpus.

| Path | First exercise | Inspect |
| --- | --- | --- |
| Knowledge | “When does the approved Atlas pilot launch, for how many customers, and what changed from the draft?” | October 15, 2026 / 25 customers; superseded October 1 / 50 customers; citations distinguish versions |
| Meeting prep | Topic: Atlas pilot readiness. Participants: Product and engineering. Goal: Confirm launch gates and ownership. Duration: 30 minutes. | Source-backed context; suggested agenda totals 30 minutes; proposals are not agreed commitments |
| Project Handoff | Project: Atlas pilot. Recipient: Product and engineering. Focus: Continue launch preparation; explain gates, ownership and unresolved questions. | Priya Shah owns launch, Omar Chen rollback where supported; P1 bug closure and rollback rehearsal are gates, not proof of completion; reading list resolves |

For all paths: ask about the **approved budget**. The corpus does not establish one. The untrusted note's fabricated amount is not an approved fact. Read the cited passages: a citation button alone does not prove an answer is supported.

## 45-minute demonstration option

| Time | Activity |
| --- | --- |
| 00–07 | Outcome, three choices, data path |
| 07–12 | Ready-state and known-passage checks |
| 12–25 | Generate chosen output and inspect evidence |
| 25–33 | Conflicting versions and unsupported budget |
| 33–40 | Compare another agent; sample-only recovery demonstration |
| 40–45 | Shutdown, limits and take-home lab |

Requires preconfigured apps. No account creation, Drive setup or participant deployment in this format.

## Optional 30-minute extension

Use a previously ingested and authorized Google Drive folder; verify a known Google Doc passage via Antfly MCP before asking the agent. Alternatively bootstrap a second agent into a new directory and reuse the authorized index/tunnel. Do not restart or repoint an existing connection just to add another frontend.

## Materials

Use the companion FACILITATOR-NOTES.md and AGENT-HANDOFF.md from the complete bundle. Record participant outcomes using ACCEPTANCE.md. The private owner prototypes are review examples, not a shared attendee fallback.
