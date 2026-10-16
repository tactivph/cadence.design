/**
 * Page contract — Agent · Calendar.
 * Single source of truth; mirrored to contracts/agent/calendar.md.
 * Design system is presentational only — endpoints/behaviour are the app's job.
 */
export const CONTRACT = `
# Agent · Calendar

The agent's monthly site-visit calendar: a month grid of scheduled trippings on the
left and a day's schedule side panel on the right, with the ways to log and close out
visits.

| | |
|---|---|
| **Route** | \`/agent/calendar\` |
| **POV / access** | **Agent (broker/seller).** Authenticated agent session; scoped to the agent's own schedules (a broker also sees their team's). Behind the agent shell + auth guard. |
| **Entry points** | Top-nav **Calendar** · lead workspace "Set schedule for visit" lands a tripping here · dashboard "Visit schedules". |

## Purpose
Give the agent a single month view of every scheduled and completed site visit, plus the
actions to log a past visit, cancel a schedule, and submit/view the completion report that
advances the lead.

## Data
- **Schedules** — \`GET /api/schedules/\` (month range; the visits that populate the grid and the day panel).
- **Completion reports** — \`GET /api/schedules/reports/\` (confirm) — the assessment attached to a completed visit.
- Schedule shape (intended): \`id\` · \`leadName\` · \`property\` · \`dateTime\` · \`status\` (incomplete | completed | cancelled).
- The day panel groups the selected day's visits into **Incomplete** and **Completed**.

## Layout
Inside the agent shell:
1. **Top nav** — brand + \`a[cds-nav-item]\` (Calendar active) + help button, notification bell, user chip.
2. **Two-column body** —
   - **Left — month calendar**: header with the month label + caret, and a **Previous month / Today / Next month** control cluster; a weekday header row (Sunday…Saturday); a 6×7 **month grid** of day cells (outside-month days muted, today highlighted).
   - **Right — schedule side panel**: "Schedule" heading + selected-date subtitle + **Log past visit**; \`cds-tabs\` with **Incomplete** and **Completed** tabs, each listing that day's visits.

## Components (from \`@tactivph/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — agent shell (Calendar active).
- \`cds-notif-bell\` (\`count\`) + \`cds-user-chip\` (\`name\`, \`role\`, \`src\`) — shell header actions.
- \`button[cds-button]\` — month controls (secondary-neutral, \`iconOnly\` carets + "Today") and **Log past visit** (primary, \`iconLeft\`).
- \`cds-tabs\` + \`cds-tab\` (\`label\`, \`icon\`) — the Incomplete / Completed day schedule.
- \`cds-empty-state\` (\`icon\`, \`title\`, \`message\`) — "Your schedule is free!" when a tab has no visits.
- **Month grid is layout only.** Cadence has **no calendar / month-grid component**; the weekday header row and the 6×7 day-cell grid are plain layout markup. FLAG: a \`cds-calendar\` (month grid + day cell) is a missing component — promote if reused.

## States
- **Loading** — day cells + schedule list show skeletons (month header/controls fixed).
- **Empty (day has no visits)** — \`cds-empty-state\` "Your schedule is free! / No scheduled visits at the moment." in the active tab.
- **Error** — \`cds-alert variant="danger"\` with Retry (app-wired).
- **Today** — the current day cell is highlighted (filled numeral); outside-month days render muted and are non-interactive.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Previous / Next month** | Shift the grid one month and refetch. | re-run \`GET /api/schedules/\` for the new range | stays |
| **Today** | Jump the grid back to the current month/day. | re-run \`GET /api/schedules/\` | stays |
| **Day cell click** | Select the day; load its visits into the side panel. | re-run \`GET /api/schedules/\` for the day (confirm) | stays |
| **Log past visit** | Record a visit that already happened. | \`POST /api/schedules/\` (confirm) | \`/agent/calendar/log-past-visit\` |
| **Cancel schedule** | Cancel a visit with a reason (lead cancelled / reschedule / didn't show / others). | \`PUT /api/schedules/:id/change-status/\` | \`/agent/calendar/:scheduleId/cancel-schedule\` |
| **Submit completion report** | Log visit outcome + assessment. | \`POST /api/schedules/reports/\` | \`/agent/calendar/:scheduleId/submit-completion-report\` |
| **View completion report** | Read a submitted report. | \`GET /api/schedules/reports/:id/\` (confirm) | \`/agent/calendar/:scheduleId/view-completion-report\` |

## Rules / validation
- The month grid always renders 6 weeks (42 cells); leading/trailing cells belong to the adjacent months and are styled as outside-month.
- A visit can only be cancelled or have a report submitted while **Incomplete**; a **Completed** visit offers **View completion report** instead.
- Cancelling requires a reason (lead cancelled / reschedule / didn't show / others).
- Submitting a completion report advances the lead's progress (Site Visit Completed) — that logic lives in the app, not the calendar view.

## Acceptance criteria
- [ ] Renders the month label, Previous / Today / Next controls, a 7-day weekday header, and a 6×7 (42-cell) month grid with outside-month and today styling.
- [ ] Right panel shows the Schedule heading, selected date, **Log past visit**, and \`cds-tabs\` with **Incomplete** / **Completed**, each using \`cds-empty-state\` when empty.
- [ ] Month navigation and day selection re-query \`GET /api/schedules/\`.
- [ ] Log past visit routes to \`/agent/calendar/log-past-visit\`; Cancel to \`/agent/calendar/:scheduleId/cancel-schedule\`; Submit report to \`/agent/calendar/:scheduleId/submit-completion-report\`; View report to \`/agent/calendar/:scheduleId/view-completion-report\`.
- [ ] Loading / empty / error states behave as specified.
- [ ] Built only from Cadence components (top-nav, nav-item, button, tabs + tab, empty-state, notif-bell, user-chip) — the month grid is explicitly plain layout, with \`cds-calendar\` flagged as the missing component.

## Notes
- The staff calendar (\`/staff/site-map\` sibling at \`/staff/calendar\`) is the same composition, staff-scoped — reuse this, narrow the data scope to the agent.
- Schedule APIs are \`/api/schedules/*\`, \`/api/schedules/:id/change-status/\`, \`/api/schedules/reports/*\` (concept 05 §5.5); per-day/per-range query params and the report GET shapes are marked (confirm).
- When a real month-grid component lands in cadence-ui, replace the layout markup and drop the FLAG.
`;
