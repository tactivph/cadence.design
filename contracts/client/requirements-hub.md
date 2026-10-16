# Client · Requirements hub

The buyer's home: the 12-stage requirements journey (Pre-reservation → Turnover),
with the forms to complete and documents to upload at each stage, each showing status.

| | |
|---|---|
| **Route** | `/client/requirements` (client home `/client/dashboard` redirects here) |
| **POV / access** | **Client (buyer).** Authenticated client session; scoped to the buyer's own contract. Behind the client shell + auth guard. |
| **Entry points** | Client home redirect · top-nav **Requirements** · notification deep links. |

## Purpose
Give the buyer one place to see what's required at each stage, complete forms,
upload documents, and track verification status toward homeownership.

## Data
- **Requirements** — `GET /api/clients/:user_id/contract-requirements/` → the 12 stages, each with its items.
- **Item detail** — `GET /api/user-requirements/:pk/`, `.../contract/`, `.../activities/`.
- Item kinds: **forms** (Buyer's Information Sheet, Preliminary Loan) and **document folders** (Quotation Sheet, Reservation Sheet, Proof of Payment, …). Published staff docs appear here too (`DocumentStatus = Published`).

## Layout
Inside the client shell, two columns:
1. **Page header** — title "Requirements", subtitle.
2. **Guidance banner** — `cds-alert variant="info"`: "Provide the required documents within the given timeframe…".
3. **Left rail** — the **12 stages** as a vertical list (`cds-stepper` vertical, or a stage list), each with its state and optional per-step timer/lock.
4. **Main panel** — the selected stage's items (list/grid): each item = title + kind + **status pill** + action (Open form / Upload / Download).

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — client shell (Requirements active).
- `cds-page-header`.
- `cds-alert variant="info"` — the guidance banner.
- `cds-stepper` — the 12-stage rail (vertical).
- `cds-card` — each requirement item row.
- `cds-status-badge kind="requirement"` — item status (Draft / Submission / For Review / Verified / For Revision).
- `cds-button` — Open form / Upload / Download / Request extension.
- `cds-empty-state` — a stage with no items yet.

## States
- **Loading** — skeleton rail + item rows.
- **Empty stage** — `cds-empty-state` "Nothing required in this stage yet".
- **Locked step** — item/stage shows a lock + countdown; actions disabled except **Request contract extension**.
- **For revision** — item pill danger + a "Resubmit" affordance.
- **Error** — `cds-alert variant="danger"` with Retry.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Stage (left rail)** | Select the stage; main panel shows its items. | — | stays |
| **Open form** | Open the BIS or Preliminary Loan wizard. | — | `/client/requirements/:userRequirementId/information-sheet` · `.../preliminary-loan` |
| **Upload** | Open the upload off-canvas and submit a document. | `PUT /api/user-requirements/:pk/upload/` | stays |
| **Download** | Download a published staff document. | — | file download |
| **Submit for verification** | Submit a completed item. | `PUT .../confirm-completion/` | stays |
| **Request contract extension** | Ask staff to extend a lapsing step. | `POST /api/contracts/:contract_pk/extensions/` | stays |
| **Confirm access** | Acknowledge a contract step. | `PUT /api/contracts/:contract/confirm-access/:pk/` | stays |

## Rules / validation
- Status pill always uses the `requirement` preset.
- Locked steps block their actions except the extension request.
- Uploads validate type/size (app-enforced) before `PUT …/upload/`.

## Acceptance criteria
- [ ] All 12 stages listed with per-stage state; selecting a stage shows its items.
- [ ] Each item shows its kind and a `requirement` status pill, with the right action (Open form / Upload / Download).
- [ ] Guidance banner present; locked steps offer Request-extension only.
- [ ] Forms route to the BIS / Preliminary Loan wizards; uploads open the off-canvas.
- [ ] Loading / empty / locked / for-revision / error states behave as specified.
- [ ] Built only from Cadence components.

## Notes
- Staff verify these items from `/staff/customers/clients/:clientId/requirements` — the same requirement model, verification side.
- The upload panel uses `cds-offcanvas` (app wires the file submit).
