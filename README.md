# Antfly Agent Workshop

**Prototype locally, deploy independently.** Extract selected files with SearchAF, publish a tested corpus to Antfly Cloud, and deploy a private support agent with hosted retrieval.

Internal workshop repository · experimental · starter repository. The repository supplies verified local enrichment and Cloud publication commands in [Pipeline quickstart](guides/searchaf-agent/PIPELINE-QUICKSTART.md). All three example apps include Cloud REST retrieval by default. [Cloud promotion](guides/searchaf-agent/CLOUD-PROMOTION.md) documents their configuration; local-tunnel retrieval remains an explicit option.

## Start here

| Audience | Start with |
| --- | --- |
| Team reviewing the workshop | [Workshop agenda](docs/AGENDA.md) and [facilitator notes](docs/FACILITATOR-NOTES.md) |
| Participant | [Workshop quickstart](docs/WORKSHOP-QUICKSTART.md) |
| Codex or Claude building an agent | [Agent handoff](guides/searchaf-agent/AGENT-HANDOFF.md) |
| Engineer reviewing the implementation | [Guide](guides/searchaf-agent/guide.md), [acceptance record](guides/searchaf-agent/ACCEPTANCE.md), and [evaluations](guides/searchaf-agent/evaluations.json) |
| Workshop organizer | [Build plan and timeline](docs/BUILD-PLAN.md) and [setup troubleshooting](docs/SETUP-AND-TROUBLESHOOTING.md) |

## Choose an agent

| Agent | Task | Starter |
| --- | --- | --- |
| Knowledge | Ask questions and inspect cited answers | `guides/searchaf-agent/starter/site` |
| Meeting prep / Fieldnotes | Prepare context, questions and a suggested agenda | `guides/searchaf-agent/starter/meeting-site` |
| Project Handoff | Transfer background, decisions, documented work and a reading list | `guides/searchaf-agent/starter/handoff-site` |

The main session builds one support agent. Meeting prep and project handoff reuse the same Cloud corpus and connection settings.

```text
Prototype: selected files → SearchAF → local Antfly → passage checks
Promote:   selected full extracted bodies + retrieval configuration → Antfly Cloud
Serve:     private app + hosted bounded retrieval → Antfly Cloud REST query API
           model answers with citations; no laptop tunnel in the serving path
```

SearchAF MCP and its Manual token are not used. Cloud publication sends selected document bodies; model answering sends retrieved excerpts. The final gate is a fresh hosted request from another device with the local runtime stopped.

## Build from this repository

Clone the repository, then give your coding agent this instruction:

> Read `guides/searchaf-agent/AGENT-HANDOFF.md`. Follow CLOUD-PROMOTION.md and bootstrap the support agent into a new working directory. Start with the synthetic sample corpus. Run PIPELINE-QUICKSTART.md using the supplied publisher, then configure the app’s Cloud settings. Reuse an existing workshop working copy rather than bootstrapping it again. Preserve existing data and connections, use native MCP locally and the enforced Cloud REST query API, and report each verification stage separately.

Example bootstrap (does not ingest or deploy):

```sh
python3 guides/searchaf-agent/scripts/bootstrap.py --agent knowledge --destination "$HOME/antfly-files-workshop"
```

Supported pilot environment: macOS, SearchAF, Node 22.13+, Python 3.12 (or uv); tmux is only needed for the optional tunnel path. API billing/model access, approved Antfly Cloud target/budget, scoped credentials and Sites tooling/access must be confirmed individually. See the handoff for exact setup steps and pinned dependencies.

## Workshop format and readiness

Plan 60 minutes with required prework; a 45-minute demo option is included. Each participant builds one agent. Google Drive, additional agents and local-tunnel hosting are optional extensions. Verify the chosen account, corpus and deployment before the live session.

The original private prototypes passed live retrieval/generation checks, including desktop and Google Drive evidence. The portable starters have build and offline test evidence. Cloud retrieval is implemented in all three apps. **Real model/Cloud semantic evaluations and hosted serving-independence checks must still be recorded for each deployment.** The pipeline and publisher have fresh installed-release/Cloud rehearsal evidence in ACCEPTANCE.md. See the dated acceptance record; repository publication is not a new end-to-end verification.

Prototype Sites remain separately controlled and owner-private. Repository access does not grant access to those apps or the owner's data. For a team demonstration, arrange an owner-led screen share or an explicitly approved sample-only deployment.

## Repository contents and maintenance

- `guides/searchaf-agent/`: runnable starters, Atlas samples, evaluations, handoff and validation tooling.
- `skills/use-cases/build-antfly-searchaf-agent/`: optional reusable Skill; keep it with the guide.
- `docs/`: facilitator kit, planning, troubleshooting and historical engineering findings.
- `scripts/validate_repo.py`: link, artifact and credential-pattern checks plus three-path bootstrap verification.

This standalone snapshot comes from the Antfly Skills workshop guide. It does not include unrelated skills, original personal app repositories, stale ZIPs or generated dependencies. Reconcile future fixes with the upstream guide deliberately.

```sh
python3 scripts/validate_repo.py
```

Participant setup uses this repository; no ZIP is distributed. Record the checked-out commit for reproducible setup.
