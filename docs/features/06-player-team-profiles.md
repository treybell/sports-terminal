# Feature 6: Player & Team Profiles

**Status:** Done
**Depends on:** Feature 5 (search)

## Goal

Real profile pages for players and teams, replacing the Feature 1 placeholders.

## In Scope

- Player profile: bio info, current team, current-season stat line
- Team profile: roster, record, basic standings info
- Navigation between related entities (team profile → player profiles on roster, and back)

## Out of Scope

- Historical/multi-season stats (Feature 7)
- Charts/visualizations (Feature 8)
- Comparisons (later)

## Acceptance Criteria

- Navigating to a player or team from search shows real data, not placeholders
- Team profile links to its players; player profile links back to their team

## Notes

Keep the layout dense/scannable — this is the core "look something up" experience of the app.

## How It Works

**Schema changes:** `Player` gained `team_id` (a foreign key to `teams.id`), `position`, and three stat fields (`points_per_game`, `rebounds_per_game`, `assists_per_game`) plus `stats_synced_at`. `Team` gained `wins`/`losses`. A SQLAlchemy `relationship()` was added on both models (not just the raw `team_id` column) so `player.team` and `team.players` work as real Python attributes — SQLAlchemy fetches the related row automatically instead of us writing a manual join every time.

**Two different sync strategies, deliberately:**
- **Rosters + standings sync upfront** (`sync_rosters`, `sync_standings` in `sync.py`, run via `python -m app.sync`): only 31 live calls total (30 rosters + 1 standings call), so it's cheap enough to do eagerly, like teams/players already were.
- **Player season stats fetch lazily, on first profile view** (`_fetch_and_cache_stats` in `routers/players.py`): with 5,135 players, calling `nba_api` for every single one upfront would be slow and hammer an unofficial, rate-limited endpoint for stats nobody may ever look at. Instead, `GET /players/{id}` checks `stats_synced_at` — `None` means "never fetched" — makes the live call only then, caches the result, and every subsequent request for that player is a pure DB read (confirmed: ~12ms cached vs. 300ms+ live).
- **Graceful degradation:** the live stats call is wrapped in `try/except` — if `nba_api` fails or times out, the profile still renders (just without a stat line) instead of the whole request failing. This is the direct payoff of the Feature 2 decision to treat `nba_api`'s unreliability as a real design constraint.

**The `TeamDetailOut` construction trick:** `TeamDetailOut(**TeamOut.model_validate(team).model_dump(), roster=roster)` — builds the base team fields from the ORM object via the existing `TeamOut` schema, unpacks them as keyword arguments, and adds `roster` on top. Avoids duplicating every team field in a second schema class.

**Frontend structure:** `Profile.jsx` is now a two-line router — it reads the `:type` URL param and renders either `PlayerProfile` or `TeamProfile`. Both fetch their own data in a `useEffect` keyed on `id`, with three render states (`loading` / `error` / real data) — the same defensive pattern as the search bar's `status` state, just applied to a full-page fetch instead of a dropdown.

## Interview Prep — Questions to Practice

1. Why sync rosters/standings eagerly but fetch player stats lazily instead of treating all the data the same way?
2. What does `stats_synced_at` actually gate, and what would happen if it were removed?
3. What's a SQLAlchemy `relationship()` doing that the raw `team_id` foreign key column alone doesn't give you?
4. Walk through what happens if `nba_api`'s live stats endpoint times out while a user is viewing a player profile — does the page break?
5. Why does `TeamDetailOut` reuse `TeamOut` instead of just being its own standalone schema with all the fields repeated?
