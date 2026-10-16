# Agent · Settings / Change address

The shared account-settings sub-page where a user updates their default business
address: a PH address form (Province / Municipality-City / District-Barangay / Postal
Code / Address 1 / Address 2) with Cancel and Save changes.

| | |
|---|---|
| **Route** | `/settings/update-address` |
| **POV / access** | **Agent (broker/seller).** Shared settings screen (also used by staff/client); authenticated session, scoped to the current user (`me`). Behind the app shell + auth guard. |
| **Entry points** | Account settings (`/settings`) → **Change address** · breadcrumb Settings → Change address. |

## Purpose
Let the signed-in user set/update the default business address stored on their profile.

## Data
- **Current user** — `GET /api/users/me/` → existing address (province, city/municipality, barangay/district, postal code, address 1/2).
- **PH location lookups** — province → city/municipality → barangay cascading options `(confirm)`.

## Layout
Inside the app shell:
1. **Breadcrumb** — `cds-breadcrumb`: Settings → Change address.
2. **Form** (single column, centred ~616px):
   - Header — title "Enter your address information" + helper "This will be used as your default business address. You can always change this later in your settings."
   - Fields — Province (required, select) · Municipality/City (required, select) · District/Barangay (required, select) · Postal Code (text) · Address 1 (required, text) · Address 2 (text, placeholder "Subdivision/Bldg. name/Unit no.").
3. **Footer actions** — Cancel + Save changes (right-aligned).

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — app shell.
- `cds-notif-bell` · `cds-user-chip` — header actions.
- `cds-breadcrumb` — Settings → Change address.
- `cds-form-field` (with `label` + `required`) wrapping `cdsInput` `<input>` / `<select>` — the six fields.
- `cds-button` — Cancel (`secondary-neutral`) + Save changes (`primary`).

## States
- **Loading** — fields disabled/skeleton while `GET /api/users/me/` resolves.
- **Saving** — Save changes shows a busy/disabled state during the PUT.
- **Error** — field-level validation messages + a form-level `cds-alert variant="danger"` on save failure.
- **Success** — success notification (e.g. "Address updated successfully") then return to `/settings`.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Province / City / Barangay (select)** | Cascade: selecting a province loads its cities; selecting a city loads its barangays. | lookups `(confirm)` | stays |
| **Save changes** | Validate + persist the address to the user's profile. | `PUT /api/users/me/` | → `/settings` on success |
| **Cancel** | Discard changes. | — | → `/settings` |

## Rules / validation
- Required: Province, Municipality/City, District/Barangay, Address 1.
- Optional: Postal Code, Address 2.
- City/Barangay selects are gated on the parent selection (province → city → barangay cascade).
- Postal code format validated (app-enforced).

## Acceptance criteria
- [ ] Breadcrumb reads Settings → Change address.
- [ ] All six fields render with correct labels, required markers, and the Province/City/Barangay cascade.
- [ ] Save changes validates required fields and calls `PUT /api/users/me/`, returning to `/settings` on success.
- [ ] Cancel returns to `/settings` without saving.
- [ ] Loading / saving / error / success states behave as specified.
- [ ] Built only from Cadence components.

## Notes
- Shared settings screen (`02 §2.5`); the same form is used in account-setup's **Address** step (`02 §2.4`).
- PH location cascade endpoints are inferred — marked `(confirm)`; confirm shapes against the API when implementing.
