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
| Known support passage | Blocked: initial support-only query returned zero excerpts; user asked to add the dedicated sample folder in SearchAF |
| Dedicated support tunnel | Awaiting user-provided tunnel ID; existing agents' tunnel preserved |
| Live model evaluations | Not run; requires indexed evidence and support tunnel |
| Private Sites deployment | Succeeded as owner-only review preview; live answers intentionally disabled until support tunnel is configured |
| Unauthenticated hosted API | HTTP 401, access denied |
| Signed-in hosted request | Not run |
| Browser WebMCP tool | Feature-detected implementation; no compatible validation context available, not verified |
| Clean-machine participant rehearsal | Not run |

Structural tests do not establish semantic correctness or prompt-injection resistance under a live model. Do not describe Support Desk as demo-ready until native retrieval, three live support cases and signed-in hosted generation pass.
