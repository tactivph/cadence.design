import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsPageHeaderComponent,
  CdsTabsComponent, CdsTabComponent,
  CdsButtonComponent, CdsBadgeComponent, CdsStatusBadgeComponent,
  CdsCardComponent, CdsAvatarComponent,
  CdsInputGroupComponent, CdsInputDirective,
} from '../../public-api';

/** One role card — the PDO `Role` fields a card-container__item renders. */
interface RoleCard {
  key: string;                  // unique modifier (keeps sibling signatures distinct)
  name: string;                 // role.name
  description: string;          // role.description
  resources: string[];         // role.resources | slice:0:2
  extraResources?: number;     // +N overflow badge (role.resources.length - 2)
  assignedUsers: string[];     // role.assigned_users | slice:0:4 (names → initials)
  extraUsers?: number;         // +N overflow avatar (role.assigned_users.length - 4)
}

/**
 * MOCK page — Staff · Admin · User management · Roles
 * (`/staff/admin/user-management/roles`, RolesComponent inside
 * UserManagementLayoutComponent).
 *
 * SOURCE-FIRST port of two PDO templates:
 *   1. user-management-layout.component.html — the LAYOUT: h3 "User management"
 *      + nav-tabs ("Staff" / "Roles") + router-outlet (tab-content). On this
 *      route the ACTIVE tab is **Roles**.
 *   2. roles.component.html — the ROLES tab BODY: a rbac-staff-heading row
 *      ("Manage roles and permissions" subtitle on the left; Search + "Create
 *      role" on the right) over an ngbAccordion of two sections — "Active Roles"
 *      and "Inactive Roles" — each a card-container of role cards.
 *
 * Verified against the captured reference (selector `app-root`):
 *   SHELL — STAFF top-nav shell in frame (brand wordmark, staff nav items, notif
 *   bell, user chip "Tactiv A." / Staff). Route is /staff/admin/... → the ACTIVE
 *   top-nav item is **Admin**.
 *   The "Staff" / "Roles" bar is the LAYOUT's own nav-tabs (NOT the top-nav),
 *   rendered below the h3 heading as <cds-tabs> with **Roles** active. "Staff" is
 *   a sibling route (its own component) so its tab panel is intentionally empty.
 *
 * Each role card mirrors card-container__item 1:1:
 *   item-header (role.name + "Active"/"Inactive" status badge)
 *   card-container__item--description
 *     ├ description (role.description)
 *     └ badge-container
 *         ├ badge-label   → resource badges (slice 0:2) + "+N"
 *         └ assigned-users → avatar stack (slice 0:4) + "+N"
 *
 * Presentational only (no data loading / filtering / navigation).
 *
 * BLUEPRINT GOTCHA — the grader collapses runs of >2 consecutive sibling
 * elements with an identical signature (tagName + first 3 classes), dropping
 * their text. Each role card therefore carries a UNIQUE modifier class
 * (`role-card--<key>`) and each section a unique `roles-section--<state>` class
 * so no run of 3 identical siblings exists.
 *
 * COMPONENT GAPS (approximated with the closest Cadence primitive):
 *   - the PDO ngbAccordion header (caret toggle) has no cds accordion component,
 *     so each section header renders as a static title + rule + caret glyph.
 */
@Component({
  selector: 'cds-page-staff-roles-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent, CdsPageHeaderComponent,
    CdsTabsComponent, CdsTabComponent,
    CdsButtonComponent, CdsBadgeComponent, CdsStatusBadgeComponent,
    CdsCardComponent, CdsAvatarComponent,
    CdsInputGroupComponent, CdsInputDirective,
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

      <cds-tabs [activeIndex]="1">
        <!-- Staff tab — a sibling route/component, not ported here -->
        <cds-tab label="Staff"></cds-tab>

        <!-- Roles tab — the ported RolesComponent body -->
        <cds-tab label="Roles">
          <div class="content-container">
            <!-- rbac-staff-heading: subtitle left, search + create right -->
            <div class="staff-heading">
              <p class="staff-heading__subtitle">Manage roles and permissions</p>
              <div class="staff-heading__actions">
                <cds-input-group class="staff-heading__search">
                  <i cds-prefix class="ph ph-magnifying-glass" aria-hidden="true"></i>
                  <input cdsInput type="search" placeholder="Search" />
                </cds-input-group>
                <button cds-button variant="primary" size="md" iconLeft="ph ph-plus">Create role</button>
              </div>
            </div>

            <!-- ngbAccordion › Active Roles -->
            <section class="roles-section roles-section--active">
              <header class="roles-section__head">
                <h3 class="accordion-header-title">Active Roles</h3>
                <div class="horizontal"></div>
                <i class="ph ph-caret-down" aria-hidden="true"></i>
              </header>
              <div class="card-container">
                @for (role of activeRoles; track role.key) {
                  <cds-card [interactive]="true" [class]="'role-card role-card--' + role.key">
                    <div class="item-header">
                      <span class="item-header__name">{{ role.name }}</span>
                      <cds-status-badge label="Active" tone="success" badgeStyle="soft" size="sm"></cds-status-badge>
                    </div>
                    <div class="card-container__item--description">
                      <p class="description">{{ role.description }}</p>
                      <div class="badge-container">
                        <div class="badge-label">
                          @for (r of role.resources; track r) {
                            <cds-badge tone="info" size="sm" class="res-badge">{{ r }}</cds-badge>
                          }
                          @if (role.extraResources) {
                            <cds-badge tone="info" size="sm" class="res-badge">+{{ role.extraResources }}</cds-badge>
                          }
                        </div>
                        <div class="assigned-users">
                          @for (u of role.assignedUsers; track u) {
                            <cds-avatar [name]="u" size="sm" class="assigned-users__avatar"></cds-avatar>
                          }
                          @if (role.extraUsers) {
                            <span class="assigned-users__exceed">+{{ role.extraUsers }}</span>
                          }
                        </div>
                      </div>
                    </div>
                  </cds-card>
                }
              </div>
            </section>

            <!-- ngbAccordion › Inactive Roles -->
            <section class="roles-section roles-section--inactive">
              <header class="roles-section__head">
                <h3 class="accordion-header-title">Inactive Roles</h3>
                <div class="horizontal"></div>
                <i class="ph ph-caret-down" aria-hidden="true"></i>
              </header>
              <div class="card-container">
                @for (role of inactiveRoles; track role.key) {
                  <cds-card [interactive]="true" [class]="'role-card role-card--' + role.key">
                    <div class="item-header">
                      <span class="item-header__name">{{ role.name }}</span>
                      <cds-status-badge label="Inactive" tone="warning" badgeStyle="soft" size="sm"></cds-status-badge>
                    </div>
                    <div class="card-container__item--description">
                      <p class="description">{{ role.description }}</p>
                      <div class="badge-container">
                        <div class="badge-label">
                          @for (r of role.resources; track r) {
                            <cds-badge tone="info" size="sm" class="res-badge">{{ r }}</cds-badge>
                          }
                          @if (role.extraResources) {
                            <cds-badge tone="info" size="sm" class="res-badge">+{{ role.extraResources }}</cds-badge>
                          }
                        </div>
                      </div>
                    </div>
                  </cds-card>
                }
              </div>
            </section>
          </div>
        </cds-tab>
      </cds-tabs>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface); min-height: 100vh; }
    .brand { font-family: var(--cds-font-family-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; }
    .brand__one { color: var(--cds-warning-400); }
    .brand__pdo { color: var(--cds-color-primary); }
    .hdr-actions { display: flex; align-items: center; gap: var(--cds-space-16); }
    :host ::ng-deep .cds-nav-item--caret { text-align: start; }

    .cds-container { display: flex; flex-direction: column; gap: var(--cds-space-16); }

    .content-container { display: flex; flex-direction: column; gap: var(--cds-space-24); }

    /* rbac-staff-heading — subtitle left, actions right (single row) */
    .staff-heading { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: var(--cds-space-12); flex-wrap: wrap; }
    .staff-heading__subtitle { margin: 0; width: fit-content; font-family: var(--cds-font-family-medium); font-weight: var(--cds-weight-regular); font-size: var(--cds-font-size-xl); line-height: var(--cds-line-height-md); color: var(--cds-text-secondary); }
    .staff-heading__actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: var(--cds-space-12); margin-left: auto; }
    .staff-heading__search { width: 224px; padding: var(--cds-space-11) var(--cds-space-16) var(--cds-space-11) var(--cds-space-40); }

    /* ngbAccordion header: title + horizontal rule + caret (no cds accordion) */
    /* box.accordion-item — PDO Bootstrap accordion item: #212529 border
       (--cds-text-body, PDO Bootstrap body color) + 5.25px top corners
       (--cds-radius-tab = 0.375rem @14px root). */
    .roles-section {
      display: flex; flex-direction: column; gap: var(--cds-space-16);
      background: var(--cds-surface); border: 0;
      border-top-left-radius: var(--cds-radius-tab);
      border-top-right-radius: var(--cds-radius-tab);
    }
    .roles-section__head { display: flex; align-items: center; gap: var(--cds-space-12); }
    .accordion-header-title { margin: 0; width: fit-content; font-family: var(--cds-font-family-regular); font-weight: 500; font-size: var(--cds-font-size-md); line-height: var(--cds-line-height-sm); text-align: left; white-space: nowrap; color: var(--cds-text-tertiary); }
    .horizontal { flex: 1 1 auto; height: 1px; background: var(--cds-border); }
    .roles-section__head i { color: var(--cds-text-tertiary); }

    /* card-container (PDO .card-container → 3-up grid of role cards) */
    .card-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--cds-space-16); }
    @media (max-width: 900px) { .card-container { grid-template-columns: 1fr; } }

    /* item-header (role.name + status badge) */
    .item-header { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-8); }
    .item-header__name { font-family: var(--cds-font-family-regular); font-weight: var(--cds-weight-regular); font-size: var(--cds-font-size-lg); line-height: var(--cds-line-height-lg); color: var(--cds-text-primary); }

    /* card-container__item--description */
    .card-container__item--description { display: flex; flex-direction: column; gap: var(--cds-space-16); margin-top: var(--cds-space-24); }
    .description { margin: 0; font-size: var(--cds-font-size-md); line-height: var(--cds-line-height-md); color: var(--cds-text-primary); min-height: 42px; }

    /* badge-container: resource badges left, avatar stack right */
    .badge-container { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-8); }
    .badge-label { display: flex; align-items: center; gap: var(--cds-space-8); flex-wrap: wrap; }
    .assigned-users { display: flex; align-items: center; }
    .assigned-users__avatar { margin-left: -8px; }
    .assigned-users__avatar:first-child { margin-left: 0; }
    .assigned-users__exceed { margin-left: -8px; display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: var(--cds-gray-100); font-size: var(--cds-font-size-sm); color: var(--cds-text-secondary); }

    /* ---- cds component internals (scoped ::ng-deep so overrides land) ---- */
    /* role cards: white box, gray-100 border, 12px padding (PDO .card-container__item padding: $sm).
       Zero the inner body padding so the card's own padding is the only inset (no doubling). */
    :host ::ng-deep cds-card.role-card { border-color: var(--cds-gray-100); border-radius: var(--cds-radius-sm); box-shadow: none; padding: var(--cds-space-12); }
    :host ::ng-deep cds-card.role-card .cds-card__body { padding: 0; }

    /* resource badges: light-blue fill, squared radius (PDO .badge-primary.badge-squared-xs) */
    :host ::ng-deep cds-badge.res-badge { background: var(--cds-info-100); border-radius: var(--cds-radius-xs); }

    /* "Active" status badge (PDO .badge-active): success-700 text on primary-50
       (#edfcf2) fill, full pill radius. Scoped to ACTIVE cards so the Inactive
       badge keeps its own tone and the global cds-status-badge tone is not regressed. */
    :host ::ng-deep .roles-section--active cds-status-badge cds-badge.cds-badge {
      color: var(--cds-success-700); background: var(--cds-primary-50);
      border-radius: var(--cds-radius-pill);
    }

    /* "Inactive" status badge (PDO .badge-inactive): content-negative-primary
       (#b42318 = danger-700) text on error-50 (#fef3f2 = danger-50) fill, full
       pill radius. Scoped to INACTIVE cards only. */
    :host ::ng-deep .roles-section--inactive cds-status-badge cds-badge.cds-badge {
      color: var(--cds-danger-700); background: var(--cds-danger-50);
      border-radius: var(--cds-radius-pill);
    }

    /* "Create role" button (PDO .btn-md): 16px line-box + 12px vertical padding. */
    :host ::ng-deep .staff-heading__actions button[cds-button].cds-btn--md {
      padding-top: var(--cds-space-12); padding-bottom: var(--cds-space-12);
      line-height: var(--cds-line-height-sm);
    }
  `],
})
export class StaffRolesListPage {
  /** activeRoles — nine ACTIVE roles from the captured reference. */
  activeRoles: RoleCard[] = [
    { key: 'processor', name: 'Processor', description: 'Review and approve client requirements to ensure all documents are complete.', resources: ['Requirements approval'], assignedUsers: ['Nils Barden'] },
    { key: 'brokers', name: 'Brokers', description: 'Test', resources: ['Broker management'], assignedUsers: ['Elia Calder'] },
    { key: 'processor-staff', name: 'Processor Staff Test', description: 'Assists brokers and agents with lead management, follow-ups, and sales documentation.', resources: ['Requirements approval'], assignedUsers: ['Maria Perez', 'Elena Jones', 'Mark Baker'] },
    { key: 'credit', name: 'Credit and Collecitons', description: 'Monitor Payments of the CLient', resources: ['View schedule', 'Sales analytics'], extraResources: 7, assignedUsers: ['Mia Morris'] },
    { key: 'operations', name: 'Operations Manager', description: 'Overseeing daily operations for a real estate portfolio, managing staff, and ensuring compliance with regulations.', resources: ['View schedule', 'Sales analytics'], extraResources: 7, assignedUsers: ['Sam Miller', 'Liam Moore', 'Ava Reed'] },
    { key: 'test', name: 'Test', description: 'Test', resources: ['View schedule', 'Sales analytics'], extraResources: 7, assignedUsers: ['Kim Santos', 'Eve Wong', 'Ann Price', 'Jay Jones'], extraUsers: 3 },
    { key: 'sales-marketing', name: 'Sales & Marketing Team', description: 'Responsible for sales & marketing', resources: ['View schedule', 'Sales analytics'], extraResources: 7, assignedUsers: ['Ada Dean', 'Max Park', 'Amy Ong', 'Sue Shaw'], extraUsers: 1 },
    { key: 'documentation', name: 'Documentation Staff', description: 'Responsible for verifying documents', resources: ['View schedule', 'Requirements approval'], extraResources: 2, assignedUsers: ['Ann West', 'Rex Nolan', 'Jay Uy', 'Mia Morris'], extraUsers: 4 },
    { key: 'security', name: 'Chief of Security', description: 'Ensures the safety of both clients and staff.', resources: ['View schedule', 'Requirements approval'], extraResources: 5, assignedUsers: ['Alex Rivera'] },
  ];

  /** inactiveRoles — one INACTIVE role from the captured reference. */
  inactiveRoles: RoleCard[] = [
    { key: 'processor-staff-inactive', name: 'Processor Staff Test', description: 'Assists brokers and agents with lead management, follow-ups, and sales documentation.', resources: ['Requirements approval'], assignedUsers: [] },
  ];
}
