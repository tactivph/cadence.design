/**
 * Page contract — Staff · Staff overview analytics dashboard.
 * Single source of truth. The `.stories.ts` renders this on the Docs tab and a
 * build step mirrors it to `contracts/staff/staff-overview.md`.
 * The design system is presentational only — every endpoint/behaviour below is
 * the consuming app's responsibility.
 */
export const CONTRACT = `
# Staff · Staff overview

A people-health dashboard for the staff organisation: how many members exist,
how many log in each day, who recently joined, and which invitations are still
outstanding — with quick paths to invite more staff and manage invitations.

| | |
|---|---|
| **Route** | \`/staff/dashboard/staff-overview-analytics\` |
| **POV / access** | **Staff.** Requires an authenticated staff session; shown only when the user's role grants the staff-overview dashboard resource. Behind the staff shell + auth guard. Super-admins always see it. |
| **Entry points** | Top-nav **Dashboard ▾ → Staff overview**. |

## Purpose
Give staff a single read on membership and daily engagement across the staff
org, surface pending invitations and recent joiners, and let an admin invite new
staff or cancel stale invitations without leaving the page.

## Data
Read-only (apart from the invite/cancel actions below). The page loads analytics
for the selected date range (default \`Last N days: Jan 1 → today\`):

- **Active staff** (percentage of daily logged-in staff, over time) — \`GET /api/staffs/analytics/* (confirm)\`.
- **Counters** — All members, Daily active members, Daily inactive members, Pending invitations — \`GET /api/staffs/analytics/* (confirm)\`.
- **Recently joined** — name + "Invited by …" — \`GET /api/staffs/analytics/* (confirm)\`.
- **Pending invitations** table — Email · Role · Date invited · Action — \`GET /api/staffs/analytics/* (confirm)\` (roster of invited-but-not-accepted staff; see \`/api/users/staffs/*\`).
- **Daily active members** table — Name · Email · Role (+ team) · Last active — \`GET /api/staffs/analytics/* (confirm)\`.

All analytics requests take the active date range as query params and re-fetch
when it changes.

## Layout
Top to bottom, inside the staff shell (\`cds-top-nav\`):
1. **Page header** — title "Staff overview", a date-range filter button, and right-aligned actions **Invite staff** + **Generate report**.
2. **Two-column grid** (left main column + right side rail):
   - **Left:** *Active staff* chart card, then *Pending invitations (n)* table card, then *Daily active members (n)* table card. The two table cards each carry a "Go to staff" link.
   - **Right:** a counters card (All members / Daily active / Daily inactive / Pending invitations) and a *Recently joined* list card.

## Components (from \`@tactivph/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — application shell / primary nav (Dashboard active).
- \`cds-notif-bell\`, \`cds-user-chip\` — shell header actions.
- \`cds-page-header\` — page title.
- \`button[cds-button]\` — date-range trigger (\`variant="secondary"\`, caret), **Invite staff** (\`variant="secondary"\`, \`iconLeft="ph ph-plus"\`), **Generate report** (\`variant="primary"\`), and the per-row **Cancel invitation** (\`variant="secondary"\`, \`size="sm"\`).
- \`cds-card\` — hosts for the chart, counters, tables and recently-joined list.
- \`cds-stat-tile\` (×4) — the counters (\`label\`, \`value\`).
- \`table[cdsTable]\` — Pending invitations and Daily active members tables.
- \`cds-badge\` — role / team chips in the table rows (\`tone="info"\`, \`tone="neutral"\`).
- \`cds-avatar\` — member avatar in Daily active members and Recently joined.
- \`a[cds-nav-item]\` — "Go to staff" links.

**Known gap — charting:** the *Active staff* visual is an area/spline chart
(PDO \`pdo-area-spline-chart\`). Cadence ships **no charting component**, so the
chart body is a layout placeholder box inside \`cds-card\`; only the frame, title,
description and axis labels come from Cadence. Flag for the design-system backlog.

## States
- **Loading** — stat tiles, chart body and table bodies show skeletons (\`cds-skeleton\`); keep the shell + header visible.
- **Empty** (range with no data) — counters render \`0\`; tables show a \`cds-empty-state\`; Recently joined shows an empty message.
- **Error** — replace the affected card body with \`cds-alert variant="danger"\` and a Retry \`button[cds-button]\`; other cards stay independent.
- **Permission denied** — the route guard redirects before render; the nav item is not shown.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Date-range filter** (\`button[cds-button]\`) | Opens the range picker; on apply, re-fetch every analytics call with the new range. Persist the choice for the session. | — (drives the GETs above) | stays on page |
| **Invite staff** | Open the invite-staff flow. | — | \`/staff/admin/user-management/create\` |
| **Generate report** | Export the current dashboard for the active range; show the button's \`loading\` state until the file is ready, then download. | \`GET /api/staffs/analytics/generate-report (confirm)\` | triggers download |
| **Cancel invitation** (per pending row) | Cancel an outstanding staff invitation; confirm via a *Yes, cancel invitation* dialog, then remove the row and refresh counters. | \`PUT /api/users/staffs/:id/change-status/ (confirm)\` | stays on page |
| **Go to staff** (table link) | Deep-link to the full staff list. | — | \`/staff/admin/user-management\` |

## Rules / validation
- Date range: *from* ≤ *to*; default \`Jan 1 → today\`; disable **Generate report** while a fetch is in flight.
- "Cancel invitation" is destructive — require a confirm dialog before firing.
- The analytics panels are read-only; only invite/cancel mutate state.

## Acceptance criteria
- [ ] Reachable via Dashboard ▾ → Staff overview.
- [ ] Shows the four counters (All members, Daily active, Daily inactive, Pending invitations), the Active staff chart region, Pending invitations table, Daily active members table, and Recently joined list.
- [ ] Changing the date range re-fetches and updates the chart, counters and both tables.
- [ ] Invite staff navigates to the invite-staff flow; Generate report shows a loading state and produces a file for the active range.
- [ ] Cancel invitation confirms, cancels the invite and refreshes the pending list + counter.
- [ ] Loading, empty, error and permission-denied states all behave as specified.
- [ ] Built only from Cadence components; no bespoke buttons/cards/badges/tables.

## Notes
- Known gap: the Active staff chart is app-rendered inside \`cds-card\` because Cadence has no charting component yet — Cadence supplies the frame, header, skeleton and empty states only. Flagged for the design-system backlog.
- Shares the date-range filter + Generate report header pattern with the other five staff dashboards — reuse that header composition.
- Endpoints under \`/api/staffs/analytics/*\` are intended from the concept audit (04 §4.1.6); confirm the exact sub-paths and the Cancel-invitation endpoint against the API.
`;
