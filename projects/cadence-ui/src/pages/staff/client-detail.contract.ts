/**
 * Page contract — Staff · Client detail.
 * Single source of truth; mirrored to contracts/staff/client-detail.md.
 * Design system is presentational only — endpoints/behaviour are the app's job.
 */
export const CONTRACT = `
# Staff · Client detail

The staff record for a single converted buyer (client): identity header with the
client's category status, a tabbed activity/documents panel, and a profile
right-rail of clustered details. The jump-off point to the client's contracts
and the requirement-verification workspace.

| | |
|---|---|
| **Route** | \`/staff/customers/clients/:clientId\` |
| **POV / access** | **Staff.** Requires resource \`manage_client\`. Behind the staff shell + auth guard. |
| **Entry points** | Clients list row (\`/staff/customers/clients\`) · Clients pipeline card · notifications/deep links. |

## Purpose
Give staff one place to read a client's profile and activity, see their contract
category at a glance, and move into the client's contracts and requirement
verification.

## Data
- **Client** — \`GET /api/clients/:pk/\` (confirm) → identity (name, Client ID), **category** (contract status), contact (mobile, email, address), personal details, **Enrolled by** (agent), date inquired/enrolled.
- **Contracts / properties** — the client's **Contract(s)** (e.g. "Contract ID: 162 — Pending") with the unit card (site, project, house type, price, total contract price): \`GET /api/contracts/?client=:clientId\` (confirm).
- **Activity / notes** — \`GET /api/notes/*\`, \`GET /api/clients/activity-history/\` (confirm).
- **Documents** — client-visible / internal documents surfaced on the Documents tab (confirm).

## Layout
Inside the staff shell (**Clients** active), one column with a two-column body:
1. **Breadcrumb** (\`cds-breadcrumb\`) — Clients › client name.
2. **Client header** — avatar + identity on the left (name, a \`cds-status-badge kind="client-category"\` category pill + a project/enrolled subtitle), primary action **Add note** on the right.
3. **Body** — a grid:
   - **Primary column** — \`cds-tabs\`: **Activity** (feed of \`cds-card\` activity items: actor avatar, title, role/meta, body, timestamp) · **Documents** (count badge; list/empty).
   - **Right rail** — bordered aside with a \`cds-tabs\` **Profile** panel of clustered detail groups: **Contact** (Mobile, Email, Address), **Lead details** (Client ID, Lead Source, Date Inquired), **Property interest** (Project, Target unit, Unit price), **Assigned team** (Project Specialist, Sales Director, Enrolled by).

## Components (from \`@tactivstudios/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — staff shell (Clients active); \`cds-notif-bell\`, \`cds-user-chip\` in actions.
- \`cds-breadcrumb\` (\`items\`) — Clients › client name.
- \`cds-avatar\` (\`name\`, \`size\`) — client header + activity actors.
- \`cds-status-badge kind="client-category"\` — the category pill (e.g. \`signed_cas\`, \`endorsed\`, \`reserved_buyer\`, \`expired\`).
- \`button[cds-button]\` — **Add note** primary action.
- \`cds-tabs\` + \`cds-tab\` (\`label\`, \`count\`) — Activity / Documents and the Profile rail.
- \`cds-card\` — activity items.

## States
- **Loading** — breadcrumb + header skeleton and skeleton placeholders for the tabs/rail (the captured reference was taken mid-load).
- **Empty (no activity)** — Activity tab shows an empty frame / prompt.
- **Empty (no documents)** — Documents tab (\`count=0\`) shows an empty frame.
- **Error / not found** — \`cds-alert variant="danger"\`; 404 → not-found.
- **Permission denied** — guard redirects; nav item hidden.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Add note** | Append a note (+ attachments) to the client's activity. | \`POST /api/notes/\` (confirm) | stays |
| **Breadcrumb · Clients** | Back to the clients register. | — | \`/staff/customers/clients\` |
| **Open requirements** (from a contract) | Enter the requirement-verification workspace for a contract. | — | \`/staff/customers/clients/:clientId/requirements?contractId=:id\` |
| **Activity tab** / **Documents tab** | Switch the primary panel. | — | stays |

## Rules / validation
- Category pill maps the contract status via the \`client-category\` preset; never hand-roll colours.
- Read-only record — mutations (verify, cancel, publish) happen in the requirements workspace, not here.
- Activity is newest-first; each item shows actor, role, body and timestamp.

## Acceptance criteria
- [ ] Reachable from the Clients list row; gated by \`manage_client\`.
- [ ] Breadcrumb (Clients › name) and a client header with avatar, name, a \`cds-status-badge kind="client-category"\` pill and subtitle.
- [ ] Primary panel has **Activity** and **Documents** tabs with counts; Activity renders actor/role/body/timestamp cards.
- [ ] Profile rail shows the Contact, Lead details, Property interest and Assigned team clusters.
- [ ] **Add note** is present as the header primary action.
- [ ] Loading / empty / error states behave as specified.
- [ ] Composed only from Cadence components.

## Notes
- Concept names the primary tabs **Properties** / **Activity**, where Properties lists the client's **Contract(s)** with unit cards; the built composition shows **Activity** / **Documents** — reconcile against the real PDO screen before wiring (contracts/properties endpoint marked \`(confirm)\`).
- The deep workflow lives one level down in **Requirements** (\`/staff/customers/clients/:clientId/requirements?contractId=:id\`) — the 12-stage document-verification workspace (Verify Requirements, Review, Publish, Cancel reservation, Contract updates).
- The staff Lead detail (\`/staff/customers/leads/:id\`) is the sibling pre-conversion record and shares this header + tabbed-body + profile-rail composition.
`;
