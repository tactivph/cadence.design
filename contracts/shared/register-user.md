# Shared · Register user (agent referral)

A public self-registration: an existing agent or staff member shares a referral link, and a
prospective agent completes the same three-step wizard as setup-account to create an account
under that referrer. Uses the same step components and copy as `setup-account.md`. The differences
are listed explicitly below.

| | |
|---|---|
| **Route** | `/register-user/:refCode` → `''` (redirects to `info`) · `info` · `address` · `security` · pdo `SetupLayoutComponent` + the account-setup step components (`pages/public/account-setup/*`) |
| **POV / access** | **Unauthenticated, referral-gated.** The `:refCode` is the only credential, and it is encrypted. |
| **Entry points** | Referral link from an agent or staff member (`refCode` is an encrypted `user-<id>` for the referrer). |

**Guard:** `logoutIfAuthenticated` on the parent route, which signs out any existing session first. Unlike setup-account, the `security` step has **no** `setupAccount` guard.

## Route table
| Path | Step | pdo component | Continue does |
|---|---|---|---|
| `/register-user/:refCode` | (redirect) | — | → `info` |
| `/register-user/:refCode/info` | 1 · Tell us about yourself | `InfoComponent` | `POST …/register-agent/:id?is_save=false` (validate only) → `address` |
| `/register-user/:refCode/address` | 2 · Address | `AddressComponent` | client validation → `security` |
| `/register-user/:refCode/security` | 3 · Create password | `PasswordComponent` | `POST …/register-agent/:id` (save) → `/setup-account/success` |

## Purpose
Let a prospective agent or staff member create their own account under a specific referrer, without an
invite, and land on the same "setup complete" screen.

## What differs from setup-account
- **No token.** Identity is the encrypted `refCode`, not a setup token. Nothing is loaded from the server, so every step starts blank.
- **Email is collected.** Step 1 shows an Email field (required, valid format). In setup-account the email is prefilled and hidden.
- **Referrer attribution.** The new account is created under the referrer: `POST /api/users/register-agent/:refUserId/`, where `refUserId` is the decrypted `refCode` with `user-` removed.
- **Server validation before continuing.** Step 1 calls the endpoint with `?is_save=false` so server errors (for example duplicate email) appear on step 1 before the visitor reaches the password step.
- **Save on step 3, not a PUT.** Step 3 creates the record with `POST` (`is_save` default) instead of updating an existing one.
- **Undecryptable refCode** redirects to `/expired` with toast "Invalid registration link".
- **No `setupAccount` guard** on `security`.

Everything else (copy, step fields, validation rules, password rules, success page) is the same as `setup-account.md`.

## Data
- **Step 1 validate** — `POST /api/users/register-agent/:refUserId/?is_save=false` with the step 1 fields and photo. pdo: `204` on valid, `4xx` with field errors otherwise. Target `200` `(confirm)`.
- **Step 3 save** — `POST /api/users/register-agent/:refUserId/` with all fields, photo and birthdate formatted as the server expects. pdo: `201` and cookies cleared, so no session is created. Target `200` `(confirm)`.
- **Referrer rules (server)** — the referrer must be an active agent or staff member, and an agent referrer must not itself be a sub-seller. Otherwise the server returns `404` "User not found".
- The page reads no record data.

## Layout
Same as setup-account (nav with progress bar, step title and subtitle, body, Back and Continue footer). Step 1 has the Email field after the name fields.

## Components (from `@tactivph/cadence-ui`)
Same as `setup-account.md`. Email field: `cds-form-field` + `input[cdsInput]` (`type="email"`).

## States
- **Idle** — blank steps.
- **Validating** (step 1 Continue) — Continue disabled while the validate call runs.
- **Saving** (step 3 Continue) — Continue disabled.
- **Field errors** — inline; server field errors mapped onto the step's fields (for example "email already in use" `(confirm)` copy).
- **Server error** — `cds-alert` for non-field errors.
- **Invalid refCode** — redirect to `/expired`.
- **Referrer not found** — `(confirm)` copy. pdo shows the server message in the alert, and it is not specified.
- **Done** — `/setup-account/success` (shared success screen).

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Continue** (step 1) | Validate on the server (no save). | `POST /api/users/register-agent/:id?is_save=false` | `…/address` |
| **Back** (step 2) | Return. | — | `…/info` (replace history) |
| **Continue** (step 2) | Validate on the client. | — | `…/security` |
| **Back** (step 3) | Return. | — | `…/address` (replace history) |
| **Continue** (step 3) | Create the account. | `POST /api/users/register-agent/:id` | `/setup-account/success` |
| **Upload photo** / **Remove**, **eye toggles** | As setup-account. | — | stays |

## Rules / validation
- All step rules are as in `setup-account.md`, with these additions:
  - Email: required; valid email format ("Email is required.", "Invalid email format.").
  - Duplicate email from the server is shown on the email field `(confirm)`.
- Phone number, names, birthdate, gender and photo follow the setup-account rules.
- The referrer identity is never shown to the visitor on these steps `(confirm)`.

## Acceptance criteria
- [ ] `/register-user/:refCode` redirects to `…/info`.
- [ ] A `refCode` that cannot be decrypted redirects to `/expired` with the "Invalid registration link" toast.
- [ ] Step 1 shows an Email field and calls `POST /api/users/register-agent/:id?is_save=false` before moving to step 2.
- [ ] A server validation error on step 1 is shown on step 1 and the visitor stays there.
- [ ] Steps 2 and 3 use the same copy, rules and password checks as setup-account.
- [ ] Step 3 calls `POST /api/users/register-agent/:id` once and navigates to `/setup-account/success`.
- [ ] No setup token is requested or sent.
- [ ] The existing session is cleared before the flow starts.
- [ ] Security (OWASP A01/A07): the referrer id is never shown in plain text; no tokens in `localStorage`.

## Notes
- Status codes: see Data (DECISIONS by analogy, `(confirm)`).
- Shared components mean any change to setup-account steps lands on this flow too. Keep one implementation with two data sources.
- The `refCode` encoding (`encryptText`/`decryptText`) is pdo's helper; the Cadence implementation needs an equivalent `(confirm)`.
