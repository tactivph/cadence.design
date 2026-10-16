/**
 * Page contract — Staff · Admin · User management · Create new role.
 * Single source of truth; mirrored to contracts/staff/role-form.md.
 * Design system is presentational only — endpoints/behaviour are the app's job.
 */
export const CONTRACT = `
# Staff · Admin · Create new role

The role authoring form: name a role, describe it, and grant permissions by
ticking a per-resource action matrix (View / Create / Edit / Delete / Approve).

| | |
|---|---|
| **Route** | \`/staff/admin/user-management/roles/create\` |
| **POV / access** | **Staff (Admin).** Requires resource \`manage_role\`. Behind the staff shell + auth guard. |
| **Entry points** | Admin → User management → **Roles** tab → **Create role**; Roles overview dashboard → **Create role**. Edit variant is \`/roles/update/:roleId\`. |

## Purpose
Let an admin define a new role and its permission set in one form, so the role
can be assigned to staff from User management.

## Data
- **Resource modules / permissions** (the matrix rows) — \`GET /api/users/resource-modules/\` and \`GET /api/users/roles/resources/\`. Grouped by module (User management, Roles & permissions, Projects, Leads, Clients, Reservations, Approvals, Sales network, Calendar, Reports, Settings); each row has a name + description and a set of action columns.
- **Action columns** — View · Create · Edit · Delete · Approve (per resource; not every resource exposes every action).
- Form state: \`name\` (required), \`description\` (required), and the matrix of granted resource/action pairs.

## Layout
Inside the staff shell:
1. **Top nav** — staff nav (Admin active ▾) + \`cds-notif-bell\` + \`cds-user-chip\`.
2. **Breadcrumb trail** — User management / Role / Create new role (rendered as a plain trail, not \`cds-breadcrumb\`; see Notes).
3. **Two-column form**:
   - **Left sidebar** — role identity: **Role name** + **Description** fields.
   - **Right** — **Permissions** card: a column header row of action labels, then per-module sections, each listing permission rows (name + description) with a checkbox per action column.
4. **Footer** — right-aligned **Cancel** + **Create role** actions.

## Components (from \`@tactivph/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — shell (Admin active).
- \`cds-notif-bell\` + \`cds-user-chip\` — header actions.
- \`cds-form-field\` (\`label\`, \`required\`) — Role name + Description fields.
- \`input[cdsInput]\` / \`textarea[cdsInput]\` — the text + multiline inputs.
- \`cds-card\` — the permissions matrix container.
- \`cds-checkbox\` — each resource/action grant cell.
- \`button[cds-button]\` — Cancel (secondary) + Create role (primary).
- Breadcrumb trail is plain markup today (not \`cds-breadcrumb\`); if a distinct-label breadcrumb is needed design-system-side, flag it.

## States
- **Loading** — permissions matrix is loading (resource modules fetch); show skeleton rows / disabled form.
- **Empty** — not expected (resource modules always exist); if the fetch returns none, show \`cds-empty-state\` in the card.
- **Error** — \`cds-alert variant="danger"\` above the form on load/save failure, with Retry (app-wired).
- **Validation** — Create role disabled / field errors until name + description are valid.
- **Permission denied** — guard redirects; Admin nav hidden without \`manage_role\`.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Role name / Description** | Capture role identity. | — (form state) | stays |
| **Permission checkbox** | Toggle a resource/action grant in the matrix. | — (form state) | stays |
| **Create role** | Validate + persist the role and its permission set. | \`POST /api/users/roles/\` (confirm) + role↔resource assignment \`PUT /api/users/:pk/roles/\` (confirm) | back to \`/staff/admin/user-management/roles\` |
| **Cancel** | Discard and return to the roles list. | — | \`/staff/admin/user-management/roles\` |

## Rules / validation
- **Role name** and **Description** are both required; Create role stays disabled until both are valid.
- The permission matrix is the role's resource grant; only actions a resource exposes are selectable.
- Edit mode (\`/roles/update/:roleId\`) reuses this form pre-filled; Create role becomes a save/update.

## Acceptance criteria
- [ ] Reachable from Admin → User management → Roles → **Create role**; gated by \`manage_role\`.
- [ ] Left column has required **Role name** + **Description** fields built with \`cds-form-field\` + \`cdsInput\`.
- [ ] Right column renders the permissions matrix in a \`cds-card\`: action-column headers, per-module sections, a \`cds-checkbox\` per resource/action cell.
- [ ] **Create role** validates then POSTs the role (\`POST /api/users/roles/\` (confirm)); **Cancel** returns to the roles list without saving.
- [ ] Loading / error / validation / denied states behave as specified.
- [ ] Built only from Cadence components (top-nav, nav-item, form-field, input, card, checkbox, button, notif-bell, user-chip).

## Notes
- The breadcrumb is intentionally plain markup (not \`cds-breadcrumb\`): a 3-item run of identical \`cds-breadcrumb__item\` siblings collapses in blueprint capture, so distinct link/current classes keep all three labels (User management / Role / Create new role).
- Role↔resource assignment endpoints (\`/api/users/roles/\`, \`/api/users/:pk/roles/\`) are intended from the concept audit — confirm the request shape against the API.
- Action columns (View/Create/Edit/Delete/Approve) are the fixture default; drive them from \`resource-modules\` so each resource shows only the actions it supports.
`;
