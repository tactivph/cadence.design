# Staff · Approvals

The staff approval queue. Two checks live here, each on its own tab: verifying
the figures on broker-submitted eligibility calculations, and confirming
reservation endorsements once the buyer's reservation fee is paid.

| | |
|---|---|
| **Route** | `/staff/approvals` |
| **POV / access** | **Staff.** Requires resource `manage_endorsement_request`. Behind the staff shell + auth guard. |
| **Entry points** | Top-nav **Approval**. Rows deep-link to the verify screen. |

## Purpose
Give staff one place to action the two gates in the sale: approve the broker's
calculation, then confirm the reservation — moving the contract
`Endorsed → Reserved Buyer` and activating the client + requirements pipeline.

## Data
- **Endorsement requests** — `GET /api/endorsement-requests/` (paged, filterable,
  searchable by lead/reference/broker/unit). Split across two tabs by state.
- **Calculations** tab — broker-submitted calculations **awaiting review**.
  Columns: **Lead** (avatar + name) · **Property** · **Submitted by** (broker) ·
  **Submitted** · **Status**.
- **Endorsements** tab — reservations to **confirm** once the reservation fee is paid.
- Header counters: *N calculations to verify*, *N endorsements to confirm*.

## Layout
Inside the staff shell:
1. **Page header** — title "Approvals" + subtitle; right rail = two **stat tiles**
   (calculations to verify / endorsements to confirm).
2. **Tabs** — **Calculations** (with count) and **Endorsements** (with count).
3. Per tab: a **toolbar** (an "N awaiting review" badge on the left; a filter button +
   search on the right) over the data table, with footer pagination.

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — shell (Approval active); `cds-notif-bell`, `cds-user-chip`.
- `cds-page-header` with `[cds-page-actions]`.
- `cds-stat-tile` — the two header counters.
- `cds-tabs` + `cds-tab [count]` — the two tabs.
- `cds-status-badge` (tone="warning"/"success") — the "awaiting review" badge and row Status.
- `button[cds-button]` — filter (secondary-neutral, icon-only).
- `cds-input-group` + `input[cdsInput]` — search.
- `cds-avatar` — Lead and Submitted-by cells.
- `table[cdsTable]` + `cds-table-header`; `cds-table-pagination` — footer.

## States
- **Loading** — table shows a spinner/skeleton; keep the toolbar visible.
- **Empty (no requests)** — empty slot "Nothing to review" per tab.
- **Empty (no matches)** — "No requests match your filters" + Clear-filters.
- **Error** — `cds-alert variant="danger"` with Retry.
- **Permission denied** — guard redirects; nav item hidden.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Row click (Calculations)** | Open **Verify endorsement calculation**. | — | `/staff/approvals/:id` |
| **Approve calculation** | Approve the computed figures. | `PUT /api/endorsement-requests/:id/change-status/` | stays / detail |
| **Verify & endorse** / **Confirm** (Endorsements) | Confirm the reservation (shows *Endorsing…*). | `PUT /api/endorsement-requests/:id/change-status/` | stays / detail |
| **Decline** | Decline the request. | `PUT /api/endorsement-requests/:id/change-status/` | stays / detail |
| **Tab switch** | Toggle Calculations ↔ Endorsements. | re-run `GET /api/endorsement-requests/` | stays |
| **Filters** | Filter the list. | re-run `GET /api/endorsement-requests/` | stays |
| **Search** | Debounced lead/reference/broker/unit search. | `GET /api/endorsement-requests/?search=` | stays |
| **Pagination** | Change page / size. | `GET /api/endorsement-requests/?page=` | stays |

## Rules / validation
- Search is debounced (~300ms) and resets paging to page 1.
- Row/badge Status uses `cds-status-badge` tones; never hand-roll colours.
- A request appears in **Endorsements** only once the reservation fee is paid.
- Approving with changed figures surfaces **Approve with conditions / adjustments** on the
  detail screen (out of scope for this list).

## Acceptance criteria
- [ ] Reachable from top-nav **Approval**; gated by `manage_endorsement_request`.
- [ ] Two tabs with live counts; header stat tiles mirror the counts.
- [ ] Calculations columns: Lead, Property, Submitted by, Submitted, Status.
- [ ] Row (Calculations) opens `/staff/approvals/:id`.
- [ ] Filter + search re-query and reset paging; pagination works.
- [ ] Loading / empty / no-match / error states behave as specified.
- [ ] Built only from Cadence components.

## Notes
- The **Endorsements** tab currently renders only the "awaiting review" badge in the mock;
  the real tab reuses the same data-table + toolbar composition as Calculations with its
  own columns. **Flag.**
