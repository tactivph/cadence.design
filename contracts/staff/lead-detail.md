# Staff · Lead detail

The staff-side read/oversight view of a single lead: a CAS-status banner, the lead
header with its CAS badge, activity tabs (Prospect property / Endorsements) and a
Profile tab grouping the lead's account, contact, personal, CAS and site-visit details.

| | |
|---|---|
| **Route** | `/staff/customers/leads/:id` |
| **POV / access** | **Staff.** Authenticated staff session, RBAC resource `manage_lead`. Staff-wide scope (any lead, not just one agent's). Behind the staff shell + auth guard. |
| **Entry points** | Leads list row (`/staff/customers/leads`) · Clients-pipeline card · notifications/deep links. Note from the list: "Once status is 'Signed CAS', open the lead to continue." |

## Purpose
Give staff a single, staff-scoped picture of a lead — current CAS standing, prospect
properties, endorsement activity, and the full profile — to monitor progress and act
where oversight is needed. Same rich detail as the agent lead page, staff-scoped.

## Data
- **Lead** — `GET /api/leads/:id/` → name, lead ID, lead source, date inquired, enrolled-by agent, contact, personal details, CAS/appointment-slip status, site-visit assessment.
- **Prospect properties** — `GET /api/leads/:pk/prospect-property/` (up to 10).
- **Endorsements** — the lead's endorsement requests `(confirm)`.
- **Notes / activity** — `GET /api/notes/*`, `GET /api/leads/activity-history/` `(confirm)`.

## Layout
Inside the staff shell (`cds-top-nav`: Dashboard ▾ · Approval · **Leads** active · Clients · Processor · Sales Network · Calendar · Calculator · Site Map · Admin ▾ · bell · profile):
1. **Breadcrumb row** — a ghost **Back** (`iconLeft="ph ph-arrow-left"`) button + `cds-breadcrumb` (Leads › lead name).
2. **CAS banner** — `cds-alert`: when a CAS is on record it is informational, e.g. `variant="info"` "CAS active · N days remaining." with the active-since / expiry dates; when the slip is expired/missing it becomes `variant="warning"` with Resend / Upload actions (see CTAs).
3. **Lead header** — `h1` lead name + a CAS status pill `cds-badge tone="success" badgeStyle="soft"` "Signed CAS" (with an info glyph).
4. **Body** (two columns):
   - **Main column — activity tabs** (`cds-tabs`): **Prospect property** (icon `ph ph-buildings`) · **Endorsements** (icon `ph ph-folder-simple`).
   - **Right rail — Profile tab** (`cds-tabs` → `cds-tab label="Profile"`) with stacked clusters:
     - **Account details** — Lead ID no., Lead Source, Date Inquired, Enrolled by (`cds-avatar` + agent name).
     - **Contact details** — Email, Phone Number.
     - **Personal details** — Date of Birth, Civil Status, Nationality, Gender, Place of Residence.
     - **Client appointment slip (CAS)** — Status (`cds-badge` Active), Activated, Source, Uploaded file (link), Expiry.
     - **Site visit assessment** — Assessment (e.g. "Closeable").

## Components (from `@tactivph/cadence-ui`)
- `cds-top-nav` + `a[cds-nav-item]` (+ `cds-notif-bell`, `cds-user-chip`) — staff shell (Leads active).
- `cds-breadcrumb` + ghost `button[cds-button]` — breadcrumb / Back.
- `cds-alert` (`variant="info"` / `variant="warning"`) — CAS banner.
- `cds-badge` (`tone`, `badgeStyle`) — "Signed CAS" header pill and CAS "Active" status.
- `cds-tabs` + `cds-tab` (`label`, `icon`) — activity tabs and the Profile tab.
- `cds-avatar` (`name`, `size`, `src`) — enrolled-by agent.
- `cds-button` — CTA buttons.
- Profile clusters are plain `dl/dt/dd` markup (no dedicated `cds-*` field component).

## States
- **Loading** — breadcrumb + header + skeleton placeholders for tabs and profile clusters (the captured screen shows greyed placeholder blocks while fetching).
- **Empty (no properties)** — Prospect-property tab shows an empty/add-property prompt.
- **Empty (no endorsements)** — Endorsements tab shows an empty frame (`cds-empty-state`).
- **CAS active** — informational `cds-alert variant="info"` (no action needed).
- **CAS expired / missing** — `cds-alert variant="warning"` with Resend / Upload actions.
- **Error / not found** — `cds-alert variant="danger"`; 404 → not-found.

## CTAs / actions
| Control | Behaviour | Endpoint | Navigation |
|---|---|---|---|
| **Back** | Return to the staff leads list. | — | `/staff/customers/leads` |
| **Add note** | Append a note (+ attachments) to the lead. | `POST /api/notes/` `(confirm)` | stays |
| **Add property** / **Add prospect property** | Add a prospect property (max 10). | `POST /api/leads/:pk/prospect-property/` `(confirm)` | `(confirm)` |
| **Remove property** | Remove a prospect property. | `DELETE /api/leads/:pk/prospect-property/:id/` `(confirm)` | stays (confirm first) |
| **Start Endorsement** / **Endorse lead** | Begin an endorsement for a property. | — | `(confirm)` |
| **View calculations** | Open the endorsement calculation. | — | `/staff/approvals/:id` `(confirm)` |
| **View endorsement** / **View endorsement summary** | Open the endorsement summary. | — | `(confirm)` |
| **View completion report** | Open the site-visit completion report. | — | `/staff/calendar/:scheduleId/view-completion-report` `(confirm)` |
| **Schedule viewing visit** | Request/schedule a tripping. | `POST /api/schedules/` `(confirm)` | `(confirm)` |
| **Resend CAS** / **Resend email** / **Send CAS** | Resend the appointment-slip email. | `PUT /api/leads/:id/send-cas/` `(confirm)` | stays |
| **Upload CAS** | Upload the signed appointment slip. | `PUT /api/leads/:id/send-cas/` `(confirm)` | stays |
| **Mark as not interested** | Drop the lead. | `POST /api/leads/:pk/change-status/` `(confirm)` | stays (confirm first) |

## Rules / validation
- RBAC resource `manage_lead` required to open the page; staff scope is all leads.
- Max **10** prospect properties per lead.
- CAS banner variant is driven by appointment-slip status: active → info; expired/missing → warning with Resend/Upload.
- "Mark as not interested" and "Remove property" require a confirm (irreversible drop).
- Uploaded-file link opens the stored appointment-slip document.
- Endpoints above are intended from the concept audit; those marked `(confirm)` are not yet verified against the API shape.

## Acceptance criteria
- [ ] Renders the staff shell with **Leads** active and the Leads › lead-name breadcrumb + Back.
- [ ] Shows the CAS banner, using the informational variant when a CAS is active and the warning variant (Resend / Upload) when it is expired/missing.
- [ ] Lead header shows the lead name and the "Signed CAS" status pill.
- [ ] Activity tabs render **Prospect property** and **Endorsements**, each with their empty states.
- [ ] Profile tab shows all five clusters: Account, Contact, Personal, Client appointment slip (CAS), Site visit assessment.
- [ ] Every CTA routes/calls as per the table; destructive actions confirm first.
- [ ] Built only from Cadence components.

## Notes
- This is the staff-scoped twin of the agent Lead detail (`/agent/leads/:id`) — reuse that composition; the agent version adds the 4-step guided checklist (`cds-stepper`) which the staff oversight view does not foreground.
- Captured reference: `tools/parity/reference/staff-lead-detail.dom.json` + `.png`; the live screen shows a CAS-active info banner with the enrolled-by agent chip in Account details.
