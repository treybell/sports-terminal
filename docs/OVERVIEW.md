# Sports Terminal — Overview

Sports Terminal is a Bloomberg-Terminal-inspired web application for sports intelligence and analytics. It gives users a single professional-style interface to search for players, teams, and games, and quickly analyze current and historical sports data — focused on exploration and comparison, not just displaying scores like ESPN.

## Core Functionality (long-term)

- Search for players, teams, and games
- Player profiles and statistics
- Team profiles, records, rankings, performance
- Individual game/matchup information
- Player and team comparisons
- Historical performance and trends
- Interactive charts and visualizations
- Watchlists for players/teams
- Betting analytics: odds, implied probability, line movement, model-based probability

## Terminal Experience

Feels like a professional intelligence terminal, not a conventional sports website: information-dense, fast search/navigation/filtering, quick comparisons.

## Analytics (long-term)

Rolling averages, historical trends, efficiency metrics, percentile rankings, strength of schedule, win probability, home/away splits, season-to-season comparisons, performance by opponent.

## Betting Analytics (long-term)

Historical odds, implied probability, model probability, model-vs-market divergence, line movement, ATS performance, strategy backtesting. Research/analysis focus — not automated bet placement.

## Initial Scope

Starting sport: **NBA**. Build incrementally:

1. Terminal-style React interface (shell/layout)
2. Data source selection (NBA stats API)
3. Backend API (Python/FastAPI)
4. Database (PostgreSQL)
5. Search for players and teams
6. Player and team profiles
7. Historical statistics
8. Interactive charts

Advanced analytics and betting features come after the core app works end-to-end.

## Feature Docs

Each feature lives in `docs/features/` as its own markdown file with scope, acceptance criteria, and status. See `docs/ROADMAP.md` for the ordered list and current status.
