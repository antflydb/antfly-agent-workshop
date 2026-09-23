# Build an agent over your files

**SearchAF for ingestion. Antfly MCP for retrieval. OpenAI for answers.**

For Codex or Claude, use the [agent-ready handoff](../guides/searchaf-agent/AGENT-HANDOFF.md) and its complete runnable bundle. This page is the human walkthrough.

In this workshop, you’ll index a small set of documents, connect an agent to that index, and ask questions with citations. The interface runs privately on OpenAI Sites; your Antfly database stays on your Mac.

## Before the workshop

Have SearchAF installed, a small folder of documents you’re comfortable using, and an OpenAI Platform account with API billing and a key. The facilitator should confirm access to Sites and secure MCP tunnels and provide the prepared app and local adapter. Complete account setup before the live session.

**Format:** plan for 60 minutes with setup completed in advance. This guide assumes the facilitator supplies the tested prototype; it is not yet a standalone installer.

## Choose what to build

| Agent | Start with | Result |
| --- | --- | --- |
| Knowledge agent | A question about your documents | A cited answer with source excerpts |
| Project Handoff | Project, recipient and focus | A cited dossier, documented work, gaps and reading list |
| Meeting-prep agent | Meeting topic, participants, goal and duration | A brief with context, decisions/proposals, suggested agenda and questions |

All three paths use the same SearchAF ingestion, Antfly database and MCP connection. Build one, or add another later without reimporting data.

## 1. Add your documents to SearchAF

Create a folder such as `Desktop/workshop-files` and put 5–10 useful documents in it. Add that exact folder in SearchAF’s folder settings and let indexing finish.

Search for a phrase you know appears inside one document. Confirm that its content—not just its filename—is searchable.

**What happened:** SearchAF ingested your files into its local Antfly database. You don’t need to create or import a second database.

## 2. Connect the workshop adapter to Antfly MCP

In the facilitator-provided local adapter folder, run:

```sh
python3 configure.py --root "$HOME/Desktop/workshop-files"
```

Use the same folder you added to SearchAF. The adapter discovers the SearchAF-owned Antfly database’s current local MCP endpoint and restricts retrieval to your selected sources.

**No SearchAF MCP setup or “Manual” token is required.** The adapter calls Antfly’s native MCP tools to search and read indexed documents.

Have the facilitator verify one known passage through the adapter before continuing.

## 3. Connect the secure tunnel

Create your workshop tunnel in the OpenAI Platform organization associated with your API key. Save the key securely and record the tunnel ID.

Use the facilitator’s prepared launcher to connect that tunnel to the local adapter. Verify both tunnel readiness and a successful document search.

Keep SearchAF running and your Mac awake. The tunnel lets the hosted agent reach the local retrieval service.

## 4. Open your private agent app

Use the prepared Sites template for your chosen agent: Knowledge, Meeting-prep, or Project Handoff. Configure these values on the server:

| Setting | Value |
| --- | --- |
| `OPENAI_API_KEY` | Your API key, stored as a secret |
| `ANTFLY_TUNNEL_ID` | Your tunnel ID |
| `OPENAI_MODEL` | The workshop’s tested model, available to your account |

Publish privately and sign in. Each participant uses their own key, tunnel, and documents.

The connection is:

```text
Your files → SearchAF → local Antfly database
                                ↑
Sites app → OpenAI agent → tunnel → adapter → Antfly MCP
```

The adapter limits retrieval and formats citations. Antfly MCP powers database access; SearchAF handles ingestion.

## 5. Try your chosen agent

**Knowledge agent:**

1. **Find a fact:** “What does [document] say about [topic]? Cite the source.”
2. **Combine evidence:** “Compare what these documents say about [topic]. Where do they agree or differ?”
3. **Check the limits:** Ask something your documents don’t answer. Look for a clear statement that evidence is insufficient.

**Meeting-prep agent:** enter a topic, participants, desired outcome and meeting length. Generate the brief, inspect cited context and prior decisions, then review the suggested agenda and questions. Check that agenda minutes match the meeting length and proposals are not presented as agreed decisions.

**Project Handoff:** enter the project, recipient and focus. Review background, decisions, documented work and reading list. Verify owners and dates; treat current status as needing confirmation. The recipient field does not share access or assign work.

Open each citation and check that the passage supports the answer. For the workshop, success means a useful answer with evidence you can inspect.

## 6. Optionally add Google Drive

Connect your chosen Drive folder in SearchAF. For Google Docs content, complete SearchAF’s Google sign-in and verify that text has been indexed. Streaming is supported; a placeholder alone does not prove content is available.

Have the facilitator add the selected Drive root to the adapter configuration while preserving your existing roots. Repeat a known-answer question and check for a Google Drive citation.

## 7. Finish and disconnect

Stop the workshop tunnel when finished. From the generated workshop working copy:

```sh
local/.venv/bin/python local/tunnel.py stop
```

Use the same `--alias` value if you selected a custom runtime alias.

This stops the agent’s connection without deleting your files or index. Disconnecting a SearchAF MCP client does not stop this Antfly MCP route.

## If something doesn’t work

- **Missing document:** check ingestion in SearchAF, then the adapter’s selected folders.
- **App cannot search:** check SearchAF, tunnel readiness, and that the Mac is awake.
- **Answer only lists files:** ask “Explain” or “Compare” instead of “Find.”
- **Large document missing:** the prototype may skip documents exceeding MCP response limits.

The index stays local, but retrieved excerpts go to OpenAI. This private prototype reads indexed snapshots; it does not check live Google permissions on every question.

**Facilitator details:** [setup and troubleshooting](SETUP-AND-TROUBLESHOOTING.md) · [agenda and timing](AGENDA.md) · [verified architecture](ANTFLY-MCP-MIGRATION.md)

**Facilitator runbook:** [facilitator notes](FACILITATOR-NOTES.md).


## Project Handoff: first use

The opening screen previews four parts of the dossier in softly shaded cards: **Where we started**, **What was decided**, **What needs attention**, and **Where to read next**. The cards explain the output; use the form on the left to generate it.

Type a project name or select a project example. Gray placeholder text is only a hint, not a filled-in value. Add a recipient and focus as useful context, then select **Build project dossier**. Inspect source citations, distinguish proposals from documented decisions, and verify owners/current status before using the suggested next checks. Entering a recipient does not send or share the result.

## Before demonstrating or sharing

Keep SearchAF and the tunnel running and the Mac awake. Confirm one fresh model result, then test the hosted app while signed in. A configuration indicator or backend test alone does not prove the hosted browser flow works.

The private examples remain owner-only unless access is deliberately changed. Screen-sharing works for an owner-led demo; sending a link does not grant team access. Direct viewers can query the selected connected sources, so approve the audience and dataset first. Use sample-only data for a shared workshop fallback.
