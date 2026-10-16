# Shared · Setup account

The three-step onboarding an invited staff member or agent completes from the invite email:
confirm personal details, add an address, and set a password. Activates the account. Success
screen after. The user is **not** signed in on completion.

| | |
|---|---|
| **Route** | `/setup-account/info/:token` (step 1) · `/setup-account/info/:token/address` (step 2) · `/setup-account/info/:token/security` (step 3) · `/setup-account/success` (done) · pdo `SetupLayoutComponent` + `InfoComponent` / `AddressComponent` / `PasswordComponent` / `SuccessComponent` (`pages/public/account-setup/*`) |
| **POV / access** | **Unauthenticated, token-gated.** The `:token` is the only credential. |
| **Entry points** | Invite email link (staff: User management → invite / resend; agent: Team → invite seller; dashboards "Invite broker" / "Invite staff"). Concept: `02-shared-and-auth-flows.md §2.4`. |

**Guards:** the parent `info/:token` route has `logoutIfAuthenticated`, which signs out any existing session before the flow starts. The `security` step also has `setupAccount`, which sends the visitor back to `info/:token` when the setup process has not been initialised (for example after a page reload). `/setup-account/success` has no guard.

## Route table
| Path | Step | pdo component | Guard | Continue does |
|---|---|---|---|---|
| `/setup-account/info/:token` | 1 · Tell us about yourself | `InfoComponent` | `logoutIfAuthenticated` (parent) | client validation → `address` |
| `/setup-account/info/:token/address` | 2 · Address | `AddressComponent` | (parent) | client validation → `security` |
| `/setup-account/info/:token/security` | 3 · Create password | `PasswordComponent` | `setupAccount` | `PUT` full profile + password → `/setup-account/success` |
| `/setup-account/success` | Done | `SuccessComponent` | none | → `/login` |

## Purpose
Let an invited user confirm and complete their profile, set a password, and activate the account
before logging in for the first time.

## Data
- **Load** — `GET /api/users/setup-account/:token/` returns the invited user. The layout uses it to prefill every step, including photo and birthdate. Invalid or expired token → `401` → redirect to `/expired` with toast "Invalid registration link" / "The registration link is invalid or expired".
- **Save** — `PUT /api/users/setup-account/:token/`, multipart, with all fields and the photo if one was chosen. Nothing is saved on steps 1 and 2.
  - pdo: `201` with the auth cookies cleared, so no session is created. Target `200` per DECISIONS by analogy `(confirm)`.
- **Fields** — first name, last name, phone number, email (prefilled, not shown on this flow), birthdate, gender, photo, address1, address2, barangay, postcode, city, province, password, confirm password.

## Layout
Each step shares the same frame:
1. **Top nav** — logo; a 3-segment progress bar; step title and subtitle from the step config.
2. **Body** — the step form. While the user loads, a loader replaces the body.
3. **Footer buttons** — Back (secondary) and Continue (primary).

Step copy (from `SetupLayoutComponent`):
- Step 1 — "Tell us about yourself" / "This helps us identify you and ensure a smooth experience. Your details will remain secure."
- Step 2 — "Enter your address information" / "This will be used as your default business address. You can always change this later in your settings."
- Step 3 — "Create your password" / "Secure your account by creating a strong password."

**Step 1 fields:** Upload photo button + Remove · `.jpg` or `.png` up to 5 MB hint · First name* · Last name* · Mobile number* (+63 prefix, placeholder "Input 10-digit number") · Date of birth (date picker; max 18 years ago, min 1930-01-01) · Gender (Male / Female).

**Step 2 fields:** banner when the user has assigned regions ("You have been assigned to …. All leads and activities within this area will be directed to you.") · address block (`pdo-address-form`): Primary address* · Address line 2 · Barangay* · City* · Province* · Postcode.

**Step 3 fields:** Password* with show/hide eye and requirements checklist · Confirm password* with show/hide eye.

## Components (from `@tactivph/cadence-ui`)
- `cds-auth-layout` — page frame. Progress bar and step title are `(confirm DS)` (no stepper component named yet).
- `cds-form-field` + `input[cdsInput]` — text fields and the mobile field.
- Mobile field prefix "(+63)" — `(confirm DS)` input prefix.
- Date of birth — `(confirm DS)` date picker.
- Gender — radio group `(confirm DS)`.
- Photo upload — `(confirm DS)` avatar upload.
- Address block — `(confirm DS)` address composite (province, city and barangay are selects).
- `cds-input-group` + `cds-suffix` — password eye toggles.
- `cds-alert variant="danger"` — server error message.
- `button[cds-button]` — Back (secondary), Continue (primary).
- Loader — `(confirm DS)`.

## States
- **Loading** — user record is being fetched; nav shows, body shows a loader.
- **Idle** — step form prefilled from the server record.
- **Field errors** — inline text under each field, shown after the user touches it or on Continue.
- **Submitting** (step 3 only) — Continue disabled.
- **Server error** — `cds-alert` for non-field errors; field-level errors inline.
- **Invalid or expired token** — redirect to `/expired`.
- **Done** — `/setup-account/success`: heading "Account setup complete!"; body "Your account has been successfully set up. Please log in to proceed to your dashboard."; button "Go to Login".

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Continue** (step 1) | Validate; no save. | — | `…/address` |
| **Back** (step 2) | Return. | — | `…/info/:token` (replace history) |
| **Continue** (step 2) | Validate; no save. | — | `…/security` |
| **Back** (step 3) | Return. | — | `…/address` (replace history) |
| **Continue** (step 3) | Validate; save the profile and password. | `PUT /api/users/setup-account/:token/` | `/setup-account/success` |
| **Upload photo** / **Remove** | Choose or clear the photo; compressed client-side before preview. | — | stays |
| **Eye toggles** | Show or hide password text. | — | stays |
| **Go to Login** (success) | Leave. | — | `/login` |

## Rules / validation
- **Step 1**
  - First name and last name: required; letters, spaces and hyphens only. Messages: "First name is required.", "Last name is required.", "Only letters and spaces are allowed".
  - Mobile number: required; digits only; must start with 9; 10 digits. Messages: "Phone number is required.", "Phone number must start with 9". The minimum-length message says "at least 11 characters long" while the rule is 10 `(confirm)`.
  - Birthdate: optional; 18 years or older; not before 1930-01-01.
  - Gender: optional (Male / Female).
  - Photo: optional; `.jpg` or `.png`; the 5 MB limit in the hint `(confirm)` that it is enforced.
- **Step 2**
  - Primary address: required, "Primary address is required.".
  - Barangay, city, province: required.
  - Address line 2 and postcode: optional.
- **Step 3**
  - Password: required; at least 8 characters; an uppercase letter, a lowercase letter and a number. Special characters are not required. Messages as in `password-reset.md`.
  - Confirm password: required; must match. Messages as in `password-reset.md`.
- **Not collected in this flow:** middle name and civil status are disabled on these steps, so they are not shown or saved `(confirm)`.
- **Step guard:** the security step cannot be reached without the setup process being initialised. Reload mid-flow restarts at step 1 and re-fetches the server record; unsaved edits are lost `(confirm)`.
- **Single use:** the token is invalidated on successful save.
- **No sign-in:** the account is activated but no session is created; the user must log in.

## Acceptance criteria
- [ ] `/setup-account/info/:token` loads the invited user and prefills step 1; an invalid token redirects to `/expired`.
- [ ] Steps 1 and 2 validate on the client and make no API call.
- [ ] Each step's title and subtitle match the copy above.
- [ ] Back buttons move between steps without losing already-entered values in the same session.
- [ ] Step 1 enforces the name, mobile (starts with 9) and birthdate rules listed above.
- [ ] Step 2 enforces the required address fields.
- [ ] Step 3 enforces the password and match rules; Continue is disabled until valid.
- [ ] Continue on step 3 calls `PUT /api/users/setup-account/:token/` once and navigates to `/setup-account/success`.
- [ ] A visitor who opens `…/security` directly is redirected to `…/info/:token`.
- [ ] The success page shows the copy above and "Go to Login" navigates to `/login`.
- [ ] After completion no session cookie remains (the user must log in).
- [ ] Security (OWASP A01/A07): the token is single use; no tokens in `localStorage`; the existing session is cleared before setup.

## Notes
- Status codes: pdo returns `201` on save. DECISIONS applies `200` to auth endpoints; the target is `200` `(confirm)`.
- The register-user flow reuses these step components with different data sources and an API call per step; see `register-user.md`.
- Concept says `…/info/:token/address` and `/security` are sub-routes of `info/:token`. Code matches (nested routes), so the URLs are as shown.
