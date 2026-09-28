# Lumen Sync 2.4 — Import troubleshooting
Fictional workshop documentation. Published September 1, 2026.

For an unspecified import failure, collect the exact error code, product version, and source type before recommending a fix. A failed import alone does not establish whether the cause is authorization, file size, or an unsupported format.

For error E413, an individual file exceeds the 20 MB per-file import limit in version 2.4. Split or export that source document into supported files no larger than 20 MB, then retry those files. Do not delete the original. Supported imports in 2.4 are PDF, plain text, and Markdown. Password-protected PDFs are not supported; ask the document owner for an approved unprotected export rather than attempting to bypass protection.

The Activity page shows each import's state: Queued, Processing, Complete, or Failed. Complete indicates ingestion finished; it does not certify the content is current or correct.
