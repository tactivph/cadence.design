# Staff · Processor dashboard

The processor's workload analytics: requirement-verification insights, average
verification time, peak visit times and scheduled visits, alongside counters and
work lists for pending verifications and visits.

| | |
|---|---|
| **Route** | `/staff/dashboard/processor` |
| **POV / access** | **Staff.** Requires an authenticated staff session whose role grants the processor dashboard resource. Behind the staff shell + auth guard; super-admins always see it. |
| **Entry points** | Top-nav **Dashboard ▾ → Processor**. |

## Purpose
Give processors (and their managers) a read on verification throughput and the
immediate queue of requirements and visits awaiting action.

## Data
Read-only analytics for the active date range (re-fetch on change):

- **Requirement verification insights** (verified requirements over time) — `GET /api/staffs/analytics/processor/*` (confirm exact path).
- **Average verification time** by requirement stage (Stage 1–6 donut) — `GET /api/staffs/analytics/processor/*` (confirm).
- **Peak visit times** heatmap (popular days/times for visits) — `GET /api/staffs/analytics/processor/*` (confirm).
- **Scheduled visits by date** (visits per day) — `GET /api/staffs/analytics/processor/*` (confirm).
- **Counters** — Verified today, For revision (awaiting resubmission), Pending verifications, Average verification time (days), Scheduled today, Incomplete.
- **Pending for verification** list — name + requirement type (Pre-reservation / Reservation / First Equity …).
- **Visits pending** list.

## Layout
Inside the staff shell (`cds-top-nav`):
1. **Page header** — title "Processor" with a right-aligned **Generate report** action.
2. **Two-column body** — left **analytics** column, right **sidebar**.
3. **Analytics** — a two-up row (*Requirement verification insights* line, *Average verification time* donut + Stage 1–6 legend), then *Peak visit times* heatmap, then *Scheduled visits by date* bars (y-axis "Number of visits").
4. **Sidebar** — a verification-counters card (Verified today / For revision / Pending / Average verification time), a schedule-counters card (Scheduled today / Incomplete), a **Pending for verification** list card (avatar + name + requirement type, open-list action), and a **Visits pending** card ("See more").

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]`, `cds-notif-bell`, `cds-user-chip` — shell.
- `cds-page-header` with `[cds-page-actions]`.
- `button[cds-button]` — **Generate report** (`variant="primary"`), the ghost open-list / **See more** actions.
- `cds-card` — every analytics chart host and every sidebar panel.
- `cds-stat-tile` — the six counters (`label`, `value`, `delta`).
- `cds-avatar` — people in the Pending-for-verification list.

## States
- **Loading** — chart bodies and tiles show skeletons (`cds-skeleton`); keep shell + header.
- **Empty** — counters read `0`; the Pending / Visits lists show an empty state ("No pending verifications", "0 Visits pending").
- **Error** — replace the affected card body with `cds-alert variant="danger"` + Retry; other cards stay independent.
- **Permission denied** — route guard redirects; nav item hidden.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Generate report** | Export the processor dashboard for the active range; loading state then download. | `GET /api/staffs/analytics/processor/generate-report` (confirm) | triggers download |
| **Open list** (↗ on a card) | Jump to the full queue behind the widget. | — | `/staff/requests/processor` |
| **Pending row** | Open that submission to verify. | — | `/staff/requests/processor/:id` |
| **See more** (Visits pending) | Expand the full visits list. | — | stays / `/staff/calendar` |

## Rules / validation
- Date range: *from* ≤ *to*; disable **Generate report** while a fetch is in flight.
- Counters and charts share the active range; the page is read-only — nothing is mutated here.
- The dashboard is distinct from the **Processor queue** (`/staff/requests/processor`), which is the actionable work list.

## Acceptance criteria
- [ ] Reachable via Dashboard ▾ → Processor; gated by the processor dashboard resource.
- [ ] Shows the four analytics regions (verification insights, average verification time Stage 1–6, peak visit times, scheduled visits by date) and the six counters.
- [ ] Pending-for-verification list shows avatar + name + requirement type; open-list/row actions route to the processor queue.
- [ ] **Generate report** shows a loading state and produces a file for the active range.
- [ ] Loading / empty / error / permission-denied states behave as specified.
- [ ] Built only from Cadence components; no bespoke buttons/cards/tiles.

## Notes
- The four visualisations (line, donut, heatmap, bars) have **no matching cds-* chart component**. The built page renders each chart body as a neutral placeholder inside `cds-card` while reproducing the titles, descriptions, axis and legend labels; the app owns the chart. **MISSING COMPONENT: charting.**
- Shares the **Generate report** header pattern with the other staff dashboards — reuse that composition.
