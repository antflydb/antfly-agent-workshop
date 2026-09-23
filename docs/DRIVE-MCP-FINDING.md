# Google Drive ingestion works; MCP omits cloud-source authorization

> September 20 update: the workshop now uses native Antfly MCP against the SearchAF-created database. Google Doc retrieval succeeds through that route. This historical finding concerns SearchAF MCP only; it is no longer a workshop retrieval blocker. See [migration notes](ANTFLY-MCP-MIGRATION.md).

Internal engineering finding · September 19, 2026

## Impact

The Google Drive connector has indexed content, including native Google Docs, but the workshop agent cannot access it through SearchAF MCP. Streaming is explicitly supported by SearchAF and is not the configuration change needed here.

**Correction to the first diagnostic:** an MCP aggregate returned zero Drive records. That number described the MCP-accessible subset, not the underlying index. It should not have been reported as proof that Drive ingestion was empty.

## Reproduction and evidence

Installed SearchAF: 0.1.28, commit `7b742320350dab91866dc0466975eabc7ef0ce96`. Latest published release checked September 19 remained 0.1.28. Refreshed main was `e746654` and retained the local-only MCP checks described below.

1. Configure a streamed My Drive source and Google sign-in; content preparation is enabled.
2. Metadata-only diagnostics of the local Antfly index found **445 Google Drive file records**. Cloud control records report **381 content-indexed** and **64 title-only** items. The title-only reasons are **46 unsupported_type** and **18 permission_lost**. These are diagnostic state counts, not a claim that every indexed document has been individually read or validated.
3. A Google-native `.gdoc` record (`Antfly_Brand_Foundation (4).gdoc`) is marked `content_state=indexed` in the file table.
4. MCP `read_document` using that record's document ID returns `outside_watched_folders` for its Drive path.
5. MCP `get_index_status` lists Desktop only and diagnoses the configured My Drive root as `outside_watched`.
6. MCP metadata aggregate constrained to that Drive root returns zero; a sorted title query returns no results.
7. Relevance search also encountered cloud-scope query timeouts. Recent logs include a failed Google Docs request with HTTP 404 / access_unconfirmed. These are additional issues; neither explains away the deterministic local-only authorization check.

The diagnostic read only index/control metadata. It did not retrieve hidden document bodies directly from the database or expose them to the agent as a workaround.

## Code paths to review

- `internal/app/mcp_tools.go`: `MCPIndexStatus` reports only `cfg.WatchDirs`. `mcpPathInWatchedRoots` checks only `WatchDirsSnapshot`. `mcpResolveDocument` uses that check for both paths and IDs.
- `internal/app/mcp_search_paging.go`: relevance results are post-filtered with `mcpPathInWatchedRoots`, dropping valid cloud results. Sorted search uses the aggregate query scope.
- `internal/app/mcp_aggregate.go`: `mcpAggregateQueries` requires active local `watch_dir_id` values, excluding cloud rows governed by `scope_id`.
- `internal/app/remote_source_queries.go` and `remote_sources.go`: existing cloud visibility/authorization machinery should remain the source of truth for cloud access.

## Required fix design

Unify MCP document access with SearchAF's current validated source grants: active local watched roots **or** enabled, identity-validated cloud scopes, with per-record visibility and current access checks. Apply the same rules to search, read, count, and status.

Do not simply add every configured Drive path to `WatchDirs`, remove the authorization check, or trust a folder prefix alone. Those approaches can expose stale, removed, wrong-account, or permission-revoked cloud content. Direct database retrieval in the workshop adapter would also bypass the existing boundary and is not the proposed fix.

Cloud document lookup must use its actual indexed document key and the cloud-aware content path. A Google-native document is not ordinary local placeholder text. Preserve provenance and indicate title-only or inaccessible content honestly.

## Acceptance tests for the SearchAF change

1. Search and read a known indexed Google Doc through MCP, then obtain a cited workshop answer from its content.
2. Repeat with a streamed PDF/Office file and verify content, not just a filename.
3. MCP counts and source status include authorized cloud records without claiming unsupported content is searchable.
4. Removing or pausing/revoking a source as appropriate to its access semantics, account mismatch, unvalidated mount identity, and document permission loss continue to prevent access. Verify both path and ID reads, including stale IDs/cursors.
5. Local Desktop search/read/count behavior remains correct.
6. Cloud-query failures produce honest status rather than silently implying the cloud corpus is empty.
7. Test tunnel disconnect and recovery after the retrieval fix.

## Workshop consequence

Keep the first workshop on a dedicated local folder. Google Drive remains an optional lab blocked on this MCP fix and end-to-end verification. Do not ask attendees to switch to mirroring or repeatedly reauthenticate as a blanket remedy for this bug.

No SearchAF application binary, OAuth credentials, folder configuration, or index contents were changed during this diagnosis. No GitHub issue or external message has been posted.

## Product documentation

- [SearchAF Google Drive help](https://www.searchaf.com/help/google-drive): streaming and mirroring supported; native Docs text requires Google sign-in; Sheets/Slides and shared-drive files are currently name-only.
- [Google Drive streaming versus mirroring](https://support.google.com/drive/answer/13401938): streamed files reside primarily in the cloud and are downloaded as needed.
