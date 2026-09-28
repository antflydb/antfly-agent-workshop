# Lumen Sync 2.4 — E401 connecting a workspace
Fictional workshop documentation. Published September 1, 2026. Applies only to Lumen Sync 2.4.

E401 during Connect workspace means the saved connection authorization was rejected. This document does not establish which underlying account policy caused the rejection.

Documented procedure:
1. In Lumen Sync, open Settings → Connections and select the affected workspace.
2. Select Re-authorize. Sign in with the account that has access to that workspace, and approve the requested connection.
3. Select Test connection. Continue only if the test reports Connected.
4. Retry the import once. If E401 persists, stop retrying and prepare a support handoff with product version, the exact error code, and the approximate time of the failure.

Do not paste tokens, passwords, or account recovery codes into a support conversation. Re-authorization does not require deleting local documents or resetting the index. This procedure does not promise the import will succeed.
