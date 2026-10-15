/**
 * Page contract — Staff · Broker overview analytics dashboard.
 * Single source of truth. The `.stories.ts` renders this on the Docs tab and a
 * build step mirrors it to `contracts/staff/broker-overview.md`.
 * The design system is presentational only — every endpoint/behaviour below is
 * the consuming app's responsibility.
 */
export const CONTRACT = `
# Staff · Broker overview

A performance read on the broker/sales network: who's selling the most (by sales
and by volume), all/active/inactive/invited counters, the brokers lagging on
sales, and the brokers most active on site visits — with paths to invite brokers,
manage them, and open the full top-performing-broker report.

| | |
|---|---|
| **Route** | \`/staff/dashboard/broker-overview\` |
| **POV / access** | **Staff.** Requires an authenticated staff session; shown only when the user's role grants the broker-overview dashboard resource (\`manage_agents\`). Behind the staff shell + auth guard. Super-admins always see it. |
| **Entry points** | Top-nav **Dashboard ▾ → Broker overview**. |

## Purpose
Give staff a single view of broker performance and engagement, surface the top
and least performers, and let a manager invite brokers, manage them, or drill
into the full ranked report.

## Data
Read-only (apart from the invite/manage navigations below). The page loads
analytics for the selected date range (default \`Last N days: Jan 1 → today\`):

- **Top performing broker (Sales)** — ranked brokers by sales value — \`GET /api/staffs/analytics/brokers/* (confirm)\`.
- **Top performing broker (Volume)** — ranked brokers by units — \`GET /api/staffs/analytics/brokers/* (confirm)\`.
- **Counters** — All brokers · Daily active brokers · Daily inactive brokers · Pending invitations — \`GET /api/staffs/analytics/brokers/* (confirm)\`.
- **Least performing brokers** table — Broker · Sales · Last sale date — \`GET /api/staffs/analytics/brokers/* (confirm)\`.
- **Top brokers with activities** table — Name · Scheduled visits · Done visits · Pending visits — \`GET /api/staffs/analytics/brokers/* (confirm)\`.

Analytics requests take the active date range as query params and re-fetch when
it changes.

## Layout
Top to bottom, inside the staff shell (\`cds-top-nav\`):
1. **Page header** — title "Broker overview", right-aligned actions **Invite broker** + **Generate report**.
2. **Two-column grid** (left main column + right side rail):
   - **Left:** a row of two chart cards (*Top performing broker (Sales)* with a "Show all" link, *Top performing broker (Volume)*), then a *Least performing brokers* table section (with a "Manage brokers" link), then a *Top brokers with activities* table section.
   - **Right:** a counters card (All / Daily active / Daily inactive brokers / Pending invitations).

## Components (from \`@tactivstudios/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — application shell / primary nav (Dashboard active).
- \`cds-notif-bell\`, \`cds-user-chip\` — shell header actions.
- \`button[cds-button]\` — **Invite broker** (\`variant="secondary-neutral"\`, \`iconLeft="ph ph-plus"\`) and **Generate report** (\`variant="primary"\`). (The "Show all" / "Manage brokers" links are anchors; use \`button[cds-button]\` \`variant="ghost"\` if rendered as buttons.)
- \`cds-card\` — hosts for the two chart panels and the counters.
- \`cds-stat-tile\` (×4) — the counters (\`label\`, \`value\`, \`trend="none"\`).
- \`table[cdsTable]\` + \`cds-table-header\` (\`[columns]\`) — Least performing brokers and Top brokers with activities tables.
- \`cds-avatar\` — broker avatar in both table rows.

**Known gap — charting:** the two *Top performing broker* panels are horizontal
bar charts. Cadence ships **no charting component**, so each chart body is a
layout placeholder (labelled bar + axis) inside \`cds-card\`; only the frame,
titles, axis ticks, series labels and values come from Cadence. Flag for the
design-system backlog.

## States
- **Loading** — stat tiles, chart bodies and table bodies show skeletons (\`cds-skeleton\`); keep the shell + header visible.
- **Empty** (range with no data) — counters render \`0\`; charts show a \`cds-empty-state\`; tables render an empty body.
- **Error** — replace the affected card/section body with \`cds-alert variant="danger"\` and a Retry \`button[cds-button]\`; other regions stay independent.
- **Permission denied** — the route guard redirects before render; the nav item is not shown.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Date-range filter** | Opens the range picker; on apply, re-fetch every analytics call. Persist for the session. | — (drives the GETs above) | stays on page |
| **Invite broker** | Open the invite-broker flow. | \`POST /api/agents/invite/ (confirm)\` | invite flow / \`/staff/brokers\` |
| **Generate report** | Export / open the full ranked broker report for the active range. | \`GET /api/staffs/analytics/brokers/generate-report (confirm)\` | \`/staff/dashboard/broker-overview/top-performing-broker\` |
| **Show all** (Sales panel link) | Open the full top-performing-broker report. | — | \`/staff/dashboard/broker-overview/top-performing-broker\` |
| **Manage brokers** (table link) | Jump to the sales-network list. | — | \`/staff/brokers\` |
| **Broker row** (either table) | Open that broker's detail. | — | \`/staff/brokers/:id (confirm)\` |

## Rules / validation
- Date range: *from* ≤ *to*; default \`Jan 1 → today\`; disable **Generate report** while a fetch is in flight.
- Counters are consistent: Daily active + Daily inactive relate to All brokers; Pending invitations counts invited-but-not-accepted.
- The analytics panels are read-only; only invite mutates state.

## Acceptance criteria
- [ ] Reachable via Dashboard ▾ → Broker overview.
- [ ] Shows both Top performing broker chart regions (Sales + Volume), the four counters (All/Daily active/Daily inactive brokers/Pending invitations), the Least performing brokers table, and the Top brokers with activities table.
- [ ] Changing the date range re-fetches and updates both charts, counters and both tables.
- [ ] Generate report / Show all navigate to the top-performing-broker report; Manage brokers navigates to the sales network.
- [ ] Invite broker opens the invite flow.
- [ ] Loading, empty, error and permission-denied states all behave as specified.
- [ ] Built only from Cadence components; no bespoke buttons/cards/tables.

## Notes
- Known gap: the two Top performing broker bar charts are app-rendered inside \`cds-card\` because Cadence has no charting component yet — Cadence supplies the frame, header, skeleton and empty states only. Flagged for the design-system backlog.
- Shares the date-range filter + Generate report header pattern with the other five staff dashboards.
- Endpoints under \`/api/staffs/analytics/brokers/*\` (and \`/api/agents/*\` for invite) are intended from the concept audit (04 §4.1.5); confirm exact sub-paths and the broker-detail route against the API.
`;
