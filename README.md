# Antfly Agent Workshop

Build a support agent over a folder of documents in an hour: SearchAF extracts the documents on your Mac, the extracted text moves to an Antfly Cloud table, and a small app answers questions from that table with citations. The same table then serves two more apps.

- [HANDOFF.md](guides/searchaf-agent/HANDOFF.md): the steps, for you or the coding agent you hand them to.
- [CORPUS.md](guides/searchaf-agent/CORPUS.md): the seven sample documents and what each check proves.
- [starter/](guides/searchaf-agent/starter/): the three apps.
- [tools/promote.mjs](tools/promote.mjs): moves what SearchAF indexed into a Cloud table and runs the checks.

To hand the whole thing to an agent:

> Read guides/searchaf-agent/HANDOFF.md and follow it. Stop where it says to stop and ask me for the instance URL and key.

You need a Mac with SearchAF, an OpenAI API key, Node 22 or newer, and an Antfly Cloud account, which you create partway through.
