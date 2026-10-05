# Atlas support packet

All seven sources are synthetic. The approved plan, superseded draft, meeting notes and untrusted note retain the original launch/version/budget/injection exercises. Three additional media sources make text extraction observable without changing those expected answers.

| Source | Distinctive fact | Support question |
| --- | --- | --- |
| `atlas-support-guide.pdf` | ATLAS-403 means session expiry; sign out and sign in; keep the cache | How do I resolve ATLAS-403? |
| `atlas-sync-error.png` | Review the change history before retrying ATLAS-409 | What should I do before retrying ATLAS-409? |
| `atlas-rollback-checklist.png` | RBR-17 requires the incident log; completion is not recorded | What must be attached to RBR-17? Is it complete? |

The screenshot and scanned worksheet are generated fixtures, not captures of a shipped Atlas product. The PDF contains selectable text; it is not the OCR exercise. The scanned PNG exercises OCR. No transcript, Markdown sidecar or answer manifest belongs inside `sample-data`: each media question must retrieve its own source.

## Checks

`corpus-checks.json` names four queries, the file each must find, and the passages that file must contain. `tools/promote.mjs check-local` runs them against SearchAF's index and `check` runs them against the Cloud table. A check passes when the file is in the top results and its extracted text holds every passage, so a filename match alone is not enough: the PDF text and the screenshots' text must have been read.

## Regenerate the media

Only maintainers need the generation dependencies; participant setup uses the committed assets and pinned workshop runtime dependencies.

```sh
uv run --with reportlab --with pillow python guides/searchaf-agent/scripts/build_sample_media.py
```

Render and inspect the PDF and both images after regeneration, then rerun the checks. Update `corpus-checks.json` if source facts change.

## atlas.aflite

`atlas.aflite` next to this file is the same corpus for people without a Mac: an Antfly Lite database with the `files` table (SearchAF's schema), the full-text index, and the seven rows exactly as `promote.mjs publish` writes them to Cloud (relative paths, extracted text, captions, no vectors). `antfly lite serve atlas.aflite --addr 127.0.0.1:8080` serves it with the same `/db/v1` API as SearchAF's engine.

To rebuild it after the documents change, with SearchAF holding the new extraction and the Antfly CLI (v0.2.5 or later) on the path:

```sh
cd guides/searchaf-agent && rm -f atlas.aflite && antfly lite init atlas.aflite
antfly lite serve atlas.aflite --addr 127.0.0.1:8777 &
cd ../.. && node tools/promote.mjs publish --root guides/searchaf-agent/sample-data --instance http://127.0.0.1:8777 --table files --no-vectors
node tools/promote.mjs check --instance http://127.0.0.1:8777 --table files --checks guides/searchaf-agent/corpus-checks.json
kill %1 && antfly lite vacuum guides/searchaf-agent/atlas.aflite
```

`publish` to a loopback address needs no key and, with `--no-vectors`, creates the table with SearchAF's schema and only the full-text index.
