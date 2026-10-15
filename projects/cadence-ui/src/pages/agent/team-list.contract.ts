/**
 * Page contract — Agent · Team (Sellers profile).
 * Single source of truth; mirrored to contracts/agent/team-list.md.
 * Design system is presentational only — endpoints/behaviour are the app's job.
 */
export const CONTRACT = `
# Agent · Team (Sellers profile)

A broker's roster of sub-agents (sellers) who help manage the broker's leads. The
live screen is the empty "No seller yet" state with the one way in: Invite seller.

| | |
|---|---|
| **Route** | \`/agent/team\` |
| **POV / access** | **Agent — broker only.** Authenticated broker session; a broker manages a Team of sellers. Behind the agent shell + auth guard. (A plain seller has no team.) |
| **Entry points** | Top-nav / profile menu **Team** · empty-state **Invite seller**. |

## Purpose
Let a broker see and build their team of sellers — who reports to them, each seller's
status — and invite new sellers. When no sellers exist yet, guide the broker to invite
the first one.

## Data
- **Sellers** — \`GET /api/sellers/\` (list, paginated; scoped to this broker). Empty for a broker with no sellers.
- **Seller detail** (per row, once populated) — \`GET /api/sellers/:sellerId\` → \`/agent/team/:sellerId\`.
- **Invite support** — \`GET /api/agents/parent-options/\` (reports-to options) · \`POST /api/agents/validate-tin/\` (TIN check) · seller status/resend via \`/api/sellers/*\` (change-status, resend-invitation).
- Row shape (once populated, confirm): seller name · role/level · reports-to · status (active / invited / inactive) · contact.

## Layout
Inside the agent shell:
1. **Top nav** — brand + \`a[cds-nav-item]\` + help button, notification bell, user chip.
2. **Heading row** — \`h1\` "Sellers profile" + tools: **Filters** icon button + **Search** input + **Invite seller** (\`button[cds-button]\` primary, \`iconLeft="ph ph-plus"\`).
3. **Roster area** — the sellers table once populated; **empty for this agent**, so it renders the empty state centered.

## Components (from \`@tactivstudios/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — agent shell.
- \`cds-notif-bell\` (\`count\`) + \`cds-user-chip\` (\`name\`, \`role\`, \`src\`) — shell header actions.
- \`button[cds-button]\` (\`variant="primary"\`, \`iconLeft="ph ph-plus"\`) — the two **Invite seller** actions (heading + empty state).
- \`cds-empty-state\` (\`icon="ph ph-users-three"\`, \`title\`, \`message\`) — the "No seller yet" state, projecting the Invite-seller button.
- The Filters icon button and Search input are plain controls today (no dedicated \`cds-*\`); if promoted, flag it.
- **Populated roster:** a \`table[cdsTable]\` + \`cds-table-header\` + \`cds-table-pagination\` + \`cds-status-badge\` for seller status — not rendered in the empty live screen; add when the data arrives.

## States
- **Empty (no sellers)** — **the live default.** \`cds-empty-state\`: title "No seller yet", message "Start building your team and streamline your workflow. Add seller to manage your leads effectively.", with an **Invite seller** button inside.
- **Loading** — skeleton rows (once a table exists) / spinner.
- **Populated** — sellers table with status badges + pagination (composition to be added).
- **Error** — \`cds-alert variant="danger"\` with Retry (app-wired).
- **Denied (plain seller)** — a non-broker has no team; route guard redirects / hides the entry.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Invite seller** (heading) | Open the invite-seller flow (name, contact, TIN, reports-to). | \`POST /api/sellers/\` (confirm) + \`/api/agents/validate-tin/\`, \`/api/agents/parent-options/\` | opens invite (modal/route) |
| **Invite seller** (empty state) | Same as above — primary path when roster is empty. | as above | opens invite (modal/route) |
| **Row click** (populated) | Open the seller detail. | \`GET /api/sellers/:sellerId\` | \`/agent/team/:sellerId\` |
| **Filters** | Filter the roster (status/level). | re-run \`GET /api/sellers/\` with params | stays |
| **Search** | Search sellers by name/contact. | re-run \`GET /api/sellers/\` with query | stays |

## Rules / validation
- Team is **broker-only**; a plain seller does not see this page.
- Invite requires a valid TIN (\`/api/agents/validate-tin/\`) and a reports-to selection (\`/api/agents/parent-options/\`).
- Both **Invite seller** buttons trigger the same flow.
- Empty roster shows the empty state, not an empty table.

## Acceptance criteria
- [ ] Heading reads "Sellers profile"; a primary **Invite seller** button (with plus icon) sits in the heading tools.
- [ ] With no sellers, \`cds-empty-state\` renders centered: icon \`ph ph-users-three\`, title "No seller yet", the stated message, and an **Invite seller** button inside.
- [ ] Both Invite-seller buttons open the same invite flow.
- [ ] Filters + Search controls are present in the heading row.
- [ ] Populated state is documented (table + status badge + pagination) for when seller data arrives.
- [ ] Loading / error / denied states behave as specified.
- [ ] Built only from Cadence components (top-nav, nav-item, button, empty-state, notif-bell, user-chip; table/header/pagination/status-badge when populated).

## Notes
- The live app renders the **empty** state only; the populated sellers table is specified here but not yet built — flag the table/status composition when implementing real data.
- Seller detail (\`/agent/team/:sellerId\`) with change-status / resend-invitation is a page of its own.
- Filters icon button / Search input are currently plain; promote to \`cds-*\` only if reused elsewhere.
`;
