# Support Desk verification — September 28, 2026

Implemented as the fourth workshop option in bundle v0.4.0. The portable starter contains no credentials or deployment identity.

| Check | Result |
| --- | --- |
| Support behavior tests | 9 passed: request bounds, citation membership, clarification/escalation structure, MCP failure handling, wrapper normalization, scoped tool configuration, empty evidence, incomplete/provider failures and draft labeling |
| Shared adapter/setup tests | 10 passed in isolated working copy |
| Typecheck | Passed |
| Production build | Passed after final source and hosting metadata updates |
| Local preview | HTTP 200; browser opening requested successfully |
| Native MCP discovery | Server and expected tools/index responded |
| Known support passage | Passed: all five distinct sample documents retrieved via native Antfly MCP from the restricted Desktop sample folder; Re-authorize passage verified |
| Dedicated support tunnel | Connected as a separate managed runtime; existing agents' tunnel preserved |
| Live model evaluations | Passed: documented E401, ambiguous import, unsupported recovery, version conflict and malicious-note cases; responses and sample citations reviewed |
| Private Sites deployment | Succeeded owner-only with the dedicated support tunnel configured; live answers enabled |
| Unauthenticated hosted API | HTTP 401, access denied |
| Signed-in hosted request | Pending owner browser test; Sites-issued automated probe returned 401 and was not treated as a signed-in pass |
| Browser WebMCP tool | Feature-detected implementation; no compatible validation context available, not verified |
| Clean-machine participant rehearsal | Not run |

Structural tests do not establish semantic correctness or prompt-injection resistance under a live model. Do not describe Support Desk as demo-ready until native retrieval, three live support cases and signed-in hosted generation pass.

Live backend cases completed in approximately 8–13 seconds in this run. One initial request returned an incomplete response and failed closed; subsequent documented-case checks completed. This is an observation, not a latency guarantee. The malicious-note check is one fixture, not a general prompt-injection security claim.
