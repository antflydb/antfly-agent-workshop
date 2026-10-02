# Atlas support packet

All seven sources are synthetic. The approved plan, superseded draft, meeting notes and untrusted note retain the original launch/version/budget/injection exercises. Three additional media sources make text extraction observable without changing those expected answers.

| Source | Distinctive fact | Support question |
| --- | --- | --- |
| `atlas-support-guide.pdf` | ATLAS-403 means session expiry; sign out and sign in; keep the cache | How do I resolve ATLAS-403? |
| `atlas-sync-error.png` | Review the change history before retrying ATLAS-409 | What should I do before retrying ATLAS-409? |
| `atlas-rollback-checklist.png` | RBR-17 requires the incident log; completion is not recorded | What must be attached to RBR-17? Is it complete? |

The screenshot and scanned worksheet are generated fixtures, not captures of a shipped Atlas product. The PDF contains selectable text; it is not the OCR exercise. The scanned PNG exercises OCR. No transcript, Markdown sidecar or answer manifest belongs inside `sample-data`: each media question must retrieve its own source.

## Retrieval gate

After bootstrap, index only the working copy's `sample-data` in SearchAF and configure the gateway for that root. From the working directory run:

```sh
local/.venv/bin/python local/check.py --corpus-checks corpus-checks.json
```

The checker uses native Antfly MCP and the workshop gateway, independently of OpenAI. A check passes only when every expected phrase is present in excerpts carrying the exact source filename. It normalizes whitespace and case for OCR line breaks. It prints format/pass status and oversized-document counts; it exits nonzero if any case fails. Expected answers remain outside the indexed corpus.

Then ask the three questions in the local app and deployed Site, inspecting each cited passage against the original file. A passage check proves retrieval, not semantic accuracy of the generated answer. The model receives extracted text and captions, not original images. Inferred captions may be wrong; the image and OCR are the evidence for exact error messages and checklist instructions.

This packet deliberately uses PDF and PNG row content. The current SearchAF source routes Office documents through native document artifacts; that body is not automatically read by the workshop's row-text gateway. Validate new formats through the same source-specific gate before adding them. Do not substitute another file or widen source scope to obtain a pass.

## Regenerate the media

Only maintainers need the generation dependencies; participant setup uses the committed assets and pinned workshop runtime dependencies.

```sh
uv run --with reportlab --with pillow python guides/searchaf-agent/scripts/build_sample_media.py
```

Render and inspect the PDF and both images after regeneration, then rerun the passage gate. Update the manifest and evaluations deliberately if source facts change.
