/**
 * Page contract — Staff · Eligibility Calculator.
 * Single source of truth; mirrored to contracts/staff/eligibility-calculator.md.
 * Design system is presentational only — endpoints/behaviour are the app's job.
 */
export const CONTRACT = `
# Staff · Eligibility Calculator

The standalone eligibility / amortization calculator: pick one or more units
via a cascading property selector, choose a financing scheme, and compute the
indicative monthly equity & loan amortization. Same tool the agent uses to endorse.

| | |
|---|---|
| **Route** | \`/staff/eligibility-calculator\` |
| **POV / access** | **Staff.** Behind the staff shell + auth guard; nav item **Calculator**. |
| **Entry points** | Top-nav **Calculator**. (Same calculator composition the agent uses when endorsing a lead.) |

## Purpose
Let staff build a property selection and run a financing-scheme computation to
preview a buyer's eligibility and amortization before endorsement.

## Data
- **Cascading option lookups** (Step 1) — \`GET /api/developments/project-options/\`, \`.../house-types/\`, \`.../product-offerings/\`, \`.../units/\` (each level narrows the next: Site → Project → House Type → Product Offering → Finish Type → Unit).
- **Loan computation** (Step 2 output) — \`GET /api/properties/:pk/loan-computation/\` and \`/api/leads/:lead_id/eligibility-calculators/*\` (monthly equity & loan amortization — indicative).
- Form state: the selected property list (units; all must belong to the same project) and the chosen financing scheme.

## Layout
Inside the staff shell:
1. **Top nav** — staff nav (Calculator active) + \`cds-notif-bell\` + \`cds-user-chip\`.
2. **Page header** — title "Eligibility Calculator", subtitle, and a **Reset** action.
3. **Two-column body**:
   - **Left (main)**:
     - **Step 1 · Property Selection** — numbered \`cds-card\`: a 2-up grid of cascading dropdown fields (Site, Project, House Type, Product Offering, Finish Type, Unit), an **Add property** row with a helper note, an **info alert** ("All units in one transaction must belong to the same project"), the **Property list** (empty state until a unit is added), and a footer with unit count + running total.
     - **Step 2 · Financing Scheme** — numbered \`cds-card\`: a grid of selectable scheme option cards (Spot Cash · Deferred Cash with/without DP · In-House Financing · HDMF/Pag-IBIG · Bank Financing).
   - **Right (side)** — **Remarks** \`cds-card\`: Miscellaneous Fee + buyer-borne charges disclaimers and the indicative-computation note.

## Components (from \`@tactivstudios/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — shell (Calculator active).
- \`cds-notif-bell\` + \`cds-user-chip\` — header actions.
- \`cds-page-header\` (\`title\`, \`subtitle\`) with \`[cds-page-actions]\` — header + Reset.
- \`cds-card\` with \`[cds-card-header]\` / \`[cds-card-footer]\` slots — the two numbered steps + remarks + scheme option cards (\`interactive\`).
- \`cds-form-field\` (\`label\`) — each property selector field.
- \`cds-dropdown\` with a \`[cds-dropdown-trigger]\` \`button[cds-button]\` — the cascading selects.
- \`button[cds-button]\` — Reset (secondary), **Add property** (secondary).
- \`cds-alert\` (\`variant="info"\`) — the same-project constraint note.
- \`cds-empty-state\` — "No property selected" placeholder for the property list.

## States
- **Loading** — option lookups resolving: dropdowns disabled / show loading; computation pending after scheme selection.
- **Empty (no property)** — property list shows \`cds-empty-state\` "No property selected"; footer reads "0 unit(s) selected · Total: ₱ 0.00".
- **Error** — \`cds-alert variant="danger"\` on lookup / computation failure with Retry (app-wired).
- **Constraint** — info \`cds-alert\`: all units in one transaction must belong to the same project (blocks adding a unit from another project).
- **Computed** — once a unit + scheme are chosen, the result shows the indicative monthly equity & loan amortization.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Site / Project / House Type / Product Offering / Finish Type / Unit** (\`cds-dropdown\`) | Cascading selection; each choice narrows the next lookup. | \`GET /api/developments/project-options/\`, \`.../house-types/\`, \`.../product-offerings/\`, \`.../units/\` | stays |
| **Add property** | Add the selected unit to the property list (same-project only). | — (form state; triggers computation) | stays |
| **Financing scheme card** | Select the scheme to compute against. | \`GET /api/properties/:pk/loan-computation/\` (+ \`/api/leads/:lead_id/eligibility-calculators/*\`) (confirm) | stays |
| **Reset** | Clear property selection + scheme back to empty. | — | stays |

## Rules / validation
- Property selection is a cascade — a later field is enabled only once its parent is chosen.
- **All units in one transaction must belong to the same project** (enforced on Add property; surfaced via the info alert).
- Computation output is **indicative only** and subject to change at loan take-out (per the Remarks disclaimer); never presented as final figures.
- Footer total reflects the current property list; empty list shows ₱ 0.00 / 0 units.

## Acceptance criteria
- [ ] Reachable from top-nav **Calculator**; behind the staff shell.
- [ ] Step 1 renders the cascading property selector (Site → Project → House Type → Product Offering → Finish Type → Unit) with \`cds-form-field\` + \`cds-dropdown\`, an **Add property** action, the same-project **info \`cds-alert\`**, and a property-list empty state + count/total footer.
- [ ] Step 2 renders the six financing-scheme option cards (\`cds-card [interactive]\`); selecting one drives the computation.
- [ ] Right rail is a Remarks \`cds-card\` with the MF / buyer-borne / indicative disclaimers.
- [ ] **Reset** clears selection + scheme; Add property enforces same-project.
- [ ] Loading / empty / error / constraint / computed states behave as specified.
- [ ] Built only from Cadence components (top-nav, nav-item, page-header, card, form-field, dropdown, button, alert, empty-state, notif-bell, user-chip).

## Notes
- Same calculator composition the agent uses to endorse a lead — reuse this contract for the agent variant, swapping the lead-scoped endpoint (\`/api/leads/:lead_id/eligibility-calculators/*\`).
- Option-lookup and loan-computation endpoints are from the concept audit; confirm the exact cascade params (which lookup takes which parent id) and the computation request/response shape against the API.
`;
