# Working copy

Follow `guides/searchaf-agent/AGENT-HANDOFF.md` in the cloned repository. Bootstrap this directory once and reuse it for later steps.

- `local/`: enrichment checks, corpus exporter/publisher and optional native Antfly MCP adapter
- `site/`: private app with Cloud retrieval by default
- `sample-data/`: the folder to select in SearchAF after bootstrap
- `.env.example`: fields for your private `.env.local` in this working-copy root

Follow PIPELINE-QUICKSTART.md to ingest, verify and publish the seven-source packet. Follow CLOUD-PROMOTION.md to set the approved instance API base, dedicated table, exact published corpus version, table-scoped read-only key and OpenAI key/model. Keep hosted credentials as server-only secrets. All three app variants support these settings.

Cloud answering needs no running laptop adapter or tunnel. For optional local retrieval, set `ANTFLY_RETRIEVAL_MODE=local-tunnel` and follow LOCAL-TUNNEL.md; the Mac, scoped adapter and tunnel must remain available. Neither mode uses a SearchAF MCP Manual token, and Cloud failures never fall back to local retrieval.
