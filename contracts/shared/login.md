# Shared · Login

The unauthenticated entry to Cadence: sign in with email + password and land on the
point-of-view home for your role. Shared across all POVs.

| | |
|---|---|
| **Route** | `/login` · guard `alreadyLoggedIn` (authenticated users are redirected away) · optional `?email=` prefill |
| **POV / access** | **Unauthenticated, shared.** No session required; the only way in for every POV. |
| **Entry points** | App-root redirect when unauthenticated · logout · invite / password-reset flows · expired-session bounce. |

## Purpose
Let a user authenticate and route them to their POV home (staff / agent / client), using
the HttpOnly-cookie JWT auth already built in CAD-8.

## Data
- **Login** — `POST /api/users/login/` (CAD-8): sets the auth cookies.
- **Identity** — after login, `GET /api/users/me/` for the user + **user type**, and
  `GET /api/users/me/resources/` for RBAC resources (both drive post-login routing).
  > `(confirm)` CAD-8 currently excludes user-type on `me/` and the `me/resources/` endpoint — see CAD-112 (the API gap this screen needs).

## Layout
Full-page, outside the app shell:
1. **Auth frame** — full-bleed background + brand logo (`cds-auth-layout`, NEW — CAD-111).
2. **Card** — heading "Login to your account", sub "Please enter your details."; Email field; Password field with show/hide eye toggle; inline form error; **Forgot password** link; **Login** button.
3. **Support** — a "Contact support" button below the card.

## Components (from `@tactivph/cadence-ui`)
- `cds-auth-layout` — reusable full-page auth frame (**NEW**, CAD-111; reused by forgot/reset/setup/register/error pages).
- `cds-form-field` + `input[cdsInput]` — Email and Password fields.
- `cds-input-group` with a `cds-suffix` — the password show/hide eye toggle.
- `button[cds-button]` — Login (and the support button).
- `cds-alert variant="danger"` — the generic invalid-credentials / error message.

## States
- **Idle** — empty (or `?email=` prefilled) form.
- **Submitting** — Login button busy; inputs disabled.
- **Invalid credentials** — one **generic** error (no email-vs-password distinction, no user enumeration).
- **Field required** — Email and Password are required (required-only; no client-side minlength).
- **Already authenticated** — `alreadyLoggedIn` guard redirects to the POV home.
- **Network / 5xx** — generic error with the ability to retry.
- **Rate limited (429)** — login throttle hit (CAD-8); show a generic "try again later" message.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Login** | Submit credentials; on success route to POV home. | `POST /api/users/login/` then `GET /api/users/me/` (+ resources) | staff → `/staff/dashboard`, agent → `/agent/dashboard`, client → `/client/dashboard` `(confirm on QA)` |
| **Forgot password** | Go to recovery. | — | `/forgot-password` |
| **Eye toggle** | Show/hide password. | — (client only) | stays |
| **Contact support** | `(confirm)` — pdo has no handler/target; render-only until confirmed. | — | — |

## Rules / validation
- Both Email and Password are **required**; no client-side minlength (pdo declares a minlength message but never applies it — not specified here).
- Auth failures return a single **generic** message (no enumeration).
- OTP / 2FA is **out of scope** for this screen.
- Post-login routing is per-POV per `concept/product/02-shared-and-auth-flows.md §2.1`.
  > `(confirm)` pdo's `login.component.ts` sends every user type to `/agent/dashboard`, and its authenticated-redirect `ngOnInit` never subscribes (dead code). Specified the concept per-POV behaviour; Alex to verify on QA.

## Acceptance criteria
- [ ] `/login` renders the auth frame + card from Cadence components only (`cds-auth-layout`, `cds-form-field`, `cdsInput`, `cds-input-group`/`cds-suffix`, `cds-button`, `cds-alert`).
- [ ] Email + Password required; submitting calls `POST /api/users/login/`; cookies are set (no tokens in JS).
- [ ] On success, `GET /api/users/me/` (+ resources) drives routing to the correct POV home.
- [ ] Invalid credentials show one generic error; no user enumeration; 429 handled.
- [ ] `alreadyLoggedIn` guard redirects an authenticated user away from `/login`.
- [ ] Forgot-password link routes to `/forgot-password`; password eye toggle works client-side.
- [ ] Loading / error / rate-limited states behave as specified.
- [ ] **Security (OWASP A01/A07):** auth over HttpOnly cookies, no tokens in `localStorage`, no enumeration, throttling honoured.

## Notes
- **Status-code parity — DECIDED (2026-10-16): keep CAD-8's `200` + user body / `401`.** pdo returns `204` + cookies / `400`, but `200`/`401` is kept as a **deliberate, documented deviation** (better REST, already shipped, the only consumer is our own `cadence.web`, and user-facing behaviour is identical). CAD-112 / CAD-113 target `200`/`401`. Recorded in `concept/config/DECISIONS.md`.
- `cds-auth-layout` is split into its own DS ticket (CAD-111) because every other public/auth screen reuses it.
- API additions this screen needs (user-type on `me/`, `me/resources/`) are CAD-112; `me/resources/` likely depends on the Roles model (CAD-46 / CAD-62 / CAD-94).
