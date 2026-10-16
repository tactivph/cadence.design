# Staff · Sales & Marketing Dashboard

The staff landing page: a period-over-period read on visits, reservations, leads,
clients and homeowners, plus sales-breakdown and property-performance visuals.

| | |
|---|---|
| **Route** | `/staff/dashboard/sales-marketing-analytics` |
| **POV / access** | **Staff.** Requires an authenticated staff session; shown only when the user's role grants the dashboard resource. Behind the staff shell + auth guard. Super-admins always see it. |
| **Entry points** | Staff home (default landing after login) · top-nav **Dashboard ▾ → Sales and marketing**. |

## Purpose
Give staff a single period-over-period view of commercial health and let them
drill into the underlying leads, clients and projects.

## Data
Read-only. The page loads analytics for the selected date range (default
`Last N days: Jan 1 → today`):

- **KPI stats** — `GET /api/staffs/analytics/sales/stats` → Property Visits, Reserved Properties, New Leads, New Clients, Homeowners, each with current value + delta vs. the prior period.
- **Sold by unit price** (treemap by price band) — `GET /api/staffs/analytics/sales/top-unit-price`.
- **Sold by project** (treemap) — `GET /api/staffs/analytics/sales/top-project`.
- **Property performance** (scheduled-for-visit / reserved / sold) — `GET /api/staffs/analytics/sales/property-performance`.
- Supporting: `.../sales-performance`, `.../top-performance`, `.../least-performance`, `.../peak-visit-times`.

All requests take the active date range as query params and re-fetch when it changes.

## Layout
Top to bottom, inside the staff shell (`cds-top-nav`):
1. **Page header** — title "Sales & Marketing", breadcrumb (Dashboard › Sales and marketing), right-aligned **date-range filter** + **Generate report**.
2. **KPI row** — 5 `cds-stat-tile` across (wraps on narrow widths).
3. **Property sales breakdown** — two equal cards side by side: *Sold by unit price* and *Sold by project* (each hosts a treemap the app renders).
4. **Property performance** — one card with the scheduled-for-visit / reserved / sold figures.

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — application shell / primary nav (Dashboard active).
- `cds-page-header` with `cds-breadcrumb` (`[cds-page-breadcrumb]`) and actions (`[cds-page-actions]`).
- `cds-dropdown` — the date-range picker trigger.
- `button[cds-button]` (`variant="primary"`, `iconLeft="ph ph-file-arrow-down"`) — Generate report.
- `cds-stat-tile` (×5) — `label`, `value`, `delta`, `trend="up|down|none"`.
- `cds-card` — hosts for the treemaps and the performance figures (charts are app-owned).

## States
- **Loading** — stat tiles and card bodies show skeletons (`cds-skeleton`); keep the shell + header visible.
- **Empty** (range with no data) — tiles render `0` with `trend="none"`; breakdown cards show an `cds-empty-state` ("No sales in this range").
- **Error** — replace the affected card body with `cds-alert variant="danger"` and a Retry `button[cds-button]`; other cards stay independent.
- **Permission denied** — the route guard redirects before render; the nav item is not shown. The page itself renders nothing special.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Date-range filter** (`cds-dropdown`) | Opens the range picker; on apply, re-fetch every analytics call with the new range. Persist the choice for the session. | — (drives the GETs above) | stays on page |
| **Apply filter** / **Clear all** | Apply or reset the range selection. | re-run GETs | stays |
| **Generate report** | Export the current dashboard for the active range; show the button's `loading` state ("Generating…") until the file is ready, then download. | `GET /api/staffs/analytics/sales/generate-report` | triggers download |
| **KPI tile drill-in** (optional) | If enabled, clicking a tile deep-links to the matching list filtered to the range. | — | e.g. New Leads → `/staff/customers/leads` |

## Rules / validation
- Date range: *from* ≤ *to*; default `Jan 1 → today`; disable **Generate report** while a fetch is in flight.
- Deltas are computed against the immediately-prior equal-length period; show `trend="up"` for favourable movement, `down` for unfavourable, `none` when the prior period is empty.
- The page is read-only — no entity is mutated here.

## Acceptance criteria
- [ ] Lands here by default after staff login and is reachable via Dashboard ▾ → Sales and marketing.
- [ ] Shows exactly five KPI tiles: Property Visits, Reserved Properties, New Leads, New Clients, Homeowners — each with a value and a period-over-period delta.
- [ ] Changing the date range re-fetches and updates every tile, both breakdown treemaps and the performance card.
- [ ] Generate report shows a loading state and produces a file for the active range.
- [ ] Loading, empty, error and permission-denied states all behave as specified.
- [ ] Composed only from Cadence components; no bespoke buttons/cards/badges.

## Notes
- Treemaps are app-rendered (e.g. the app's charting lib) inside `cds-card`; Cadence supplies the frame, header and empty/skeleton states, not the chart.
- All six staff dashboards (Sales & Marketing, Clients pipeline, Roles, Processor, Broker, Staff overview) share the date-range filter + Generate report pattern — reuse this header composition across them.
