# Staff · Admin · Sites

The inventory hub: a grid of development ("site") cards, the top of the
Development → Project → House type → Product offering → Unit hierarchy that staff
author under Admin.

| | |
|---|---|
| **Route** | `/staff/admin/sites` |
| **POV / access** | **Staff.** Admin-gated (inventory management resource) `(confirm)`. Behind the staff shell + auth guard. |
| **Entry points** | Top-nav **Admin ▾ → Sites**. Cards deep-link to the site's inventory. |

## Purpose
Let admin staff browse every development and open one to manage its projects,
house types, product offerings and units — or create a new site.

## Data
- **Sites (developments)** — `GET /api/developments/staff-view/` (searchable; supports
  `/api/developments/staff-view/filters`). Each card: cover image, **title**, **location**,
  and a **products** list (the development's project/product categories).

## Layout
Inside the staff shell:
1. **Page header** — title "Sites"; actions on the right = a **search** field and an
   **Add a Site** button.
2. **Responsive card grid** — one interactive card per development (cover, title,
   location with pin icon, product list with folder icon).

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — shell (Admin active); `cds-notif-bell`, `cds-user-chip`.
- `cds-page-header` with `[cds-page-actions]`.
- `cds-input-group` + `input[cdsInput]` — search.
- `button[cds-button]` — **Add a Site** (primary).
- `cds-card [interactive] [flush]` — the site tile.

## States
- **Loading** — card grid shows skeleton tiles.
- **Empty (no sites)** — `cds-empty-state` "No sites yet" + an Add-a-Site action.
- **Empty (no matches)** — "No sites match your search" + Clear search.
- **Error** — `cds-alert variant="danger"` with Retry.
- **Permission denied** — guard redirects; Admin nav item hidden.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Card click** | Open the site's inventory (projects). | — | `/staff/admin/sites/:id` |
| **Add a Site** | Start a new development. | `POST /api/developments/staff-view/` (confirm) | `/staff/admin/sites/create` |
| **Search** | Debounced name/location search. | `GET /api/developments/staff-view/?search=` | stays |

## Rules / validation
- Search is debounced (~300ms); the product list on each card truncates to one line.
- Legacy `/developments/*` paths redirect to `/sites/*`.
- The cover image comes from the development's uploaded images; show a placeholder when absent.

## Acceptance criteria
- [ ] Reachable from top-nav **Admin ▾ → Sites**; admin-gated.
- [ ] Grid renders one card per development with cover, title, location, products.
- [ ] Search filters the grid; **Add a Site** routes to `/staff/admin/sites/create`.
- [ ] Card opens `/staff/admin/sites/:id`.
- [ ] Loading / empty / no-match / error states behave as specified.
- [ ] Built only from Cadence components.

## Notes
- Cover image is a CSS gradient placeholder in the mock; the real card binds the
  development image.
- This is the authoring entry point; the read-only **Site Map** viewer
  (`/staff/site-map`) is a separate page over the same `/api/developments/` data.
