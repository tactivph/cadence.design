# Shared · Password reset

The page a visitor opens from the reset email to choose a new password. Token-gated and
single-use. On success they go to the recovery confirmation.

| | |
|---|---|
| **Route** | `/password-reset/:token` · no guard · pdo `ResetPasswordComponent` (`pages/public/forgot-password/reset-password`) |
| **POV / access** | **Unauthenticated, token-gated.** The `:token` is the only credential. |
| **Entry points** | Reset email link from `/forgot-password`. |

## Purpose
Let a user who has the emailed token set a new password for their account.

## Data
- **On open** — none. pdo does not validate the token until submit. `(confirm)` the concept (`02-shared-and-auth-flows.md §2.3`) expects token validation on open.
- **Submit** — `PUT /api/users/forgot-password/:token/` with body `{ password }`.
  - pdo: `204` on success. Invalid or expired token → `401` ("Invalid or expired token. Please provide a valid token.").
  - Target: `200` on success, per DECISIONS by analogy `(confirm)`.
- The token is invalidated on success (single use).

## Layout
Full-page, sign-in-free:
1. **Nav bar** — logo, vertical divider, and the title "Password recovery".
2. **Heading** — "Create your new password"; sub "Secure your account by creating a new password that follows the guidelines."
3. **Alert slot** — server error message (non-field error) when present.
4. **Password field** — label "Password", placeholder "Enter your password", show/hide eye.
5. **Requirements checklist** — "8 characters minimum", "an uppercase letter", "a lowercase letter", "a number". Each row ticks when satisfied.
6. **Confirm password field** — label "Confirm password" with required marker, placeholder "Re-enter password", show/hide eye.
7. **Primary button** — "Update password".

## Components (from `@tactivph/cadence-ui`)
- `cds-auth-layout` — page frame (nav logo + divider as slot content).
- `cds-form-field` + `input[cdsInput]` (type password) — Password and Confirm password.
- `cds-input-group` with `cds-suffix` — show/hide eye on both fields.
- `cds-alert variant="danger"` — server error message.
- Requirements checklist — `(confirm DS)`. No checklist component is named yet.
- `button[cds-button]` — Update password (primary).

## States
- **Idle** — empty fields; Update password disabled.
- **Typing** — requirement rows update live; confirm shows match status on blur or submit.
- **Field errors** — inline text under the field (messages below).
- **Submitting** — Update password disabled while the request is in flight.
- **Server error** — `cds-alert` with the server message; fields stay filled.
- **Invalid or expired token** — see Rules (target: redirect to `/expired`).
- **Success** — navigates to `/recovery-success`.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Update password** | Validate; set the password for the token. | `PUT /api/users/forgot-password/:token/` `{ password }` | `/recovery-success` (replace history) on success; stays on error |
| **Show/hide eye** (each field) | Toggle masking. | — | stays |

## Rules / validation
- **Password** — required. Must be at least 8 characters, contain an uppercase letter, a lowercase letter and a number. Special characters are not required (pdo has that check commented out).
  - Messages: "Password is required.", "Password must be at least 8 characters long.", "Password must contain at least one uppercase letter.", "Password must contain at least one lowercase letter.", "Password must contain at least one number."
- **Confirm password** — required and must equal Password.
  - Messages: "Confirm password is required.", "Passwords must match."
- Submit is enabled only when both fields are valid.
- **On error the user must stay on this page** with the message shown. pdo's `catchError` returns the error as a value, so its success branch still runs and navigates to `/recovery-success`. The target behaviour is an error path that does not navigate. `(confirm)`
- **Expired or used token** — target: send the user to `/expired` (per concept §2.3). pdo shows the server message inline instead. `(confirm)`
- The link is single-use: after success, the same token must not work again.

## Acceptance criteria
- [ ] `/password-reset/:token` renders the nav, heading, requirements checklist and both fields from Cadence components.
- [ ] Update password is disabled until both fields are valid.
- [ ] Each password rule message matches the copy above.
- [ ] A valid submit calls `PUT /api/users/forgot-password/:token/` with `{ password }` and navigates to `/recovery-success` with history replaced.
- [ ] A failed submit shows the server message and stays on this page.
- [ ] An expired or used token leads to `/expired` (behaviour `(confirm)`).
- [ ] Show/hide eye works on both fields without changing the value.
- [ ] Security (OWASP A07): the password is never shown in a URL or log; the token is single use.

## Notes
- Status codes: see Data (DECISIONS by analogy, `(confirm)`).
- The page sends `?success=1` on navigation to `/recovery-success`; that parameter is not read by the next page (see `recovery-success.md`).
- The same password rules apply to setup-account security and register-user security (`setup-account.md`).
