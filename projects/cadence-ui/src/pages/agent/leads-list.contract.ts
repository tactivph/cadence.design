/**
 * Page contract — Agent · Leads list.
 * Single source of truth; mirrored to contracts/agent/leads-list.md.
 * Design system is presentational only — endpoints/behaviour are the app's job.
 */
export const CONTRACT = `
# Agent · Leads list

The agent's book of business: every lead they own in one table, with progress,
status, expiry and temperature at a glance, plus the three ways to bring a lead in.

| | |
|---|---|
| **Route** | \`/agent/leads\` |
| **POV / access** | **Agent (broker/seller).** Authenticated agent session; scoped to the agent's own leads (a broker also sees their team's). Behind the agent shell + auth guard. |
| **Entry points** | Top-nav **Leads** · status-board "Enroll a lead" · shared enrollment form submissions land here. |

## Purpose
Give the agent a scannable list of all their leads — who they are, where each one
sits, whether a CAS/reservation lock is live, and how warm they are — and the
entry points to enroll more.

## Data
- **Leads** — \`GET /api/leads/\` (paginated; query params for filter + search).
- **Export** — \`GET /api/leads/export/\` (download, see Export action).
- Row shape (\`Row\`): \`id\` · \`name\` · \`progress\` (lead-progress code) · \`status\` (client-category code) · \`mobile\` · \`email\` · \`enrolledBy\` · \`expiry\` (date string or \`null\`; literal \`"Expired"\` when the lock has lapsed) · \`temp\` (\`hot\` | \`warm\` | \`cold\` | \`dormant\`).
- **Lead progress** codes: \`new_lead\` (New Lead) · \`site_visit_scheduled\` (Site Visit Scheduled) · \`site_visit_completed\` (Site Visit Completed) · (later funnel stages as they arrive).
- **Status** codes: \`available\` (Available) · \`signed_cas\` (Signed CAS) · \`unavailable\` (Unavailable).

## Layout
Inside the agent shell:
1. **Top nav** — brand + \`a[cds-nav-item]\` (Leads active) + help button, notification bell, user chip.
2. **Title row** — \`h1\` "Leads" + three actions: **Export**, **Share enrollment form**, **Manual enrollment**.
3. **Note + tools row** — inline info note "Once status is 'Signed CAS', open the lead to continue." + **Filters** button + **Search** input.
4. **Table** — \`cdsTable\` with \`cds-table-header\`; one row per lead with favorite star, chevron, and the typed cells below.
5. **Pagination** — \`cds-table-pagination\` (\`itemName="lead"\`).

### Columns
(favorite) · **ID** · **Name** · **Lead Progress** · **Status** · **Mobile Number** · **Email** · **Enrolled by** · **Expiry Date** · **Lead Temperature** · (chevron)

## Components (from \`@tactivstudios/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — agent shell (Leads active).
- \`cds-notif-bell\` (\`count\`) + \`cds-user-chip\` (\`name\`, \`role\`, \`src\`) — shell header actions.
- \`button[cds-button]\` — the three page actions (ghost-neutral Export, secondary-neutral Share, primary Manual enrollment).
- \`table[cdsTable]\` + \`cds-table-header\` (\`columns\`) — the leads table.
- \`cds-lead-progress-tag\` (\`code\`) — the Lead Progress cell.
- \`cds-status-badge kind="client-category"\` (\`code\`, \`size\`, \`info\`) — the Status cell (Available / Signed CAS / Unavailable).
- \`cds-lead-temperature\` (\`level\`, \`info\`) — the Lead Temperature cell.
- \`cds-table-pagination\` (\`itemName\`, \`page\`, \`pageSize\`, \`collectionSize\`) — pager.
- Favorite star + expand chevron are plain cells in the table today (no dedicated \`cds-*\`); if promoted to the design system, flag it.

## States
- **Loading** — table shows skeleton rows (header/pager fixed).
- **Empty (no leads)** — \`cds-empty-state\` in the table body: "No leads yet" + a path to Manual enrollment / Share enrollment form.
- **Empty (filtered)** — "No leads match your filters" with a clear-filters affordance.
- **Error** — \`cds-alert variant="danger"\` with Retry (app-wired).
- **Expiry "Expired"** — expiry cell renders the literal \`Expired\` in danger styling (\`--cds-danger-700\`); a null expiry renders \`-\`.
- **Status variants** — \`available\`, \`signed_cas\`, \`unavailable\` each get their client-category badge styling.
- **Temperature levels** — \`hot\` / \`warm\` / \`cold\` / \`dormant\` each get their temperature styling.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Export** | Download the leads list (current filter) as a file. | \`GET /api/leads/export/\` | stays (download) |
| **Share enrollment form** | Surface the public enrollment link to share with prospects. | — (public enrollment form, concept 03 §3.1) | stays (reveals/copies link) |
| **Manual enrollment** | Agent creates a lead directly. | \`POST /api/leads/\` (+ \`/api/leads/registration/\`) | \`/agent/leads/add\` |
| **Row click** | Open the lead workspace. | — | \`/agent/leads/:id\` |
| **Expand chevron** | Expand the row for inline detail (no navigation). | — | stays |
| **Favorite star** | Toggle favorite on the lead. | \`POST /api/users/lead/favorite/\` (confirm) | stays |
| **Filters** | Filter the list (project/status/temperature). | re-run \`GET /api/leads/\` with params | stays |
| **Search** | Search by name/contact. | re-run \`GET /api/leads/\` with query | stays |
| **Pagination** | Page through leads. | re-run \`GET /api/leads/\` with page params | stays |

## Rules / validation
- When a lead's **Status** is **Signed CAS**, the inline note directs the agent to open the lead to continue (progress happens in lead detail, not the list).
- **Expiry Date** reflects the CAS / reservation lock; once lapsed it shows **Expired** in danger styling.
- Favorite is a per-lead toggle; the star reflects current favorite state.
- Row navigation and chevron expand are distinct — the chevron must not navigate.

## Acceptance criteria
- [ ] Table renders all columns: ID · Name · Lead Progress · Status · Mobile · Email · Enrolled by · Expiry Date · Lead Temperature, plus favorite + chevron cells.
- [ ] Lead Progress uses \`cds-lead-progress-tag\`; Status uses \`cds-status-badge kind="client-category"\`; Temperature uses \`cds-lead-temperature\`.
- [ ] Expired lock shows literal "Expired" in danger styling; null expiry shows "-".
- [ ] Title row shows Export, Share enrollment form, Manual enrollment; the "Signed CAS" note is present.
- [ ] Export calls \`GET /api/leads/export/\`; Manual enrollment routes to \`/agent/leads/add\`; a row opens \`/agent/leads/:id\`.
- [ ] Filters/search/pagination re-query \`GET /api/leads/\`; pagination uses \`itemName="lead"\`.
- [ ] Loading / empty / error states behave as specified.
- [ ] Built only from Cadence components (top-nav, nav-item, button, table + header + pagination, status-badge, lead-progress-tag, lead-temperature, notif-bell, user-chip).

## Notes
- The staff Leads list is the same table, staff-scoped across all brokers — reuse this composition, narrow the data scope to the agent.
- Manual enrollment (\`/agent/leads/add\`) and the lead workspace (\`/agent/leads/:id\`) are pages of their own.
- Favorite + expand-chevron are currently plain table cells; promote to \`cds-*\` only if reused elsewhere.
`;
