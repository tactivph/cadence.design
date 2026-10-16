# Staff · Leads list

The staff-wide register of every lead across all brokers (vs. the agent's own
list), with progress, temperature, status and drill-in to each lead's detail.

| | |
|---|---|
| **Route** | `/staff/customers/leads` |
| **POV / access** | **Staff.** Requires resource `manage_lead`. Behind the staff shell + auth guard. |
| **Entry points** | Top-nav **Leads**. Rows deep-link to lead detail. |

## Purpose
Let staff find any lead across the whole broker network, read its progress and
temperature at a glance, and open the record to continue the sale.

## Data
- **Leads** — `GET /api/leads/` (paged, filterable, searchable). Columns: favourite,
  Lead ID, Name, **Lead Progress** (pipeline stage), **Status** (client-category),
  Mobile Number, **Lead Temperature** (hot/warm/cold/dormant), Email,
  **Enrolled by** (broker — not "You"), **CAS Expiry**.
- Filters feed query params (broker, project, status); search matches name/email/mobile.

## Layout
Inside the staff shell:
1. **Row 1** — title "Leads" with an **Export** action on the right.
2. **Row 2** — hint note ("Once status is \\"Signed CAS\\", open the lead to continue.")
   on the left; a filter icon-button and a search field on the right.
3. **Data table** — rows with favourite star, progress tag, status badge, temperature
   chip, the enrolling broker (avatar + name) and a row chevron.
4. Footer pagination.

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — shell (Leads active); `cds-notif-bell`, `cds-user-chip`.
- `button[cds-button]` — **Export** (ghost-neutral).
- `table[cdsTable]` + `cds-table-header` — the table + column header row.
- `cds-lead-progress-tag [code]` — the Lead Progress cell.
- `cds-status-badge kind="client-category"` — the Status pill.
- `cds-lead-temperature [level]` — the temperature chip.
- `cds-table-pagination` — footer.

## States
- **Loading** — table shows a spinner/skeleton; keep the toolbar visible.
- **Empty (no leads)** — empty slot "No leads yet" with a neutral icon.
- **Empty (no matches)** — "No leads match your filters" + a Clear-filters action.
- **Error** — `cds-alert variant="danger"` above the table with Retry.
- **Permission denied** — guard redirects; nav item hidden.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Row click** | Open the lead record. | — | `/staff/customers/leads/:id` |
| **Export** | Export the (filtered) leads. | `GET /api/leads/export/` | stays (file download) |
| **Filters** | Filter the list (broker / project / status). | re-run `GET /api/leads/` | stays |
| **Search** | Debounced name/email/mobile search. | `GET /api/leads/?search=` | stays |
| **Favourite** (star) | Toggle the lead as a favourite. | `PUT /api/users/lead/favorite/` (confirm) | stays |
| **Pagination** | Change page / size. | `GET /api/leads/?page=` | stays |

## Rules / validation
- Search is debounced (~300ms) and resets paging to page 1.
- **Enrolled by** shows the broker name (staff scope), never "You".
- Lead Progress, Status and Temperature are rendered via their presets
  (`cds-lead-progress-tag`, `cds-status-badge kind="client-category"`,
  `cds-lead-temperature`); never hand-roll colours.
- CAS Expiry renders a date or an em-dash when absent.
- Read-only list; no lead is mutated here beyond the favourite flag.

## Acceptance criteria
- [ ] Reachable from top-nav **Leads**; gated by `manage_lead`.
- [ ] Columns: favourite, ID, Name, Lead Progress, Status, Mobile, Temperature, Email, Enrolled by, CAS Expiry.
- [ ] Filter + search re-query and reset paging; pagination works.
- [ ] **Export** calls `/api/leads/export/`.
- [ ] Row opens `/staff/customers/leads/:id`.
- [ ] Loading / empty / no-match / error states behave as specified.
- [ ] Progress/Status/Temperature rendered with their Cadence presets; built only from Cadence components.

## Notes
- The current mock composes the Row-2 toolbar from a raw `<input type="search">` and a
  plain icon-button rather than `cds-input-group`/`cds-button` — the real page should use
  the Cadence filter-bar primitives for parity with the Clients list. **Flag.**
- The agent Leads list (`/agent/leads`) is the same table scoped to one broker — reuse this composition.
