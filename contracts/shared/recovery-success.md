# Shared · Recovery success

Confirmation after a password has been reset, with one action back to login. Informational only.

| | |
|---|---|
| **Route** | `/recovery-success` · no guard · pdo `RecoverySuccessComponent` (`pages/public/forgot-password/reset-password/recovery-success`) |
| **POV / access** | **Unauthenticated, shared.** |
| **Entry points** | `/password-reset/:token` after a successful submit (replaces history). |

## Purpose
Confirm the password change and send the user to log in with the new password.

## Data
- None. No API call on this page.

## Layout
Centred, full-page:
1. **Nav bar** — logo.
2. **Confetti background** — decorative.
3. **Status icon** — completed check.
4. **Heading** — "Password Updated!"
5. **Body** — "Your password has been successfully updated. You can now use your new password to log in securely."
6. **Primary button** — "Proceed to log in".

## Components (from `@tactivph/cadence-ui`)
- `cds-auth-layout` — page frame with logo.
- Confetti and check artwork — `(confirm DS)` success graphic.
- `button[cds-button]` (primary, `md`) — "Proceed to log in".

## States
- Single state. No loading or error state (static content).

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Proceed to log in** | Go to login. | — | `/login` (replace history) |

## Rules / validation
- Static page. It does not check that a reset just happened (see Notes).

## Acceptance criteria
- [ ] `/recovery-success` renders the heading "Password Updated!" and the body copy from pdo.
- [ ] "Proceed to log in" navigates to `/login` and replaces history, so Back does not return here.
- [ ] No API call is made on load.
- [ ] The page is built only from Cadence components (plus the artwork).

## Notes
- pdo has no guard here, so the URL works on its own. Anyone can open it directly and see "Password Updated!". `(confirm)` whether to require the `?success=1` handoff or a short-lived state. The recommendation is to leave it public and informational, since the copy reveals nothing sensitive.
- The `?success=1` query parameter set by the reset page is not read here.
