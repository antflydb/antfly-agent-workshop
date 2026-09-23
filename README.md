# Antfly Agent Workshop

**One index, three agents.** Use SearchAF to ingest selected local and Google Drive files, retrieve through native Antfly MCP, and build a private OpenAI-powered Sites app.

Internal Antfly workshop and review repository · experimental · source bundle v0.3.1.

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

All three reuse the same index and scoped tunnel. The fictional Atlas sample corpus is included; personal source documents, credentials, deployment identities and running environments are not.

```text
Selected files → SearchAF → local Antfly database
                                      ↑
Private Sites app → OpenAI → tunnel → scoped adapter → Antfly MCP
```

SearchAF MCP and its Manual token are not used. Selected excerpts go to OpenAI; the index stays on the Mac. Keep SearchAF and the tunnel running and the Mac awake.

## Build from this repository

Clone the repository, then give your coding agent this instruction:

> Read `guides/searchaf-agent/AGENT-HANDOFF.md`. Help me choose Knowledge, Meeting prep, or Project Handoff and bootstrap it into a new working directory. Start with the included sample corpus unless I select another folder. Preserve existing data and connections, use native Antfly MCP for retrieval, and report each verification stage separately.

Example bootstrap (does not ingest or deploy):

```sh
python3 guides/searchaf-agent/scripts/bootstrap.py --agent project-handoff --destination "$HOME/antfly-workshop-handoff"
```

Supported pilot environment: macOS, SearchAF, Node 22.13+, Python 3.12 (or uv), and tmux. API billing, model access, secure MCP tunnel permissions and Sites tooling/access must be confirmed individually. See the handoff for exact setup steps and pinned dependencies.

## Workshop format and readiness

Plan 60 minutes with required prework; a 45-minute demo option is included. Each participant builds one agent. Google Drive and additional agents are optional extensions.

The original private prototypes passed live retrieval/generation checks, including desktop and Google Drive evidence. The portable starters have build and offline test evidence. **A second-person clean-machine/account rehearsal, full semantic evaluations and recovery checks remain required.** See the dated acceptance record; repository publication is not a new end-to-end verification.

Prototype Sites remain separately controlled and owner-private. Repository access does not grant access to those apps or the owner's data. For a team demonstration, arrange an owner-led screen share or an explicitly approved sample-only deployment.

## Repository contents and maintenance

- `guides/searchaf-agent/`: runnable starters, Atlas samples, evaluations, handoff and package tooling.
- `skills/use-cases/build-antfly-searchaf-agent/`: optional reusable Skill; keep it with the guide.
- `docs/`: facilitator kit, planning, troubleshooting and historical engineering findings.
- `scripts/validate_repo.py`: link, artifact and credential-pattern checks plus three-path bootstrap verification.

This standalone snapshot comes from the Antfly Skills workshop guide. It does not include unrelated skills, original personal app repositories, stale ZIPs or generated dependencies. Reconcile future fixes with the upstream guide deliberately.

```sh
python3 scripts/validate_repo.py
python3 guides/searchaf-agent/scripts/package.py --output /tmp/antfly-workshop-v0.3.1.zip
```

The ZIP contains the participant guide/Skill, three starters, agenda and facilitator notes. Clone this repository for the full internal planning and engineering materials.
