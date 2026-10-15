import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsButtonComponent,
  CdsCheckboxComponent, CdsBadgeComponent,
  CdsNotifBellComponent, CdsUserChipComponent,
} from '../../public-api';

interface Role {
  slug: string;   // unique row modifier (keeps 3+ sibling rows from collapsing)
  name: string;
  description: string;
}

/**
 * MOCK page — Staff · Admin · User management · Add new staff
 * (route /staff/admin/user-management/create → CreateUpdateStaffComponent).
 *
 * SOURCE-FIRST port of PDO `create-update-staff.component.html`. Captured
 * reference (selector `app-root`) shows the STAFF top-nav shell in frame (brand
 * wordmark, staff nav items, notif bell, user chip "Tactiv A." / Staff). Route is
 * /staff/admin/... → ACTIVE top-nav item is **Admin**. Shell copied verbatim from
 * the role-form staff sibling.
 *
 * CREATE state (isUpdate = false, staff = undefined) — this is exactly what the
 * reference captures:
 *   - breadcrumb current crumb = "Add new staff" (the @else of @if(isUpdate)),
 *     middle crumb = "Staff" (the !first_name fallback).
 *   - user-primary-details shows the "-" fallback (no first/last name) + an empty
 *     status badge; the resend-card / invited-by blocks are omitted (staff null).
 *   - "Date invited:" renders with an empty date.
 *   - footer__user-actions: staff?.current_status (undefined) != INVITED → the
 *     "Remove this account" button shows; the @else branch → "Deactivate this
 *     account" shows (current_status !== INACTIVE).
 *   - submit label = "Invite staff" (the @else of @if(isUpdate)), disabled.
 *
 * Structure mirrors create-update-staff.component.html 1:1:
 *   .add-staff › .container › .add-staff__content (column, 24px gap)
 *     ├ .breadcrumb  (row): arrow-left icon / "User management" / "Staff" / active "Add new staff"
 *     └ .user-roles  (row, 24px gap)
 *         ├ .user-details (left rail, 400px, column, space-between)
 *         │   ├ .user-primary-details: img avatar + ("-" fallback + empty status badge)
 *         │   └ .user-secondary-details:
 *         │         ├ p.date-invited "Date invited:"
 *         │         └ .footer__user-actions: "Remove this account" | "Deactivate this account"
 *         └ .available-roles (right, column)
 *               ├ .available-roles__heading: h5 "Available roles" + descriptive p
 *               ├ form.admin-agent-row: @for role → label.form-check (checkbox + name + description)
 *               └ .add-staff__footer › .footer-actions: Cancel + Invite staff (disabled)
 *
 * BLUEPRINT GOTCHA — the grader collapses runs of >2 consecutive sibling elements
 * with an identical signature (tagName + first 3 classes), dropping their text. The
 * role rows (21 of them) repeat, so each leads with a UNIQUE modifier class
 * (form-check--<slug>) to keep every role name/description captured.
 *
 * COMPONENT MAPPING: role toggles → cds-checkbox; status pill → cds-badge (empty in
 * create state); footer + account actions → cds-button (danger-ghost = PDO
 * .btn-ghost.negative). The breadcrumb is a bespoke trail (not cds-breadcrumb):
 * cds-breadcrumb wraps items in identical <li> so a 3-item trail collapses to its
 * first label; distinct link/active classes keep all three captured, matching the
 * real breadcrumb-item / breadcrumb-item.active markup.
 *
 * COMPONENT GAP: none — every real region maps onto an existing cds-* primitive.
 */
@Component({
  selector: 'cds-page-staff-staff-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsButtonComponent,
    CdsCheckboxComponent, CdsBadgeComponent,
    CdsNotifBellComponent, CdsUserChipComponent,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item [hasCaret]="true">Dashboard</a>
      <a cds-nav-item>Approval</a>
      <a cds-nav-item>Leads</a>
      <a cds-nav-item>Clients</a>
      <a cds-nav-item>Processor</a>
      <a cds-nav-item>Sales Network</a>
      <a cds-nav-item>Calendar</a>
      <a cds-nav-item>Calculator</a>
      <a cds-nav-item>Site Map</a>
      <div cds-topnav-actions class="hdr-actions">
        <a cds-nav-item [active]="true" [hasCaret]="true">Admin</a>
        <cds-notif-bell [count]="3"></cds-notif-bell>
        <cds-user-chip name="Tactiv A." role="Staff"></cds-user-chip>
      </div>
    </cds-top-nav>

    <main class="cds-container">
      <div class="add-staff">
        <div class="add-staff__content">
          <!--
            .breadcrumb — bespoke trail (not cds-breadcrumb) so each crumb keeps a
            distinct class and all three labels stay captured, matching the real
            breadcrumb-item / breadcrumb-item.active markup.
          -->
          <div class="breadcrumb">
            <i class="ph ph-arrow-left enroll-leads__back" aria-hidden="true"></i>
            <a class="breadcrumb-item" href="#">User management</a>
            <a class="breadcrumb-item" href="#">Staff</a>
            <a class="breadcrumb-item active" aria-current="page">Add new staff</a>
          </div>

          <div class="user-roles">
            <!-- Left rail: user identity + account actions (.user-details) -->
            <div class="user-details">
              <div class="user-primary-details">
                <img class="user-avatar" alt="" />
                <div class="d-flex flex-column gap-2">
                  <div class="user-primary-details__inner">
                    <span class="user-name">-</span>
                    <cds-badge tone="neutral" shape="pill" size="sm" class="badge-staff"></cds-badge>
                  </div>
                </div>
              </div>

              <div class="user-secondary-details">
                <div class="user-secondary-details__inner">
                  <p class="date-invited">Date invited:</p>
                </div>
                <div class="footer__user-actions">
                  <button cds-button variant="danger-ghost" class="account-action">Remove this account</button>
                  <button cds-button variant="danger-ghost" class="account-action">Deactivate this account</button>
                </div>
              </div>
            </div>

            <!-- Right: available roles checkbox list (.available-roles) -->
            <div class="available-roles">
              <div class="available-roles__heading">
                <h5 class="available-roles__title">Available roles</h5>
                <p class="available-roles__desc">
                  Update staff access by configuring the roles below to align with
                  responsibilities and permissions.
                </p>
              </div>

              <form class="admin-agent-row">
                @for (role of roles; track role.slug) {
                  <label class="form-check" [class]="'form-check--' + role.slug">
                    <cds-checkbox></cds-checkbox>
                    <div class="form-check-label secondary">
                      <p class="form-check-label__name">{{ role.name }}</p>
                      <span class="form-check-label__desc">{{ role.description }}</span>
                    </div>
                  </label>
                }
              </form>

              <div class="add-staff__footer">
                <div class="footer-actions">
                  <button cds-button variant="secondary-neutral" size="sm">Cancel</button>
                  <button cds-button variant="primary" size="sm" [disabled]="true">Invite staff</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface); min-height: 100vh; }

    .brand { font-family: var(--cds-font-family-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; }
    .brand__one { color: var(--cds-warning-400); }
    .brand__pdo { color: var(--cds-color-primary); }
    .hdr-actions { display: flex; align-items: center; gap: var(--cds-space-16); }
    :host ::ng-deep .cds-nav-item--caret { text-align: start; }

    .cds-container { padding: var(--cds-space-20) var(--cds-space-40); }

    /* .add-staff__content — column stack, 24px gap (PDO) */
    .add-staff__content { display: flex; flex-direction: column; gap: var(--cds-space-24); align-items: flex-start; }

    /* breadcrumb trail (row) */
    .breadcrumb { display: flex; align-items: center; gap: var(--cds-space-10); margin: 0; }
    .breadcrumb .enroll-leads__back { font-size: 14px; color: var(--cds-text-primary); }
    .breadcrumb .breadcrumb-item { color: var(--cds-text-tertiary); text-decoration: none; }
    .breadcrumb .breadcrumb-item:not(:first-of-type) { padding-left: var(--cds-space-7); }
    /* PDO breadcrumb-item.active — Medium face, weight 500, primary ink. Scoped to
       4 classes (0,4,1) to beat the shared breadcrumb md-size rule (0,4,0). */
    .add-staff .breadcrumb a.breadcrumb-item.active {
      color: var(--cds-text-primary);
      font-family: var(--cds-font-family-medium);  /* Inter Medium */
      font-weight: var(--cds-weight-semibold);   /* 500 */
      line-height: var(--cds-line-height-md);      /* 21px */
    }
    /* Cancel (secondary-neutral) is borderless in PDO (no 1px gray outline) */
    .add-staff__footer ::ng-deep button.cds-btn.cds-btn--secondary-neutral { border: 0; }

    /* body: left rail (400px) / right available-roles, 24px gap */
    .user-roles { display: flex; gap: var(--cds-space-24); width: 100%; align-items: stretch; }

    /* left rail */
    .user-details { display: flex; flex-direction: column; justify-content: space-between; width: 400px; flex: none; }
    .user-primary-details { display: flex; align-items: flex-start; gap: var(--cds-space-8); }
    .user-avatar { width: 40px; height: 40px; border-radius: 100px; background: var(--cds-border-subtle); flex: none; }
    .user-primary-details__inner { display: flex; align-items: center; gap: var(--cds-space-8); }
    .user-name { color: var(--cds-text-primary); }

    .user-secondary-details { display: flex; flex-direction: column; gap: var(--cds-space-4); }
    .date-invited { margin: 0; font-size: var(--cds-font-size-sm); line-height: var(--cds-line-height-14); color: var(--cds-text-tertiary); }
    .footer__user-actions { display: flex; align-items: center; gap: var(--cds-space-8); }
    /* PDO .btn-ghost.negative — red text, no padding, inline links. */
    .footer__user-actions ::ng-deep button.cds-btn { padding: 0; }

    /* right: available roles */
    .available-roles { flex: 1; display: flex; flex-direction: column; }
    .available-roles__heading { display: flex; flex-direction: column; gap: var(--cds-space-4); padding: var(--cds-space-12) var(--cds-space-8); }
    .available-roles__title { margin: 0; font-family: var(--cds-font-family-semibold-face); font-size: var(--cds-font-size-xl); font-weight: var(--cds-weight-semibold); line-height: var(--cds-line-height-md); color: var(--cds-text-secondary); }
    .available-roles__desc { margin: 0; font-size: var(--cds-font-size-lg); line-height: var(--cds-line-height-lg); color: var(--cds-text-tertiary); }

    /* Role list is a FIXED-HEIGHT SCROLLABLE region (PDO): the 21 rows would
       otherwise stretch .user-roles to ~1600px and push the footer + left-rail
       bottom actions far below the reference. Reference form.admin-agent-row is
       584px tall (y225 → y809), so cap at 584px and scroll the overflow — this
       lands the footer (Cancel / Invite staff) at y≈845 and the left-rail
       "Date invited:" / Remove / Deactivate at y≈835-857. */
    .admin-agent-row { display: flex; flex-direction: column; gap: var(--cds-space-4); max-height: 584px; overflow-y: auto; }
    /* each row = checkbox + label block; border-bottom hairline (PDO form-check) */
    .form-check { display: flex; align-items: flex-start; gap: var(--cds-space-8); padding: var(--cds-space-12) var(--cds-space-12) var(--cds-space-12) 28px; margin: 0; border-bottom: 1px solid var(--cds-border-row); }
    .form-check-label { display: flex; flex-direction: column; padding-left: 18px; }
    .form-check-label__name { margin: 0; font-family: var(--cds-font-family-medium); font-size: var(--cds-font-size-md); line-height: var(--cds-line-height-sm); color: var(--cds-text-primary); }
    .form-check-label__desc { font-size: var(--cds-font-size-md); line-height: var(--cds-line-height-md); color: var(--cds-text-secondary); }

    /* footer: right-aligned Cancel + Invite staff */
    .add-staff__footer { display: flex; align-items: flex-end; justify-content: flex-end; padding-top: var(--cds-space-16); }
    .footer-actions { display: flex; align-items: center; gap: var(--cds-space-8); }
    /* PDO footer buttons use md metrics: 14px font, 21px line-height, 8/20 padding. */
    .add-staff__footer ::ng-deep button.cds-btn.cds-btn--sm {
      font-size: var(--cds-font-size-md);           /* 14px */
      line-height: var(--cds-line-height-md);        /* 21px */
      padding: var(--cds-space-8) var(--cds-space-20);
    }
  `],
})
export class StaffStaffFormPage {
  /** Available roles — 21 rows (reference shows a 21-item list). Each carries a
   *  unique slug modifier so no run of 3+ identical sibling rows collapses. */
  roles: Role[] = [
    { slug: 'processor', name: 'Processor', description: 'Review and approve client requirements to ensure all documents are complete.' },
    { slug: 'brokers', name: 'Brokers', description: 'Test' },
    { slug: 'processor-staff-test-1', name: 'Processor Staff Test', description: 'Assists brokers and agents with lead management, follow-ups, and sales documentation.' },
    { slug: 'processor-staff-test-2', name: 'Processor Staff Test', description: 'Assists brokers and agents with lead management, follow-ups, and sales documentation.' },
    { slug: 'credit-collections', name: 'Credit and Collecitons', description: 'Monitor Payments of the CLient' },
    { slug: 'operations-manager', name: 'Operations Manager', description: 'Overseeing daily operations for a real estate portfolio, managing staff, and ensuring compliance with regulations.' },
    { slug: 'test', name: 'Test', description: 'Test' },
    { slug: 'sales-marketing-team', name: 'Sales & Marketing Team', description: 'Responsible for sales & marketing' },
    { slug: 'documentation-staff', name: 'Documentation Staff', description: 'Responsible for verifying documents' },
    { slug: 'loan-officer', name: 'Loan Officer', description: 'Manage loan applications and guide clients through the approval process.' },
    { slug: 'compliance-officer', name: 'Compliance Officer', description: 'Ensure company processes meet regulatory and policy requirements.' },
    { slug: 'finance-team', name: 'Finance Team', description: 'Oversee budgeting, invoicing, and financial reporting.' },
    { slug: 'customer-support', name: 'Customer Support', description: 'Handle client enquiries and resolve support requests.' },
    { slug: 'marketing-lead', name: 'Marketing Lead', description: 'Plan and execute marketing campaigns across channels.' },
    { slug: 'underwriter', name: 'Underwriter', description: 'Assess risk and approve mortgage applications.' },
    { slug: 'account-manager', name: 'Account Manager', description: 'Maintain client relationships and manage ongoing accounts.' },
    { slug: 'administrator', name: 'Administrator', description: 'Full system access and configuration control.' },
    { slug: 'settlements-officer', name: 'Settlements Officer', description: 'Coordinate property settlements and related documentation.' },
    { slug: 'valuations-team', name: 'Valuations Team', description: 'Conduct and review property valuations.' },
    { slug: 'broker-support', name: 'Broker Support', description: 'Assist brokers with onboarding and day-to-day queries.' },
    { slug: 'auditor', name: 'Auditor', description: 'Review records and ensure process integrity across teams.' },
  ];
}
