# Feature 8: Interactive Charts

**Status:** Not Started
**Depends on:** Feature 7 (historical stats)

## Goal

Add interactive data visualizations to player/team profiles using the historical data from Feature 7.

## In Scope

- Pick a charting library (e.g. Recharts, visx, or D3 directly)
- Player: stat trend over time (e.g. points per game across a season or across seasons)
- Team: record/performance trend over time
- Basic interactivity: hover for exact values, toggle between stats/date ranges

## Out of Scope

- Advanced analytics visualizations (efficiency, percentile rankings, etc. — later)
- Betting-related charts (odds/line movement — later)

## Acceptance Criteria

- At least one interactive chart renders real historical data on both player and team profiles
- Charts are readable/dense in the terminal aesthetic, not default-library-looking

## Notes

This closes out the initial 8-feature scope. After this, revisit `docs/ROADMAP.md` to break down comparisons, watchlists, advanced analytics, and betting analytics as new feature docs.
