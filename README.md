# Sports Terminal

A Bloomberg-Terminal-inspired web app for NBA stats and analytics — search players and teams, view profiles, rosters, and current-season stats, in a dense, keyboard-driven interface. Built as an active learning/portfolio project; see [`docs/OVERVIEW.md`](docs/OVERVIEW.md) for the full vision and [`docs/ROADMAP.md`](docs/ROADMAP.md) for what's built vs. in progress.

## Status

In active development. Currently working: terminal UI shell, keyboard-driven search across 5,000+ players and 30 teams, and real player/team profile pages with rosters and current-season stats. See [`docs/ROADMAP.md`](docs/ROADMAP.md) for the full feature list and what's next.

## Tech Stack

- **Frontend:** React, Vite, React Router
- **Backend:** FastAPI (Python), SQLAlchemy, Alembic
- **Database:** PostgreSQL (via Docker Compose)
- **Data source:** [`nba_api`](https://github.com/swar/nba_api) (unofficial NBA.com stats client) — see [`docs/features/02-data-source-selection.md`](docs/features/02-data-source-selection.md) for why

## Getting Started

Prerequisites: Node.js, Python 3.9+, [Docker Desktop](https://www.docker.com/products/docker-desktop/).

**1. Start the database**
```
docker compose up -d
```

**2. Set up and run the backend**
```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

alembic upgrade head       # create tables
python -m app.sync         # populate teams/players/rosters/standings from nba_api

uvicorn app.main:app --port 8000 --reload
```
Backend runs at `http://localhost:8000` — visit `/docs` for an interactive API explorer.

**3. Set up and run the frontend**

In a separate terminal, from the project root:
```
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

## Project Structure

```
src/                  React frontend
backend/app/          FastAPI backend (routers, models, sync script)
backend/migrations/   Alembic schema migrations
docker-compose.yml    Local PostgreSQL container
docs/                 Feature roadmap, decision log, per-feature specs
```

## Documentation

Each feature was planned and built individually — see [`docs/features/`](docs/features) for the goal, scope, and technical write-up behind each one.
