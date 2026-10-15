/**
 * Page contract — Agent · Status board.
 * Single source of truth; mirrored to contracts/agent/status-board.md.
 * Design system is presentational only — endpoints/behaviour are the app's job.
 */
export const CONTRACT = `
# Agent · Status board

The agent's home: a dual Kanban of their own leads and requirements. Statuses are
tagged automatically as a lead progresses — the board is read-only, no manual moving.

| | |
|---|---|
| **Route** | \`/agent/dashboard/status-board\` |
| **POV / access** | **Agent (broker/seller).** Authenticated agent session; scoped to the agent's own leads/clients. Behind the agent shell + auth guard. |
| **Entry points** | Agent home (default landing after login) · top-nav **Dashboard**. |

## Purpose
Show the agent where every one of their leads sits in the sales funnel and the
post-reservation requirements journey, at a glance.

## Data
- **Leads pipeline** — \`GET /api/dashboard/status/leads\` grouped by lead progress: New Leads · Engaged & Qualified · Site Visit Scheduled · Site Visit Completed · Unit & Computation.
- **Requirements pipeline** — \`GET /api/dashboard/status/clients\` grouped Pre-reservation → Turnover.
- Each lead card: name, phone, prospect property, unit price, **temperature** (Hot/Warm/Cold/Dormant), days-in-stage.
- Filters (project, temperature) + search feed query params.

## Layout
Inside the agent shell:
1. **Page header** — title "Client Status", subtitle, actions: filters + search.
2. **Info banner** — "Statuses are tagged automatically as a lead progresses. No manual moving."
3. **Leads Pipeline** — a horizontal row of \`cds-kanban-column\`, each with \`cds-kanban-card\` leads.
4. **Requirements Pipeline** — a second row of columns (Pre-reservation → Turnover).

## Components (from \`@tactivstudios/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — agent shell (Dashboard active).
- \`cds-page-header\` with filter \`cds-dropdown\`s + \`cds-input-group\` search.
- \`cds-alert variant="info"\` — the auto-tagging banner.
- \`cds-kanban-column\` (\`title\`, \`count\`) — pipeline stages.
- \`cds-kanban-card\` (\`interactive\`) — a lead; projects name/phone/property/price.
- \`cds-status-badge kind="temperature"\` — the Hot/Warm/Cold/Dormant pill.
- \`cds-badge\` — the "N days in stage" chip (danger when 7+).

## States
- **Loading** — show skeleton cards in each column.
- **Empty (no leads)** — \`cds-empty-state\` across the board: "No leads yet" + an Enroll-a-lead action (the app wires enrolment).
- **Empty column** — column renders with \`count=0\` and a subtle "Nothing here" line.
- **Error** — \`cds-alert variant="danger"\` with Retry.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Lead card click** | Open the lead workspace. | — | \`/agent/leads/:id\` |
| **Filters / search** | Filter the board by project/temperature/name. | re-run the status GETs | stays |
| **Enroll a lead** (empty state) | Start manual enrolment. | — | \`/agent/leads/add\` |

## Rules / validation
- Board is **read-only**: cards are not draggable; status changes happen via lead actions elsewhere.
- A card 7+ days in one stage shows a warning "N days" chip.
- Temperature pill always uses the \`temperature\` preset.

## Acceptance criteria
- [ ] Two pipelines render: Leads (5 stages) and Requirements (Pre-reservation → Turnover).
- [ ] Each lead card shows name, phone, property, price, temperature and days-in-stage.
- [ ] The auto-tagging info banner is present; cards cannot be dragged.
- [ ] Card opens \`/agent/leads/:id\`; filters/search re-query.
- [ ] Loading / empty / error states behave as specified.
- [ ] Built only from Cadence components (kanban column/card, status badge, badge, alert).

## Notes
- Same model as the staff Clients-pipeline dashboard (\`/staff/dashboard/clients-pipeline\`), there across all brokers — reuse this composition, widen the data scope.
`;
