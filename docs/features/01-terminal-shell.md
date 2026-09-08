# Feature 1: Terminal Shell

**Status:** Done
**Depends on:** nothing

## Goal

Build the base React app layout with a "professional terminal" look and feel — no real data yet, just structure and static/mock content.

## In Scope

- App shell: header/command bar, main content area, sidebar/panel(s) for navigation
- Dark, dense, monospace-leaning visual style (Bloomberg-terminal aesthetic)
- A global search/command bar (non-functional for now — just UI)
- Placeholder panels/routes for: player search, team search, a profile view, a comparison view
- Basic client-side routing between those placeholder views
- Responsive enough for a laptop screen (desktop-first, not mobile-first)

## Out of Scope

- Real data of any kind (use mock/hardcoded data)
- Backend/API calls
- Charts (placeholder box is fine)

## Acceptance Criteria

- `npm run dev` shows a terminal-styled app with working navigation between placeholder views
- Search bar exists and is visually integrated, even if it doesn't do anything yet
- Layout looks intentional and dense, not like a default Vite template

## Notes

This is the visual foundation everything else gets built into. Keep components generic enough that real data can be swapped in later without restructuring.

## How It Works

**Routing:** `react-router-dom`'s `BrowserRouter` wraps the app in `main.jsx`. `App.jsx` defines the routes as a tree: a parent `Layout` route (the shell) with child routes rendered inside it via `<Outlet />`. This is the standard "layout route" pattern — the shell (command bar + sidebar) never unmounts when you navigate; only the `<Outlet />` content swaps.

**Layout structure** (`components/Layout.jsx`):
- `CommandBar` — top bar, fixed height, contains the brand name, a search `<input>` (not wired to any logic yet — no `onChange`/`onSubmit` handler, so typing does nothing), and a live clock using `useEffect` + `setInterval` to tick every second.
- `Sidebar` — left nav built from a `NAV_ITEMS` array mapped to `NavLink`s. `NavLink` (vs plain `Link`) auto-applies an `active` class when its route matches the current URL, which is how the highlighted/current nav item works without manual state.
- `<main>` — renders whatever child route matched, via `<Outlet />`.

**Pages** (`pages/*.jsx`): each is a simple functional component returning static/placeholder JSX — no state, no data fetching. `Profile.jsx` is the one exception: it reads route params (`useParams()`) for `:type/:id`, so `/players/123` and `/teams/lakers` both hit it and it displays which type/id it received. This proves dynamic routing works before there's real data to plug in.

**Styling:** plain CSS (no framework) using CSS custom properties (`--bg`, `--accent`, etc.) defined once in `index.css` — that's what makes the dark/amber terminal theme easy to tweak globally later. `Layout.css` holds the shell-specific styles; shared "panel" styles live in `index.css` since multiple pages reuse them.

## Interview Prep — Questions to Practice

1. Why use React Router's nested/layout routes instead of conditionally rendering components based on state?
2. What's the difference between `Link` and `NavLink`, and why does the sidebar use `NavLink`?
3. Why does the search input do nothing right now — what would it take to make it functional, and why wasn't that built yet?
4. Why CSS custom properties instead of a UI library like Tailwind or MUI for this project?
5. How does `/players/123` know to render the `Profile` component instead of a 404?
