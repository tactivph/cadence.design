import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsPageHeaderComponent,
  CdsTabsComponent, CdsTabComponent,
  CdsButtonComponent, CdsBadgeComponent,
  CdsInputGroupComponent, CdsInputDirective,
  CdsTableDirective, CdsTableHeaderComponent, CdsTablePaginationComponent,
  CdsTableColumn,
} from '../../public-api';

/** One staff row — the PDO `Staff` fields the list-table loop renders. */
interface StaffRow {
  id: string;
  name: string;                 // first_name + last_name (avatar + name)
  email: string;
  roles: string[];              // item.roles | slice:0:2 (+N overflow badge)
  lastActive: string;           // last_active | dateFormat | '-'
  dateAdded: string;            // created_at | dateFormat
  status: 'Active' | 'Inactive' | 'Invited';  // current_status | titlecase
}

/**
 * MOCK page — Staff · Admin · User management
 * (`/staff/admin/user-management`, UserManagementLayoutComponent →
 * UserManagementComponent).
 *
 * SOURCE-FIRST port of two PDO templates:
 *   1. user-management-layout.component.html — the LAYOUT: h3 "User management"
 *      + nav-tabs ("Staff" active / "Roles") + router-outlet (tab-content).
 *   2. user-management.component.html — the STAFF tab BODY: a rbac-staff-heading
 *      row ("Invite and assign roles" subtitle on the left; funnel filter +
 *      Search + "Invite staff" on the right) over the staff list-table and a
 *      pdo-table-pagination footer.
 *
 * Verified against the captured reference (selector `app-root`):
 *
 *   SHELL — the STAFF top-nav shell is in frame (copied verbatim from the
 *   sibling staff clients-list page: brand wordmark, staff nav items, notif
 *   bell, user chip "Tactiv A." / Staff). The reference nav highlights the
 *   "Admin" caret item (white text on the filled green pill) — route is
 *   /staff/admin/... → ACTIVE top-nav item is **Admin**.
 *
 *   The "Staff" / "Roles" bar is the LAYOUT's own nav-tabs (NOT the top-nav),
 *   rendered below the h3 heading as <cds-tabs> with Staff active. "Roles" is a
 *   sibling route (its own component) so its tab panel is intentionally empty
 *   here — only the Staff panel is ported.
 *
 *   DATA — the captured DOM caught the table loading/empty, so the staff rows +
 *   pagination are reproduced from the screenshot (10 of 55 staff members).
 *
 * Structure mirrors the two templates 1:1:
 *   rbac-staff-list > container
 *     ├ content-header  → h3 "User management"            (cds-page-header)
 *     ├ nav-tabs         → Staff (active) / Roles          (cds-tabs)
 *     └ tab-content (Staff) > content-container
 *         ├ rbac-staff-heading
 *         │   ├ subtitle  "Invite and assign roles"
 *         │   └ tabs      funnel filter · Search · Invite staff
 *         ├ table.list-table
 *         │   Name · Email · Roles · Last active · Date added · Status · (action)
 *         └ pdo-table-pagination  ("staff member", 10 of 55)
 *
 * Presentational only (no data loading / filtering / invite behaviour).
 *
 * COMPONENT GAPS (approximated with the closest Cadence primitive):
 *   - the funnel filter button is a PDO ngbDropdown trigger; there is no cds
 *     dropdown component, so it renders as a static `.cds-icon-btn`.
 */
@Component({
  selector: 'cds-page-staff-user-management',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent, CdsPageHeaderComponent,
    CdsTabsComponent, CdsTabComponent,
    CdsButtonComponent, CdsBadgeComponent,
    CdsInputGroupComponent, CdsInputDirective,
    CdsTableDirective, CdsTableHeaderComponent, CdsTablePaginationComponent,
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
        <cds-notif-bell [count]="0"></cds-notif-bell>
        <cds-user-chip name="Tactiv A." role="Staff"></cds-user-chip>
      </div>
    </cds-top-nav>

    <main class="cds-container">
      <!-- LAYOUT: content-header + nav-tabs -->
      <cds-page-header title="User management"></cds-page-header>

      <cds-tabs [activeIndex]="0">
        <!-- Staff tab — the ported UserManagementComponent body -->
        <cds-tab label="Staff">
          <!-- rbac-staff-heading: subtitle left, filter + search + invite right -->
          <div class="staff-heading">
            <p class="staff-heading__subtitle">Invite and assign roles</p>
            <div class="staff-heading__actions">
              <button class="cds-icon-btn" aria-label="Filters"><i class="ph-bold ph-funnel"></i></button>
              <cds-input-group class="staff-heading__search">
                <i cds-prefix class="ph ph-magnifying-glass" aria-hidden="true"></i>
                <input cdsInput type="search" placeholder="Search" />
              </cds-input-group>
              <button cds-button variant="primary" size="md" iconLeft="ph ph-plus">Invite staff</button>
            </div>
          </div>

          <!-- staff list-table -->
          <div class="cds-table-wrap">
            <table cdsTable class="list-table">
              <thead><tr><cds-table-header [columns]="columns"></cds-table-header></tr></thead>
              <tbody>
                @for (r of rows; track r.id) {
                  <tr>
                    <td class="column-name">
                      <span class="user-cell"><img class="user-cell__avatar" [src]="placeholder" alt="" /> {{ r.name }}</span>
                    </td>
                    <td class="email">{{ r.email }}</td>
                    <td>
                      <span class="roles">
                        @for (role of r.roles.slice(0, 2); track role) {
                          <cds-badge tone="info" badgeStyle="soft" shape="rounded" size="sm">{{ role }}</cds-badge>
                        }
                        @if (r.roles.length > 2) {
                          <cds-badge tone="info" badgeStyle="soft" shape="rounded" size="sm">+{{ r.roles.length - 2 }}</cds-badge>
                        }
                      </span>
                    </td>
                    <td class="last-active">{{ r.lastActive }}</td>
                    <td class="date-added">{{ r.dateAdded }}</td>
                    <td>
                      <cds-badge [tone]="toneFor(r.status)" badgeStyle="soft" shape="pill" size="sm">{{ r.status }}</cds-badge>
                    </td>
                    <td class="column-action">
                      @if (r.status === 'Invited') {
                        <button cds-button variant="secondary-neutral" size="sm">Resend invite</button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <cds-table-pagination
            itemName="staff member"
            [page]="1"
            [pageSize]="10"
            [collectionSize]="55"></cds-table-pagination>
        </cds-tab>

        <!-- Roles tab — a sibling route/component, not ported here -->
        <cds-tab label="Roles"></cds-tab>
      </cds-tabs>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface); min-height: 100vh; }
    .brand { font-family: var(--cds-font-family-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; }
    .brand__one { color: var(--cds-warning-400); }
    .brand__pdo { color: var(--cds-color-primary); }
    .hdr-actions { display: flex; align-items: center; gap: var(--cds-space-16); }

    /* staff caret nav items (Dashboard, Admin) align start, not center (page-scoped) */
    :host ::ng-deep .cds-nav-item--caret { text-align: start; }

    .cds-container { display: flex; flex-direction: column; gap: var(--cds-space-16); }

    /* rbac-staff-heading — subtitle left, actions right (single row) */
    .staff-heading { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: var(--cds-space-12); flex-wrap: wrap; margin-bottom: var(--cds-space-16); }
    .staff-heading__subtitle { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: var(--cds-font-size-lg); line-height: var(--cds-line-height-md); color: var(--cds-text-primary); }
    .staff-heading__actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: var(--cds-space-12); margin-left: auto; }
    .staff-heading__search { width: 224px; padding: var(--cds-space-11) var(--cds-space-16) var(--cds-space-11) var(--cds-space-40); }

    /* Name cell: avatar + name (PDO .d-flex.gap-2 => 0.5rem) */
    .user-cell { display: inline-flex; align-items: center; gap: var(--cds-space-7); }
    .user-cell__avatar { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }

    /* Email cell link (PDO td.email { color: $primary-700 }) */
    .email { color: var(--cds-primary-700); }

    /* Roles cell: inline soft badges (PDO .roles) */
    .roles { display: inline-flex; align-items: center; gap: var(--cds-space-7); flex-wrap: wrap; }

    .column-action { text-align: right; }
  `],
})
export class StaffUserManagementPage {
  /** Neutral avatar placeholder (data URI so the cell carries a real <img>). */
  placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12" fill="rgb(207,212,220)"/></svg>'
  );

  /** list-table <thead> from user-management.component.html — 7 columns. */
  columns: CdsTableColumn[] = [
    { label: 'Name' },
    { label: 'Email' },
    { label: 'Roles' },
    { label: 'Last active' },
    { label: 'Date added' },
    { label: 'Status' },
    { label: '' },             // row action (Resend invite)
  ];

  /** `staffsList` — one page of staff (10 of 55), from the reference screenshot. */
  rows: StaffRow[] = [
    { id: '1', name: 'Elia Calder', email: 'user29@example.com', roles: ['Broker Manager', 'Brokers'], lastActive: 'Jul. 09, 2026 at 01:59 am', dateAdded: 'Jul 07, 2026', status: 'Active' },
    { id: '2', name: 'Kai Barden', email: 'user39@example.com', roles: ['Super admin'], lastActive: 'May. 25, 2026 at 11:23 am', dateAdded: 'May 25, 2026', status: 'Inactive' },
    { id: '3', name: 'Nils Barden', email: 'user30@example.com', roles: ['Processor Staff', 'Sales & Documentation Team', 'Brokers', 'Admin', 'Reviewer'], lastActive: 'May. 12, 2026 at 02:30 am', dateAdded: 'May 12, 2026', status: 'Active' },
    { id: '4', name: 'Gia Calder', email: 'user43@example.com', roles: ['Super admin'], lastActive: 'Oct. 01, 2026 at 01:00 pm', dateAdded: 'May 04, 2026', status: 'Active' },
    { id: '5', name: 'Opal Barden', email: 'user7@example.com', roles: ['Processor Staff Test'], lastActive: '-', dateAdded: 'Apr 06, 2026', status: 'Invited' },
    { id: '6', name: 'Hugo Barden', email: 'user6@example.com', roles: ['Sales & Marketing Team'], lastActive: 'Apr. 06, 2026 at 03:11 pm', dateAdded: 'Mar 31, 2026', status: 'Active' },
    { id: '7', name: 'Celia Barden', email: 'user28@example.com', roles: ['Processor Staff', 'Sales & Documentation Team'], lastActive: 'Mar. 11, 2026 at 02:00 am', dateAdded: 'Mar 11, 2026', status: 'Active' },
    { id: '8', name: 'Finn Barden', email: 'user31@example.com', roles: ['Processor Staff'], lastActive: '-', dateAdded: 'Mar 10, 2026', status: 'Invited' },
    { id: '9', name: 'Elia Barden', email: 'user32@example.com', roles: ['Super admin'], lastActive: 'Jun. 01, 2026 at 11:31 pm', dateAdded: 'Mar 06, 2026', status: 'Active' },
    { id: '10', name: 'Leo Barden', email: 'user35@example.com', roles: ['Operations Manager'], lastActive: 'Jan. 30, 2026 at 12:11 pm', dateAdded: 'Jan 30, 2026', status: 'Inactive' },
  ];

  /** PDO status → badge tone: ACTIVE badge-active, INVITED badge-neutral-700, INACTIVE badge-warning. */
  toneFor(status: StaffRow['status']): 'success' | 'neutral' | 'danger' {
    return status === 'Active' ? 'success' : status === 'Invited' ? 'neutral' : 'danger';
  }
}
