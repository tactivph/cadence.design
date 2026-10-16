/**
 * Page contract — Client · Buyer's Information Sheet (BIS) wizard.
 * Single source of truth; mirrored to contracts/client/buyers-information-sheet.md.
 * Design system is presentational only — endpoints/behaviour are the app's job.
 */
export const CONTRACT = `
# Client · Buyer's Information Sheet (BIS) wizard

A multi-step form the buyer completes as part of the requirements journey, capturing
personal, spouse, employment and consent details (plus co-borrower steps when applicable).

| | |
|---|---|
| **Route** | \`/client/requirements/:userRequirementId/information-sheet\` (→ \`personal-details\` by default) |
| **POV / access** | **Client (buyer).** Authenticated client session; the user-requirement must belong to the buyer. Behind the client shell + auth guard. |
| **Entry points** | Requirements hub → the BIS item's **Open form**. |

## Purpose
Collect a complete, validated Buyer's Information Sheet and submit it for staff
verification, step by step so the buyer isn't overwhelmed.

## Data
- **BIS** — \`GET/POST/PATCH /api/user-requirements/:pk/information-sheet/\` (model \`InformationSheet\`; co-borrower model \`CoborrowerInformationSheet\`).
- Supporting reference data: \`PurchaseReason\` (location / neighborhood / price / design / payment terms / amenities), "hear-from" sources, employment status.

## Steps
**Primary buyer** — 1) Personal details · 2) Spouse information · 3) Representative / employment · 4) General questions · 5) Review property · 6) Privacy statement & consent.
**Co-borrower / co-maker** (when applicable) — 7) Co-personal details · 8) Co-spouse · 9) Co-representative · 10) Co-general questions · 11) Co-privacy & consent.
Then a read-only **Summary** at \`…/information-sheet/summary\`.

## Layout
Inside the client shell:
1. **Page header** — breadcrumb (Requirements › Buyer's Information Sheet), title, step indicator.
2. **Stepper** — \`cds-stepper\` showing the steps and current position.
3. **Form card** — the current step's fields, grouped with \`cds-field-group\`, built from \`cds-form-field\` + \`cdsInput\`.
4. **Footer** — **Previous** / **Save & Next** (last step → **Confirm & submit**).

## Components (from \`@tactivph/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — client shell (Requirements active).
- \`cds-page-header\` + \`cds-breadcrumb\`.
- \`cds-stepper\` — the wizard steps.
- \`cds-card\` — the form surface.
- \`cds-field-group\` (\`legend\`, \`layout\`) — groups of fields.
- \`cds-form-field\` (\`label\`, \`hint\`, \`error\`, \`required\`) + \`input[cdsInput]\` / \`select[cdsInput]\` — each field.
- \`cds-button\` — Previous / Save & Next / Confirm & submit.

## States
- **Loading** — skeleton form.
- **Validation errors** — per-field \`error\` on \`cds-form-field\`; block Next until the step is valid.
- **Saving** — Next/Submit show \`loading\`; a draft PATCH persists progress.
- **Submitted** — advance to Summary; item status becomes "For Review".
- **For revision** — reopen with staff remarks surfaced near the relevant step.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Save & Next** | Validate + persist the step, advance. | \`PATCH /api/user-requirements/:pk/information-sheet/\` | next step route |
| **Previous** | Go back a step (no validation). | — | previous step route |
| **Confirm & submit** (last step) | Submit the whole sheet for verification. | \`POST /api/user-requirements/:pk/information-sheet/\` | \`…/information-sheet/summary\` |
| **Go back to requirements list** | Leave the wizard. | — | \`/client/requirements\` |

## Rules / validation
- Required fields per step enforced before advancing; show inline \`error\`.
- Co-borrower steps (7–11) appear only when a co-borrower is declared.
- Progress is saved as a draft so the buyer can resume.
- Privacy consent must be accepted before submit.

## Acceptance criteria
- [ ] Renders the stepper with the 6 primary steps (co-borrower steps when applicable) and current position.
- [ ] Each step's fields use \`cds-form-field\` + \`cdsInput\`, grouped with \`cds-field-group\`.
- [ ] Previous/Next navigate; Next validates and saves a draft; last step submits.
- [ ] On submit, routes to Summary and the requirement shows "For Review".
- [ ] Validation, saving, submitted and for-revision states behave as specified.
- [ ] Built only from Cadence components.

## Notes
- The Preliminary Loan Questionnaire (\`…/preliminary-loan\`) is the same wizard shape with 2 steps — reuse this composition.
- The Summary view is read-only and also shown to agent/staff as the "information-sheet summary".
`;
