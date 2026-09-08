# Feature 2: Data Source Selection

**Status:** Not Started
**Depends on:** nothing (can happen in parallel with Feature 1)

## Goal

Decide where NBA data (players, teams, stats, historical game data) comes from. This is a research/decision task, not a build task.

## In Scope

- Research free and paid NBA data APIs (e.g. balldontlie, official stats.nba.com endpoints, SportsData.io, API-SPORTS, etc.)
- Compare on: cost, rate limits, historical data depth, data freshness/live updates, legal/ToS considerations
- Pick a primary source (and possibly a fallback)
- Document the decision and reasoning in this file

## Out of Scope

- Betting odds data sources (revisit when betting analytics feature comes up)
- Building the integration itself (that's Feature 3)

## Acceptance Criteria

- This doc lists 2-3 candidate sources with tradeoffs
- A source is chosen and justified
- Any API keys/signup needed are noted (not committed to git)

## Notes

This choice affects the backend design (Feature 3) and database schema (Feature 4), so it should be settled before those start.

## Decision Log

_(fill in once decided)_
