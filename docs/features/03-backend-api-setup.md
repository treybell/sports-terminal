# Feature 3: Backend API Setup

**Status:** Not Started
**Depends on:** Feature 2 (data source selection)

## Goal

Stand up a Python/FastAPI backend that the frontend can talk to, with initial endpoints that proxy/fetch data from the chosen NBA data source.

## In Scope

- FastAPI project scaffold (separate from the frontend, e.g. `backend/`)
- Basic project structure: routers, config, environment variable handling for API keys
- Endpoints: list/search teams, list/search players (backed by the chosen data source)
- CORS configured so the Vite frontend can call it locally
- Local dev instructions (how to run the backend alongside `npm run dev`)

## Out of Scope

- Database persistence (Feature 4) — this can hit the external API directly for now, or lightly cache in memory
- Auth/user accounts
- Betting data endpoints

## Acceptance Criteria

- Backend runs locally (e.g. `uvicorn main:app --reload`) on its own port
- `GET /teams` and `GET /players?search=...` (or similar) return real data from the chosen source
- Frontend can successfully call these endpoints from the browser (CORS working)

## Notes

Keep endpoint shapes simple and frontend-driven — design them around what the UI needs (Features 5/6), not around whatever the upstream API happens to return.
