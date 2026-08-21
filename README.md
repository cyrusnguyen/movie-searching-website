# Reel — Movie Search

React client for the [Movie API](https://github.com/cyrusnguyen/movie-api). Search
a film catalogue, compare ratings from three sources, and follow cast and crew
between titles.

Originally built as a QUT coursework project; rebuilt and hardened since.

---

## Quick start

You need the API running first:

```bash
git clone https://github.com/cyrusnguyen/movie-api
cd movie-api && npm install && cp .env.example .env
# add a JWT_SECRET to .env, then:
npm start                      # http://localhost:3000
```

Then this app:

```bash
git clone https://github.com/cyrusnguyen/movie-searching-website
cd movie-searching-website
npm install
cp .env.example .env           # VITE_API_URL defaults to http://localhost:3000
npm run dev                    # http://localhost:5173
```

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the dev server. |
| `npm run build` | Production build into `build/`. |
| `npm run preview` | Serve the production build locally. |
| `npm test` | Run the unit tests. |
| `npm run lint` | Lint the project. |

## Configuration

| Variable | Default | Notes |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | Base URL of the Movie API. |

The API only accepts browser requests from origins in its `CORS_ORIGIN`
allowlist, which defaults to `http://localhost:5173` — this app's dev port.

## Features

- Search by title, with filters for year, genre and minimum rating, plus sorting.
- Poster-card results grid with loading skeletons and real empty and error states.
- Film pages with a rating breakdown, genres, runtime, box office and full credits.
- Person pages with a sortable filmography and a rating distribution chart.
- JWT authentication with automatic, deduplicated token refresh.
- A profile page for the account fields the API has always exposed.
- Keyboard navigable, screen-reader labelled, and responsive from 320px up.

## What changed in the rebuild

### Build

Create React App was deprecated in February 2025 and was the source of
**74 npm advisories (4 critical, 35 high)** that `npm audit fix` could not
resolve. Replaced with Vite 7 and Vitest.

| | Before | After |
|---|---|---|
| npm advisories | 74 | **0** |
| Packages installed | 1518 | 322 |
| Initial JS + CSS (gzip) | ~519 kB | **~29 kB** |
| Production build | ~45 s | ~4 s |

The largest dependencies (ag-grid, chart.js) now load only on the pages that use
them. The bundled logo was a 2861×3045 PNG rendered at 32px — 410 kB for an
icon; it is 8 kB now.

`boostrap@2.0.0` was also removed. That is a typosquat of `bootstrap` (which was
installed alongside it), and npm flags it with a security hold.

### Bugs fixed

- **Registration never worked.** It posted to `${API}/register`, but the API
  mounts that router at `/user`.
- **Token refresh always threw.** `AuthContextProvider` called a hook that read
  `AuthContext` before the provider was mounted, so it received the default
  context value and `setAuthState` was `undefined`.
- **`console("You are not logged in…")`** — `console` is not callable. This threw
  and unmounted the whole app.
- **Sorting and resizing were dead in every table.** `defaultColDef` was an array;
  ag-grid expects an object.
- **The results page could crash** reading `pagination.lastPage` while pagination
  was still `null` — it arrived from a second, separate request.
- **Every search cost two identical network round-trips**, one for rows and one
  for the pagination block.
- **Navigating between two films showed stale data** — the detail effect read
  `id` but declared no dependencies.
- **Film pages crashed on sparse records**, calling `.toLocaleString()` on a null
  box office and `.join()` on absent genres.
- **The registration inputs were uncontrolled** — bound to `state.email.value`
  where `state.email` was a string.
- **The logo linked nowhere** (`as` instead of `tag` on reactstrap's
  `NavbarBrand`) and sign-out was a `Link` with no `to`.
- **A 10.0 rating fell out of the ratings chart**, which indexed a ten-element
  array with `Math.floor(10)`; unrated credits landed in the 0–1 bucket because
  `Number(null)` is `0`.
- **Search broke on `&` or `#`** in a title — the term was interpolated straight
  into the URL.
- The chart re-randomised its colours on every render, so it flickered.
- ~60 lint warnings, including a duplicate object key and an import of
  `IconName` from `react-icons/bi`, which does not exist.

### Security

- **Auth state is derived from the token**, not from an `isAuthenticated` flag in
  `localStorage` that the UI trusted — setting it by hand used to be enough to
  make the app believe you were signed in.
- `jwtDecode` is guarded, so a malformed stored token no longer crashes startup.
- Token refresh is deduplicated, so a burst of requests fires one refresh.
- Route guarding is a real route wrapper rather than an `alert()` and a redirect
  fired as a side effect of a data-fetching effect.

Tokens still live in `localStorage`, so they remain readable by any successful
XSS. The API side of this was hardened instead — short-lived bearer tokens,
rotating refresh tokens with reuse detection, and a strict CSP. Moving to an
httpOnly cookie would close it properly and is the natural next step.

### Design

Rebuilt on a token-based design system (`src/styles/tokens.css`) with a poster
grid, skeleton loading, empty and error states, adaptive tables, visible focus
rings, and a real mobile layout. `reactstrap`, `bootstrap` and
`styled-components` are gone; the styling is plain CSS with custom properties.

Verified end to end in Chromium via Playwright across 20 checks — register,
sign in, search, filter, film, person, profile, sign out, 404 — at 1440px and
375px, with no console errors.

## Deployment

Not currently deployed; the previous Vercel deployment is gone. `vercel.json` is
kept current so it can be redeployed. Set `VITE_API_URL` to your API's URL at
build time, and add the site's origin to the API's `CORS_ORIGIN`.

```bash
npm run build      # static output in build/
```
