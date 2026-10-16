# Agent · Eligibility Calculator

The agent's standalone eligibility / amortization calculator: pick one or more property
units, choose a financing scheme, and get an indicative monthly equity & loan amortization.
The same component the agent uses in-context to endorse a lead for reservation.

| | |
|---|---|
| **Route** | `/agent/eligibility-calculator` |
| **POV / access** | **Agent (broker/seller).** Authenticated agent session; behind the agent shell + auth guard. |
| **Entry points** | Top-nav **Calculator** · launched in-context from a lead to drive the endorsement (`/agent/leads/:id/income-calculator`, concept 05 §5.2.4). |

## Purpose
Let the agent compute an indicative financing breakdown for a prospect before endorsing —
cascading property selection, a financing scheme, and the resulting monthly equity & loan
amortization, with the standard PDO remarks on fees and charges.

## Data
- **Property option lookups** (cascading) — `GET /api/developments/project-options/`, `.../house-types/`, `.../product-offerings/`, `.../units/` (each narrowed by the prior selection). Site/Finish-type lookups (confirm).
- **Loan computation** — `GET /api/properties/:pk/loan-computation/` — the amortization/equity figures for a selected unit + scheme.
- **Calculator session** (added properties, phases, totals) — `/api/leads/:lead_id/eligibility-calculators/*` when launched from a lead; standalone (no lead) persistence (confirm).
- Scheme shape (`Scheme`): `title` · `desc`.
- Financing schemes: **Spot Cash** · **Deferred Cash (with DP)** · **Deferred Cash (without DP)** · **In-House Financing** · **HDMF / Pag-IBIG** · **Bank Financing**.

## Layout
Inside the agent shell:
1. **Top nav** — brand + `a[cds-nav-item]` (Calculator active) + help button, notification bell, user chip.
2. **Page header** — `h1` "Eligibility Calculator" + subtitle "Select the financing scheme for this assessment." + **Reset**.
3. **Two-column body** —
   - **Main (left)**:
     - **Step 1 — Property Selection** (`cds-card`): numbered step header; six `cds-form-field` selects — **Site**, **Project**, **House Type**, **Product Offering**, **Finish Type**, **Unit**; an **Add property** row with hint; an info `cds-alert` ("All units in one transaction must belong to the same project."); a **Property list** with `cds-empty-state` until a property is added; a card footer showing unit count + total.
     - **Step 2 — Financing Scheme** (`cds-card`): numbered step header + a grid of six interactive `cds-card` scheme tiles (title + description).
   - **Aside (right)**: **Remarks** `cds-card` — MF/buyer-borne-charges notes + sample-computation + indicative-only disclaimer.

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — agent shell (Calculator active).
- `cds-notif-bell` (`count`) + `cds-user-chip` (`name`, `role`, `src`) — shell header actions.
- `button[cds-button]` — **Reset** (secondary-neutral, `iconLeft`) and **Add property** (secondary-neutral).
- `cds-card` — the two step cards, the Remarks card, and (with `[interactive]`) the six financing-scheme tiles; `[cds-card-header]` / `[cds-card-footer]` for the step header + totals footer.
- `cds-form-field` (`label`) wrapping a native `select[cdsInput]` — the six cascading property selects.
- `cds-alert variant="info"` — the same-project constraint note.
- `cds-empty-state` (`icon`, `title`, `message`) — "No property selected" until a property is added.

## States
- **Loading (options)** — selects disabled / skeleton while option lookups resolve.
- **Empty (no property added)** — `cds-empty-state` "No property selected / Please choose a property to add to your list."; footer shows "0 unit(s) selected" and "Total: ₱ 0.00".
- **Error** — `cds-alert variant="danger"` with Retry (app-wired) if a lookup or computation fails.
- **Scheme selected** — the chosen scheme tile is active; computation is run for the selected unit(s) + scheme.
- **Reset** — clears selections, property list, chosen scheme, and totals back to the empty state.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Site / Project / House Type / Product Offering / Finish Type / Unit** | Cascading selects; each choice narrows the next. | re-run the matching `GET /api/developments/*-options` lookup | stays |
| **Add property** | Add the selected unit to the property list (multiple units allowed; must share one project). | `POST /api/leads/:lead_id/eligibility-calculators/` (confirm standalone shape) | stays |
| **Remove property** | Remove a unit from the list. | `DELETE /api/leads/:lead_id/eligibility-calculators/:id/` (confirm) | stays |
| **Financing scheme tile** | Select a scheme; compute indicative equity & amortization. | `GET /api/properties/:pk/loan-computation/` | stays |
| **Reset** | Clear all selections, list, scheme and totals. | `POST /api/leads/:lead_id/eligibility-calculators/reset/` (confirm) | stays |
| **Endorse / Submit to PDO** (in-context from a lead) | Validate eligibility + endorse to PDO. | `POST /api/leads/:pk/endorsement-requests/` | lead workspace (concept 05 §5.2.4) |

## Rules / validation
- **All units in one transaction must belong to the same project** — enforced before Add property (shown as the info alert).
- Selects are cascading: a downstream select is disabled/empty until its upstream selection is made.
- A financing scheme must be chosen to produce a computation; figures are **indicative only** and subject to change at loan take-out.
- Standalone use computes without a lead; the **Endorse / Submit to PDO** flow only exists when launched in-context from a lead (concept 05 §5.2.4).

## Acceptance criteria
- [ ] Page header shows "Eligibility Calculator", the subtitle, and a **Reset** action.
- [ ] Step 1 renders six cascading `cds-form-field` selects (Site, Project, House Type, Product Offering, Finish Type, Unit), an **Add property** row, the same-project `cds-alert variant="info"`, a Property list with `cds-empty-state`, and a footer with unit count + total.
- [ ] Step 2 renders six interactive `cds-card` scheme tiles: Spot Cash · Deferred Cash (with DP) · Deferred Cash (without DP) · In-House Financing · HDMF / Pag-IBIG · Bank Financing.
- [ ] Remarks aside renders the MF / buyer-borne-charges notes and the indicative-only disclaimer.
- [ ] Cascading selects query `/api/developments/*-options`; selecting a scheme calls `GET /api/properties/:pk/loan-computation/`; Reset clears to the empty state.
- [ ] Loading / empty / error states behave as specified.
- [ ] Built only from Cadence components (top-nav, nav-item, button, card + card-header/footer, form-field, input, alert, empty-state, notif-bell, user-chip).

## Notes
- Identical to the staff calculator (concept 04 §4.8); reuse this composition for `/staff/eligibility-calculator`.
- The full endorsement variant (Add phase / equity payment phases, Confirm & submit, Submit to PDO for Approval — concept 05 §5.2.4) is a richer superset rendered inside the lead workspace; this standalone page is the computation-only entry.
- Option-lookup query params, standalone persistence, Add/Remove/Reset shapes are marked (confirm) pending API audit.
