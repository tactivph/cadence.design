/**
 * Page contract — Agent · Manual enrollment (add lead).
 * Single source of truth; mirrored to contracts/agent/lead-create.md.
 * The design system is presentational only — every endpoint/behaviour below is
 * the consuming app's responsibility.
 */
export const CONTRACT = `
# Agent · Manual enrollment (add lead)

The agent-driven lead-creation form: manually encode a prospect's source,
personal details, residential address and up to ten prospect properties, then
enroll them in the system.

| | |
|---|---|
| **Route** | \`/agent/leads/add\` |
| **POV / access** | **Agent (broker / seller).** Behind the agent shell + auth guard; the new lead is enrolled under the signed-in agent. |
| **Entry points** | Agent **Leads** list → **Manual enrollment**; the Analytics *Enroll a lead* empty state. |

## Purpose
Let an agent create a lead directly (rather than via a shared public enrollment
link) by encoding their profile and the properties they are interested in.

## Data
- **Reference lists** feed the selects/dropdowns: lead source, sales campaign, suffix, civil status, country/province/municipality/barangay, and the property cascade (site → project → house type → product offering → block and lot). \`GET\` reference endpoints (confirm).
- On submit the new lead is created: \`POST /api/leads/\` (+ \`/api/leads/registration/\`); prospect properties attach via \`POST /api/leads/:pk/prospect-property/\` (confirm shape).

## Layout
Inside the agent shell (\`cds-top-nav\`, Leads active):
1. **Trail** — back icon-button + \`cds-breadcrumb\` (Leads › Enroll new lead).
2. **Header** — title "Manual Enrollment", subtitle "Manually encode the lead's information and enroll them in the system."
3. **Source** — two fields: *Source of Lead* (dropdown) and *Sales Campaign* (text).
4. **Basic Information** — First / Middle / Last name, Suffix, Date of birth, Civil status, Nationality (radios Filipino / Foreigner), Gender (radios Male / Female), Email, Mobile number.
5. **Residential address** — Country, Province, Municipality/City, District/Barangay, Postal code, Address 1, Address 2.
6. **Prospect Property** — the property cascade (Site, Project, House Type, Product Offering, Block and Lot), an **Add property** card ("Does this lead have another property in mind?"), and a right-hand **Prospect Property list** with an empty state.
7. **Footer actions** — **Cancel** + **Finish enrollment** (disabled until valid).

## Components (from \`@tactivph/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\`, \`cds-notif-bell\`, \`cds-user-chip\` — shell.
- \`cds-breadcrumb\` — the trail.
- \`cds-form-field\` wrapping \`input[cdsInput]\` / \`select[cdsInput]\` — text, email, tel and select fields; \`[required]\` on First name, Last name, Mobile number.
- \`cds-radio\` — Nationality and Gender choices.
- \`cds-dropdown\` + \`button[cds-dropdown-trigger][cds-button]\` + \`button[cds-menu-item]\` — Source of Lead and Site pickers.
- \`cds-card\` — the "Add property" prompt.
- \`cds-empty-state\` — the empty Prospect Property list ("No prospect properties selected").
- \`button[cds-button]\` — **Add property**, **Cancel**, **Finish enrollment**.

## States
- **Default (empty form)** — all fields blank; Prospect Property list shows its empty state; **Finish enrollment** disabled.
- **Validating** — inline field errors surface in \`cds-form-field\` for required / malformed values.
- **Submitting** — **Finish enrollment** shows a loading state while the POST is in flight.
- **Error** — surface a \`cds-alert variant="danger"\` for a failed submit; keep entered values.
- **Permission denied** — route guard redirects; Leads nav hidden.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Back** (icon) / **Cancel** | Discard and return to the Leads list. | — | \`/agent/leads\` |
| **Add property** | Append the chosen property to the Prospect Property list (max 10). | — (staged client-side; persisted on submit) | stays |
| **Finish enrollment** | Validate, then create the lead with its properties. | \`POST /api/leads/\` (+ \`/api/leads/registration/\`, \`POST /api/leads/:pk/prospect-property/\`) | on success → the new lead detail \`/agent/leads/:id\` |

## Rules / validation
- Required: First name, Last name, Mobile number; mobile is a 10-digit PH number ((+63) prefix shown).
- Email must be a valid address when provided.
- **At most 10** prospect properties per lead; **Finish enrollment** stays disabled until the required fields are valid.
- Nationality and Gender are single-select radio groups.

## Acceptance criteria
- [ ] Reachable from the Leads list **Manual enrollment** action and the Analytics empty state.
- [ ] Sections render in order: Source, Basic Information, Residential address, Prospect Property.
- [ ] First name, Last name and Mobile number are marked required; **Finish enrollment** is disabled until they validate.
- [ ] Add property appends to the Prospect Property list and enforces the 10-property cap; empty list shows \`cds-empty-state\`.
- [ ] Submit POSTs the lead and navigates to its detail; failures surface an alert without losing input.
- [ ] Built only from Cadence components; no bespoke inputs/buttons/cards.

## Notes
- This is the manual counterpart to the public shared enrollment form (see \`concept 03 §3.1\`); both land as leads under the agent.
- Prospect-property cascade options (Site → Project → House Type → Product Offering → Block and Lot) are dependent selects — downstream selects populate from the upstream choice.
`;
