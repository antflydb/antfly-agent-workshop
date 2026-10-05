# Starters

Three apps over the same Antfly Cloud table. Each reads four server-side variables (see `.env.example`), searches with `lib/cloud.ts`, and answers only from excerpts it retrieved.

- `site/`: knowledge agent. Ask a question, get an answer with citations you can open.
- `meeting-site/`: meeting prep. Context, open questions, and an agenda from the same documents.
- `handoff-site/`: project handoff. Background, decisions, and a reading list.

Build order and checks are in `../HANDOFF.md`. Each app has `npm test`, `npm run typecheck`, and `npm run build`.
