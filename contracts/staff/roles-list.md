# Staff · User management — Roles

The Roles tab of Admin → User management: manage roles and permissions as
cards, split into **Active Roles** and **Inactive Roles** sections, with search
and create.

| | |
|---|---|
| **Route** | `/staff/admin/user-management/roles` |
| **POV / access** | **Staff (admin).** Requires resource `manage_role`. Behind the staff shell + auth guard. |
| **Entry points** | Top-nav **Admin ▾ → User management → Roles** tab (sibling of the Staff tab). |

## Purpose
Let an administrator review every role, see which are active vs. inactive, and
create or open a role to edit its resource/permission assignment.

## Data
- **Roles** — `GET /api/users/roles/` (confirm); each card carries title, status (Active / Inactive) and a description. Grouped into Active and Inactive sections.
- Role ↔ resource assignment data: `/api/users/roles/resources/`, `/api/users/resource-modules/` (used on the create/update screens).

## Layout
Inside the staff shell (`cds-top-nav`):
1. **Page title** "User management" with the two-tab `cds-tabs` (Staff / **Roles**).
2. **Toolbar** — subtitle "Manage roles and permissions", a Search roles input group, and a **Create role** button.
3. **Active Roles** section — collapsible header + a responsive grid of role `cds-card`s (name + `cds-badge tone="success"` + description).
4. **Inactive Roles** section — same grid; badge `tone="neutral"`.

## Components (from `@tactivstudios/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]`, `cds-notif-bell`, `cds-user-chip` — shell (Admin in the actions row).
- `cds-tabs` + `cds-tab` — the Staff / Roles switch.
- `cds-input-group` + `input[cdsInput]` — Search roles (prefix magnifier).
- `button[cds-button]` — **Create role** (`variant="primary"`, `iconLeft="ph-bold ph-plus"`).
- `cds-card` — each role card (`cds-card-header` for name + badge).
- `cds-badge` — the status pill (`success` Active / `neutral` Inactive).

## States
- **Loading** — role grids show skeleton cards (`cds-skeleton`); keep tabs + toolbar.
- **Empty** — a section with no roles shows an empty state (e.g. "No inactive roles").
- **No search matches** — "No roles match your search" + Clear action.
- **Error** — `cds-alert variant="danger"` with Retry above the grids.
- **Permission denied** — guard redirects; Admin menu hidden.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Create role** | Start a new role. | — (form posts `POST /api/users/roles/`) | `/staff/admin/user-management/roles/create` |
| **Role card click** | Open the role to edit its resource assignment. | load `GET /api/users/roles/:id` (confirm) | `/staff/admin/user-management/roles/update/:roleId` |
| **Search** | Debounced filter across role name/description. | client-side or `GET /api/users/roles/?search=` (confirm) | stays |
| **Section toggle** (caret) | Collapse / expand the Active or Inactive section. | — | stays |
| **Tab change** | Switch to the Staff tab. | — | `/staff/admin/user-management` |

## Rules / validation
- Status badge: Active → `tone="success"`, Inactive → `tone="neutral"`; never hand-roll colours.
- Roles are grouped strictly by status into the two sections; search filters within both.
- No role is mutated on this screen; create/update happen on the dedicated role form.

## Acceptance criteria
- [ ] Reachable as the **Roles** tab of Admin → User management; gated by `manage_role`.
- [ ] Two sections — Active Roles and Inactive Roles — each a responsive grid of role cards (name, status badge, description).
- [ ] **Create role** routes to the role-create form; a card routes to role update.
- [ ] Search filters the role cards; section carets collapse/expand.
- [ ] Loading / empty / no-match / error / permission-denied states behave as specified.
- [ ] Built only from Cadence components (tabs, card, badge, input-group, button).

## Notes
- Sibling of the **Staff** tab (`/staff/admin/user-management`); both live under the same User management shell.
- The concept's Roles-overview *dashboard* (`/staff/dashboard/roles-overview`) is a separate analytics page — this is the admin management list.
