# Feature 4: Database Setup

**Status:** Done
**Depends on:** Feature 3 (backend API setup)

## Goal

Add PostgreSQL to persist and cache data instead of hitting the external NBA data source on every request, and to store data the upstream API doesn't provide directly (e.g. watchlists, later: our own computed analytics).

## In Scope

- Local PostgreSQL setup (e.g. via Docker Compose for easy local dev)
- Schema for core entities: teams, players, games/season stats (shape driven by what Feature 3's endpoints need)
- ORM/migrations setup (e.g. SQLAlchemy + Alembic)
- A basic sync/cache strategy: fetch from external API, store/update in DB, serve from DB when fresh

## Out of Scope

- Complex analytics tables (rolling averages, efficiency metrics, etc.) — added when those features are built
- Betting data tables

## Acceptance Criteria

- `docker compose up` (or equivalent) brings up Postgres locally
- Migrations create the schema cleanly from scratch
- Backend endpoints from Feature 3 read from the DB (with a working refresh/sync path) instead of calling the external API on every request

## Notes

Don't over-design the schema up front — start with what Features 5-7 actually need and extend it as we go.

## How to Run Locally

```
# 1. Start Postgres (from project root)
docker compose up -d

# 2. Apply schema migrations (from backend/, with venv active)
cd backend
source venv/bin/activate
alembic upgrade head

# 3. Populate tables from nba_api (one-time, or re-run to refresh)
python -m app.sync

# 4. Start the API as before
uvicorn app.main:app --port 8000 --reload
```

`docker compose up -d` only needs to be re-run after a reboot or if the container was stopped — the data persists in a Docker volume between runs. Migrations and sync only need to be re-run when the schema or data actually changes.

## How It Works

**New pieces:**
```
docker-compose.yml       — defines the Postgres container (image, credentials, port, persistent volume)
backend/.env             — DATABASE_URL, gitignored (contains a local dev password)
backend/.env.example     — same file, committed, so anyone cloning the repo knows what env vars to set
backend/app/database.py  — creates the SQLAlchemy engine/session, reads DATABASE_URL from .env
backend/app/models.py    — ORM models: Team, Player (Python classes that map to SQL tables)
backend/app/schemas.py   — Pydantic models that define the JSON shape FastAPI returns
backend/app/sync.py      — pulls data from nba_api's static lists, upserts into Postgres
backend/migrations/      — Alembic's version-controlled schema history
```

**The chain from container to API response:**
1. `docker compose up -d` starts a Postgres *process* in a container, with a named volume (`pgdata`) so data survives container restarts.
2. `alembic upgrade head` connects to that Postgres instance and creates the `teams`/`players` tables, based on the Python classes in `models.py`. Alembic tracks *which* migrations have run in its own `alembic_version` table, so it never re-applies the same change twice — this is what "migrations" means: a versioned, ordered history of schema changes, like git commits but for your database structure.
3. `python -m app.sync` is a one-time (or re-runnable) script — it calls the exact same `nba_api` static functions the backend used to call directly, but instead of returning them straight to the browser, it writes them into Postgres using an "upsert" (insert new rows, update existing ones by `id` if they already exist — so re-running the sync doesn't create duplicates or error out).
4. The `/teams` and `/players` routes changed from calling `nba_api` directly to querying Postgres via SQLAlchemy (`select(Team)...`, `select(Player).where(Player.full_name.ilike(...))`). The external API is now only touched by the sync script, not by every incoming HTTP request.
5. **Why the `schemas.py` layer exists:** FastAPI can only auto-convert a return value to JSON if it knows the shape. SQLAlchemy model instances carry internal bookkeeping (`_sa_instance_state`) that isn't JSON-serializable, so we can't return them directly. `TeamOut`/`PlayerOut` (Pydantic models with `from_attributes=True`) act as a translation layer: "take this ORM object, and return only these specific fields as JSON." Declaring `response_model=list[TeamOut]` on the route also means FastAPI validates the output shape and auto-documents it in `/docs`.

**Search changed from Python to SQL:** Feature 3's search filtered a big in-memory Python list (`if query in p["full_name"].lower()`). Now it's `Player.full_name.ilike(f"%{search}%")` — a SQL `LIKE` (case-insensitive) query executed by Postgres itself. Same end result, but now the database engine does the filtering instead of Python holding the entire player list in memory on every request.

## Interview Prep — Questions to Practice

1. What's a migration, and why version-control schema changes instead of just running `CREATE TABLE` manually once?
2. What does "upsert" mean and why does the sync script need it instead of a plain `INSERT`?
3. Why can't FastAPI return a SQLAlchemy model instance directly as JSON — what's the `schemas.py` layer actually solving?
4. Where does `docker-compose.yml`'s `pgdata` volume actually live, and what happens to your data if you run `docker compose down` vs. `docker compose down -v`?
5. The search endpoint moved from filtering in Python to filtering in SQL (`ilike`). What's the practical difference in how much data has to move around to answer the same question?
