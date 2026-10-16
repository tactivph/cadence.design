# Staff · Calendar

A monthly calendar of site visits with status-colored day markers, plus a
right-rail Schedule panel for the selected date split into Incomplete /
Completed tabs.

| | |
|---|---|
| **Route** | `/staff/calendar` |
| **POV / access** | **Staff.** Requires resource `view_schedule`. Behind the staff shell + auth guard. |
| **Entry points** | Top-nav **Calendar**. Schedule entries deep-link to a visit's completion report. |

## Purpose
Let staff see site visits across the month at a glance and drill into a day's
schedule to track which visits are still incomplete versus completed.

## Data
- **Schedules** — `GET /api/schedules/*` (site visits for the visible month; each day cell is marked by visit status — e.g. warning / success dots).
- **Completion reports** — `GET /api/schedules/reports/*` (the per-visit report opened from a schedule entry).
- Month grid: weeks of day cells (leading/trailing days muted, today highlighted, status dots per day).
- Schedule panel: entries for the selected date, bucketed **Incomplete** / **Completed**.

## Layout
Inside the staff shell:
1. **Top nav** — staff nav (Calendar active) + `cds-notif-bell` + `cds-user-chip`.
2. **Two-column body**:
   - **Left — Calendar** — month header (current month + caret) with prev / **Today** / next controls, then the month grid (weekday row + week rows of day cells).
   - **Right — Schedule panel** — `cds-card` with the selected date, then `cds-tabs` (**Incomplete** / **Completed**), each showing its entries or an empty state.

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — shell (Calendar active).
- `cds-notif-bell` + `cds-user-chip` — header actions.
- `button[cds-button]` (`iconOnly` / `iconLeft`) — prev month, **Today**, next month.
- `cds-card` — the Schedule side panel.
- `cds-tabs` + `cds-tab` (`label`, `icon`) — Incomplete / Completed buckets.
- `cds-empty-state` (`icon`, `title`, `message`) — "Your schedule is free!" per tab.
- **Month grid** — layout placeholder only: there is **no `cds-*` calendar / month-grid component yet**, so the weekday row + day cells + status dots are plain markup. **Flag this as a MISSING COMPONENT** (calendar month-grid) for the design system.

## States
- **Loading** — show skeleton month grid / disabled nav while `GET /api/schedules/*` resolves.
- **Empty (day has no visits)** — per-tab `cds-empty-state`: "Your schedule is free!" / "No scheduled visits at the moment."
- **Error** — `cds-alert variant="danger"` with Retry (app-wired).
- **Permission denied** — guard redirects without `view_schedule`; nav item hidden.
- **Day markers** — status dots (e.g. warning / success) per day; today's number highlighted.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Prev / Next month** | Move the visible month; reload its visits. | re-run `GET /api/schedules/*` for the month | stays |
| **Today** | Jump back to the current month/date. | re-run `GET /api/schedules/*` | stays |
| **Day cell click** | Select the date; load its schedule into the right panel. | `GET /api/schedules/*` for the date | stays |
| **Incomplete / Completed tab** | Switch the schedule bucket for the selected date. | — (client filter) | stays |
| **View completion report** (from a schedule entry) | Open the visit's completion report. | `GET /api/schedules/reports/*` (confirm) | `/staff/calendar/:scheduleId/view-completion-report` |

## Rules / validation
- Day markers are driven by visit status for that date; today's cell is visually highlighted.
- Leading/trailing days from adjacent months render muted and are non-selectable (or select into their month).
- The Schedule panel always reflects the currently selected date.

## Acceptance criteria
- [ ] Reachable from top-nav **Calendar**; gated by `view_schedule`.
- [ ] Month header shows the current month with prev / **Today** / next controls (`cds-button`).
- [ ] Month grid renders weekday headers + week rows with muted adjacent-month days, a highlighted today, and status dots — noted as a layout placeholder (no `cds-*` month-grid).
- [ ] Right rail is a `cds-card` with `cds-tabs` Incomplete / Completed, each showing entries or a `cds-empty-state`.
- [ ] A schedule entry opens `/staff/calendar/:scheduleId/view-completion-report`.
- [ ] Loading / empty / error / denied states behave as specified.
- [ ] Built only from Cadence components (top-nav, nav-item, button, card, tabs, tab, empty-state, notif-bell, user-chip); the month-grid placeholder is flagged as a missing component.

## Notes
- **MISSING COMPONENT:** calendar month-grid. The month grid is plain layout markup because no Cadence calendar component exists yet; every other region maps to a `cds-*`. If a month-grid is added to the design system, swap it in here.
- Schedule + completion-report endpoints (`/api/schedules/*`, `/api/schedules/reports/*`) are from the concept audit; confirm the exact query params for month / date scoping.
