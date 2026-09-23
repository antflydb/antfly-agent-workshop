# Build an agent over your files

Use **SearchAF to ingest**, **Antfly MCP to retrieve**, and **OpenAI to answer** in a private Sites app.

1. Start with the included fictional Project Atlas documents or a small folder you select.
2. Add the folder in SearchAF and verify a known passage is indexed.
3. Configure the supplied adapter against the existing local Antfly database.
4. Connect the adapter to your own secure OpenAI tunnel.
5. Run a cited-answer check and build the included app.
6. Publish privately through Sites when your agent has access.
7. Ask a factual question, compare documents, and inspect the citations.

You do not need SearchAF MCP, a Manual token, a second database or a data reimport. Your Mac must stay awake with SearchAF and the tunnel running. The database stays local; retrieved excerpts go to OpenAI.

## Choose your agent

| Path | What the user provides | What they get |
| --- | --- | --- |
| Knowledge agent | A question | A cited answer and source excerpts |
| Project-handoff agent | Project, recipient and focus | A cited dossier, documented work, gaps and reading list |
| Meeting-prep agent | Topic, participants, goal and duration | A brief, prior decisions/proposals, evidence gaps, suggested agenda and questions |

All three use the same SearchAF ingestion and native Antfly MCP setup. Choose at bootstrap with `--agent knowledge`, `--agent meeting-prep`, or `--agent project-handoff`; no second database or reimport is needed.

## Hand this to Codex or Claude

Share the complete versioned bundle, not just this page, and use:

> Read `guides/searchaf-agent/AGENT-HANDOFF.md` and execute it in a new workspace. Use SearchAF for ingestion and native Antfly MCP for retrieval. Ask which agent I want to build: knowledge, meeting-prep, or project-handoff. Start with the sample corpus unless I select another folder. Ask only for missing source/account authorization or secure credential setup. Preserve my existing database and integrations. Verify each stage and report precisely what passed, what remains blocked, and whether the hosted browser test was completed.

The optional Skill is at `skills/use-cases/build-antfly-searchaf-agent/SKILL.md`. Reading the handoff directly is enough; the package does not require harness-specific auto-installation.

## Included

- [Agent handoff with exact commands](AGENT-HANDOFF.md)
- `starter/local/`: adapter, configuration, diagnostic and tunnel scripts, pinned dependencies, tests
- `starter/site/`: knowledge-agent Sites app
- `starter/meeting-site/`: meeting-prep Sites app with a distinct briefing layout
- `starter/handoff-site/`: project-handoff app with a dossier layout
- All three apps include lockfiles, citation checks and a live smoke script
- `sample-data/`: four fictional documents
- [Evaluation cases](evaluations.json) and [acceptance record](ACCEPTANCE.md)
- `scripts/bootstrap.py`: creates an isolated working copy
- `scripts/package.py`: creates a sanitized bundle with a checksum inventory

**Status:** experimental. The original private prototype retrieved Desktop and Google Doc evidence and generated a cited answer through native Antfly MCP. The portable package's checks are recorded separately in ACCEPTANCE.md. A second participant's account setup and hosted deployment still require rehearsal.


## Project Handoff: first use

The opening screen previews four parts of the dossier in softly shaded cards: **Where we started**, **What was decided**, **What needs attention**, and **Where to read next**. The cards explain the output; use the form on the left to generate it.

Type a project name or select a project example. Gray placeholder text is only a hint, not a filled-in value. Add a recipient and focus as useful context, then select **Build project dossier**. Inspect source citations, distinguish proposals from documented decisions, and verify owners/current status before using the suggested next checks. Entering a recipient does not send or share the result.

## Before demonstrating or sharing

Keep SearchAF and the tunnel running and the Mac awake. Confirm one fresh model result, then test the hosted app while signed in. A configuration indicator or backend test alone does not prove the hosted browser flow works.

The private examples remain owner-only unless access is deliberately changed. Screen-sharing works for an owner-led demo; sending a link does not grant team access. Direct viewers can query the selected connected sources, so approve the audience and dataset first. Use sample-only data for a shared workshop fallback.

Workshop materials: [agenda](WORKSHOP-AGENDA.md) · [facilitator notes](FACILITATOR-NOTES.md).
