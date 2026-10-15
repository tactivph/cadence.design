/**
 * Page contract — Agent · Clients list.
 * Single source of truth; mirrored to contracts/agent/clients-list.md.
 * Design system is presentational only — endpoints/behaviour are the app's job.
 */
export const CONTRACT = `
# Agent · Clients list

The agent's converted buyers in one table: everyone who crossed from lead to client,
with category, contact and last activity at a glance — scoped to this agent.

| | |
|---|---|
| **Route** | \`/agent/clients\` |
| **POV / access** | **Agent (broker/seller).** Authenticated agent session; scoped to the agent's own clients (a broker also sees their team's). Behind the agent shell + auth guard. |
| **Entry points** | Top-nav **Clients** · a lead that converts (reservation confirmed) surfaces here · status-board Requirements pipeline. |

## Purpose
Give the agent a scannable list of their converted clients — who they are, what
category each sits in, how to reach them, and when they were last touched — plus the
path into each client's detail to keep scheduling and tracking requirements.

## Data
- **Clients** — \`GET /api/clients/\` (paginated; query params for filter + search), scoped to the agent.
- **Client detail** (per row) — \`GET /api/clients/:clientId\` with \`/api/clients/:user_id/contracts/\` and \`/api/clients/:user_id/contract-requirements/\`.
- Row shape (\`Row\`): \`id\` · \`name\` · \`category\` (client-category code) · \`mobile\` · \`email\` · \`enrolledBy\` · \`updated\` (last-updated date string).
- **Category** codes (client-category preset): \`available\` (Available) · \`signed_cas\` (Signed CAS) · \`unavailable\` (Unavailable) · \`expired\` (Expired) — the live row renders \`expired\`.

## Layout
Inside the agent shell:
1. **Top nav** — brand + \`a[cds-nav-item]\` (Clients active) + help button, notification bell, user chip.
2. **Title row** — \`h1\` "Clients" + tools: **Filters** icon button + **Search** input.
3. **Table** — \`cdsTable\` with \`cds-table-header\`; one row per client with a favorite star, ID, avatar+name, category badge, and the typed cells below.
4. **Pagination** — \`cds-table-pagination\` (\`itemName="client"\`).

### Columns
(favorite) · **ID** · **Name** · **Category** · **Mobile Number** · **Email** · **Enrolled by** · **Last Updated**

## Components (from \`@tactivstudios/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — agent shell (Clients active).
- \`cds-notif-bell\` (\`count\`) + \`cds-user-chip\` (\`name\`, \`role\`, \`src\`) — shell header actions.
- \`table[cdsTable]\` + \`cds-table-header\` (\`columns\`) — the clients table.
- \`cds-status-badge kind="client-category"\` (\`code\`, \`size\`) — the Category cell.
- \`cds-table-pagination\` (\`itemName\`, \`page\`, \`pageSize\`, \`collectionSize\`) — pager.
- Favorite star, the avatar+name / avatar+enrolledBy cells, the Filters icon button and the Search input are plain cells/controls today (no dedicated \`cds-*\`); if promoted to the design system, flag it.

## States
- **Loading** — table shows skeleton rows (header/pager fixed).
- **Empty (no clients)** — \`cds-empty-state\` in the table body: "No clients yet" + a path back to Leads (clients arrive by conversion, not direct creation).
- **Empty (filtered)** — "No clients match your filters" with a clear-filters affordance.
- **Error** — \`cds-alert variant="danger"\` with Retry (app-wired).
- **Category variants** — \`available\`, \`signed_cas\`, \`unavailable\`, \`expired\` each get their client-category badge styling.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Row click** | Open the client workspace. | \`GET /api/clients/:clientId\` | \`/agent/clients/:clientId\` |
| **Favorite star** | Toggle favorite on the client. | \`POST /api/users/lead/favorite/\` (confirm) | stays |
| **Filters** | Filter the list (category/project). | re-run \`GET /api/clients/\` with params | stays |
| **Search** | Search by name/contact. | re-run \`GET /api/clients/\` with query | stays |
| **Pagination** | Page through clients. | re-run \`GET /api/clients/\` with page params | stays |

## Rules / validation
- Clients are **not created here** — a client appears only when a lead converts (reservation confirmed); no "add client" action on this page.
- Category reflects the client-category preset; the live screen shows \`Expired\` when a lock lapsed.
- Favorite is a per-client toggle; the star reflects current favorite state.

## Acceptance criteria
- [ ] Table renders all columns: ID · Name · Category · Mobile · Email · Enrolled by · Last Updated, plus the favorite cell.
- [ ] Category uses \`cds-status-badge kind="client-category"\` (\`size="md"\`).
- [ ] Name and Enrolled-by cells show an avatar alongside the text.
- [ ] A row opens \`/agent/clients/:clientId\`; pagination uses \`itemName="client"\` and re-queries \`GET /api/clients/\`.
- [ ] Filters/search re-query \`GET /api/clients/\`.
- [ ] Loading / empty / error states behave as specified.
- [ ] Built only from Cadence components (top-nav, nav-item, status-badge, table + header + pagination, notif-bell, user-chip).

## Notes
- Same table shape as the staff Clients list, narrowed to the agent's own clients — reuse that composition, narrow the data scope.
- Client detail (\`/agent/clients/:clientId\`) and its children (set-schedule, requirements, information-sheet / preliminary-loan summaries) are pages of their own.
- Favorite star / avatar cells / Filters icon button / Search input are currently plain; promote to \`cds-*\` only if reused elsewhere.
`;
