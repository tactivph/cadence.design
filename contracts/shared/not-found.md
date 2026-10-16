# Shared · Not found (404)

The catch-all page for any URL that does not match a route, and the landing page for
guarded deep links to records or screens the visitor cannot see. Renders without the app shell.

| | |
|---|---|
| **Route** | `/404` · no guard · also the target of the root wildcard `**` redirect (`app-routing.module.ts`) |
| **POV / access** | **Unauthenticated and authenticated.** Lives in the public module (`hideHeader`), so the app header is never shown here. |
| **Entry points** | Root wildcard `**` for any unknown path · role guards in `commons/utils/security.util.ts` when a user lands on a page outside their POV · in-app `navigate(['/404'])` when a record is missing or out of scope (agent lead detail, property detail, endorse, income calculator). |

## Purpose
Tell the visitor the page does not exist and give them one way back to the app.

## Data
- **Layout only** — `GET /api/users/me/?for_display=true` (`AuthService.fetchCurrentUser`) decides whether the logo header is shown. No record data is read.
- On failure the page renders the anonymous layout (pdo logs the error and carries on).

## Layout
Centred, full-viewport:
1. **Header** — Pueblo de Oro logo. Shown only when the visitor is anonymous.
2. **Message block** — `h1` "404", `h2` "Page not found", body "Sorry, but the page you were looking for could not be found".
3. **Primary button** — "Back to home".
4. **Illustration** — decorative 404 artwork beside the message (empty `alt`).

## Components (from `@tactivph/cadence-ui`)
- `cds-auth-layout` — anonymous frame with logo header. `(confirm DS)` whether a signed-in variant (no logo header) is needed.
- Message block (heading + text) — no dedicated DS component. `(confirm DS)` for an error-page content slot.
- `button[cds-button]` (primary) — "Back to home".

## States
- **Anonymous** — logo header shown.
- **Signed in** — logo header hidden; same message and button.
- **Layout lookup pending or failed** — render the anonymous layout immediately; swap when `me/` resolves. `(confirm)`

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Back to home** | Leave the error page. | — | `/` (app root: POV home when signed in, `/login` otherwise) |

## Rules / validation
- Any unmatched URL resolves here through the wildcard redirect; the original URL is not preserved or returned to.
- The page shows no record data and never confirms whether a record exists. Out-of-scope records use this same page (pdo parity).
- No form, no input.

## Acceptance criteria
- [ ] `/404` renders the "404" heading, "Page not found" title and body copy from pdo.
- [ ] An unknown path (for example `/does-not-exist`) redirects to `/404`.
- [ ] "Back to home" navigates to `/`.
- [ ] An anonymous visitor sees the logo header; a signed-in visitor does not.
- [ ] The page still renders when `GET /api/users/me/` fails.
- [ ] The page is built only from Cadence components (plus the illustration asset).

## Notes
- The wildcard lives in `pdo/web/src/app/app-routing.module.ts` (`path: '**'` → `404`).
- `/404` is also the redirect for role mismatches in `security.util.ts`. Those redirects are owned by the guard contracts, not this page.
