# Agent · Dashboard › Visit schedules

The agent dashboard's third tab: a table of every site-visit schedule across their
leads, with completion status, beside an Activity feed of recent team updates.

| | |
|---|---|
| **Route** | `/agent/dashboard/visit-schedules` |
| **POV / access** | **Agent (broker/seller).** Authenticated agent session; scoped to the agent's own schedules (a broker also sees their team's). Behind the agent shell + auth guard. |
| **Entry points** | Agent **Dashboard** → **Visit schedules** tab (third tab, after Status board and Analytics) · a scheduled visit from a lead's "Set schedule" step surfaces here. |

## Purpose
Give the agent one list of all their requested site visits — lead, who requested it,
property, date/time and whether it's complete — plus an Activity rail summarising
recent team updates (visits, submissions, endorsements).

## Data
- **Schedules** — `GET /api/schedules/` (paginated; scoped to the agent; query params for search), from the `/api/schedules/*` family.
- **Activity feed** — recent team updates (visits, submissions, endorsements); endpoint `/api/leads/activity-history/` or an activity feed (confirm).
- Row shape (`Row`): `id` · `lead` (lead name) · `requestedBy` (the agent — rendered "You" with avatar) · `property` (property name) · `datetime` (date & time string) · `complete` (boolean → Complete / Incomplete).

## Layout
Inside the agent shell:
1. **Top nav** — brand + `a[cds-nav-item]` (Dashboard active) + help button, notification bell, user chip.
2. **Page title** — `h1` "Dashboard".
3. **Tabs** — `cds-tabs` with `cds-tab`: Status board · Analytics · **Visit schedules** (active). This page is the Visit schedules tab body.
4. **Two-column body** —
   - **Main** — `h2` "List of visit schedules" + `cdsTable` with `cds-table-header`, then `cds-table-pagination` (`itemName="Visit schedule"`).
   - **Side rail** — `cds-input-group` search + `cds-card` "Activity" containing a `cds-empty-state` when there's nothing yet.

### Columns
**Lead name** · **Requested by** · **Property name** · **Date & time** · **Status**

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — agent shell (Dashboard active).
- `cds-notif-bell` (`count`) + `cds-user-chip` (`name`, `role`, `src`) — shell header actions.
- `cds-tabs` (`activeIndex`) + `cds-tab` (`label`, `icon`) — the dashboard tab bar; Visit schedules is index 2.
- `table[cdsTable]` + `cds-table-header` (`columns`) — the schedules table.
- `cds-status-badge` (`label`, `tone`) — the Status cell (`tone="success"` Complete / `tone="danger"` Incomplete).
- `cds-table-pagination` (`itemName`, `page`, `pageSize`, `collectionSize`) — pager.
- `cds-input-group` + `input[cdsInput]` (with `cds-prefix` search icon) — the side-rail search.
- `cds-card` — the Activity panel container.
- `cds-empty-state` (`icon="ph ph-chart-bar"`, `title`, `message`) — the empty Activity feed.
- The Requested-by avatar cell is a plain cell today (no dedicated `cds-*`); if promoted, flag it.

## States
- **Loading** — table shows skeleton rows; Activity rail shows a loading/skeleton panel.
- **Empty (no schedules)** — `cds-empty-state` in the table body: "No visit schedules yet" (app-wired copy).
- **Empty (Activity)** — **live default for the rail:** `cds-empty-state` inside the card, title "No activity yet", message "Your team's updates, visits, submissions, endorsements show up here."
- **Error** — `cds-alert variant="danger"` with Retry (app-wired).
- **Status variants** — `complete` → "Complete" badge `tone="success"`; `!complete` → "Incomplete" badge `tone="danger"`.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Tab: Status board** | Switch to the status board tab. | — | `/agent/dashboard/status-board` |
| **Tab: Analytics** | Switch to the analytics tab. | — | `/agent/dashboard/analytics` |
| **Tab: Visit schedules** | This tab (active). | `GET /api/schedules/` | stays |
| **Row click** | Open the schedule / its completion report. | `GET /api/schedules/:id` (confirm) | `/agent/calendar/:scheduleId/view-completion-report` (confirm) |
| **Search** | Search schedules by lead/property. | re-run `GET /api/schedules/` with query | stays |
| **Pagination** | Page through schedules. | re-run `GET /api/schedules/` with page params | stays |

## Rules / validation
- The table is **read-only** — status (Complete/Incomplete) is set by the visit flow (completion report), not toggled here.
- **Requested by** renders "You" for schedules the agent requested; broker-team schedules show the requesting seller.
- Status tone is derived: `complete` ⇒ success, otherwise danger.
- Search filters the schedules table; the Activity rail is independent.

## Acceptance criteria
- [ ] Renders inside the Dashboard tabs with Visit schedules as the active (third) tab.
- [ ] Table columns: Lead name · Requested by · Property name · Date & time · Status.
- [ ] Status uses `cds-status-badge` with `label`/`tone` — "Complete" success, "Incomplete" danger.
- [ ] Pagination uses `itemName="Visit schedule"` and re-queries `GET /api/schedules/`.
- [ ] Side rail shows a `cds-input-group` search and an Activity `cds-card` with a `cds-empty-state` when empty.
- [ ] Loading / empty (table + activity) / error states behave as specified.
- [ ] Built only from Cadence components (top-nav, nav-item, tabs + tab, table + header + pagination, status-badge, input-group + input, card, empty-state, notif-bell, user-chip).

## Notes
- This is a sub-tab of the agent Dashboard (`/agent/dashboard`); Status board and Analytics are the sibling tabs.
- Schedules originate from a lead's "Set schedule for visit" step (`POST /api/schedules/`) and resolve via the completion report (`POST /api/schedules/reports/`) from the Calendar flow.
- The Requested-by avatar cell is currently plain; promote to `cds-*` only if reused elsewhere.
