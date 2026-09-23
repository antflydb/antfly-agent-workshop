# Meeting-prep agent — September 20, 2026

Published privately: (owner-private prototype; request its URL from the facilitator)

- Separate navy/ivory briefing layout with meeting topic, participants, goal and duration.
- Uses the existing OpenAI key and Antfly MCP tunnel/index; no additional ingestion.
- Live local authenticated app request passed: 19 excerpts from local files and Google Drive; four agenda items totaling 30 minutes; facts carry source IDs and proposals are labeled.
- Five unit tests, TypeScript and production build passed.
- Deployment succeeded; access verified owner-only, one allowed user, no external visitors or groups. Unauthenticated hosted API request returned 401.
- Published URL opened for user review. Signed-in hosted generation has not yet been confirmed by the user; browser automation service was unavailable.
- Experimental WebMCP action is implemented but could not be tested in a supported browser context.

The Mac, SearchAF and existing tunnel must remain running. Evidence is an indexed snapshot; excerpts are sent to OpenAI. The app does not save briefs, create calendar events or send messages. Copy/print lets the user deliberately export a brief.

Workshop now offers Knowledge or Meeting-prep with the same shared ingestion/MCP setup. Both portable variants are included in the version 0.2.0 agent handoff bundle.
