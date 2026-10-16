# Shared · Link expired

The single "this link is no longer valid" surface. Every tokenised public flow (account setup,
registration, appointment slip, and in pdo the password reset) sends stale or invalid links here.

| | |
|---|---|
| **Route** | `/expired` · no guard · pdo component `BrokenLinkComponent` (`pages/public/broken-link`) |
| **POV / access** | **Unauthenticated and authenticated** (public module, `hideHeader`). |
| **Entry points** | Account setup: token fails to load (`setup-layout`, toast "Invalid registration link") · register-user: `refCode` cannot be decrypted · appointment slip: `GET /api/agents/cas/:token/` returns 4xx (toast "Invalid Token") · password reset: see Notes. |

## Purpose
Tell the visitor the link is no longer valid, and point them to the right next step
(a fresh email or support), without exposing why the token failed.

## Data
- **Layout only** — `GET /api/users/me/?for_display=true` decides the header and the primary button.
- No record data. The page does not echo the token.

## Layout
Centred, full-viewport:
1. **Header** — Pueblo de Oro logo, anonymous visitors only.
2. **Message block** — icon (broken link), `h1` "This link has expired", body "The link you’re trying to access is no longer valid. Please check your email for a new link or contact support for further assistance."
3. **Primary button** — "Back to login" (anonymous) or "Back to home" (signed in).
4. **Support** — secondary button "Got any trouble? Contact support" below the block.

## Components (from `@tactivph/cadence-ui`)
- `cds-auth-layout` — anonymous frame with logo header.
- Broken-link icon — `(confirm DS)` icon name.
- `button[cds-button]` (primary) — "Back to login" / "Back to home".
- `button[cds-button]` (secondary) — "Contact support". `(confirm DS)` for the support action target.

## States
- **Anonymous** — logo header; "Back to login".
- **Signed in** — no logo header; "Back to home".
- **Single message state** — expired and invalid tokens look the same by design.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Back to login** (anonymous) | Leave the page. | — | `/login` |
| **Back to home** (signed in) | Leave the page. | — | `/` |
| **Contact support** | `(confirm)` pdo has no handler or target; render-only until confirmed. | — | — |

## Rules / validation
- The message is identical for expired, used and malformed tokens. Do not show the reason.
- The page does not offer a self-serve resend. A new link comes from the person who sent the original (inviter or agent) or from forgot-password for a reset.
- No form, no input.

## Acceptance criteria
- [ ] `/expired` renders the heading, body copy and icon from pdo.
- [ ] An anonymous visitor sees the logo header and a "Back to login" button that navigates to `/login`.
- [ ] A signed-in visitor sees "Back to home" that navigates to `/`.
- [ ] The page never displays the token or the failure reason.
- [ ] The support button renders (behaviour `(confirm)`).
- [ ] The page is built only from Cadence components (plus the icon).

## Notes
- Routing into this page uses `replaceUrl` in pdo, so Back does not return to the bad link.
- Password reset: pdo's `ResetPasswordComponent` does not redirect here on an invalid token; it shows the server message inline. The concept (`02-shared-and-auth-flows.md §2.3`) says it should land here. See `password-reset.md`.
