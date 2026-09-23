# Antfly Agent Workshop

Read `guides/searchaf-agent/AGENT-HANDOFF.md` before building a participant instance. Bootstrap into a new directory; never insert credentials or real deployment IDs in the starters. SearchAF ingests and native Antfly MCP retrieves through the scoped read-only adapter. Preserve existing datasets and connections.

This repository is the standalone workshop snapshot derived from Antfly Skills. Workshop improvements should be reconciled with the upstream guide deliberately; there is no automatic synchronization.

For documentation or packaging changes run `python3 scripts/validate_repo.py`. For app changes use the selected starter's tests, typecheck and build in an isolated working copy. Preserve lockfiles. Record live and hosted checks separately; do not turn historical results into fresh pass claims.
