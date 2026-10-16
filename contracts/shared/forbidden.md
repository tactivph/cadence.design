# Shared · Forbidden (403)

The access-denied page shown when a signed-in user reaches a screen whose RBAC resource they
do not hold. Renders without the app shell.

| | |
|---|---|
| **Route** | `/403` · no guard |
| **POV / access** | **Unauthenticated and authenticated** (public module, `hideHeader`). Content is generic; it never names the missing resource. |
| **Entry points** | `ResourceGuard` (`commons/services/utils/resource-guard.service.ts`) when the user lacks the required resource and there is no previous URL to return to · deep link to a restricted page with no prior history. |

## Purpose
Tell the user they lack permission for this page and give them a way back home.

## Data
- **Layout only** — `GET /api/users/me/?for_display=true` decides whether the logo header is shown.
- No record data.

## Layout
Same structure as the 404 page:
1. **Header** — Pueblo de Oro logo, anonymous visitors only.
2. **Message block** — `h1` "403", `h2` "Access forbidden", body "Sorry, you don’t have permission to access this page."
3. **Primary button** — "Back to home".
4. **Illustration** — decorative (same artwork as 404).

## Components (from `@tactivph/cadence-ui`)
- `cds-auth-layout` — anonymous frame with logo header. `(confirm DS)` for a signed-in variant.
- Message block — no dedicated DS component. `(confirm DS)`.
- `button[cds-button]` (primary) — "Back to home".

## States
- **Anonymous** — logo header shown.
- **Signed in** — logo header hidden.
- **Layout lookup pending or failed** — anonymous layout, swapped when `me/` resolves. `(confirm)`

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Back to home** | Leave the page. | — | `/` (app root) |

## Rules / validation
- The guard shows an "Access Denied" toast ("You do not have permission to access this page.") before redirecting here. That toast belongs to the guard, not this page.
- When the guard has a previous URL it returns the user there instead of showing `/403` (pdo behaviour). This page is therefore only reached when there is no previous page, such as a direct deep link. `(confirm)`
- The page must not reveal which resource or role was missing.

## Acceptance criteria
- [ ] `/403` renders the "403" heading, "Access forbidden" title and body copy from pdo.
- [ ] A guard denial with no previous URL lands on `/403`.
- [ ] "Back to home" navigates to `/`.
- [ ] An anonymous visitor sees the logo header; a signed-in visitor does not.
- [ ] The page names no resource, role or permission code.
- [ ] The page is built only from Cadence components (plus the illustration asset).

## Notes
- The 403 path is also used by the resource guard; the guard and its previous-URL behaviour are specified in the guard contract, not here.
- The 404 and 403 pages are visually identical except for the code and copy, so they should share one component in Cadence.
