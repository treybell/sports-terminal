# Feature 5: Player & Team Search

**Status:** Done
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

## How It Works

**New/changed files:**
```
backend/app/routers/teams.py  — added ?search= support (previously only /players had it)
src/api.js                     — fetch() wrappers for calling the backend from the browser
src/components/SearchBar.jsx   — all the search UI + logic
src/components/CommandBar.jsx  — swapped the dead <input> for <SearchBar />
src/components/Layout.css      — dropdown/result styling
```

**The flow, end to end:** typing updates React state (`query`) → a `useEffect` watching `query` waits 250ms after you stop typing (the debounce) → fires `fetch` calls to both `/teams?search=` and `/players?search=` in parallel via `Promise.all` → merges both JSON responses into one labeled, capped list → `setResults(...)` re-renders the dropdown.

**Why debounce:** without it, typing "curry" fires 5 separate network requests (one per keystroke) — wasteful, and results can arrive out of order (a slow response to "c" could overwrite a faster response to "curry"). Waiting until you pause typing collapses that into one request.

**Why `Promise.all` instead of two separate `await`s:** `searchTeams` and `searchPlayers` don't depend on each other, so running them sequentially (`await searchTeams(); await searchPlayers()`) would take the sum of both request times. `Promise.all` fires both immediately and waits for whichever finishes last — total time is the *slower* of the two, not the sum.

**Keyboard navigation:** `activeIndex` is just a number in state. Arrow keys increment/decrement it (wrapping around with `% results.length` so pressing ↓ on the last result jumps back to the first). Enter looks up `results[activeIndex]` and navigates there via React Router's `useNavigate()` — no full page reload, it's a client-side route change.

**The `onMouseDown` vs `onClick` detail:** clicking a result needs to fire *before* the input's `onBlur` closes the dropdown. Browsers fire `mousedown` before `blur`, so using `onMouseDown` on results (instead of `onClick`) wins that race; the `onBlur` handler also has a 150ms delay as a safety margin.

## Interview Prep — Questions to Practice

1. Why debounce the search input instead of firing a request on every keystroke?
2. What's the difference between `Promise.all([a, b])` and `await a; await b;` — why does it matter here?
3. Walk through what happens, step by step, from a keypress to a result appearing on screen.
4. Why does clicking a search result use `onMouseDown` instead of the more common `onClick`?
5. What would break if the backend weren't running while you used the search bar, and how does the UI currently handle that?
