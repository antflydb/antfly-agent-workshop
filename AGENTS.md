# Antfly Agent Workshop

Read `guides/searchaf-agent/AGENT-HANDOFF.md` before building a participant instance. Bootstrap into a new directory; never insert credentials or real deployment IDs in the starters. The main workshop prototypes locally, publishes a selected corpus to Antfly Cloud and hosts bounded retrieval with the app. Run PIPELINE-QUICKSTART.md for the supplied enrichment checker and publisher. Read CLOUD-PROMOTION.md: the web app starters still implement the optional local-tunnel reference and require Cloud REST adaptation. Preserve existing datasets and connections.

This repository is the standalone workshop snapshot derived from Antfly Skills. Workshop improvements should be reconciled with the upstream guide deliberately; there is no automatic synchronization.

For documentation or packaging changes run `python3 scripts/validate_repo.py`. For app changes use the selected starter's tests, typecheck and build in an isolated working copy. Preserve lockfiles. Record live and hosted checks separately; do not turn historical results into fresh pass claims.
