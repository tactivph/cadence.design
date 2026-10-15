# Agent · Analytics dashboard

The agent's performance view: pipeline funnels plus reservations, distribution,
top-selling and revenue visuals for a chosen date range — the second tab of the
agent Dashboard (after Status board, before Visit schedules).

| | |
|---|---|
| **Route** | `/agent/dashboard/analytics` |
| **POV / access** | **Agent (broker / seller).** Behind the agent shell + auth guard; scoped to the signed-in agent's own pipeline. |
| **Entry points** | Agent Dashboard → **Analytics** tab (Dashboard ▾ in top-nav; Status board / Analytics / Visit schedules tabs). |

## Purpose
Give an agent a period-over-period read on how their leads move through the
pipeline and which properties and reservations are converting, with a report
export.

## Data
Read-only. Everything loads for the active date range (default
`Last 285 days: Jan 1, 2026 → Oct 13, 2026`) and re-fetches when the range changes:

- **Leads Pipeline Funnel** — stages New Leads → Engaged & Qualified Prospect → Site Visit Scheduled → Site Visit Completed → Unit & Computation Finalized → Reserved, each with count + % conversion. `GET /api/analytics/*` (confirm exact path).
- **Buyer Requirements Pipeline Funnel** — reservation → homeowner; empty when no reserved buyers in the period. `GET /api/analytics/*` (confirm).
- **Property reservations over time** — Leads vs Reservation series. `GET /api/analytics/*` (confirm).
- **Client distribution** — customers segmented by category (Lead / Client / Homeowner). `GET /api/analytics/*` (confirm).
- **Top-selling properties** · **Sales revenue & units sold** — `GET /api/analytics/*` (confirm).

## Layout
Inside the agent shell (`cds-top-nav`):
1. **Page title** "Dashboard" and the three-tab `cds-tabs` (Status board / **Analytics** / Visit schedules).
2. **Analytics toolbar** — section title "Analytics", a date-range `cds-dropdown` trigger, right-aligned **Filters** and **Generate report** buttons.
3. **Row 1** — two equal `cds-card`s: *Leads Pipeline Funnel* (desc "From first contact to closed sale") and *Buyer Requirements Pipeline Funnel* (desc "From reservation to homeowner").
4. **Row 2** — *Property reservations over time* (Leads / Reservation legend) and *Client distribution* (desc "Customer segmented by categories").
5. **Row 3** — *Top-selling properties* and *Sales revenue & units sold*.

## Components (from `@tactivstudios/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — application shell (Dashboard active, with caret).
- `cds-notif-bell`, `cds-user-chip` — header actions.
- `cds-tabs` + `cds-tab` — the Status board / Analytics / Visit schedules switch.
- `cds-dropdown` + `button[cds-button]` (`cds-dropdown-trigger`) — date-range picker trigger.
- `button[cds-button]` — **Filters** (`variant="secondary"`, `iconLeft="ph ph-funnel"`) and **Generate report** (`variant="primary"`).
- `cds-card` — the six chart hosts (chart bodies are app-owned).
- `cds-empty-state` — the Buyer Requirements funnel empty state with an **Enroll a lead** action.

## States
- **Loading** — card bodies show skeletons (`cds-skeleton`); keep shell + toolbar visible.
- **Empty** (range / stage with no data) — funnel stages read `0 (0.0%)`; the Buyer Requirements card shows `cds-empty-state` ("No buyers in this period yet…") with **Enroll a lead**.
- **Error** — replace the affected card body with `cds-alert variant="danger"` + Retry `button[cds-button]`; other cards stay independent.
- **Permission denied** — route guard redirects; nav item hidden.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Date-range filter** (`cds-dropdown`) | Open the range picker; on apply re-fetch every analytics call for the new range; persist for the session. | drives the GETs above | stays |
| **Filters** | Open additional analytics filters (e.g. project); re-query on apply. | re-run `GET /api/analytics/*` (confirm) | stays |
| **Generate report** | Export the current dashboard for the active range; show a loading state until the file is ready, then download. | `GET /api/analytics/generate-report/` | triggers download |
| **Enroll a lead** (empty state) | Start manual enrollment. | — | `/agent/leads/add` |
| **Tab change** | Switch to Status board / Visit schedules. | — | `/agent/dashboard` · `/agent/dashboard/visit-schedules` |

## Rules / validation
- Date range: *from* ≤ *to*; default `Jan 1 → today`; disable **Generate report** while a fetch is in flight.
- Funnel percentages are computed against the first stage (New Leads = 100%); never hand-roll stage colours/order — follow the stage list above.
- The page is read-only; no entity is mutated here.

## Acceptance criteria
- [ ] Reachable as the **Analytics** tab of the agent Dashboard; scoped to the signed-in agent.
- [ ] Leads funnel shows all six stages with count + % conversion; Buyer Requirements funnel shows its empty state with **Enroll a lead** → `/agent/leads/add`.
- [ ] Changing the date range re-fetches and updates every card.
- [ ] **Generate report** shows a loading state and produces a file for the active range.
- [ ] Loading / empty / error / permission-denied states behave as specified.
- [ ] Built only from Cadence components; no bespoke buttons/cards/badges.

## Notes
- The funnel, time-series, distribution and revenue visuals have **no matching cds-* chart component**. The built page renders them as placeholders inside `cds-card` carrying the real section titles and (for the Leads funnel) stage labels/values; the app supplies the chart, Cadence supplies the frame + empty/skeleton states. **MISSING COMPONENT: funnel + charting.**
- Shares the date-range filter + **Generate report** header pattern with the staff dashboards — reuse that composition.
