# Workshop migration to native Antfly MCP

September 20, 2026

The intended architecture is now implemented: **SearchAF for ingestion, Antfly database and native Antfly MCP for retrieval, OpenAI for answers, Sites for the interface.** No corpus reimport, database reset, Cloud migration or new API key was needed.

## Request path

```text
Private Sites app
→ OpenAI Responses
→ existing secure tunnel
→ local read-only workshop adapter
→ native Antfly /mcp/v1
→ SearchAF-created files table
```

The small adapter remains to constrain the exposed operations, selected roots and result size, and to generate citation identifiers. It invokes Antfly `query` and `get_document` over Streamable HTTP. It no longer invokes SearchAF MCP or uses its token. The existing tool name and tunnel ID remain compatible with the published app, so no Sites frontend redeployment is required.

## Verified

- Native Antfly MCP initialization and tool discovery succeed.
- Antfly `get_document` reads the previously blocked Google Doc, with 7,818 characters of indexed text.
- Hybrid retrieval uses both full-text search and `document_vectors`.
- Corrected local adapter test returns eleven excerpts from Desktop and Google Drive, including four Google Docs. One oversized document was skipped.
- Six offline tests pass: path/symlink escape rejection, local grants, cloud provenance/indexed state, disabled/mismatched cloud scopes, database query filters, and runtime database identity.
- Managed tunnel restarted with the Antfly adapter.
- Live OpenAI → existing tunnel → adapter → Antfly MCP answer test passed: two successful tool calls, 23 unique evidence excerpts, a 1,439-character answer, and two valid citations. Evidence included Desktop and Google Drive. Both answer citations resolved to Google Docs: `Antfly_Brand_Foundation.gdoc` and `Antfly_Brand_Foundation (3).gdoc`.

## Response-size issue handled

Combining several full document bodies in one MCP query exceeded the server's response-size limit for some searches. The adapter now queries bounded metadata, then reads content individually. If an individual document still exceeds the limit it is skipped and counted in the tool response. Complete retrieval from arbitrarily large documents requires a follow-up chunk-level retrieval implementation; this prototype does not claim exhaustive corpus coverage.

## Access semantics

This is a private, single-owner indexed-snapshot test. The adapter checks current configured roots and source grants, matching persisted scope/account/mount metadata, and indexed cloud content state. It rereads grants before returning evidence. It does not independently revalidate live Google authorization or the full File Provider mount identity. Permission changes not yet reflected in indexed/configuration state may therefore not be known to it.

The existing SearchAF MCP finding remains valid for that separate product route; it no longer blocks this workshop. Stopping the tunnel revokes workshop connectivity. Disconnecting a SearchAF MCP client does not revoke this direct Antfly route.

## Files changed

- `searchaf-sites-local/adapter.py`: native Antfly MCP client and bounded retrieval.
- `searchaf-sites-local/configure.py`: explicit root selection; no SearchAF MCP token setup.
- `searchaf-sites-local/connection.json`: runtime/database discovery and selected roots.
- `searchaf-sites-local/test_adapter.py`: scope and configuration regression checks.
- Workshop overview, agenda, setup and build plan: corrected architecture and setup sequence.

The private hosted app URL remains unchanged. Signed-in browser confirmation of the revised route is a separate check from the live model/tunnel test.
