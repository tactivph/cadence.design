/**
 * Page contract — Staff · Requests Processor (processor queue).
 * Single source of truth; mirrored to contracts/staff/requests-processor.md.
 * Design system is presentational only — endpoints/behaviour are the app's job.
 */
export const CONTRACT = `
# Staff · Processor

The processor's actionable work queue (distinct from the Processor *dashboard*):
client requirement submissions waiting to be verified, with a filter + search
toolbar. When nothing is pending the page is deliberately empty.

| | |
|---|---|
| **Route** | \`/staff/requests/processor\` |
| **POV / access** | **Staff (processor).** Requires resource \`requirements_approval\`. Behind the staff shell + auth guard. |
| **Entry points** | Top-nav **Processor** · Dashboard ▾ → Processor. Rows deep-link to the processor detail screen. |

## Purpose
Give the processor one place to pick up and action submitted client requirements —
moving each submission \`Submission → For Review → Approved/Rejected\`. The queue
clears itself as work is completed, so the empty state is the healthy state.

## Data
- **Processor queue** — \`GET /api/clients/processors/\` (paged; filterable + searchable).
- **Row detail** — \`GET /api/clients/processors/:pk/\`.
- **Filters** — \`GET /api/clients/processors/filters/\`.
- Row shape carries at least the client/lead, the requirement (type + stage), and its submission status — \`(confirm)\` exact fields against the API.

## Layout
Inside the staff shell:
1. **Top nav** — brand + \`a[cds-nav-item]\` (Processor active) + Admin ▾, notification bell, user chip.
2. **Page header** — \`cds-page-header\`: title "Processor"; right rail (\`cds-page-actions\`) = a filter button + a search input.
3. **Queue area** — the requirements table (rows → processor detail) in a tall, centred container; when empty it shows the empty state below.

## Components (from \`@tactivstudios/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` (\`hasCaret\`, \`active\`) — staff shell (Processor active).
- \`cds-notif-bell\` (\`count\`) + \`cds-user-chip\` (\`name\`, \`role\`) — header actions.
- \`cds-page-header\` (\`title\`, \`cds-page-actions\` slot) — title + toolbar.
- \`button[cds-button] variant="secondary"\` (\`iconLeft="ph ph-funnel"\`) — Filter.
- \`cds-input-group\` (\`cds-prefix\` search icon) wrapping \`cdsInput type="search"\` — Search.
- \`cds-empty-state\` (\`icon\`, \`title\`, \`message\`) — the "No pending requirements" state.
- The requirements table itself (\`cdsTable\` + header + pagination) is referenced for the populated state; the current mock renders only the empty state. Flag the table composition when the populated queue is built.

## States
- **Loading** — table shows skeleton rows while \`GET /api/clients/processors/\` resolves.
- **Empty (no pending)** — \`cds-empty-state\` centred in the tall queue area: icon \`ph-fill ph-file\`, title **"No pending requirements"**, message "Great work! This page clears as you complete processing requirements. Stay on top of tasks to keep it empty!". This is the live screen's default.
- **Empty (filtered)** — "No requirements match your filters" with a clear-filters affordance.
- **Error** — \`cds-alert variant="danger"\` with Retry (app-wired).
- **Denied** — users without \`requirements_approval\` are blocked by the resource guard.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Filter** | Open the filter controls for the queue. | \`GET /api/clients/processors/filters/\` then re-run the list | stays |
| **Search** | Search the queue by client/requirement. | re-run \`GET /api/clients/processors/\` with query | stays |
| **Row click** | Open the processor detail to verify the submission. | \`GET /api/clients/processors/:pk/\` | → \`/staff/requests/processor/:id\` |

## Rules / validation
- Access is gated on the \`requirements_approval\` resource; without it the route is denied.
- The queue is the actionable work list, **not** the Processor dashboard (\`/staff/dashboard/processor\`) — the two are distinct screens.
- Verification (\`Submission → For Review → Approved/Rejected\`) happens on the processor **detail** screen, not in this list.
- The empty state is expected steady-state when no requirements are pending.

## Acceptance criteria
- [ ] Page header reads "Processor" with a filter button + search input in the actions slot.
- [ ] Empty state renders with icon \`ph-fill ph-file\`, title "No pending requirements", and the "Great work!…" message, centred in a tall queue area.
- [ ] Populated queue loads from \`GET /api/clients/processors/\`; filter uses \`.../filters/\`; a row opens \`/staff/requests/processor/:id\` via \`.../:pk/\`.
- [ ] Loading / empty (no pending) / empty (filtered) / error / denied states behave as specified.
- [ ] Access requires the \`requirements_approval\` resource.
- [ ] Built only from Cadence components (top-nav, nav-item, page-header, button, input-group, input, empty-state, notif-bell, user-chip).

## Notes
- Concept 04 §4.5: the processor queue, distinct from the Processor dashboard (§4.1.4).
- The processor detail (\`/staff/requests/processor/:id\`) and the client requirements screen (§4.4) are pages of their own.
- Row/table fields are inferred — marked \`(confirm)\`; confirm the row shape against \`GET /api/clients/processors/\` when building the populated state.
`;
