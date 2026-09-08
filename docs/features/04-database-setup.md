# Feature 4: Database Setup

**Status:** Not Started
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
