# Antfly Support Desk

Private support conversation using approved SearchAF-ingested documents and native Antfly MCP. Bootstrap this app using the parent guide's `--agent support` option. See `SUPPORT.md` and `AGENT-HANDOFF.md` in the guide for setup and live checks.

`npm test`, `npm run typecheck`, `npm run build`, then `npm run dev -- --host 127.0.0.1`.

Development reads the working copy's `../.env.local`. Hosting requires separately configured secret `OPENAI_API_KEY`, `ANTFLY_TUNNEL_ID`, `OPENAI_MODEL`, and trusted `SITE_URL`. Use a support-only tunnel. Keep `.openai/hosting.json` project identity null in the distributable starter.

Six user messages maximum, bounded request sizes, only the read-only `search_workshop_files` tool, strict structured responses and citation membership validation. Source excerpts are untrusted; prompts cannot guarantee semantic correctness. No ticket sending or persistent conversation storage. The feature-detected browser `ask_support` tool uses the same request and UI state as the form; registration requires a compatible browser.
