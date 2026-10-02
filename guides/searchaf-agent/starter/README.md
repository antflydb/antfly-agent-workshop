# Working copy

Follow the supplied `guides/searchaf-agent/AGENT-HANDOFF.md` from the original bundle.

- `local/`: native Antfly MCP adapter and launcher
- `site/`: private Sites app
- `sample-data/`: copied here by bootstrap
- `.env.example`: fields for your private `.env.local`

Configuration and secrets are intentionally absent. SearchAF ingests; Antfly MCP retrieves. The app never needs a SearchAF MCP token.

## Cloud workshop path

This is the local-tunnel reference implementation. Bootstrap installs local enrichment checks and the Cloud publisher, while the web app remains the local-tunnel reference. Read PIPELINE-QUICKSTART.md for local → Cloud corpus verification. Follow `AGENT-HANDOFF.md` and `CLOUD-PROMOTION.md` in the original bundle to adapt this isolated working copy; use `LOCAL-TUNNEL.md` for the optional existing personal-agent route. Do not deploy the unchanged starter and claim serving independence.
