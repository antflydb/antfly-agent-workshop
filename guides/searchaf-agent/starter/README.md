# Starters

Three apps over the same documents. Each reads the same server-side variables (see `.env.example`), searches with `lib/retrieval.ts` against SearchAF's engine on the Mac or an Antfly Cloud table, and answers only from excerpts it retrieved.

- `site/`: knowledge agent. Ask a question, get an answer with citations you can open.
- `meeting-site/`: meeting prep. Context, open questions, and an agenda from the same documents.
- `handoff-site/`: project handoff. Background, decisions, and a reading list.

The prompts and checks are in `../HANDOFF.md`. Each app has `npm test`, `npm run typecheck`, and `npm run build`.
