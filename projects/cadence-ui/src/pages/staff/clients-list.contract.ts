/**
 * Page contract — Staff · Clients list.
 * Single source of truth; mirrored to contracts/staff/clients-list.md.
 * Design system is presentational only — endpoints/behaviour are the app's job.
 */
export const CONTRACT = `
# Staff · Clients list

The staff-wide register of converted buyers (clients) across all agents, with
search, filter and drill-in to each client's detail + requirement verification.

| | |
|---|---|
| **Route** | \`/staff/customers/clients\` |
| **POV / access** | **Staff.** Requires resource \`manage_client\`. Behind the staff shell + auth guard. |
| **Entry points** | Top-nav **Clients**. Rows deep-link to client detail. |

## Purpose
Let staff find any client and open their record to verify requirements and track
contract progress.

## Data
- **Clients** — \`GET /api/clients/\` (paged, filterable, searchable). Columns: Client ID, Name, **Category** (contract status), Mobile, Email, **Enrolled by** (agent), Last Updated, favourite flag.
- Filters feed query params (agent, project, category); search matches name/email/mobile.

## Layout
Inside the staff shell:
1. **Page header** — title "Clients", subtitle, (optional) count.
2. **Data table** with a toolbar (\`cds-filter-bar\`): filter dropdowns on the left, search on the right.
3. Table rows with a favourite star, the category status pill and the enrolling agent (avatar + name).
4. Footer pagination.

## Components (from \`@tactivph/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — shell (Clients active).
- \`cds-page-header\`.
- \`cds-data-table\` — table chrome + loading/empty states + toolbar/footer slots.
- \`cds-filter-bar\` with \`cds-dropdown\` (filters) and \`cds-input-group\` (search).
- \`table[cdsTable]\` — the rows.
- \`cds-status-badge kind="contract"\` — the Category pill.
- \`cds-avatar\` — enrolled-by agent.
- \`button[cds-button]\` — favourite (icon-only), row actions.
- \`cds-pagination\` — footer.

## States
- **Loading** — \`cds-data-table [loading]="true"\` shows the spinner; keep the toolbar visible.
- **Empty (no clients)** — \`[empty]="true"\` with \`emptyTitle="No clients yet"\`, \`emptyIcon="ph ph-users"\`.
- **Empty (no matches)** — same slot, "No clients match your filters" + a Clear-filters action.
- **Error** — \`cds-alert variant="danger"\` above the table with Retry.
- **Permission denied** — guard redirects; nav item hidden.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Row click** | Open the client record. | — | \`/staff/customers/clients/:clientId\` |
| **Filters** (\`cds-dropdown\`) | Filter the list (agent / project / category). | re-run \`GET /api/clients/\` | stays |
| **Search** | Debounced name/email/mobile search. | \`GET /api/clients/?search=\` | stays |
| **Favourite** (star) | Toggle the client as a favourite for the current user. | \`PUT /api/users/client/favorite/\` | stays |
| **Pagination** | Change page / size. | \`GET /api/clients/?page=\` | stays |

## Rules / validation
- Search is debounced (~300ms) and resets paging to page 1.
- Category pill maps the contract status via the \`contract\` preset; never hand-roll colours.
- Read-only list; no client is mutated here beyond the favourite flag.

## Acceptance criteria
- [ ] Reachable from top-nav **Clients**; gated by \`manage_client\`.
- [ ] Columns: ID, Name, Category, Mobile, Email, Enrolled by, Last Updated, favourite.
- [ ] Filter + search re-query and reset paging; pagination works.
- [ ] Row opens \`/staff/customers/clients/:clientId\`.
- [ ] Loading / empty / no-match / error states behave as specified.
- [ ] Category rendered with \`cds-status-badge kind="contract"\`; built only from Cadence components.

## Notes
- The agent Clients list (\`/agent/clients\`) is the same table scoped to one agent — reuse this composition.
`;
