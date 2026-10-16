/**
 * Page contract — Staff · Clients pipeline.
 * Single source of truth; mirrored to contracts/staff/clients-pipeline.md.
 * Design system is presentational only — endpoints/behaviour are the app's job.
 */
export const CONTRACT = `
# Staff · Clients pipeline

The staff-wide dual Kanban: every lead and client across all brokers, laid out
across the Leads funnel and the post-reservation Requirements journey. Statuses
are tagged automatically as a lead progresses — the board is read-only, no manual
moving.

| | |
|---|---|
| **Route** | \`/staff/dashboard/clients-pipeline\` |
| **POV / access** | **Staff.** Requires resource \`manage_lead\`. Behind the staff shell + auth guard. Super-admins always see it. |
| **Entry points** | Top-nav **Dashboard ▾ → Clients pipeline**. Cards deep-link to the lead / client record. |

## Purpose
Give staff an at-a-glance, all-brokers view of where every lead sits in the sales
funnel and the requirements journey, and let them drill into any lead or client.

## Data
Read-only. Two pipelines render side by side (the switcher chooses which board is
shown); both are grouped by stage with a per-stage count and a peso total.

- **Leads pipeline** — \`GET /api/dashboard/status/leads\` grouped by lead progress: **New Leads · Engaged and Qualified Prospect · Site Visit Scheduled · Site Visit Completed · Unit & Computation · Reservation**.
- **Requirements pipeline** — \`GET /api/dashboard/status/clients\` grouped **Pre-reservation → … → Turnover**.
- Each **card**: owner name (blank → placeholder "—" avatar), phone, prospect **property** (blank → "No target unit yet"), **unit price** (blank → em-dash), **temperature** (Hot / Warm / Cold / Dormant), **days-in-stage**, and an owner footer (role + name, e.g. "Project Specialist: Aria Ashby").
- Each **column header**: stage title, item **count** badge, and the green **total** bar (sum of unit prices in that stage).
- Filters (broker, project) + search (name / unit) feed query params on both GETs.

## Layout
Top to bottom, inside the staff shell (\`cds-top-nav\`):
1. **Page header** — title "Clients pipeline", subtitle "Every lead and client across all brokers", right-aligned **Generate report** action.
2. **Pipeline + filter bar** (one row): left = \`cds-pipeline-switcher\` (two summary pills joined by an arrow — *Leads pipeline · Lead → Reservation* and *Requirements pipeline · Pre-reservation → Turnover*, each with an icon + count); right = **All brokers** dropdown, **All projects** dropdown, and the **search** input.
3. **Legend row** — the auto-tag note + a red-dot key "7+ days in one stage".
4. **Board** — a horizontal row of \`cds-kanban-column\` for the active pipeline's stages, each holding \`cds-kanban-card\` items; scrolls horizontally.

## Components (from \`@tactivph/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — staff shell / primary nav (Dashboard active, Dashboard & Admin carry a caret).
- \`cds-notif-bell\`, \`cds-user-chip\` — top-nav actions.
- \`cds-page-header\` with the actions slot (\`[cds-page-actions]\`).
- \`button[cds-button]\` (\`variant="primary"\`) — Generate report.
- \`cds-pipeline-switcher\` (\`[items]\`, \`[activeIndex]\`) — the dual Leads / Requirements toggle pills with counts; items are \`{ icon, title, subtitle, count }\` (\`CdsPipelineItem\`).
- \`cds-dropdown\` (×2) — All brokers / All projects filters (each wraps a \`button[cds-button] variant="secondary" iconRight="ph ph-caret-down"\`).
- \`cds-input-group\` + \`input[cdsInput]\` — search by name or unit.
- \`cds-kanban-column\` (\`title\`, \`count\`, \`total\`) — a pipeline stage (green total bar + count badge + title).
- \`cds-kanban-card\` — a lead / client; projects the card body below.
- \`cds-avatar\` — card head avatar (owner/prospect) + footer avatar.
- \`cds-lead-temperature\` (\`[level]="'hot'|'warm'|'cold'"\`, \`[info]="true"\`) — the Cold / Warm / Hot ⓘ pill.

## States
- **Loading** — show \`cds-skeleton\` cards within each column; keep the shell, header and switcher visible.
- **Empty (no leads/clients)** — \`cds-empty-state\` across the active board ("No leads in this pipeline yet").
- **Empty column** — column renders with \`count=0\`, \`total="₱0"\` and no cards.
- **Error** — \`cds-alert variant="danger"\` above the board with a Retry \`button[cds-button]\`.
- **Permission denied** — the route guard redirects before render; the Dashboard ▾ entry is hidden.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Generate report** | Export the current pipeline view; show the button's \`loading\` state until the file is ready, then download. | — *(concept names no report endpoint; confirm)* | triggers download |
| **Pipeline switcher** | Toggle between the **Leads** and **Requirements** boards; the selected board's columns render. | reads the already-loaded \`.../status/leads\` vs \`.../status/clients\` | stays |
| **All brokers** (\`cds-dropdown\`) | Scope both pipelines to one broker / all. | re-run the status GETs with the broker param | stays |
| **All projects** (\`cds-dropdown\`) | Scope both pipelines to one project / all. | re-run the status GETs with the project param | stays |
| **Search** | Debounced name / unit search. | re-run the status GETs with \`search=\` | stays |
| **Card click** | Open the lead workspace (Leads board) or the client record (Requirements board). | — | Lead → \`/staff/customers/leads/:id\`; Client → \`/staff/customers/clients/:clientId\` |

## Rules / validation
- Board is **read-only**: cards are **not draggable**; status changes happen via lead/client actions elsewhere, tagged automatically as a lead progresses.
- A card **7+ days** in one stage shows its days-in-stage in red (the legend's red-dot key).
- Temperature always uses \`cds-lead-temperature\` (Hot / Warm / Cold / Dormant); never hand-roll the pill.
- Filters + search apply to **both** pipelines and reset any board paging.
- Blank name → "—" placeholder avatar; blank property → "No target unit yet"; blank price → em-dash.

## Acceptance criteria
- [ ] Reachable from top-nav **Dashboard ▾ → Clients pipeline**; gated by \`manage_lead\`.
- [ ] The \`cds-pipeline-switcher\` offers both boards (Leads pipeline · Lead → Reservation; Requirements pipeline · Pre-reservation → Turnover) with counts, and switches the visible columns.
- [ ] Leads board shows the six stages: New Leads · Engaged and Qualified Prospect · Site Visit Scheduled · Site Visit Completed · Unit & Computation · Reservation; Requirements board runs Pre-reservation → Turnover.
- [ ] Each column shows title, count badge and the green peso total bar; each card shows name/phone, property-or-"No target unit yet", unit price, temperature and days-in-stage, plus the owner role + name footer.
- [ ] The auto-tag banner + "7+ days in one stage" key are present; cards cannot be dragged and days-in-stage turns red at ≥ 7.
- [ ] All brokers / All projects / search re-query both pipelines across all brokers.
- [ ] Cards open \`/staff/customers/leads/:id\` (Leads) or \`/staff/customers/clients/:clientId\` (Requirements).
- [ ] Loading / empty / empty-column / error / permission-denied states behave as specified.
- [ ] Built only from Cadence components (top-nav, page-header, pipeline-switcher, dropdown, input-group, kanban column/card, avatar, lead-temperature) — no bespoke buttons/cards/badges.

## Notes
- Same dual-Kanban model as the agent **Status board** (\`/agent/dashboard/status-board\`), there scoped to one agent — this page widens the scope to all brokers and adds the broker filter + pipeline switcher.
- Shares the staff-dashboard header pattern (title + **Generate report**) with the other staff dashboards (Sales & Marketing, Roles, Processor, Broker, Staff overview).
- The concept audit (\`04-staff-flows.md §4.1.2\`) names \`/api/dashboard/status/leads*\` and \`/api/dashboard/status/clients*\` but **no report endpoint** — the Generate report route is unconfirmed; do not invent a shape.
`;
