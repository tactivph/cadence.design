/**
 * Page contract — Agent · Client detail.
 * Single source of truth; mirrored to contracts/agent/client-detail.md.
 * Design system is presentational only — endpoints/behaviour are the app's job.
 */
export const CONTRACT = `
# Agent · Client detail

The agent's workspace for a single converted buyer: a client header with category
pill, a tabbed activity/documents panel, and a tabbed profile rail. The agent
follows the client's contract-requirement progress and keeps scheduling.

| | |
|---|---|
| **Route** | \`/agent/clients/:clientId\` |
| **POV / access** | **Agent.** Authenticated agent session; the client must belong to the agent (or their team). Behind the agent shell + auth guard. |
| **Entry points** | Clients list row · status-board card (Reservation → Turnover) · notifications/deep links. |

## Purpose
Give the agent one place to view a converted client's profile, follow their
requirement progress through the buyer pipeline, review activity and documents,
and keep scheduling visits.

## Data
- **Client** — \`GET /api/clients/:user_id/\` (confirm) → profile, category, contact, enrollment, enrolled-by.
- **Contracts** — \`GET /api/clients/:user_id/contracts/\` → reserved unit(s), project, contract price.
- **Contract requirements** — \`GET /api/clients/:user_id/contract-requirements/\` → requirement progress (Pre-reservation → Turnover).
- **Activity** — team updates, visits, submissions, endorsements (\`GET /api/leads/activity-history/\` / \`/api/schedules/*\`) (confirm).
- **Documents** — uploaded contracts & requirement files (confirm endpoint).

## Layout
Inside the agent shell (Dashboard · Leads · **Clients** active · Calendar · Calculator · Site Map), one page:
1. **Client header** — \`cds-avatar\` (lg) + \`cds-page-header\` (title = client name, subtitle = "Client · CL-####") with breadcrumb (Clients › client name); actions: client-category pill + **Edit client**.
2. **Main column** — a flush \`cds-card\` wrapping \`cds-tabs\`:
   - **Activity** (count) — activity cards (actor avatar, title, meta, body, timestamp).
   - **Documents** (count) — document list, or empty-state + **Upload document**.
3. **Right rail** — \`cds-card\` + \`cds-tabs\` with a **Profile** tab: clustered details — **Contact** (Mobile, Email, Address), **Enrollment** (Client ID, Category, Enrolled by, Date enrolled), **Property** (Project, Unit, Contract price), **Requirements** (Appointment slip, Proof of income, Valid ID …).

## Components (from \`@tactivph/cadence-ui\`)
- \`cds-top-nav\` + \`a[cds-nav-item]\` — agent shell (Clients active); \`cds-user-chip\`, \`cds-notif-bell\` in actions.
- \`cds-page-header\` + \`cds-breadcrumb\` + \`cds-avatar\` — client header.
- \`cds-status-badge kind="client-category"\` — category pill (e.g. expired/reserved_buyer).
- \`cds-button\` — Edit client, Upload document, and rail/tab actions.
- \`cds-card\` (\`flush\`) — the activity/documents panel, activity cards, the profile rail.
- \`cds-tabs\` + \`cds-tab\` (\`label\`, \`count\`) — Activity / Documents · Profile.
- \`cds-empty-state\` — Documents empty-state.

## States
- **Loading** — header + card skeletons for the panel and rail (captured reference is this skeleton state).
- **Empty (no documents)** — Documents tab shows \`cds-empty-state\` + **Upload document**.
- **Empty (no activity)** — Activity tab shows an empty prompt.
- **Error / not found** — \`cds-alert variant="danger"\`; 404 → not-found.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Edit client** | Edit the client's profile. | \`PUT /api/clients/:user_id/\` (confirm) | \`/agent/clients/:clientId/update\` (confirm) |
| **Check requirements** / **View requirements** | Follow contract-requirement progress. | \`GET /api/clients/:user_id/contract-requirements/\` | \`/agent/clients/:clientId/requirements\` |
| requirement row | Open a single requirement (info-sheet / preliminary-loan summary). | — | \`/agent/clients/:clientId/requirements/:requirementId\` (confirm) |
| **Set schedule** / **Schedule viewing visit** | Request a visit for this client. | \`POST /api/schedules/\` | \`/agent/clients/:clientId/set-schedule/:id\` |
| **Upload document** | Upload a contract/requirement file. | (confirm endpoint) | stays |
| **Add note** | Append a note to activity (+ attachments). | \`POST /api/notes/\` (confirm) | stays |

## Rules / validation
- Client is scoped to the agent (or their team); others are denied/not-found.
- Requirement progress is read-driven from contract-requirements; the agent follows, staff/buyer act on them.
- Document upload accepts the contract's required file types (confirm limits).

## Acceptance criteria
- [ ] Client header shows avatar, name, "Client · CL-####" subtitle, breadcrumb, category pill, and Edit client.
- [ ] Main panel renders Activity and Documents tabs with counts; Documents empty-state offers Upload document.
- [ ] Profile rail shows Contact, Enrollment, Property and Requirements clusters.
- [ ] Each CTA routes/calls as per the table; unconfirmed endpoints stay flagged \`(confirm)\`.
- [ ] Loading state matches the captured skeleton (header + panel + rail placeholders).
- [ ] Composed only from Cadence components.

## Notes
- Clients are the agent's **converted buyers** — same columns/detail model as the staff clients list, agent-scoped.
- Requirement detail, information-sheet and preliminary-loan summaries are pages of their own (see Client/Buyer requirements flow).
- The captured reference (\`tools/parity/reference/agent-client-detail\`) is the loading state; field values here come from the concept + built mock page.
`;
