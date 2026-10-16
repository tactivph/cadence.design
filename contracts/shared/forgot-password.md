# Shared · Forgot password

The first step of password recovery: the visitor enters their account email and the system emails a
reset link. Two states on one screen: the request form, then a "check your email" confirmation with
resend.

| | |
|---|---|
| **Route** | `/forgot-password` · no guard · pdo `ForgotPasswordComponent` (`pages/public/forgot-password`) |
| **POV / access** | **Unauthenticated, shared.** No session required. |
| **Entry points** | Login → **Forgot password** link · direct link. Leaves to `/login` (Back to sign in) or to the emailed link (`/password-reset/:token`). |

## Purpose
Let a locked-out user request a password-reset email for their account, without the screen revealing
whether that account exists.

## Data
- **Request** — `POST /api/users/forgot-password/` with body `{ email }`.
  - pdo: `204` on success · `400` with `{ time_left }` when throttled (one request per minute per email) · `404` when no account matches the email.
  - Target per `concept/config/DECISIONS.md`: `200` on success, `429` with `{ time_left }` when throttled. `(confirm)` DECISIONS names login explicitly; the other codes are kept until confirmed.
- No account data is read or displayed.

## Layout
Full-page, auth frame:
1. **Auth frame** — brand logo above the card (`cds-auth-layout`).
2. **Card (request state)** — heading "Forgot password?", sub "Enter email address to reset password."; Email field (placeholder "Enter your account email"); inline error; cooldown message when throttled; **Send email** primary button; **Back to sign in** secondary link.
3. **Card (sent state)** — heading "Password reset email sent"; body "We've sent a password reset email to **{email}**. Simply click the link to set up a new password."; **Back to login** primary button; footer line "Didn’t get an email?" with **Send it again**.
4. **Footer** — "Got any trouble? Contact support" secondary button (request state only).

## Components (from `@tactivph/cadence-ui`)
- `cds-auth-layout` — full-page auth frame.
- `cds-form-field` + `input[cdsInput]` (`type="email"`) — Email field, with the error text slot.
- `button[cds-button]` — Send email (primary, `lg`), Back to sign in (secondary), Back to login (primary), Send it again (ghost), Contact support (secondary).
- Cooldown and confirmation text — plain text in the card.
- Resend confirmation toast — `(confirm DS)` toast component.

## States
- **Idle** — empty Email field; Send email enabled.
- **Field required** — Email empty on submit.
- **Submitting** — Send email disabled while the request is in flight.
- **Sent** — confirmation card with the entered email echoed back.
- **Cooldown** — after a send, "Send it again" is disabled and shows the countdown `Send it again (Ns)` from 60 s. A `time_left` from the server restarts the countdown with its value.
- **Throttled** — server returns `time_left`; show "Please wait N seconds before trying again." under the field.
- **Unknown email** — must look identical to **Sent** (see Rules).
- **Network / 5xx** — generic error with retry `(confirm)`. pdo shows nothing on this path.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Send email** | Validate; request the reset email. | `POST /api/users/forgot-password/` `{ email }` | stays; switches to **Sent** |
| **Back to sign in** | Leave for login. | — | `/login` |
| **Send it again** | Resend to the same address. Disabled during cooldown. | `POST /api/users/forgot-password/` `{ email }` | stays; toast "Reset link sent again"; restarts 60 s |
| **Back to login** (sent state) | Leave for login. | — | `/login` (replace history) |
| **Contact support** | `(confirm)` pdo has no handler or target. | — | — |

## Rules / validation
- Email is **required**. pdo's form uses `Validators.required` only; the input has `type="email"`. Message: "This field is required." (pdo default). `(confirm)` whether to add the email-format check used elsewhere ("Invalid email format.").
- Cooldown: 60 s after every successful send. The server also enforces one request per minute per email.
- **No account enumeration.** The Sent state and the wording must be the same whether or not an account matches. pdo returns `404` for unknown emails and shows no feedback, which reveals existence. See the question in the scratch file.
- The reset link carries a one-day token (`send_password_reset` uses `expiry=1`). Unit `(confirm)`.

## Acceptance criteria
- [ ] `/forgot-password` renders the auth frame and card from Cadence components only.
- [ ] Submitting an empty Email shows the required message and does not call the API.
- [ ] A valid submit calls `POST /api/users/forgot-password/` with `{ email }` and shows the Sent state with the entered email.
- [ ] "Back to sign in" and "Back to login" navigate to `/login`.
- [ ] "Send it again" is disabled for 60 s after a send, then enabled.
- [ ] A throttled response shows the server's `time_left` as a countdown message.
- [ ] A known and an unknown email produce the same Sent state (no enumeration).
- [ ] While the request is in flight the submit button is disabled.
- [ ] Security (OWASP A07): no account-existence signal in UI, status or timing copy; rate limit honoured.

## Notes
- Status codes: see the Data section (DECISIONS applied by analogy `(confirm)`).
- Backend note for the API owner: pdo's `ForgotPassword.create` passes the whole request body into `get_object_or_404(**request.data)`. The lookup should use `email` only. `(confirm)`
- Cooldown state is in-memory only; a page reload restarts it from zero.
