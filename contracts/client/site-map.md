# Client · Site map

The buyer's interactive developments/sites viewer — a searchable "Sites" list that lets
the buyer explore available sites and lots, with an empty state when none are available.

| | |
|---|---|
| **Route** | `/client/site-map` |
| **POV / access** | **Client (buyer).** Authenticated client session. Behind the client shell + auth guard. |
| **Entry points** | Client shell top-nav **Site Map**. |

## Purpose
Give the buyer the same interactive developments map/sites viewer (shared component) to
explore sites and lots available to them.

## Data
- **Sites / developments** — the list of sites available to the buyer, backed by the developments endpoints (`/api/developments/public-view/`, options endpoints) `(confirm)`.
- **Search** — client-side or query-param filter over the sites list `(confirm)`.

## Layout
Inside the client shell:
1. **Page head** — title "Sites" with a search `cds-input-group` (magnifying-glass prefix, "Search" placeholder) on the right.
2. **Body** — the sites viewer; `cds-empty-state` (house icon, "No Sites Yet", "No sites are available at this time.") when empty.

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — client shell (Site Map active).
- `cds-avatar` + `cds-badge` — user chip + notification badge in the header.
- `cds-input-group` + `cdsInput` — the search box.
- `cds-empty-state` — the "No Sites Yet" empty state.

## States
- **Loading** — skeleton/spinner while sites load.
- **Empty** — `cds-empty-state` "No Sites Yet" (default captured state).
- **Error** — `cds-alert variant="danger"` with Retry.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Search** | Filter the sites list. | — `(confirm)` | stays |
| **Site / lot** | Open the site/lot detail in the viewer. | — `(confirm)` | site detail `(confirm)` |

## Rules / validation
- Search filters the visible sites; empty result keeps the empty state messaging.

## Acceptance criteria
- [ ] Page head shows "Sites" title and a working search input.
- [ ] Sites render when present; the "No Sites Yet" empty state shows otherwise.
- [ ] Loading / empty / error states behave as specified.
- [ ] Built only from Cadence components.

## Visibility rule (PO decided, pdo parity, 2026-10-17)
Final PO decisions (supersede the earlier "available only" proposal; recorded on CAD-87 / CAD-92 and in `concept/config/DECISIONS.md`). There is **no availability narrowing**.
1. **Units:** a buyer sees **all units with their status** (Available, Sold/Reserved, On-Hold), as pdo does. Sold and on-hold lots are NOT excluded. pdo: all SAP-linked lots returned with no availability filter (`pdo/api/developments/views/development.py:870-887`); viewer shows the status pills and filter (`pdo/web/src/app/pages/agent/site-map/site-map-detail/site-map-detail.component.ts:23-25,76-80,343-344`; enum `pdo/api/developments/models.py:164-167`).
2. **Own unit:** a buyer always sees the unit they hold a contract on, regardless of its status. (The one addition to pdo parity.)
3. **Sites:** only sites with a published map (`has_map`, `pdo/api/developments/managers.py:35-40`), limited to the buyer's active region (`pdo/api/developments/views/development.py:61-75`). Unchanged from pdo; the client page reuses the agent component (`pdo/web/src/app/pages/client/client-routing.module.ts:134-135`, `pdo/web/src/app/pages/agent/site-map/site-map.component.ts:49-55`).
4. **Property feed:** no inventory rule; see `property-feed.md`.

## Notes
- Shares the developments map/sites viewer used across POVs (`06 §6.6`).
- The captured reference shows the empty state only; site-list item shape, search endpoint, and detail route are unconfirmed — marked `(confirm)`.
