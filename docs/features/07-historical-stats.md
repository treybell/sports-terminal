# Feature 7: Historical Statistics

**Status:** Not Started
**Depends on:** Feature 6 (profiles)

## Goal

Extend player and team profiles with historical (multi-season / game-by-game) data, not just current-season snapshot.

## In Scope

- Player: season-by-season stat history, recent game log
- Team: season-by-season record history
- Basic filtering (e.g. by season, by date range)

## Out of Scope

- Derived/advanced analytics (rolling averages, efficiency, percentiles — later, post-initial-scope)
- Charting the history visually (Feature 8)

## Acceptance Criteria

- A player profile can show stats from multiple past seasons, not just the current one
- Data is pulled from the DB (Feature 4), not live-fetched on every view

## Notes

This is largely a data-plumbing feature — the DB schema and sync logic from Feature 4 need to actually capture historical data, not just current snapshots.
