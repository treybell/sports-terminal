# Feature 5: Player & Team Search

**Status:** Not Started
**Depends on:** Feature 1 (shell), Feature 3/4 (backend + data)

## Goal

Make the search/command bar from Feature 1 actually work — real, fast search across players and teams.

## In Scope

- Wire the global search bar to the backend search endpoints
- Results grouped/labeled by type (player vs. team)
- Keyboard-friendly (type to search, arrow keys to navigate results, enter to select) — terminal feel
- Selecting a result navigates to that player/team's profile placeholder (Feature 6 will fill it in)

## Out of Scope

- Game/matchup search (later, once game data exists)
- Fuzzy/typo-tolerant search beyond whatever the DB's basic text search gives us for free

## Acceptance Criteria

- Typing in the search bar returns real matching players/teams within ~1 second
- Keyboard navigation works end-to-end without touching the mouse
- No results state is handled gracefully

## Notes

This is the first feature where the terminal "feel" (fast, keyboard-driven) really has to land — worth spending extra care on responsiveness here.
