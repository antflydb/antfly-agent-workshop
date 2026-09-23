# Working copy

Follow the supplied `guides/searchaf-agent/AGENT-HANDOFF.md` from the original bundle.

- `local/`: native Antfly MCP adapter and launcher
- `site/`: private Sites app
- `sample-data/`: copied here by bootstrap
- `.env.example`: fields for your private `.env.local`

Configuration and secrets are intentionally absent. SearchAF ingests; Antfly MCP retrieves. The app never needs a SearchAF MCP token.
