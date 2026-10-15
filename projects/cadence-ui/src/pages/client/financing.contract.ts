/**
 * Page contract — Client · Financing (Matchmo bank pre-qualification).
 * Single source of truth; mirrored to contracts/client/financing.md.
 * The design system is presentational only — every endpoint/behaviour below is
 * the consuming app's responsibility.
 */
export const CONTRACT = `
# Client · Financing (Matchmo)

The buyer's bank / loan pre-qualification experience: discover the banks most
likely to approve them, apply, and track the application — organised as three
tabs **Choose a Bank**, **Apply** and **Application Status**.

| | |
|---|---|
| **Route** | \`/client/financing\` |
| **POV / access** | **Client (buyer).** Behind the client shell + auth guard; scoped to the signed-in buyer's own contract. Meaningful once the buyer's endorsement is approved. |
| **Entry points** | Client top-nav **Financing**. |

## Purpose
Help an approved buyer pre-qualify with recommended banks, select and apply to
one, and watch the application's progress through to approval.

## Data
- **Recommended banks** (Choose a Bank) — \`GET /api/financing/banks/\` (from \`MatchmoPrequalification\` + \`...Bank\`; the recommendation is triggered by \`POST /api/contracts/:pk/prequalify/\`).
- **Selected bank** persists so a revisit resumes at the application step: \`PUT /api/financing/banks/:pk/select/\`.
- **Bank-support options** to close an affordability gap (\`BankSupport\`): Add Co-Borrower/Co-Maker · Increase Downpayment · Use Personal Savings · Liquidate Assets · Family Financial Support.
- **Application status** — the submitted application's state (confirm endpoint).

## Layout
Inside the client shell (\`cds-top-nav\`, Financing active):
1. **Three-tab \`cds-tabs\`** across the top:
   - **Choose a Bank** — recommended-bank cards (each bank with its support options + Select and apply); empty state when none yet.
   - **Apply** — the application form for the selected bank.
   - **Application Status** — progress of the submitted application.
2. The built page shows the **Choose a Bank** empty state ("No bank recommendations yet" — recommendations appear once the endorsement is processed).

## Components (from \`@tactivstudios/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — client shell (Financing active); header bell icon + \`cds-avatar\`.
- \`cds-tabs\` + \`cds-tab\` — Choose a Bank / Apply / Application Status (each tab iconed).
- \`cds-empty-state\` — the pre-recommendation empty state on Choose a Bank.
- \`cds-avatar\` — header user.
- Bank cards, the application form controls and the status timeline will also need \`cds-card\`, \`button[cds-button]\`, \`cds-form-field\` + \`cds-input\`, \`cds-checkbox\` and \`cds-stepper\`/\`cds-status-badge\` for the populated states — see Notes.

## States
- **Loading** — tab bodies show skeletons (\`cds-skeleton\`); keep the shell + tabs.
- **Empty (no recommendations)** — Choose a Bank shows \`cds-empty-state\` ("No bank recommendations yet / Once your endorsement is processed, the banks most likely to approve you will appear here.").
- **Populated** — recommended-bank cards with support options and a **Select and apply** / **Selected** control.
- **Error** — \`cds-alert variant="danger"\` + Retry within the affected tab.
- **Not yet eligible** — tabs still render; messaging directs the buyer to complete endorsement first.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Select and apply** / **Selected** | Pick a recommended bank; the choice persists and advances to Apply. | \`PUT /api/financing/banks/:pk/select/\` | → **Apply** tab |
| **Choose a different bank** | Return to Choose a Bank to re-select. | — | → **Choose a Bank** tab |
| **Continue to application** | Proceed through the application; shows a *Saving…* state. | \`PUT /api/financing/banks/:pk/select/\` / submit (confirm) | → next step |
| **Submit application** | Submit the completed application. | \`POST\` application submit (confirm) | → **Application Status** tab |
| **Back to Billing** | Leave financing and return to billing. | — | billing route (confirm) |

## Rules / validation
- Recommendations only appear after the endorsement is processed (\`POST /api/contracts/:pk/prequalify/\`); until then Choose a Bank stays empty.
- The selected bank is saved so a revisit resumes at the application step — reflect the saved selection as **Selected** on return.
- Bank-support options model closing an affordability gap and must be surfaced per bank where applicable.

## Acceptance criteria
- [ ] Reachable from client top-nav **Financing**; scoped to the buyer's own contract.
- [ ] Three tabs render: Choose a Bank, Apply, Application Status.
- [ ] With no recommendations, Choose a Bank shows the \`cds-empty-state\` with the exact title/message.
- [ ] Selecting a bank persists via the select endpoint and advances to Apply; a revisit resumes at the saved step showing **Selected**.
- [ ] Loading / empty / populated / error states behave as specified.
- [ ] Built only from Cadence components (tabs, empty-state, avatar, and the card/form/button set for populated states).

## Notes
- The built mock is the **empty** Choose-a-Bank state only (tabs + \`cds-empty-state\`). The populated bank list, application form and status timeline are not yet composed; implementers must build them from \`cds-card\`, \`button[cds-button]\`, \`cds-form-field\`/\`cds-input\`, \`cds-checkbox\`, \`cds-stepper\` and \`cds-status-badge\`. **FLAG: populated tabs pending.**
- "Matchmo" is the pre-qualification engine behind \`/api/financing/*\`; the UI is bank-agnostic and driven by its recommendations.
`;
