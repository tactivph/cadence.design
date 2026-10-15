/**
 * Page contract — Client · Pre-reservation stage.
 * Single source of truth; mirrored to contracts/client/pre-reservation.md.
 * Design system is presentational only — endpoints/behaviour are the app's job.
 */
export const CONTRACT = `
# Client · Pre-reservation stage

The buyer's requirements journey focused on the first stage: a vertical stepper rail
of all 12 stages plus the Pre-reservation requirement rows (forms to fill, documents
to upload), each showing its status.

| | |
|---|---|
| **Route** | \`/client/requirements/pre-reservation\` (sub-view of \`/client/requirements\`) |
| **POV / access** | **Client (buyer).** Authenticated client session; scoped to the buyer's own contract. Behind the client shell + auth guard. |
| **Entry points** | Requirements hub → Pre-reservation stage in the rail · client home redirect · notification deep links. |

## Purpose
Let the buyer see and complete everything required at the Pre-reservation stage —
Buyer's Information Sheet, Preliminary Loan Questionnaire, and the supporting document
folders — and submit the stage for verification.

## Data
- **Requirements** — \`GET /api/clients/:user_id/contract-requirements/\` → the 12 stages; this view renders the Pre-reservation stage's items.
- **Item detail** — \`GET /api/user-requirements/:pk/\`, \`.../contract/\`, \`.../activities/\`.
- **Project / unit header** — development + unit (project name, block/lot) from the buyer's contract \`(confirm)\`.
- Item kinds: **forms** (Buyer's Information Sheet, Preliminary Loan Questionnaire) and **document folders** (Quotation Sheet, Reservation Sheet, Proof of Payment). Published staff docs appear here too (\`DocumentStatus = Published\`).
- Item states inline: No submission yet / Set for submission / Pending / For revision / Verified.

## Layout
Inside the client shell:
1. **Project hero** — eyebrow + project name (e.g. "Townscapes Malvar") with a \`cds-badge\` for the assigned unit (Block/Lot).
2. **Two-column layout**:
   - **Left rail** — \`cds-stepper\` (vertical), the 12 stages with Pre-reservation current.
   - **Main panel** — \`cds-card\` titled "Pre-reservation Requirements (To be filled by 'You')" with a **Submit for verification** button + grid/list view toggles, then the requirement rows (icon · title · status badge · open/chevron cue).

## Components (from \`@tactivstudios/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — client shell (Requirements active).
- \`cds-notif-bell\` · \`cds-user-chip\` — header actions.
- \`cds-badge\` — unit badge in hero + per-row status pill (neutral / info tones).
- \`cds-stepper\` (vertical, clickable) — the 12-stage rail.
- \`cds-card\` — the requirements panel container.
- \`cds-button\` — Submit for verification; Open form / Upload actions.
- *(Icon buttons for grid/list view toggle are plain styled buttons — no dedicated \`cds-*\` exists; flagged.)*

## States
- **Loading** — skeleton rail + rows.
- **Empty stage** — "Nothing required in this stage yet" (use \`cds-empty-state\`).
- **Locked step** — rail step + rows show lock/countdown; actions disabled except **Request contract extension**.
- **For revision** — row status pill danger + a Resubmit affordance.
- **Error** — \`cds-alert variant="danger"\` with Retry.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Stage (rail)** | Select another stage. | — | \`/client/requirements\` (stage view) |
| **Open form (BIS)** | Open the Buyer's Information Sheet wizard. | — | \`/client/requirements/:userRequirementId/information-sheet\` |
| **Open form (Preliminary Loan)** | Open the Preliminary Loan wizard. | — | \`/client/requirements/:userRequirementId/preliminary-loan\` |
| **Open folder (chevron)** | Open a document folder / upload off-canvas. | \`PUT /api/user-requirements/:pk/upload/\` | stays |
| **Download** | Download a published staff document. | — | file download |
| **Submit for verification** | Submit completed stage items. | \`PUT /api/user-requirements/:pk/confirm-completion/\` | stays |
| **Request contract extension** | Ask staff to extend a lapsing step. | \`POST /api/contracts/:contract_pk/extensions/\` | stays |
| **Confirm access** | Acknowledge a contract step. | \`PUT /api/contracts/:contract/confirm-access/:pk/\` | stays |

## Rules / validation
- **Submit for verification** is disabled until the stage's required items are complete.
- Status pill tone follows item state (No submission yet = neutral, Set for submission = info).
- Locked steps block their actions except the extension request.
- Uploads validate type/size (app-enforced) before \`PUT …/upload/\`.

## Acceptance criteria
- [ ] All 12 stages appear in the vertical stepper with Pre-reservation current.
- [ ] The five Pre-reservation items render with the correct icon, title, status pill, and open/chevron cue.
- [ ] BIS and Preliminary Loan rows route to their wizards; folder rows open the upload off-canvas.
- [ ] Submit-for-verification is gated on completion and calls \`confirm-completion\`.
- [ ] Loading / empty / locked / for-revision / error states behave as specified.
- [ ] Built only from Cadence components.

## Notes
- This is the stage-scoped view of the Requirements hub (\`requirements-hub.contract.ts\`) — same requirement model, same endpoints.
- Grid/list view toggle has no dedicated Cadence component yet — flagged for the design system if it becomes a shared control.
`;
