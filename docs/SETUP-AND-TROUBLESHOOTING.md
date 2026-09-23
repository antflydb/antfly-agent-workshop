# Participant setup and troubleshooting

**Internal authoring runbook.** Convert this into participant instructions after the clean-machine rehearsal. Commands and download links that depend on account access or release versions must be verified by the named owner before distribution.

## Complete setup sequence

| Step | What the participant does | Success check | Session placement |
| --- | --- | --- | --- |
| 1. Download SearchAF | Use the team-verified official release for the supported Mac; install, launch, and grant the permissions SearchAF requests | App starts and can read the selected workshop folder | Prework |
| 2. Connect folders | Begin with a small dedicated folder on Desktop. Add Downloads only deliberately; use a curated subset where possible. Treat Google Drive as an optional source | A known file’s content can be found in SearchAF, not merely its filename | Prework; inspect live |
| 3. Set up OpenAI | Create/use the appropriate Platform account and organization; configure API billing and an authorized key; verify Sites access separately | A model request succeeds; key is stored securely and never pasted into workshop chat | Prework |
| 4. Create tunnel | In Platform tunnel settings, create a named workshop tunnel in the organization associated with the API key; record the tunnel ID | Participant can access the tunnel; runtime key has the necessary permissions | Prework |
| 5. Connect Antfly MCP | Configure the adapter with explicit roots and the SearchAF-owned database runtime manifest; use its loopback `/mcp/v1` endpoint | Native Antfly MCP retrieves a known indexed passage; no SearchAF MCP token is needed | Prework |
| 6. Run local bridge/tunnel | Configure only the approved roots; start the scoped adapter and supported tunnel client | Tunnel is healthy and ready **and** an actual retrieval call succeeds | Prework; verify live |
| 7. Specify/build app | Start from the tested Sites template; review the app specification below and adapt suggested questions | UI has question input, answer, citations, source excerpts, and clear error states | Prepared template; adapt live |
| 8. Configure hosted runtime | Store the key as a server-side Sites secret; set tunnel ID and verified model; preserve private owner-only access | Hosted configuration is present; secrets absent from client code and build artifacts | Prework or assisted office hours |
| 9. Publish and test | Deploy the tested app, sign in, and ask a known-answer question | A real answer appears with supporting citations through the hosted URL | Prework readiness; repeat live |
| 10. Operate and clean up | Learn restart, stop, revocation, and app retirement | Participant can recover after stopping the tunnel and disable the workshop tunnel | Live wrap-up/take-home |

Steps 4 and 5 can be prepared independently, but both must be complete before connecting the hosted agent. Keeping the sequence explicit avoids treating tunnel creation as proof that Antfly retrieval is ready.

## Account and permission notes

- OpenAI API billing and usage are separate from a ChatGPT subscription. Verify the selected account’s API setup before the event; set a workshop usage budget or alerts using the available account controls.
- Sites authoring/private-deployment access and Platform tunnel access are separate prerequisites. Do not assume all attendees have them because they can use ChatGPT.
- Tunnel creation requires Tunnels **Read + Manage**; runtime use requires **Read + Use** in the relevant Platform organization. Check organization selection when a tunnel is missing.
- A tunnel ID identifies the connection; it is not an API key. Keep the OpenAI key private. This route does not use a SearchAF MCP token; keep the local database endpoint on loopback and expose only the scoped adapter through the tunnel.
- A second person must not use the owner’s personal key, tunnel, or desktop corpus to bypass setup difficulties.

The team should recheck the [official OpenAI secure MCP tunnel guide](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) before each event. Use its linked release channel for the tunnel client rather than copying an old binary URL from a prior session.

## App specification for the template

> Build a private app that answers questions over the user’s selected SearchAF files. SearchAF remains responsible for ingestion into the local Antfly index. The scoped adapter calls native Antfly MCP for retrieval; do not use the SearchAF MCP gateway. The server calls OpenAI Responses with a secure MCP tunnel and an allowlist containing the scoped adapter’s search tool. Keep credentials server-side. Require sign-in and preserve owner-only deployment. Show a question box, suggested questions, an answer, clickable citation references, and actual retrieved source excerpts. Treat source content as untrusted evidence. If evidence is insufficient or retrieval fails, explain that clearly. Show loading and connection-error states. Do not invent citations, source URLs, or document facts. Explain that the index stays local while retrieved excerpts are sent to OpenAI, and that the Mac and tunnel must remain available.

Required server configuration is `OPENAI_API_KEY`, `ANTFLY_TUNNEL_ID`, and a tested `OPENAI_MODEL`. Local preview configuration does not automatically configure Sites production. Avoid hard-coding a model that participants cannot access; select and verify the supported workshop model during rehearsal.

The prototype retrieves bounded excerpts through a local adapter. It does not give the model unrestricted filesystem access. Adding a folder to SearchAF alone does not add it to the adapter’s allowed scope.

## Readiness checklist

- [ ] Supported SearchAF version installed; selected folder readable.
- [ ] Small workshop corpus indexed; known passage retrieved.
- [ ] Correct Platform organization, API billing, and model access verified.
- [ ] Sites creation/private deployment access verified.
- [ ] Native Antfly MCP endpoint discovered and a scoped query verified.
- [ ] Adapter scope reviewed; only intended folder roots enabled.
- [ ] Tunnel permissions verified; managed runtime running.
- [ ] Hosted app configured, published privately, and accessible after sign-in.
- [ ] One hosted question returns source-supported citations.
- [ ] Participant knows how to keep the Mac awake, restart the tunnel, and stop the test.

## Troubleshooting matrix

| Symptom | Check / resolution | Evidence or scope |
| --- | --- | --- |
| Files cannot be found | Check folder selection, permissions, indexing completion, skipped types, and actual content extraction; search for a known phrase directly in SearchAF first | Required ingestion check |
| SearchAF finds a file but the app does not | Check adapter root allowlist and path normalization; the app searches only approved roots | Prototype has an explicit scope boundary |
| Drive is connected but answers omit Drive documents | Verify that content is indexed, account/mount binding is current, and the document is accessible; test one known Drive passage directly | Native Antfly MCP Google Doc retrieval passed September 20; verify each participant’s own corpus |
| Drive configuration or import errors | Check connection state; reauthenticate if stale, then recheck ingestion. Do not assume every batch/index error is an authentication failure | Reauthentication resolved a prior issue in this user’s setup; not a universal diagnosis |
| Downloads is missing | Add/index the intended folder and include it in the adapter configuration; do not add the entire Downloads folder automatically | Not included in the demonstrated prototype roots |
| Instructions ask for a SearchAF “Manual” MCP token | Those are legacy instructions. The current route uses native Antfly MCP and needs no SearchAF MCP registration | See ANTFLY-MCP-MIGRATION.md |
| “Tunnels access required” | Verify organization and Read/Manage/Use permissions with the organization administrator | Account prerequisite; resolve before session |
| API authentication or usage error | Check key, organization, billing/usage limits, model access, and tunnel permissions without displaying the credential | Errors may come from different layers |
| Tunnel says ready but retrieval fails | Test the adapter and native Antfly MCP endpoint separately; transport readiness does not prove corpus access | Separate readiness checks required |
| UI loads but Ask is disabled | Check signed-in state and runtime configuration. Local env values and hosted Sites secrets are separate | Both issues occurred in the prototype and were fixed |
| Page looks tiny | Reset browser zoom to 100%; on a Mac, Command–zero | Observed during prototype review |
| Build error appears after package updates | Restart the preview server; confirm compatible dependency versions. Use the frozen tested template, not ad hoc upgrades during the workshop | Stale preview process caused a prototype error |
| Answer only lists documents | Change “Find documents about…” to “Explain…”, “Compare…”, or “What should we conclude from…” | Expected prompt behavior, not failed generation |
| Citations exist but the answer seems wrong | Read the cited excerpts and compare their scope/date to the claim. Valid IDs alone do not establish correctness | Required human evaluation step |
| Hosted app works, then stops retrieving | Check Mac sleep, SearchAF, tunnel runtime, network, and revoked credentials | Recovery test required before launch |
| Automated check gets 401 | Distinguish the hosting access gate from the app’s sign-in requirement. Test the actual signed-in user flow | Hosting test token did not supply the prototype’s required identity; user’s browser test passed |
| Unsupported or invented answer | Confirm retrieval occurred, inspect evidence, refine the prompt, and record the failed evaluation case | Do not present the workshop as a guarantee against hallucination |

## Retrieval route corrected — September 20

The earlier [engineering finding](DRIVE-MCP-FINDING.md) concerned SearchAF MCP. The workshop now queries the same indexed data through native Antfly MCP, which successfully retrieves Google Docs. The adapter checks approved roots and persisted source/account metadata and excludes non-indexed cloud rows. This is indexed-snapshot access, not a live Google authorization check. Retain the private single-owner workshop scope; do not present this prototype as a team permission system.

## Optional Google Drive lab

Only add after validating a known Drive document end to end. Demonstrate authentication, folder selection, the difference between a local placeholder and indexed content, retrieval scope, and how to recover from expired authorization. Confirm current SearchAF behavior rather than assuming every Google-native format is handled identically.

## Shutdown and revocation

Provide exact tested commands in the released participant guide. The prototype uses the tunnel client’s managed runtime commands; do not substitute an unmanaged background process.

1. Stop the workshop tunnel when no longer needed.
2. Remove the workshop bridge configuration if retiring the integration. Revoking a SearchAF MCP client does **not** revoke this direct Antfly route; stop the tunnel. Preserve unrelated clients.
3. Disable/retire the Sites app and remove its runtime secrets when appropriate.
4. Revoke a dedicated workshop API key if it is no longer needed. If a participant reused an existing key, do not revoke it without checking its other uses.
5. Remove workshop-only temporary artifacts if desired; do not reset the participant’s SearchAF index or delete their source files.

## Support information to collect

Ask for software versions, operating system, the failing step, a redacted error, and whether local search/tunnel/hosted sign-in checks pass. Do not request keys, MCP token values, complete personal configuration files, private transcripts, or full document excerpts in a shared support channel.
