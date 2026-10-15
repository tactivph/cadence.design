# Agent · Lead detail

The agent's core workspace for a single lead: a 4-step guided checklist to reach
endorsement, prospect-property and endorsement tabs, and a profile right-rail.

| | |
|---|---|
| **Route** | `/agent/leads/:id` |
| **POV / access** | **Agent.** Authenticated agent session; the lead must belong to the agent (or their team). Behind the agent shell + auth guard. |
| **Entry points** | Status board card · Leads list row · notifications/deep links. |

## Purpose
Drive one lead from capture to endorsement, tracking the required steps and the
lead's profile, properties and endorsements in one place.

## Data
- **Lead** — `GET /api/leads/:id/` → profile, lead source, dates, contact, personal details, CAS/appointment-slip status, site-visit assessment.
- **Prospect properties** — `GET /api/leads/:pk/prospect-property/` (up to 10).
- **Endorsements** — the lead's endorsement requests.
- **Notes / activity** — `GET /api/notes/*`, `GET /api/leads/activity-history/`.

## Layout
Inside the agent shell, two columns:
1. **Page header** — breadcrumb (Leads › lead name), title = lead name, actions: **Add note**, **Mark as not interested**.
2. **CAS banner** (conditional) — `cds-alert variant="warning"`: "CAS expired · Action needed" with **Resend email** / **Upload CAS**.
3. **Main column**
   - **Guided checklist** — a `cds-stepper` of 4 steps: Set schedule for visit · Complete site visit · Update lead profile · Endorse for reservation. Each step has a CTA.
   - **Tabs** (`cds-tabs`): **Prospect property** (property cards + Add property) · **Endorsements** (list or empty-state Start Endorsement).
4. **Right rail** — **Profile** `cds-card`: account details (Lead ID, Lead Source, Date Inquired, Enrolled by), contact, personal details, appointment slip, site-visit assessment.

## Components (from `@tactivstudios/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` — agent shell (Leads active).
- `cds-page-header` + `cds-breadcrumb` + action `button[cds-button]`s.
- `cds-alert variant="warning"` with `[cds-alert-actions]` — CAS banner.
- `cds-stepper` (`steps`, `activeIndex`) — the 4-step checklist.
- `cds-tabs` + `cds-tab` (`label`, `count`) — Prospect property / Endorsements.
- `cds-card` — property cards, the profile rail, the endorsements empty frame.
- `cds-empty-state` — Endorsements empty-state.
- `cds-status-badge kind="lead-progress"` — current lead stage pill.
- `cds-button` — every step CTA and tab action.

## States
- **Loading** — header + skeleton for stepper/tabs/rail.
- **Empty (no properties)** — Prospect-property tab shows an Add-property prompt.
- **Empty (no endorsements)** — `cds-empty-state` + **Start Endorsement**.
- **CAS ok** — banner hidden.
- **Ready for endorsement** — a success note: "This lead has completed all requirements → Go to Endorsements".
- **Error / not found** — `cds-alert variant="danger"`; 404 → not-found.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Set schedule for visit** (step 1) | Request a tripping. | `POST /api/schedules/` | `/agent/leads/:id/set-schedule` |
| **Submit completion report** (step 2) | Log visit outcome + assessment. | `POST /api/schedules/reports/` | `/agent/calendar/:scheduleId/submit-completion-report` |
| **Update lead profile** (step 3) | Fill reservation-required details. | `PUT /api/leads/:id/` | `/agent/leads/:id/update` |
| **Endorse for reservation** (step 4) | Open the eligibility calculator. | — | `/agent/leads/:id/income-calculator` |
| **Resend email** / **Upload CAS** | Resend CAS / upload the signed slip. | `PUT /api/leads/:id/send-cas/` | stays |
| **Add property** | Add a prospect property (max 10). | `POST /api/leads/:pk/prospect-property/` | `/agent/leads/:id/add-property` |
| **Start Endorsement** | Begin endorsement for a property. | — | `/agent/leads/endorse-lead/:leadId/property/:propertyId` |
| **Add note** | Append a note (+ attachments). | `POST /api/notes/` | stays |
| **Mark as not interested** | Drop the lead. | `POST /api/leads/:pk/change-status/` | stays (confirm first) |

## Rules / validation
- Max **10** prospect properties per lead.
- Steps complete in order; later steps may be disabled until earlier ones are done.
- "Mark as not interested" requires a confirm (irreversible drop).
- CAS banner only when the appointment slip is expired/missing.

## Acceptance criteria
- [ ] Shows the 4-step checklist with each step's CTA and completion state.
- [ ] CAS banner appears only when action is needed, with Resend/Upload.
- [ ] Prospect-property and Endorsements tabs render, with their empty states.
- [ ] Profile rail shows account/contact/personal/appointment-slip/assessment.
- [ ] Every CTA routes/calls as per the table; "Mark as not interested" confirms.
- [ ] Composed only from Cadence components.

## Notes
- The staff Lead detail (`/staff/customers/leads/:id`) is the same rich page, staff-scoped — reuse this composition.
- The calculator opened by step 4 is a page of its own (multi-unit, phased equity, co-borrower).
