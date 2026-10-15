/**
 * Page contract — Agent · Settings / Edit profile.
 * Single source of truth; mirrored to contracts/agent/settings-edit-profile.md.
 * Design system is presentational only — endpoints/behaviour are the app's job.
 */
export const CONTRACT = `
# Agent · Settings / Edit profile

The shared account-settings sub-page where a user edits their personal profile:
photo, name, mobile, date of birth and gender, with Cancel and Save changes.

| | |
|---|---|
| **Route** | \`/settings/edit-profile\` |
| **POV / access** | **Agent (broker/seller).** Shared settings screen (also used by staff/client); authenticated session, scoped to the current user (\`me\`). Behind the app shell + auth guard. |
| **Entry points** | Account settings (\`/settings\`) → **Edit profile** · breadcrumb Settings → Edit profile. |

## Purpose
Let the signed-in user update the personal details stored on their profile — the
identity fields surfaced on the account overview.

## Data
- **Current user** — \`GET /api/users/me/\` → photo, first/middle/last name, mobile number, date of birth, gender.
- On save → \`PUT /api/users/me/\`; emits a success/failure notification (e.g. *Profile updated successfully*) — concept 02 §2.5.

## Layout
Inside the app shell:
1. **Breadcrumb** — \`cds-breadcrumb\`: Settings → Edit profile (caret separator).
2. **Form** (single column, centred ~616px):
   - **Step title** — "Tell us about yourself" + helper "This helps us identify you and ensure a smooth experience. Your details will remain secure."
   - **Photo** — \`cds-avatar size="lg"\` + **Change photo** / **Remove** buttons + helper ".jpg or .png up to 5 MB".
   - **Fields** — First name (required) · Middle name · Last name (required) · Mobile number (required, \`(+63)\` prefix) · Date of birth (calendar suffix) · Gender (Male / Female radios).
3. **Footer actions** — Cancel + Save changes (right-aligned).

## Components (from \`@tactivstudios/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — app shell.
- \`cds-notif-bell\` · \`cds-user-chip\` — header actions.
- \`cds-breadcrumb\` (\`items\`, \`separator\`) — Settings → Edit profile.
- \`cds-avatar\` (\`src\`, \`size="lg"\`) — current photo.
- \`cds-form-field\` (with \`label\` + \`required\`) wrapping \`cdsInput\` \`<input>\` — the text/tel fields.
- \`cds-input-group\` (\`cds-prefix\` \`(+63)\`, \`cds-suffix\` calendar icon) — mobile + date of birth fields.
- \`cds-radio\` (\`name\`, \`value\`, \`checked\`) — Gender (Male / Female).
- \`cds-button\` — Change photo (\`secondary-neutral\`, \`iconLeft\`) · Remove (\`ghost-neutral\`) · Cancel (\`secondary-neutral\`) · Save changes (\`primary\`).

## States
- **Loading** — fields/photo skeleton while \`GET /api/users/me/\` resolves.
- **Pristine** — Save changes is disabled until a field changes.
- **Saving** — Save changes shows a busy/disabled state during the PUT.
- **Error** — field-level validation messages + a form-level \`cds-alert variant="danger"\` on save failure.
- **Success** — success notification ("Profile updated successfully") then return to \`/settings\`.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Change photo** | Pick a new avatar image (.jpg/.png ≤ 5 MB). | avatar upload \`(confirm)\` | stays |
| **Remove** | Clear the current photo. | avatar clear \`(confirm)\` | stays |
| **Gender (radio)** | Select Male / Female. | — | stays |
| **Save changes** | Validate + persist the profile. | \`PUT /api/users/me/\` | → \`/settings\` on success |
| **Cancel** | Discard changes. | — | → \`/settings\` |

## Rules / validation
- Required: First name, Last name, Mobile number.
- Optional: Middle name, Date of birth, Gender, Photo.
- Mobile number uses the \`(+63)\` prefix; the input holds the national portion.
- Photo must be .jpg or .png, up to 5 MB.
- Save changes stays disabled while the form is pristine/invalid.

## Acceptance criteria
- [ ] Breadcrumb reads Settings → Edit profile.
- [ ] Photo block renders avatar + Change photo + Remove + the ".jpg or .png up to 5 MB" helper.
- [ ] Fields render with correct labels and required markers: First name* · Middle name · Last name* · Mobile number* (\`(+63)\` prefix) · Date of birth (calendar suffix) · Gender (Male/Female radios).
- [ ] Save changes validates required fields and calls \`PUT /api/users/me/\`, returning to \`/settings\` on success.
- [ ] Cancel returns to \`/settings\` without saving.
- [ ] Loading / pristine / saving / error / success states behave as specified.
- [ ] Built only from Cadence components (top-nav, nav-item, breadcrumb, avatar, form-field, input, input-group, radio, button, notif-bell, user-chip).

## Notes
- Shared settings screen (concept 02 §2.5); the same form backs account-setup's **Info** step (02 §2.4), scoped to \`me\`.
- Avatar upload/clear endpoints are inferred — marked \`(confirm)\`; confirm shapes against the API when implementing.
`;
