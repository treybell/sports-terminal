# Feature 2: Data Source Selection

**Status:** Done
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

**Chosen: `nba_api`** (Python package wrapping stats.nba.com), 2026-09-08.

### Candidates considered

| Source | Cost | Depth | Reliability |
|---|---|---|---|
| **nba_api** | Free, no key | Deep — career stats, box scores, play-by-play, live scores, decades of history | Unofficial/undocumented NBA.com endpoints; can change or rate-limit without notice |
| **balldontlie** | Free tier: teams/players/games only (5 req/min). Game stats: $9.99/mo. Box scores/standings/history: $39.99/mo | Good, but real depth is paywalled | Official, documented, actively maintained REST API |
| **SportsData.io** | Free trial = fake/scrambled test data only; real access is enterprise/sales-priced | High (in production tiers) | High, but not accessible at this project's budget |

### Reasoning

- This is a resume project with no budget — anything requiring a paid tier to reach the historical-stats depth we actually want (Features 7-8) is a non-starter.
- `nba_api` is free and has the depth needed for the full initial roadmap (search, profiles, historical stats, charts) without hitting a paywall.
- The reliability tradeoff (unofficial API, can break/rate-limit) is treated as a design constraint, not ignored: it's the reason Feature 4 (database + caching layer) exists in the roadmap. The backend fetches from `nba_api`, stores results in Postgres, and serves from the DB — so the app doesn't depend on an undocumented endpoint staying up on every page load, and stays functional even if `nba_api` temporarily breaks.
- If `nba_api` becomes unworkable later (e.g. NBA.com blocks it more aggressively), balldontlie's free tier is a viable fallback for search-only functionality, with paid tiers as a stretch option if the project ever needs "real" reliability.

## Interview Prep — Questions to Practice

1. Why pick an unofficial, undocumented API instead of a paid official one?
2. How does your architecture protect the app from that API's unreliability?
3. What would you do if `nba_api` broke in production tomorrow?
4. What's the tradeoff between build cost (free + fragile) and reliability (paid + stable) in API selection generally?
