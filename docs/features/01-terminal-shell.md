# Feature 1: Terminal Shell

**Status:** Not Started
**Depends on:** nothing

## Goal

Build the base React app layout with a "professional terminal" look and feel — no real data yet, just structure and static/mock content.

## In Scope

- App shell: header/command bar, main content area, sidebar/panel(s) for navigation
- Dark, dense, monospace-leaning visual style (Bloomberg-terminal aesthetic)
- A global search/command bar (non-functional for now — just UI)
- Placeholder panels/routes for: player search, team search, a profile view, a comparison view
- Basic client-side routing between those placeholder views
- Responsive enough for a laptop screen (desktop-first, not mobile-first)

## Out of Scope

- Real data of any kind (use mock/hardcoded data)
- Backend/API calls
- Charts (placeholder box is fine)

## Acceptance Criteria

- `npm run dev` shows a terminal-styled app with working navigation between placeholder views
- Search bar exists and is visually integrated, even if it doesn't do anything yet
- Layout looks intentional and dense, not like a default Vite template

## Notes

This is the visual foundation everything else gets built into. Keep components generic enough that real data can be swapped in later without restructuring.
