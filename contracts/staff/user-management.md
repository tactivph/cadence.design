# Staff · Admin · User management

The admin people hub: invite and manage staff members and assign them roles, and
manage the roles + permissions that gate everything else.

| | |
|---|---|
| **Route** | `/staff/admin/user-management` |
| **POV / access** | **Staff.** Requires `manage_staff` (Staff tab) / `manage_role` (Roles tab). Behind the staff shell + auth guard. |
| **Entry points** | Top-nav **Admin ▾ → User management**. Rows deep-link to edit/role screens. |

## Purpose
Let admin staff onboard colleagues (invite, assign roles, activate/deactivate) and
define the roles + resource permissions that drive RBAC across the app.

## Data
- **Staff** tab — `GET /api/users/staffs/` (paged, searchable by name/email).
  Columns: **Name** (avatar + name) · **Email** · **Role(s)** · **Status**
  (Active/Invited/Suspended) · **Last active** · row menu.
- **Roles** tab — `GET /api/users/roles/`. Columns: **Role** · **Description** ·
  **Users** (assigned count) · row menu. Role ↔ resource assignment via
  `/api/users/roles/resources/`, `/api/users/resource-modules/`.

## Layout
Inside the staff shell:
1. **Page header** — title "User management".
2. **Tabs** — **Staff** and **Roles**.
3. Per tab: a **toolbar** (search on the left; a primary **Create** action on the right)
   over a data table, with footer pagination.

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — shell (Admin active); `cds-notif-bell`, `cds-user-chip`.
- `cds-page-header`.
- `cds-tabs` + `cds-tab` — Staff / Roles.
- `cds-input-group` + `input[cdsInput]` — search.
- `button[cds-button]` — **Create user** / **Create role** (primary).
- `cds-avatar` — Name cell (Staff tab).
- `cds-badge` (tone success/warning/danger) — the Status pill.
- `table[cdsTable]` + `cds-table-header`; `cds-table-pagination` — footer.

## States
- **Loading** — table shows a spinner/skeleton; keep the toolbar visible.
- **Empty (no staff / no roles)** — empty slot per tab.
- **Empty (no matches)** — "No results match your search" + Clear search.
- **Error** — `cds-alert variant="danger"` with Retry.
- **Permission denied** — guard redirects; Admin nav item hidden.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Create user** (Invite staff) | Open the invite form. | `POST /api/users/staffs/` (confirm) | `/staff/admin/user-management/create` |
| **Row menu → Edit** (Staff) | Edit the staff member. | — | `/staff/admin/user-management/update/:staffId` |
| **Row menu → Change status** (Staff) | Activate / deactivate; destructive = *Yes, …* confirm. | `PUT /api/users/staffs/:id/change-status/` | stays |
| **Row menu → Resend invite** (Invited) | Re-send the invitation. | `POST /api/users/staffs/:id/resend/` (confirm) | stays |
| **Create role** | Open the create-role form. | `POST /api/users/roles/` (confirm) | `/staff/admin/user-management/roles/create` |
| **Row menu → Update** (Roles) | Edit the role + resource permissions. | `PUT /api/users/:pk/roles/` (confirm) | `/staff/admin/user-management/roles/update/:roleId` |
| **Search** | Debounced name/email (Staff) / role (Roles) search. | `GET /api/users/staffs/?search=` · `GET /api/users/roles/?search=` | stays |
| **Pagination** | Change page / size. | `?page=` on the active list | stays |

## Rules / validation
- Search is debounced (~300ms) and resets paging to page 1.
- Status pill maps Active/Invited/Suspended to `cds-badge` tones success/warning/danger; never hand-roll colours.
- Each destructive lifecycle action (deactivate, remove, cancel invite) requires a *Yes, …* confirm dialog.
- RBAC: the Roles tab is only shown/usable with `manage_role`; Staff tab with `manage_staff`.

## Acceptance criteria
- [ ] Reachable from top-nav **Admin ▾ → User management**; tabs gated by `manage_staff` / `manage_role`.
- [ ] Staff columns: Name, Email, Role, Status, Last active, row menu.
- [ ] Roles columns: Role, Description, Users, row menu.
- [ ] Create actions route to the invite/create forms; change-status hits `/api/users/staffs/:id/change-status/`.
- [ ] Search + pagination work per tab.
- [ ] Loading / empty / no-match / error states behave as specified.
- [ ] Status rendered with `cds-badge`; built only from Cadence components.

## Notes
- The mock labels the Staff primary button **"Create user"**; the concept/live label is
  **"Invite staff"** — align the real label. **Flag.**
- The concept renders **Roles** as cards (description + permission chips + assigned member
  avatars); the current mock renders a table. Decide table vs. cards for parity. **Flag.**
- Also exposed on this area: **Activity logs** (`GET /api/users/activity-logs/`) — audit trail,
  out of scope for this list.
