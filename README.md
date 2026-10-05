# Antfly Agent Workshop

Build a support agent over a folder of documents in an hour. SearchAF extracts the documents on your Mac and runs an Antfly engine there; a small app answers questions from it with citations. Then the documents are published to Antfly Cloud and the app is deployed to ChatGPT Sites, and the same app works with your Mac shut.

- [HANDOFF.md](guides/searchaf-agent/HANDOFF.md): the two prompts you give a coding agent, and what it does for each.
- [CORPUS.md](guides/searchaf-agent/CORPUS.md): the seven sample documents and what each check proves.
- [starter/](guides/searchaf-agent/starter/): the support agent and two more apps over the same documents.
- [tools/promote.mjs](tools/promote.mjs): finds the local engine, publishes what SearchAF indexed to a Cloud table, and runs the checks.

Before the first prompt: install [SearchAF](https://searchaf.com) and add this repository's `guides/searchaf-agent/sample-data` folder during its setup (not on a Mac? serve `guides/searchaf-agent/atlas.aflite` with `antfly lite serve` instead; HANDOFF.md has the two lines); create an Antfly Cloud account, an instance, and an instance key; have an OpenAI API key and Node 22 or newer.

> Clone this repository and set up my .env.local.

Then put your OpenAI API key in `~/antfly-workshop/.env.local` and:

> Build the support agent from guides/searchaf-agent/HANDOFF.md and run it locally.

Then put your instance URL and key in the same file and:

> Deploy everything to the cloud.
