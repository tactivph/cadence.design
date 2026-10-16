# Agent · Lead · Update profile

The reservation-readiness form for one lead: the agent completes the lead's basic
profile (personal details, contact, source of lead, home address) so the lead can
move on to endorsement. Reached from step 3 of the lead detail checklist.

| | |
|---|---|
| **Route** | `/agent/leads/:id/update` |
| **POV / access** | **Agent (broker/seller).** Authenticated agent session; the lead must be visible to the agent (own lead, or a team member's lead for a broker). Behind the agent shell + auth guard. |
| **Entry points** | Lead detail · guided checklist step 3 **Update lead profile** · Profile rail edit (confirm). |

## Purpose
Let the agent capture and correct the lead's personal, contact and address details
(plus lead source) in one form, and save them back to the lead record. Saving returns
the agent to the lead detail page.

## Data
- **Lead** — `GET /api/agents/leads/:id/` (via `useQueryDetail`) prefills the form: name parts, birthdate, gender, nationality, civil status, phone, email, source, address.
- **Location lookups** — province, city and barangay option lists (`location` service, driven by `LocationQueryParams`); city is scoped to the chosen province, barangay to the chosen city.
- **Constants** — suffix and civil-status option lists (shared user constants).
- **Save** — `PUT /api/agents/leads/:id/` with the full basic-info + address payload.

Fields (form config `LeadBasicInfoForm` + `LeadAddressForm`):

| Field | Input | Required |
|---|---|---|
| `source` | Source of lead (select) | Yes |
| `specify_source` | Sales campaign (select) | Yes |
| `first_name` · `middle_name` · `last_name` · `suffix` | text / select | first + last only |
| `birthdate` | date picker, max = today minus 18 years | Yes |
| `gender` | radio: Male / Female | Yes |
| `nationality` | radio: Filipino / Foreign | Yes |
| `civil_status` | select (shared civil-status list) | Yes |
| `email` | email | Yes |
| `phone_number` | mobile | Yes (min 10 digits, must start with 9) |
| `address1` · `address2` · `postcode` | text | `address1` only |
| `province` · `city` · `barangay` | address-form cascade | Yes (Filipino) |
| `country` | select | Yes (Foreign) |

`tax_identification_number1` is removed from this form on load (not shown or required here).

## Layout
Inside the agent shell:
1. **Top nav** — brand + `a[cds-nav-item]` (Leads active) + notification bell + user chip.
2. **Breadcrumb** — Leads › lead name › Update profile.
3. **Page header** — `cds-page-header` with title "Update lead profile"; the page actions are the footer buttons.
4. **Form card** — `cds-card` sections, top to bottom:
   - **Lead source** — Source of lead + Sales campaign.
   - **Personal details** — First / Middle / Last name, Suffix, Date of birth, Gender, Nationality, Civil status.
   - **Contact** — Email, Mobile number.
   - **Address** — the shared address form (`pdo-address-form`): Primary address, Address line 2, Postcode, Province, City, Barangay; country-only block for Foreign nationality.
5. **Footer actions** — **Cancel** (left) and **Save** (right), sticky to the page bottom.

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]`, `cds-notif-bell`, `cds-user-chip` — shell.
- `cds-breadcrumb` — the trail.
- `cds-page-header` (title) with `[cds-page-actions]`.
- `cds-card` — each form section.
- `cds-form-field` + `input[cdsInput]` — text, email, mobile fields; `[required]` on the required fields.
- `select[cdsInput]` inside `cds-form-field` — Source, Sales campaign, Suffix, Civil status, Province, City, Barangay, Country.
- `cds-radio` — Gender and Nationality.
- Date of birth picker — no Cadence date-picker name yet (confirm DS).
- Address cascade — composed from the selects above (confirm DS if promoted to a shared address block).
- `button[cds-button]` — **Cancel** (secondary) and **Save** (primary, `[disabled]` while saving).
- `cds-alert variant="danger"` — page-level error when the lead cannot be loaded or saved.
- Confirm-discard dialog — no Cadence dialog name yet (confirm DS).

## States
- **Loading** — `cds-skeleton` over the form sections while the lead loads; Save disabled.
- **Idle** — prefilled from the lead; Save enabled.
- **Validation** — inline error text under each invalid required field, shown after touch/submit; submit blocked until valid.
- **Saving** — Save shows busy, inputs disabled.
- **Saved** — success toast, return to the lead detail page.
- **Save failed** — inline API field errors where the API returns them; otherwise an error toast.
- **Not found / error** — `cds-alert variant="danger"` with the lead unavailable; 404 routes to not-found.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Save** | Validate, then save the full profile. | `PUT /api/agents/leads/:id/` | `/agent/leads/:id` (replace history) |
| **Cancel** | Leave without saving. If the form is dirty, confirm discard first; if clean, leave immediately. | — | `/agent/leads/:id` |
| **Province / City / Barangay** | Change the address cascade; child lists refetch. | `GET` location lists (`location` service) | stays |
| **Nationality** = Foreign | Swap the address block for Country only. | — | stays |

## Rules / validation
- Required fields as in the table above; Date of birth cannot be later than 18 years before today (the picker's max).
- Mobile number: digits only, must start with `9`, at least 10 digits (`CustomValidators.phoneNumber` + `minLength(10)`).
- Email must be a valid email format.
- **Foreign nationality** sends the address as country only: province, city, barangay, address lines and postcode are cleared (confirm the API accepts the null/blank address).
- Source of lead and sales campaign are both required (confirm the option list is the same as the lead-create source list).
- Discard prompt only when the form is dirty (basic or address).

## Acceptance criteria
- [ ] Form is prefilled from `GET /api/agents/leads/:id/`; the page shows a loading state until it arrives.
- [ ] Required fields (Source, Sales campaign, First/Last name, Date of birth, Gender, Nationality, Civil status, Email, Mobile, Address line 1, Province, City, Barangay) show inline errors when empty.
- [ ] Mobile number rejects non-digits and numbers not starting with 9 or shorter than 10 digits; email rejects an invalid format.
- [ ] Choosing Foreign nationality replaces the address block with Country only and omits the Philippine address on save.
- [ ] Save sends `PUT /api/agents/leads/:id/`, shows a success toast, and returns to `/agent/leads/:id` with the replace flag.
- [ ] Cancel with unsaved changes asks for confirmation; Cancel with no changes leaves immediately.
- [ ] Save is disabled while the request is in flight.
- [ ] Built only from Cadence components (top-nav, nav-item, breadcrumb, page-header, card, form-field, cdsInput, radio, button, alert).

## Notes
- Route is a full page, not a modal. The same lead-level fields feed the endorsement flow, so keep the labels in step with [lead-create](./lead-create.md).
- Lead-level `tax_identification_number1` is intentionally not on this screen (removed in code on load).
- The back-end lead resource is `/api/agents/leads/…`. The lead detail contract shows `/api/leads/…`; that prefix is short by `agents/` (confirm when implementing).
- The pdo failure toast reads "Unable to enroll lead" (copy from the enrol flow) — see open questions; this contract uses update wording.
