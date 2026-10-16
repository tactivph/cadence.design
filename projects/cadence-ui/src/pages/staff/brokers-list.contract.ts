/**
 * Page contract — Staff · Sales network (brokers) list.
 * Single source of truth; mirrored to contracts/staff/brokers-list.md.
 * The design system is presentational only — every endpoint/behaviour below is
 * the consuming app's responsibility.
 */
export const CONTRACT = `
# Staff · Sales network (brokers) list

The staff register of the broker/seller organisation — every member with their
type, reporting line, client count, activity and invite status — with search,
filter, invite and drill-in to each member's detail.

| | |
|---|---|
| **Route** | \`/staff/brokers\` |
| **POV / access** | **Staff.** Requires resource \`manage_agents\`. Behind the staff shell + auth guard. |
| **Entry points** | Top-nav **Sales Network**. Rows deep-link to the member detail. |

## Purpose
Let staff browse the sales network, invite new members, and open any member to
view their profile, leads/clients and status history.

## Data
- **Members** — \`GET /api/agents/\` (paged, filterable, searchable). Columns: Name (avatar + name), **Type** (Project Specialist · Sales Manager · Sales Director · Seller), **Reports To** (hierarchy), Email, **Clients** (count), Last Active, **Status** (Active / Invited), Actions.
- Supporting: \`/api/agents/parent-options/\` (reports-to), \`/api/agents/validate-tin/\`, \`/api/sellers/*\`.
- Filters + search feed query params (type, project, name/unit).

## Layout
Inside the staff shell (\`cds-top-nav\`, Sales Network active):
1. **Header** — title "Sales network profiles" with a right-aligned toolbar: Filters icon-button, Search box, **Invite member** button.
2. **Data table** (\`table[cdsTable]\` + \`cds-table-header\`) — one row per member; Type and Status render as badges; the Actions cell shows **Resend invite** only for Invited members.
3. **Footer** — \`cds-table-pagination\` (itemName "member").

## Components (from \`@tactivph/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\`, \`cds-notif-bell\`, \`cds-user-chip\` — shell.
- \`table[cdsTable]\` + \`cds-table-header\` (\`[columns]\`) — the table.
- \`cds-status-badge\` — the **Type** pill (\`tone\` primary / info / seasoning, \`[dot]="true"\`) and the **Status** pill (\`success\` for Active, \`neutral\` for Invited).
- \`button[cds-button]\` — **Invite member** (\`variant="primary"\`, \`iconLeft="ph-bold ph-plus"\`) and per-row **Resend invite** (\`variant="secondary-neutral" size="sm"\`).
- \`cds-table-pagination\` — footer.
- Note: the Filters icon-button and the Search box are rendered as plain \`.cds-icon-btn\` / native \`input[type=search]\`, not dedicated cds-* controls — see Notes.

## States
- **Loading** — table shows its loading state; keep the header/toolbar visible.
- **Empty (no members)** — empty state ("No members yet") with an **Invite member** action.
- **Empty (no matches)** — "No members match your filters" + Clear-filters action.
- **Error** — \`cds-alert variant="danger"\` above the table with Retry.
- **Permission denied** — guard redirects; nav item hidden.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Row click** | Open the member record. | — | \`/staff/brokers/:id\` |
| **Invite member** | Open the invite flow for a new network member. | \`POST /api/agents/\` (invite) (confirm) | opens invite form/modal |
| **Resend invite** (Invited rows) | Re-send the invitation email. | \`POST /api/agents/:id/resend-invitation/\` (confirm) | stays |
| **Search** | Debounced name/unit search. | \`GET /api/agents/?search=\` | stays |
| **Filters** | Filter by type / project. | re-run \`GET /api/agents/\` | stays |
| **Pagination** | Change page / size. | \`GET /api/agents/?page=\` | stays |

## Rules / validation
- Search is debounced (~300ms) and resets paging to page 1.
- **Resend invite** appears only when Status is Invited; Active rows have no row action.
- Type and Status pills map via \`cds-status-badge\` presets — never hand-roll colours.
- Read-only list beyond the invite/resend lifecycle actions.

## Acceptance criteria
- [ ] Reachable from top-nav **Sales Network**; gated by \`manage_agents\`.
- [ ] Columns: Name, Type, Reports To, Email, Clients, Last Active, Status, Actions.
- [ ] Type and Status render with \`cds-status-badge\`; Resend invite shows only for Invited members.
- [ ] Invite member, search, filter and pagination work; row opens \`/staff/brokers/:id\`.
- [ ] Loading / empty / no-match / error / permission-denied states behave as specified.
- [ ] Built only from Cadence components (table, badge, button, pagination).

## Notes
- The built mock uses a plain Filters icon-button and a native search input in the header toolbar rather than \`cds-filter-bar\`/\`cds-input-group\`; the real page should prefer \`cds-filter-bar\` + \`cds-input-group\` to match the Clients list composition. **FLAG: toolbar controls not yet on cds-* primitives.**
- Member detail (\`/staff/brokers/:id\`) covers profile, their leads/clients, status history and change-status.
`;
