# Feature 3: Backend API Setup

**Status:** Done
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

## How to Run Locally

```
cd backend
source venv/bin/activate
uvicorn app.main:app --port 8000 --reload
```

Runs alongside the frontend (`npm run dev` in the project root, port 5173). The two are separate processes you run in separate terminal tabs.

## How It Works

**Structure:**
```
backend/
  venv/              — Python virtual environment (gitignored, not portable — each dev creates their own)
  requirements.txt   — exact installed package versions (pip freeze output)
  app/
    main.py          — FastAPI app instance, CORS config, wires routers together
    routers/
      teams.py        — GET /teams
      players.py       — GET /players?search=...
```

**Why a virtual environment:** it isolates this project's Python packages from your system Python and from other projects. Without it, installing `fastapi` here could conflict with a different version some other project needs. `venv/` is gitignored — anyone cloning the repo runs `python3 -m venv venv && pip install -r requirements.txt` to recreate it locally rather than the folder itself being shared.

**Why the static `nba_api` lists specifically:** `nba_api.stats.static.teams` / `.players` are lists bundled inside the installed package itself — no network call happens when you hit `/teams` or `/players`. That's why this feature could be built and tested without worrying about rate limits yet. Later features (box scores, season stats) will call `nba_api`'s *live* endpoints, which do hit stats.nba.com over the network and are the unreliable, rate-limited part flagged in Feature 2's decision doc — that's exactly what Feature 4's caching layer exists to protect against.

**Search implementation:** `/players?search=curry` loads the full static player list (thousands of entries, including retired players) and filters in Python with a case-insensitive substring match on `full_name`, capped at 50 results. This is fine at this scale (in-memory list, sub-millisecond filter) — it would not scale to a live SQL `LIKE` query pattern if the dataset were huge, but for a bundled static list it's simpler than standing up a search index for no benefit.

**CORS:** `CORSMiddleware` explicitly allow-lists `http://localhost:5173` (the Vite dev server's origin). Without this, the browser's same-origin policy blocks the frontend's JS from reading responses from a different port, even though both are running on `localhost`.

## Interview Prep — Questions to Practice

1. Why does the backend need a virtual environment, and what would go wrong without one?
2. Why don't the `/teams` and `/players` endpoints make any network requests right now — where does the data come from?
3. What is CORS, and what would break if the middleware weren't configured?
4. How would you change the player search if the player list were too large to filter in memory?
5. This backend currently talks straight to `nba_api`'s static data with no database. What's the plan for when live/historical data is needed, and why not build that from day one?
