# Cadence — page inventory & build worklist

Every screen in the real PDO app (from `pdo/web` routing source) mapped to its Cadence
status. Work down the ⬜ rows with `/new-page <pov>/<slug>`. Built = story + contract exist.

**Status:** 6 built · ~70 primary screens total. Routes are the real QA paths (POV prefix shown).
Grouped rows (CRUD pairs, wizard steps) collapse several routes — expand as you build them.

Legend: ✅ built · ⬜ missing · 🔁 create/update share one screen · 🧩 multi-step wizard

---

## AGENT  (`/agent`)   — 1 / ~20 built

### Dashboard
| Screen | Route | Status | slug |
|---|---|---|---|
| Status board | `/agent/dashboard/status-board` | ✅ | `agent/status-board` |
| Visit schedules | `/agent/dashboard/visit-schedules` | ⬜ | `agent/visit-schedules` |
| Analytics | `/agent/dashboard/analytics` | ⬜ | `agent/analytics` |

### Leads
| Screen | Route | Status | slug |
|---|---|---|---|
| Leads list | `/agent/leads` | ⬜ | `agent/leads-list` |
| Add lead | `/agent/leads/add` | ⬜ | `agent/lead-create` |
| Lead detail | `/agent/leads/:id` | ✅ | `agent/lead-detail` |
| Lead · update profile | `/agent/leads/:id/update` | ⬜ | `agent/lead-update` |
| Lead · set schedule | `/agent/leads/:id/set-schedule` | ⬜ | `agent/lead-set-schedule` |
| Lead · add property | `/agent/leads/:id/add-property` | ⬜ | `agent/lead-add-property` |
| Lead · property details | `/agent/leads/:id/property-details/:propertyId` | ⬜ | `agent/lead-property-details` |
| Lead · requirements | `/agent/leads/:id/requirements` | ⬜ | `agent/lead-requirements` |
| Lead · endorse | `/agent/leads/endorse-lead/:leadId/property/:propertyId` | ⬜ | `agent/lead-endorse` |
| Lead · income calculator | `/agent/leads/:leadId/income-calculator` | ⬜ | `agent/lead-income-calculator` |
| Lead · completion report (view) | `/agent/leads/:id/view-completion-report` | ⬜ | `agent/completion-report-view` |
| Lead · info-sheet / loan summaries | `…/requirements/:urId/{information-sheet,preliminary-loan}-summary` | ⬜ | reuse client summaries |

### Clients / Team / Tools
| Screen | Route | Status | slug |
|---|---|---|---|
| Clients list | `/agent/clients` | ⬜ | `agent/clients-list` |
| Client detail | `/agent/clients/:clientId` | ⬜ | `agent/client-detail` |
| Team (sellers) list | `/agent/team` | ⬜ | `agent/team-list` |
| Team member detail | `/agent/team/:sellerId` | ⬜ | `agent/team-detail` |
| Calendar | `/agent/calendar` | ⬜ | `agent/calendar` |
| Calendar · log/cancel/submit/view | `/agent/calendar/…` | ⬜ 🧩 | `agent/calendar-actions` |
| Eligibility calculator | `/agent/eligibility-calculator` | ⬜ | `agent/eligibility-calculator` |
| Site map | `/agent/site-map` | ⬜ | `agent/site-map` |

---

## STAFF  (`/staff`)   — 2 / ~28 built

### Dashboards
| Screen | Route | Status | slug |
|---|---|---|---|
| Clients pipeline | `/staff/dashboard/clients-pipeline` | ⬜ | `staff/clients-pipeline` |
| Sales & marketing analytics | `/staff/dashboard/sales-marketing-analytics` | ✅ | `staff/sales-marketing-dashboard` |
| Staff overview analytics | `/staff/dashboard/staff-overview-analytics` | ⬜ | `staff/staff-overview` |
| Roles overview | `/staff/dashboard/roles-overview` | ⬜ | `staff/roles-overview` |
| Processor | `/staff/dashboard/processor` | ⬜ | `staff/processor-dashboard` |
| Broker overview | `/staff/dashboard/broker-overview` | ⬜ | `staff/broker-overview` |
| Top performing broker | `/staff/dashboard/broker-overview/top-performing-broker` | ⬜ | `staff/top-performing-broker` |

### Customers
| Screen | Route | Status | slug |
|---|---|---|---|
| Leads list | `/staff/customers/leads` | ⬜ | `staff/leads-list` |
| Lead detail | `/staff/customers/leads/:id` | ⬜ | `staff/lead-detail` |
| Clients list | `/staff/customers/clients` | ✅ | `staff/clients-list` |
| Client detail | `/staff/customers/clients/:clientId` | ⬜ | `staff/client-detail` |
| Customer requirements / internal requirement | `…/clients/:id/requirements…` | ⬜ 🧩 | `staff/customer-requirements` |

### Brokers / Admin / Developments
| Screen | Route | Status | slug |
|---|---|---|---|
| Brokers list | `/staff/brokers` | ⬜ | `staff/brokers-list` |
| Broker detail | `/staff/brokers/:id` | ⬜ | `staff/broker-detail` |
| User management | `/staff/admin/user-management` | ⬜ | `staff/user-management` |
| Roles list | `/staff/admin/user-management/roles` | ⬜ | `staff/roles-list` |
| Create/update role | `…/roles/create` · `…/roles/update/:id` | ⬜ 🔁 | `staff/role-form` |
| Create/update staff | `…/create` · `…/update/:staffId` | ⬜ 🔁 | `staff/staff-form` |
| Developments (sites) list | `/staff/admin/sites` | ⬜ | `staff/sites-list` |
| Site create/detail/update | `/staff/admin/sites/:id…` | ⬜ 🔁 | `staff/site-detail` |
| Site map setup | `/staff/admin/sites/:id/site-map/setup` | ⬜ | `staff/site-map-setup` |
| Projects list/create/detail/update | `…/sites/:id/projects…` | ⬜ 🔁 | `staff/projects` |
| House type detail | `…/house-types/:houseTypeId` | ⬜ | `staff/house-type-detail` |
| Product offering detail | `…/products/:productOfferingId` | ⬜ | `staff/product-offering-detail` |
| Create property | `…/developments/:id/create-property` | ⬜ | `staff/property-form` |

### Approvals / Requests / Tools
| Screen | Route | Status | slug |
|---|---|---|---|
| Approvals list | `/staff/approvals` | ⬜ | `staff/approvals-list` |
| Approval detail | `/staff/approvals/:id` | ⬜ | `staff/approval-detail` |
| Requests · processor list | `/staff/requests/processor` | ⬜ | `staff/requests-processor` |
| Requests · processor detail (+reservation) | `/staff/requests/processor/:id…` | ⬜ 🧩 | `staff/processor-detail` |
| Calendar | `/staff/calendar` | ⬜ | `staff/calendar` |
| Eligibility calculator | `/staff/eligibility-calculator` | ⬜ | `staff/eligibility-calculator` |
| Site map | `/staff/site-map` | ⬜ | `staff/site-map` |

---

## CLIENT  (`/client`)   — 2 / ~8 built

| Screen | Route | Status | slug |
|---|---|---|---|
| Requirements hub | `/client/requirements` | ✅ | `client/requirements-hub` |
| Pre-reservation | `/client/requirements/pre-reservation` | ⬜ | `client/pre-reservation` |
| Property feed | `/client/property-feed` | ⬜ | `client/property-feed` |
| Financing | `/client/financing` | ⬜ | `client/financing` |
| Buyer's information sheet | `/client/requirements/:urId/information-sheet` | ✅ | `client/buyers-information-sheet` |
| BIS · wizard steps (×12) | `…/information-sheet/{personal-details,spouse-information,representative,general-questions,review-property,privacy…,co-*}` | ⬜ 🧩 | `client/bis-steps` |
| BIS summary | `…/information-sheet/summary` | ⬜ | `client/bis-summary` |
| Preliminary loan (×2 steps) | `…/preliminary-loan/{financial-background,monthly-financial-overview}` | ⬜ 🧩 | `client/preliminary-loan` |
| Preliminary loan summary | `…/preliminary-loan/summary` | ⬜ | `client/preliminary-loan-summary` |
| Site map | `/client/site-map` | ⬜ | `client/site-map` |

---

## SHARED & PUBLIC  (lower priority for the design-system clone)

- **Settings** (`/settings`): account, edit-profile, update-password, update-address — 4 screens.
- **Notifications** (`/notifications`): 1 screen.
- **Public** (unauthenticated): login, 404, 403, expired, forgot-password, password-reset,
  recovery-success, setup-account (info/address/security), register-user 🧩, register-lead 🧩,
  client-appointment-slip, polygon-tracer, public site-map detail — ~18 screens.

---

## Suggested order

1. **Lock the design system first** (`/parity-loop` on the 5 current page targets + component
   targets). Every screen below is composed from those components.
2. **Core authenticated screens** per POV — the list/detail/dashboard rows above (not wizards).
   These exercise the shared components hardest and surface missing ones early.
3. **Wizards & forms** (BIS steps, preliminary-loan, admin CRUD) — mostly form components; batch
   them once the form controls are proven.
4. **Shared + public** last.

> Add a `targets.json` row per screen as you build it (copy an existing page row, set `pov`,
> `clone.storyId`, and the real `reference.path` from the table above). For `:id` routes, use
> `reference.clickFirst` to reach a record from its list, or paste a concrete URL.
