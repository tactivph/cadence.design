# Staff · Create / invite staff user

The create-staff screen under Admin → User management → Staff: a role-assignment
form with a left user-details rail and a right **Available roles** checkbox list,
closed by an Invite/Cancel footer.

| | |
|---|---|
| **Route** | `/staff/admin/user-management/create` |
| **POV / access** | **Staff (admin).** Requires resource `manage_staff`. Behind the staff shell + auth guard. |
| **Entry points** | Admin → User management → **Staff** tab → **Invite staff**. (The same composition backs **Edit** at `/update/:staffId`.) |

## Purpose
Invite a new staff member (by email) and assign the roles that define their
access, or, in edit mode, update an existing member's roles and account status.

## Data
- **Available roles** — `GET /api/users/roles/` (confirm); each row is name + description with a checkbox. Multiple roles may be assigned.
- **Edit mode** also loads the staff record (name, date invited, status): `GET /api/users/staffs/:id` (confirm).

## Layout
Inside the staff shell (`cds-top-nav`):
1. **Breadcrumb row** — back icon + `cds-breadcrumb` (User management › Staff) › current page "Add new staff".
2. **Two-column body**:
   - **Left rail (user details)** — avatar + name placeholder, "Date invited:" line, and account actions (**Remove this account**, **Deactivate this account**) — populated/active in edit mode.
   - **Right (Available roles)** — heading + helper text, then a scrollable list of role rows each a `cds-checkbox` with name + description.
3. **Footer** — **Cancel** + **Invite staff** (disabled until a role / required input is set).

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]`, `cds-notif-bell`, `cds-user-chip` — shell (Admin in actions row).
- `cds-breadcrumb` — the trail (current page rendered as a distinct text node).
- `cds-avatar` — the user-details rail avatar.
- `cds-checkbox` — one per available role (wraps name + description).
- `button[cds-button]` — **Remove this account** / **Deactivate this account** (`variant="danger-ghost" size="sm"`), **Cancel** (`secondary-neutral`), **Invite staff** (`primary`).

## States
- **Create (default)** — user-details rail shows placeholders ("-", "Date invited:"); roles list all unchecked; **Invite staff** disabled.
- **Edit** — rail shows the member's avatar/name/date; current roles pre-checked; Remove/Deactivate enabled.
- **Submitting** — **Invite staff** shows a loading state while the request is in flight.
- **Error** — `cds-alert variant="danger"` for a failed invite/update; keep selections.
- **Permission denied** — guard redirects; Admin menu hidden.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Invite staff** | Validate, then create the staff invite with the selected roles (in edit mode, save role changes). | `POST /api/users/staffs/` (create) · `PUT /api/users/:pk/roles/` (role assignment) (confirm) | on success → `/staff/admin/user-management` (Staff tab) |
| **Cancel** / **Back** | Discard and return to the list. | — | `/staff/admin/user-management` |
| **Remove this account** | Permanently remove the staff account (edit mode). | `DELETE /api/users/staffs/:id` (confirm) | returns to list |
| **Deactivate this account** | Set the account inactive (edit mode). | `PUT /api/users/staffs/:id/change-status/` | stays |

## Rules / validation
- At least one role must be selected before **Invite staff** enables (plus a valid invite email in create mode).
- Roles are a multi-select checkbox list (not single-choice).
- **Remove** / **Deactivate** are destructive edit-mode actions — gate behind a confirm and only when editing an existing account.

## Acceptance criteria
- [ ] Reachable from Admin → User management → Staff → **Invite staff**; gated by `manage_staff`.
- [ ] Left user-details rail (avatar, date invited, account actions) + right **Available roles** checkbox list render side by side.
- [ ] Roles are multi-selectable via `cds-checkbox`; **Invite staff** stays disabled until at least one role is chosen.
- [ ] Invite submits and returns to the Staff list; Cancel/Back discards; edit-mode Remove/Deactivate behave as specified.
- [ ] Error and permission-denied states behave as specified.
- [ ] Built only from Cadence components (breadcrumb, avatar, checkbox, button).

## Notes
- The breadcrumb's current-page label ("Add new staff") is rendered as a distinct text node beside `cds-breadcrumb` (the breadcrumb wraps items in identical `<li>`s).
- Edit mode reuses this exact composition at `/staff/admin/user-management/update/:staffId`.
