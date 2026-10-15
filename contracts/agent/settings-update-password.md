# Agent · Settings / Update password

The shared account-settings sub-page where a user changes their password: current
password, new password (with a live requirements checklist) and confirm password,
with Cancel and Update password.

| | |
|---|---|
| **Route** | `/settings/update-password` |
| **POV / access** | **Agent (broker/seller).** Shared settings screen (also used by staff/client); authenticated session, scoped to the current user (`me`). Behind the app shell + auth guard. |
| **Entry points** | Account settings (`/settings`) → **Update password** · breadcrumb Settings → Update password (with back arrow). |

## Purpose
Let the signed-in user set a new account password, checking the new value against
the strength requirements before it is saved.

## Data
- **Current user** — `GET /api/users/me/` (identity context only; no stored password is read).
- On save → `PUT /api/users/me/password/`; emits a success/failure notification (e.g. *Password update failed*) — concept 02 §2.5.
- **Requirements** checklist (each met / not-met): **8 characters minimum** · **One uppercase letter** · **One lowercase letter** · **One number** · **One special character**.

## Layout
Inside the app shell:
1. **Breadcrumb** — back-arrow icon + `cds-breadcrumb`: Settings → Update password.
2. **Form** (single column, centred ~616px):
   - **Header** — title "Create your password" + helper "Secure your account by creating a strong password."
   - **Current password** — `cds-form-field` + password input with an eye (show/hide) icon.
   - **Password** (new) — `cds-form-field` + password input with eye icon, followed by the requirements checklist.
   - **Confirm password** — `cds-form-field` + password input with eye icon.
3. **Footer actions** — Cancel + Update password (right-aligned).

## Components (from `@tactivstudios/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — app shell.
- `cds-notif-bell` · `cds-user-chip` — header actions.
- `cds-breadcrumb` (`items`) — Settings → Update password.
- `cds-form-field` (with `label`) wrapping `cdsInput` `type="password"` — the three password fields.
- `cds-button` — Cancel (`secondary-neutral`) + Update password (`primary`).
- The show/hide eye icon and the requirements checklist are plain markup today (no dedicated `cds-*`); if a password-input or requirement-list is reused elsewhere, promote it and flag it.

## States
- **Default** — requirements render unmet; Update password disabled until the form is valid.
- **Typing (new password)** — each requirement toggles met / not-met live as the user types.
- **Saving** — Update password shows a busy/disabled state during the PUT.
- **Error** — wrong current password / mismatch surfaces field-level errors + a form-level `cds-alert variant="danger"` on save failure.
- **Success** — success notification then return to `/settings`.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Eye toggle** | Show / hide the password value in its field. | — | stays |
| **Update password** | Validate current + new + confirm, then persist. | `PUT /api/users/me/password/` | → `/settings` on success |
| **Cancel** / **back arrow** | Discard and return. | — | → `/settings` |

## Rules / validation
- New password must satisfy all five requirements: 8+ chars, one uppercase, one lowercase, one number, one special character.
- **Confirm password** must equal the new password.
- **Current password** is required and must match the account's current password (server-verified).
- Update password stays disabled until the new password is valid and confirmed.

## Acceptance criteria
- [ ] Breadcrumb reads Settings → Update password (with back arrow).
- [ ] Three fields render: Current password · Password (new) · Confirm password, each with a show/hide eye toggle.
- [ ] The requirements checklist shows all five rules and toggles met/not-met as the new password is typed.
- [ ] Update password validates the five rules + confirm match and calls `PUT /api/users/me/password/`, returning to `/settings` on success.
- [ ] Cancel / back arrow return to `/settings` without saving.
- [ ] Default / typing / saving / error / success states behave as specified.
- [ ] Built only from Cadence components (top-nav, nav-item, breadcrumb, form-field, input, button, notif-bell, user-chip).

## Notes
- Shared settings screen (concept 02 §2.5); the same requirements checklist backs account-setup's **Security** step (02 §2.4) and the `/password-reset/:token` reset flow (02 §2.3).
- Password-input (field + eye toggle) and the requirement-list are currently plain markup; promote to `cds-*` only if reused elsewhere.
