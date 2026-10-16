# Staff · Roles overview

A read on how staff are distributed across roles: a role-distribution visual,
all/active/inactive/unassigned counters, the roles that have no members, and
cards for each active role (its permission and assigned members) — with paths to
create and manage roles.

| | |
|---|---|
| **Route** | `/staff/dashboard/roles-overview` |
| **POV / access** | **Staff.** Requires an authenticated staff session; shown only when the user's role grants the roles-overview dashboard resource (role/permission management). Behind the staff shell + auth guard. Super-admins always see it. |
| **Entry points** | Top-nav **Dashboard ▾ → Roles overview**. |

## Purpose
Give staff a single view of role coverage — which roles exist, how members are
spread across them, which roles are unassigned — and let an admin jump to create
or manage roles.

## Data
Read-only (apart from the create/manage navigations below). The page loads
analytics for the selected date range (default `Last N days: Jan 1 → today`):

- **Role distribution** (staff members per role) — `GET /api/staffs/analytics/roles/* (confirm)`.
- **Counters** — All roles · Active roles · Inactive roles · Unassigned roles — `GET /api/staffs/analytics/roles/* (confirm)`.
- **Unassigned roles** table — Role · Permission · Created by · Date created · Action — `GET /api/users/roles/* (confirm)` (roles with no assigned members).
- **Active roles** cards — role name, status, description, permission chip, assigned-member avatars — `GET /api/users/roles/* (confirm)`.

Analytics requests take the active date range as query params and re-fetch when
it changes.

## Layout
Top to bottom, inside the staff shell (`cds-top-nav`):
1. **Page header** — title "Roles overview", right-aligned actions **Create role** + **Generate report**.
2. **Two-column grid** (left main column + right side rail):
   - **Left:** *Role distribution* chart card, then an *Unassigned roles (n)* section (section title + "Manage roles" link + table), then an *Active roles (n)* section (section title + "Manage roles" link + a grid of role cards).
   - **Right:** a counters card (All / Active / Inactive / Unassigned roles).

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — application shell / primary nav (Dashboard active).
- `cds-avatar` — shell header avatar + assigned-member avatars on role cards.
- `cds-page-header` with actions (`[cds-page-actions]`).
- `button[cds-button]` — **Create role** (`variant="secondary-neutral"`, `iconLeft="ph ph-plus"`), **Generate report** (`variant="primary"`), and the per-section **Manage roles** links (`variant="ghost"`, `iconRight`).
- `cds-card` — hosts for the chart, counters and the role cards (`[interactive]="true"`).
- `cds-stat-tile` (×4) — the counters (`label`, `value`).
- `table[cdsTable]` — the Unassigned roles table.
- `cds-status-badge` — the "Active" badge on each role card (`tone="success"`, `badgeStyle="soft"`).
- `cds-badge` — the permission chip on each role card (`variant="primary"`, `size="sm"`).

**Known gap — charting:** the *Role distribution* visual is an ApexCharts
treemap. Cadence ships **no charting component**, so the chart body is a layout
placeholder (labelled grid) inside `cds-card`; only the frame, title, subtitle
and cell labels come from Cadence. Flag for the design-system backlog.

## States
- **Loading** — stat tiles, chart body, table and role cards show skeletons (`cds-skeleton`); keep the shell + header visible.
- **Empty** — "Unassigned roles (0)" renders an empty table body; counters render `0`; Active roles shows a `cds-empty-state` when there are none.
- **Error** — replace the affected card/section body with `cds-alert variant="danger"` and a Retry `button[cds-button]`; other regions stay independent.
- **Permission denied** — the route guard redirects before render; the nav item is not shown.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Date-range filter** | Opens the range picker; on apply, re-fetch every analytics call. Persist for the session. | — (drives the GETs above) | stays on page |
| **Create role** | Open the create-role flow. | — | `/staff/admin/user-management/roles/create` |
| **Generate report** | Export the current dashboard for the active range; show the button's `loading` state until the file is ready, then download. | `GET /api/staffs/analytics/roles/generate-report (confirm)` | triggers download |
| **Manage roles** (section links) | Jump to the roles management screen. | — | `/staff/admin/user-management/roles` |
| **Active role card** (`[interactive]`) | Open that role to view/edit its permissions and members. | — | `/staff/admin/user-management/roles/update/:roleId (confirm)` |
| **Unassigned row Action** | Manage/assign that role. | — | `/staff/admin/user-management/roles/update/:roleId (confirm)` |

## Rules / validation
- Date range: *from* ≤ *to*; default `Jan 1 → today`; disable **Generate report** while a fetch is in flight.
- Counters are mutually consistent: Active + Inactive = All; Unassigned is a subset count.
- This page does not mutate roles — create/manage happen on their own screens under Admin.

## Acceptance criteria
- [ ] Reachable via Dashboard ▾ → Roles overview.
- [ ] Shows the Role distribution chart region, the four counters (All/Active/Inactive/Unassigned roles), the Unassigned roles table, and the Active roles cards (each with name, Active badge, description, permission chip, member avatars).
- [ ] Create role navigates to the create-role flow; Manage roles links navigate to roles management.
- [ ] Generate report shows a loading state and produces a file for the active range.
- [ ] Loading, empty, error and permission-denied states all behave as specified.
- [ ] Built only from Cadence components; no bespoke buttons/cards/badges/tables.

## Notes
- Known gap: the Role distribution treemap is app-rendered inside `cds-card` because Cadence has no charting component yet — Cadence supplies the frame, header, skeleton and empty states only. Flagged for the design-system backlog.
- Shares the date-range filter + Generate report header pattern with the other five staff dashboards.
- Endpoints under `/api/staffs/analytics/roles/*` and `/api/users/roles/*` are intended from the concept audit (04 §4.1.3); confirm exact sub-paths and the role-update route against the API.
