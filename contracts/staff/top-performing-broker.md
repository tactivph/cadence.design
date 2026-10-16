# Staff · Top performing broker

The full, ranked report behind the Broker overview dashboard: a searchable,
paginated table of brokers ordered by performance (position, clients, total
sales, last sale date).

| | |
|---|---|
| **Route** | `/staff/dashboard/broker-overview/top-performing-broker` |
| **POV / access** | **Staff.** Requires an authenticated staff session; shown only when the user's role grants the broker-overview dashboard resource (`manage_agents`). Behind the staff shell + auth guard. Super-admins always see it. |
| **Entry points** | Broker overview → **Generate report** / **Show all** (on the Top performing broker (Sales) panel). |

## Purpose
Give staff the complete ranked broker list that the dashboard's summary panels
only preview — searchable and paginated — for review and export.

## Data
Read-only. The page loads the ranked broker report:

- **Top performing brokers** table — Position · Broker · No. of clients · Total sales · Last sale date — `GET /api/staffs/analytics/brokers/top-performing-broker (confirm)`, paginated and sortable, honouring the active search term.

The dashboard's date range carries through to this report where applicable (confirm).

## Layout
Top to bottom, inside the staff shell (`cds-top-nav`):
1. **Breadcrumb** — Dashboard › Top performing broker.
2. **Section header** — title "Top performing broker" and a right-aligned search input.
3. **Table** — the ranked broker table (Position · Broker · No. of clients · Total sales · Last sale date).
4. **Pagination** — below the table.
5. **Loading state** — shown while the report is fetching.

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — application shell / primary nav (Dashboard active).
- `cds-notif-bell`, `cds-user-chip` — shell header actions.
- `cds-breadcrumb` (`[items]`) — Dashboard › Top performing broker.
- `table[cdsTable]` + `cds-table-header` (`[columns]`, `[sort]`) — the ranked broker table.
- `cds-table-pagination` (`itemName`, `[page]`, `[pageSize]`, `[collectionSize]`) — pagination.
- `cds-loading-state` — the fetching state shown below the table.
- Search is a native `input[type="search"]` with a Phosphor icon (no dedicated `cds-search` component exists — note for the design-system backlog).

## States
- **Loading** — `cds-loading-state` below an empty table body (the capture reproduced in the story shows exactly this: header + empty table + loading state while the report fetches).
- **Empty** (no brokers / no search match) — `cds-table-pagination` shows `collectionSize=0`; render a `cds-empty-state` in/under the table body.
- **Error** — replace the table body with `cds-alert variant="danger"` and a Retry `button[cds-button]`.
- **Permission denied** — the route guard redirects before render; the page is not reachable from the dashboard link.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Search** (`input[type="search"]`) | Debounced filter of the broker report by name; re-fetch/refilter and reset to page 1. | re-runs the GET with a query param | stays on page |
| **Column sort** (`cds-table-header`) | Sort the report by the chosen column; re-fetch/re-order. | re-runs the GET with sort params | stays on page |
| **Pagination** (`cds-table-pagination`) | Change page / page size; re-fetch the corresponding slice. | re-runs the GET with page params | stays on page |
| **Breadcrumb → Dashboard** | Return to the broker overview dashboard. | — | `/staff/dashboard/broker-overview` |
| **Broker row** | Open that broker's detail. | — | `/staff/brokers/:id (confirm)` |

## Rules / validation
- Search is debounced and resets pagination to page 1.
- The report is read-only — no entity is mutated here.
- Ranking (Position) is server-assigned and reflects the active sort/range.

## Acceptance criteria
- [ ] Reachable from Broker overview via Generate report / Show all, with a working breadcrumb back to the dashboard.
- [ ] Shows the ranked table with columns Position, Broker, No. of clients, Total sales, Last sale date.
- [ ] Search filters the report and resets to page 1; sorting and pagination re-fetch the matching slice.
- [ ] While fetching, the loading state is shown below the (empty) table; empty and error states behave as specified.
- [ ] Permission-denied is handled by the route guard.
- [ ] Built only from Cadence components; no bespoke table, pagination or loading indicator.

## Notes
- No charting on this page — it is a pure table report (unlike the Broker overview dashboard it drills in from).
- No dedicated `cds-search` / `cds-input` search component is used; the search box is a native input with a Phosphor icon — flagged for the design-system backlog.
- Endpoint `/api/staffs/analytics/brokers/top-performing-broker` is intended from the concept audit (04 §4.1.5); confirm the exact path, sort/search params and the broker-detail route against the API.
