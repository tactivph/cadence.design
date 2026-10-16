# Staff · Customer requirements (verification workspace)

The staff verification workspace for one client's contract: the 12-stage requirement
folders, the documents inside each, and the actions that verify, confirm and advance a
buyer through the home-buying journey.

| | |
|---|---|
| **Route** | `/staff/customers/clients/:clientId/requirements` (root) · `…/requirements/:userRequirementId` (internal requirement view) · `…/requirements/:userRequirementId/information-sheet/summary` · `…/requirements/:userRequirementId/preliminary-loan/summary` · `…/requirements/:contractId/cancel-reservation` · processor mirror `/staff/requests/processor/:id…` (same workspace, `requirements_approval`). |
| **POV / access** | **Staff.** Client route guarded by resource `manage_client`; processor mirror by `requirements_approval`. Cancel reservation requires `requirements_approval` (`update`) via `RbacPermission` on the API. Behind the staff shell + auth guard. |
| **Entry points** | Clients list row → client detail → Requirements · Processor list row (`/staff/requests/processor/:id`) · notifications linking to `/staff/requests/processor/:clientId`. |

## Purpose
Let staff review each requirement folder a buyer submits, verify or send back every
document, confirm access where a stage is gated, publish internal documents, and move
the contract to the next stage. Stages are sequential: the next folder opens only when the
previous one is verified. The page shows the active stage and its documents; the timeline
shows all 12 stages.

## Data
- **Contract requirements** — `GET /api/clients/:userId/contract-requirements/` (optional `?contract_id=`). Returns `contract`, `extension`, and `contract_requirements` ordered by `category__step`. Each folder carries `category` (`name`, `step`, `is_internal`, `requires_confirmation`), `confirmed_at`, `is_all_verified`, and `user_requirements[]` (`id`, `requirement`, `requirement_name`, `requirement_type` `document|form`, `current_status`, `is_internal`, `published_count`).
- **Processor header** — `GET /api/clients/processors/:id/` (requests mirror) or `GET /api/clients/:id/` (client route).
- **Activity** — `GET /api/clients/user-requirements/:id/activities/` (internal view).
- **Remarks** — `GET /api/clients/user-requirements/:id/remarks/`.
- Contract `current_status` drives read-only mode: `terminated` or `expired` sets read-only.
- Each `user_requirement` is a document (opens review offcanvas) or a form (BIS / preliminary loan summaries).

## Layout
Inside the staff shell:
1. **Breadcrumb** — Clients › {Client name} › Requirements (back via `back(2)` / `back(1)`).
2. **Client header** — avatar, name, `pdo-lead-tag` status, tabs **Requirements** · **Property feed**.
3. **Status toast** — endorsed/reserved: "pending for approval" + *View endorsement summary*; otherwise a hint to provide documents on time. Homeowner shows "Homebuying requirements are complete".
4. **Lock banner** — `days_left` and "Complete submission before {date}" while `latest_locked_in_period` is set (copy changes at step ≥3).
5. **Stage timeline (sidecard)** — the 12 folders from `contract_requirements`, each with `current` (in active set), `active` (selected) and `verified` (`is_all_verified`) state. Click selects the folder.
6. **Stage panel** — heading (`category.name`), *Verify Requirements* button, grid/list toggle; then the folder's `user_requirements` as rows or tiles with status badge and internal-document count.
7. **Confirm-access overlay** — when the active stage `requires_confirmation` and is not yet confirmed (step ≥3), the stage panel is covered by the Confirm Access modal.
8. **Property feed tab** — `pdo-property-feed` for the contract.

### Stage table (12 stages)
Names and flags come from the `RequirementCategory` seed (`clients/fixtures/clients__requirement_categories.json`). Live flags (`is_internal`, `requires_confirmation`) must be confirmed against the database.

| # | Stage (category name) | Step | Category id | Internal | Requires confirmation | Staff does | Opens next on verify |
|---|---|---|---|---|---|---|---|
| 1 | Pre-reservation requirements | 1 | 1 | no | no | Review documents; Verify Requirements. | Step 2 · status → `reserved_buyer`; Matchmo pre-qualification if bank financing. |
| 2 | Reservation requirements | 2 | 2 | no | no | Review; Verify Requirements. **Reservation is confirmed automatically** on verify (no separate confirm). | Steps 3 + 4 · `locked_in_period` set (30 days, 60 for OFW); step 10 removed for bank / in-house / direct payment. |
| 3 | First Equity | 3 | 11 | no | no | Review; Verify Requirements. | Step 5 only once step 4 is also verified. |
| 4 | Full document compliance (FDC) | 4 | 3 | no | no | Review; Verify Requirements. | Step 5 only once step 3 is also verified. |
| 5 | HCR Requirements | 5 | 4 | yes | yes | Confirm access; upload internal docs; publish; Confirm Completion per requirement. | Step 6 · status → `seasoning_buyer`. |
| 6 | HCR approval documents | 6 | 10 | yes | no | Upload internal docs; publish; Confirm Completion. | Step 7 (see note N6). |
| 7 | Resubmission of BIS | 7 | 5 | no | yes | Confirm access (client notified "Resubmission of BIS is now open"); Verify Requirements after client resubmits. | Step 8 · status → `takeout_buyer`; `locked_in_period` 15 days. |
| 8 | Update of income requirements | 8 | 6 | no | no | Review; Verify Requirements. | Steps 9 + 10 (10 only for HDMF). |
| 9 | Loan documents signing & notary | 9 | 7 | yes | yes | Confirm access; internal uploads; publish; Confirm Completion. | Step 11 Booking. |
| 10 | Annotation | 10 | 8 | yes | yes | Confirm access; internal uploads; publish; Confirm Completion. Exists for HDMF only. | No handler (see N10). |
| 11 | Booking | 11 | 9 | yes | no | Internal uploads; publish; Confirm Completion. | No handler in code (see N11). |
| 12 | Turnover | 12 | 12 | yes | no | Internal uploads; publish. | No handler; homeowner set by `set_as_homeowner` (see N12). |

Steps 3 and 4 both open at reservation confirmation. Steps after 2 stay hidden from
`activeRequirements` until the reservation folder has `confirmed_at`.

### Per-document review (document rows)
- Clicking a document row opens the **review offcanvas** (`pdo-details`). Staff pick one action per document:
  - **Mark as verified** → `APPROVED`.
  - **Request to re-upload** → `REJECTED`, remarks required; buyer notified; activity logged.
  - Field-level remarks on forms set `REJECTED` even when approved.
- The review offcanvas is shown only when the document `current_status` is `for_review`.
- When the last document of a folder is approved, the backend advances the step automatically. The page then shows "Requirements are verified!" (not shown for steps 3 and 4).
- Form rows open the BIS summary or preliminary-loan summary for the user requirement.

### Internal folders (stages 5, 6, 9, 10, 11, 12)
- Internal requirements open the **internal requirement view** (`…/requirements/:userRequirementId`).
- Staff upload files, publish or unpublish each (published files are visible to the client), rename, and delete files while the requirement is editable.
- **Confirm Completion** (needs ≥1 published document and an editable requirement) sets the requirement `APPROVED` and writes an activity entry.
- Activity log lists uploads, publish/unpublish, renames, deletes and completions.

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — staff shell (Clients active).
- `cds-breadcrumb` (Clients › client › Requirements) — `(confirm DS)`.
- `cds-status-badge kind="client-status"` for the lead/status tag (`pdo-lead-tag` today) — `(confirm DS)` for the kind name.
- `cds-tabs` (Requirements · Property feed) — `(confirm DS)`.
- `cds-alert variant="info"` — status toast and lock banner.
- `cds-timeline` (12-stage sidecard, `current` / `active` / `verified`) — `(confirm DS)`.
- `cds-status-badge kind="requirement"` (per-document status, pdo `pdo-requirement-status`) — `(confirm DS)`.
- `button[cds-button]` — Verify Requirements, Confirm completion, Approve and proceed, Cancel reservation.
- `cds-modal` (Confirm access, Confirm completion, Cancel reservation) — `(confirm DS)`.
- `cds-offcanvas` (document review, internal requirement view) — `(confirm DS)`.
- `cds-file-list` (internal documents) and `cds-upload-files` — `(confirm DS)`.
- `cds-view-toggle` (grid / list) — `(confirm DS)`.
- `cds-empty-state` and `cds-skeleton` for loading — `(confirm DS)`.

## States
- **Loading** — timeline and rows show skeleton placeholders; header stays.
- **No contract** — `GET contract-requirements` returns 404 "Contract not found"; show empty state with a path back to Clients.
- **Read-only** — `terminated` or `expired` contract: no Verify, no review, no internal uploads; rows still open for viewing.
- **Verify failed** — `verify-all` returns 400 `Some requirements are not yet ready for approval`; show `cds-alert variant="danger"` with the server message.
- **Permission denied** — guard redirect; Cancel reservation button hidden without `requirements_approval` `update`.
- **Error loading client/processor** — toast "Unable to fetch processor details" and navigate back.
- **Network / 5xx** — `cds-alert variant="danger"` with Retry.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Verify Requirements** (non-internal, not verified, not read-only) | Approve every requirement in the folder and advance the step. | `PUT /api/clients/contract-requirements/:id/verify-all/` | stays; refetch |
| **Document row** (`for_review`) | Open the review offcanvas. | — | offcanvas |
| **Mark as verified / Request to re-upload** (in offcanvas) | Set the document status; remarks mandatory for re-upload. | `POST /api/clients/user-requirements/:id/remarks/` (`status` `approved`\|`rejected`) | stays |
| **Confirm access → Approve and proceed** | Confirm a gated stage (`confirmed_at`). | `PUT /api/clients/contracts/:contractId/confirm-access/:contractRequirementId/` | stays |
| **Confirm access → Cancel reservation** (RBAC `requirements_approval` update) | Opens the cancellation survey. | — | `…/requirements/:contractId/cancel-reservation` |
| **Cancel reservation → submit** | Terminate the contract with reason + remarks. | `POST /api/clients/contracts/:contractId/cancel/` | back to requirements; clients list when opened from clients |
| **Row (internal)** | Open the internal requirement view. | — | `…/requirements/:userRequirementId` |
| **Row (form BIS / preliminary loan)** | Open the summary. | — | `…/information-sheet/summary` · `…/preliminary-loan/summary` |
| **Upload file (internal)** | Add documents to an internal requirement. | `POST /api/clients/user-requirements/:id/internal-upload/` | stays |
| **Publish / Unpublish** | Toggle client visibility of one document. | `PUT /api/clients/user-requirements/:id/internal-upload/:docId/publish/` | stays |
| **Rename / delete file** | Edit or delete an internal document. | `PUT` / `DELETE …/internal-upload/:docId/` | stays |
| **Confirm Completion** | Mark the internal requirement complete (irreversible). | `PUT /api/clients/user-requirements/:id/confirm-completion/` | stays |
| **Grid / list toggle** | Change row layout. | — | stays |
| **Breadcrumb / back** | Return to clients list or processor list. | — | `../` |
| **View endorsement summary** | Open the endorsement offcanvas for the property. | — | offcanvas |

## Rules / validation
- Stages run in step order. A folder is verified only when every requirement is `approved` (`is_requirements_verified`).
- `verify-all` is rejected while any requirement has no submission (`Some requirements are not yet ready for approval.`).
- A document can be sent back only with remarks (`REJECTED`). Field remarks on a form force `REJECTED`.
- A requirement is editable unless it is `approved` or `for_review`, or the contract is `expired` or `terminated`.
- Stages with `requires_confirmation` at step ≥3 are blocked until confirmed. Steps 1 and 2 never show the gate.
- Confirm Completion needs ≥1 published document.
- Cancel reservation sets the contract to `terminated`; the reason must be one of the preset cancellation reasons (see `cancel-reservation` contract).
- Client-facing copy for the reservation: "The client has 30 days to submit the necessary documents and proceed."

## Acceptance criteria
- [ ] The route is guarded by `manage_client` (client route) or `requirements_approval` (processor mirror); unauthorised users are redirected.
- [ ] The timeline shows all 12 stages in step order, with `current`, `active` and `verified` states.
- [ ] Stages at step ≥3 stay hidden until the reservation folder is confirmed.
- [ ] Verify Requirements is shown only for non-internal, unverified folders when the contract is not read-only.
- [ ] A 400 from `verify-all` displays the server message in a danger alert and keeps the page usable.
- [ ] Clicking a `for_review` document opens the review offcanvas; re-upload requires remarks.
- [ ] A gated stage shows the confirm-access modal and cannot be worked until "Approve and proceed" succeeds.
- [ ] Confirm Completion is disabled until at least one document is published.
- [ ] Publish/unpublish updates the document state and the published count shown on the row.
- [ ] Cancel reservation is hidden without `requirements_approval` update, and submits the reason and remarks.
- [ ] Read-only contracts (`terminated`, `expired`) show no mutating controls.
- [ ] Built only from Cadence components (or marked `(confirm DS)`).
- [ ] **Security (OWASP A01):** every write endpoint behind this screen (`verify-all`, `confirm-access`, internal upload/publish/completion, remarks) enforces an RBAC resource. `(confirm)`: pdo currently applies only `IsAuthenticated` to these views; only `ContractCancellation` uses `RbacPermission`.

## Notes
- **N1 (stage flags)** The stage table uses the seed fixture. Confirm `is_internal` and `requires_confirmation` against the live database before implementing.
- **N2 (reservation)** Reservation confirmation is automatic on verifying stage 2. The old manual "Confirm reservation" action is gone.
- **N3 (confirm-access copy)** The modal reads "Credit and Collection: Please check completion of required equity payments" for every gated stage. `(confirm)` whether copy should vary by stage.
- **N4 (auto-advance)** Approving the last document in a folder advances the step on the server. Verify Requirements is a bulk alternative. `(confirm)` that the two paths cannot double-advance.
- **N5 (stage 5 confirm)** Stage 5 needs both stage 3 and stage 4 verified before it opens.
- **N6 (stage 6)** Confirm Completion on stage 6 sends the client notification but, per the serializer, does not call step advance. `(confirm)` whether stage 7 should open on completion or only on verify.
- **N7 (stage 7)** Confirm access on stage 7 emails and notifies the client "Resubmission of BIS is now open".
- **N8 (stage 8)** Stage 8 does not confirm its own folder on advance (commented out upstream). Leave as-is.
- **N9 (stage 9)** Confirm Completion on stage 9 also opens Booking for bank and direct-payment options.
- **N10 (stage 10)** Annotation has no step handler. `(confirm)` whether Booking should wait on it.
- **N11 (stages 11–12)** Booking and Turnover have no advance handler. `initialize_step12` has no caller in the backend. `(confirm)` the homeowner transition and where Turnover is opened.
- **N12 (homeowner)** The backend writes a "homeowner" activity log at stage 9 (before Booking completes), and `set_as_homeowner` is called from the completion path. `(confirm)` the intended trigger.
- **N13 (processor mirror)** The processor detail has a `goTo()` helper that navigates to `/staff/processor/…` (missing `/requests`). `(confirm)` whether it is dead code.
- **N14 (reservation child)** The processor `reservation` and `pre-reservation` child components render static placeholder rows (Buyer's guide, Proof of Payment). They are not wired to real requirements. `(confirm)`.
- **N15 (upload)** Internal uploads are authenticated-only on the API; file type and size are validated by the shared upload validators only if the serializer applies them. `(confirm)`.
