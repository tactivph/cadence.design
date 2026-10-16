# Staff · Site Map

A read-only "Sites" grid of developments — each card shows the cover image,
name, location and product lines — with search and a path into the public
interactive site map.

| | |
|---|---|
| **Route** | `/staff/site-map` |
| **POV / access** | **Staff.** Behind the staff shell + auth guard; visible per the viewer's resources (confirm). Read-only viewer — authoring is under Admin → Sites (`/staff/admin/sites`). |
| **Entry points** | Top-nav **Site Map**. Cards open the public interactive map in a new tab. |

## Purpose
Give staff a browsable gallery of developments and a quick jump into each site's
interactive map, without inventory-editing powers.

## Data
- **Sites / developments** — `GET /api/developments/` (+ `public-view`, `staff-view`, `filters`). Each card: cover image, **name**, **location**, **product lines** (categories, e.g. Enclave / Townhomes / Residences).
- Search matches development name/location (feeds the list query).

## Layout
Inside the staff shell:
1. **Top nav** — staff nav (Site Map active) + `cds-notif-bell` + `cds-user-chip`.
2. **Page header** — title "Sites" with a **Search** field in the actions slot.
3. **Responsive card grid** — one `cds-card` per development: cover image, title, location (map-pin icon), product lines (folder icon).

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — shell (Site Map active).
- `cds-notif-bell` + `cds-user-chip` — header actions.
- `cds-page-header` (`title`) with `[cds-page-actions]` slot — the "Sites" header.
- `cds-input-group` + `input[cdsInput]` (with `[cds-prefix]` search icon) — the search field.
- `cds-card` (`interactive`) — each development card.

## States
- **Loading** — show skeleton cards while `GET /api/developments/` resolves.
- **Empty (no sites)** — `cds-empty-state` in the grid area ("No sites yet").
- **Empty (no matches)** — "No sites match your search" + clear-search affordance.
- **Error** — `cds-alert variant="danger"` above the grid with Retry (app-wired).
- **Permission denied** — guard redirects; nav item hidden.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Search** | Filter the sites grid by name/location. | re-run `GET /api/developments/` with query | stays |
| **Site card click** / **View site map** | Open the public interactive site map in a new tab. | — | `/site-map/:id` (new tab) |

## Rules / validation
- Read-only: no development is created or edited here (authoring lives under Admin → Sites).
- Search is debounced and re-queries the list; product lines render as plain text from the development's categories.

## Acceptance criteria
- [ ] Reachable from top-nav **Site Map**; behind the staff shell.
- [ ] "Sites" `cds-page-header` with a search `cds-input-group` in the actions slot.
- [ ] Responsive grid of interactive `cds-card`s, each with cover image, name, location and product lines.
- [ ] Card / **View site map** opens `/site-map/:id` in a new tab; no editing affordances present.
- [ ] Loading / empty / no-match / error states behave as specified.
- [ ] Built only from Cadence components (top-nav, nav-item, page-header, input-group, input, card, notif-bell, user-chip).

## Notes
- This is the viewer; the editable inventory hub is Admin → Sites (`/staff/admin/sites`) with Add a Site + full hierarchy CRUD — do not conflate the two.
- Development list endpoints (`/api/developments/` + `public-view` / `staff-view` / `filters`) are from the concept audit; confirm which variant this read-only grid uses.
