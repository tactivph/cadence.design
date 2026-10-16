# Agent · Site Map

A "Sites" grid of PDO developments — image, name, location, product categories — the agent
browses to show units to prospects. Each card opens the public interactive site map.

| | |
|---|---|
| **Route** | `/agent/site-map` |
| **POV / access** | **Agent (broker/seller).** Authenticated agent session; behind the agent shell + auth guard. Read-only viewer (authoring lives under staff Admin → Sites). |
| **Entry points** | Top-nav **Site Map**. |

## Purpose
Give the agent a scannable catalog of developments and a one-click path into each
development's interactive map, so they can walk a prospect through available units.

## Data
- **Developments** — `GET /api/developments/` (+ `public-view`, `staff-view`, `filters`) — the sites grid.
- Site shape (`Site`): `title` · `location` · `products` (comma-separated product categories) · (image).
- Search filters the grid client/server-side (confirm which).

## Layout
Inside the agent shell:
1. **Top nav** — brand + `a[cds-nav-item]` (Site Map active) + help button, notification bell, user chip.
2. **Header row** — `h1` "Sites" + a **Search** input (native, no `cds-*` input here).
3. **Sites grid** — a 4-column grid of `cds-card` ( `[interactive]`, `[flush]` ): image banner + content (title, location with map-pin icon, product categories with folder icon, truncated).

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — agent shell (Site Map active).
- `cds-notif-bell` (`count`) + `cds-user-chip` (`name`, `role`, `src`) — shell header actions.
- `cds-card` (`[interactive]`, `[flush]`) — the development cards (interactive = whole card is the "View site map" target; flush = image bleeds to card edges).
- Search is a plain native `input[type=search]` today (no dedicated `cds-*` for the inline search box); if promoted to the design system, flag it.

## States
- **Loading** — grid shows skeleton cards.
- **Empty (no developments)** — `cds-empty-state` "No sites yet" (app-wired; not present in the mock).
- **Empty (search)** — "No sites match your search" with a clear affordance (app-wired).
- **Error** — `cds-alert variant="danger"` with Retry (app-wired).

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Card click / View site map** | Open the development's public interactive site map. | — (map data via development; see `/api/developments/:dev/map/`, concept 04) | `/site-map/:id` (public interactive map, new tab) |
| **Search** | Filter the sites grid by name/location. | re-run `GET /api/developments/` with query (confirm) | stays |

## Rules / validation
- Read-only viewer — the agent cannot author or edit a site here (authoring is staff Admin → Sites).
- The interactive map opens the **public** map route (`/site-map/:id`), typically in a new tab.

## Acceptance criteria
- [ ] Header renders "Sites" + a search input.
- [ ] Grid renders development cards (`cds-card [interactive] [flush]`) each with image banner, title, location (map-pin), and product categories (folder, truncated).
- [ ] A card opens `/site-map/:id` (public interactive map).
- [ ] Search re-queries / filters the developments grid.
- [ ] Loading / empty / error states behave as specified.
- [ ] Built only from Cadence components (top-nav, nav-item, card, notif-bell, user-chip) — the inline search input is plain markup and flagged if promoted.

## Notes
- Identical to the staff Site Map (concept 04 §4.9); reuse this composition for `/staff/site-map`.
- Developments API is `/api/developments/` (+ `public-view`, `staff-view`, `filters`); the interactive map itself is a separate public page (`/site-map/:id`) backed by `/api/developments/:dev/map/`.
- Search wiring and empty/error states are not in the presentational mock — they are the app's job.
