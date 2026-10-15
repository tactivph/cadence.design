import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsButtonComponent, CdsDropdownComponent,
  CdsCardComponent, CdsStatTileComponent, CdsBadgeComponent,
  CdsAvatarComponent, CdsDataTableComponent, CdsTableDirective,
} from '../../public-api';

/** A pending-invitation row (pdo staffs-pending-list). */
interface PendingRow { email: string; role: string; dateInvited: string; }
/** A daily-active member row (pdo staffs-daily-active). */
interface ActiveRow { name: string; email: string; roles: string[]; extra?: number; lastActive: string; }
/** A recently-joined member (pdo staffs-recently-joined). */
interface JoinedRow { name: string; invitedBy: string; }

/**
 * MOCK page — Staff · Dashboard › Staff overview
 * (`/staff/dashboard/staff-overview-analytics`).
 *
 * SOURCE-FIRST port of PDO `StaffOverviewComponent`
 * (pages/staff/dashboard/staff-overview). STANDALONE staff page (selector
 * `pdo-staff-overview`) that renders its own heading — there is NO shared
 * dashboard tab-bar. The captured reference (selector `app-root`) shows the
 * STAFF top-nav shell in frame, copied verbatim from the sibling staff
 * sales-marketing-dashboard page (brand wordmark, staff nav items with
 * Dashboard active, Admin caret, notif bell, user chip "Tactiv A." / Staff).
 *
 * Structure mirrors staff-overview.component.html 1:1:
 *   container.staff-analytics.roles-overview
 *     ├ leads-heading
 *     │   ├ leads-heading__header → "Staff overview" h1 + range datepicker
 *     │   └ leads-heading__tabs   → "Invite staff" + "Generate report" buttons
 *     └ staff-analytics-container (two columns):
 *         LEFT · staff-analytics-cards
 *           1 staff-analytics-card "Active staff" → pdo-area-spline-chart
 *           2 "Pending invitations (N)" + "Go to staff" + list-table
 *           3 "Daily active members (N)" + "Go to staff" + list-table
 *         RIGHT · right-container
 *           4 cards-row → staff-stats-card (2×2 stat tiles)
 *           5 visit-schedules-activity "Recently joined" → member list
 *
 * CHART GAP — PDO's `pdo-area-spline-chart` (ApexCharts) and
 * `pdo-range-datepicker` have no Cadence equivalent, so the chart is
 * approximated with a cds-card carrying the real title/subtitle + a minimal
 * presentational SVG spline and "Percentage" y-axis label, and the datepicker
 * is approximated by a cds-dropdown trigger. Presentational only (no data
 * loading / filtering / report download).
 */
@Component({
  selector: 'cds-page-staff-overview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent, CdsButtonComponent, CdsDropdownComponent,
    CdsCardComponent, CdsStatTileComponent, CdsBadgeComponent,
    CdsAvatarComponent, CdsDataTableComponent, CdsTableDirective,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item [active]="true" [hasCaret]="true">Dashboard</a>
      <a cds-nav-item>Approval</a>
      <a cds-nav-item>Leads</a>
      <a cds-nav-item>Clients</a>
      <a cds-nav-item>Processor</a>
      <a cds-nav-item>Sales Network</a>
      <a cds-nav-item>Calendar</a>
      <a cds-nav-item>Calculator</a>
      <a cds-nav-item>Site Map</a>
      <div cds-topnav-actions class="hdr-actions">
        <a cds-nav-item [hasCaret]="true">Admin</a>
        <cds-notif-bell [count]="3"></cds-notif-bell>
        <cds-user-chip name="Tactiv A." role="Staff"></cds-user-chip>
      </div>
    </cds-top-nav>

    <main class="cds-container">
      <!-- leads-heading -->
      <div class="so__heading">
        <!-- leads-heading__header : title + range datepicker -->
        <div class="so__heading-left">
          <h1 class="so__title">Staff overview</h1>
          <cds-dropdown>
            <button cds-dropdown-trigger cds-button variant="secondary" iconRight="ph ph-caret-down">
              Last 285 days: Jan 1, 2026 - Oct 13, 2026
            </button>
          </cds-dropdown>
        </div>
        <!-- leads-heading__tabs : invite staff + generate report -->
        <div class="so__heading-right">
          <button cds-button variant="secondary" iconLeft="ph ph-plus" class="so__invite">Invite staff</button>
          <button cds-button variant="primary">Generate report</button>
        </div>
      </div>

      <!-- staff-analytics-container -->
      <div class="so__grid">
        <!-- LEFT · staff-analytics-cards -->
        <div class="so__col-left">

          <!-- 1 · Active staff (staff-analytics-card → pdo-area-spline-chart) -->
          <cds-card class="chart-card chart-card--active-staff">
            <div class="chart-heading chart-heading--stacked">
              <p class="chart-title">Active staff</p>
              <p class="chart-subtitle">Percentage of daily logged in staff</p>
            </div>
            <div class="spline">
              <span class="axis axis--y">Percentage</span>
              <div class="spline__plot">
                <svg viewBox="0 0 960 300" preserveAspectRatio="none" class="spline__svg" aria-hidden="true">
                  <line x1="0" y1="30"  x2="960" y2="30"  stroke="#EAECF0" stroke-width="1"></line>
                  <line x1="0" y1="97"  x2="960" y2="97"  stroke="#EAECF0" stroke-width="1"></line>
                  <line x1="0" y1="165" x2="960" y2="165" stroke="#EAECF0" stroke-width="1"></line>
                  <line x1="0" y1="232" x2="960" y2="232" stroke="#EAECF0" stroke-width="1"></line>
                  <line x1="0" y1="300" x2="960" y2="300" stroke="#EAECF0" stroke-width="1"></line>
                  <polyline fill="rgba(22,179,100,0.14)" stroke="none"
                    points="0,290 90,285 170,100 250,270 340,278 430,262 520,268 610,272 700,276 790,278 880,280 960,282 960,300 0,300"></polyline>
                  <polyline fill="none" stroke="#16B364" stroke-width="2"
                    points="0,290 90,285 170,100 250,270 340,278 430,262 520,268 610,272 700,276 790,278 880,280 960,282"></polyline>
                </svg>
              </div>
            </div>
          </cds-card>

          <!-- 2 · Pending invitations list -->
          <cds-card class="chart-card chart-card--pending">
            <div class="list-heading">
              <p class="analytics-title">Pending invitations ({{ pendingRows.length }})</p>
              <button cds-button variant="ghost" iconRight="ph-bold ph-arrow-up-right">Go to staff</button>
            </div>
            <cds-data-table>
              <table cdsTable>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Date invited</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of pendingRows; track row.email) {
                    <tr>
                      <td class="email">{{ row.email }}</td>
                      <td><cds-badge tone="info" size="sm" class="so__role">{{ row.role }}</cds-badge></td>
                      <td>{{ row.dateInvited }}</td>
                      <td><button cds-button variant="secondary" size="sm">Cancel invitation</button></td>
                    </tr>
                  }
                </tbody>
              </table>
            </cds-data-table>
          </cds-card>

          <!-- 3 · Daily active members list -->
          <cds-card class="chart-card chart-card--daily-active">
            <div class="list-heading">
              <p class="analytics-title">Daily active members ({{ activeRows.length }})</p>
              <button cds-button variant="ghost" iconRight="ph-bold ph-arrow-up-right">Go to staff</button>
            </div>
            <cds-data-table>
              <table cdsTable>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Last active</th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of activeRows; track row.email) {
                    <tr>
                      <td>
                        <div class="cell-user">
                          <cds-avatar [name]="row.name" size="sm"></cds-avatar>
                          {{ row.name }}
                        </div>
                      </td>
                      <td class="email">{{ row.email }}</td>
                      <td>
                        <div class="cell-roles">
                          @for (r of row.roles; track r) {
                            <cds-badge tone="info" size="sm" class="so__role">{{ r }}</cds-badge>
                          }
                          @if (row.extra) {
                            <cds-badge tone="info" size="sm" class="so__role">+{{ row.extra }}</cds-badge>
                          }
                        </div>
                      </td>
                      <td>{{ row.lastActive }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </cds-data-table>
          </cds-card>
        </div>

        <!-- RIGHT · right-container -->
        <div class="so__col-right">

          <!-- 4 · cards-row → staff-stats-card (2×2 stat tiles) -->
          <cds-card class="chart-card chart-card--stats">
            <div class="stats-grid">
              <div class="stats-col">
                <cds-stat-tile label="All members" [value]="stats.all"></cds-stat-tile>
                <cds-stat-tile label="Daily inactive members" [value]="stats.inactive"></cds-stat-tile>
              </div>
              <div class="stats-col">
                <cds-stat-tile label="Daily active members" [value]="stats.active"></cds-stat-tile>
                <cds-stat-tile label="Pending invitations" [value]="stats.pending"></cds-stat-tile>
              </div>
            </div>
          </cds-card>

          <!-- 5 · Recently joined -->
          <cds-card class="chart-card chart-card--recently-joined">
            <p class="activity-title">Recently joined</p>
            <div class="activity-list">
              @for (m of recentlyJoined; track m.name) {
                <div class="activity-item">
                  <cds-avatar [name]="m.name" size="md"></cds-avatar>
                  <div class="activity-item__body">
                    <p class="activity-item__info"><span class="user-name">{{ m.name }}</span></p>
                    <p class="activity-item__time">{{ m.invitedBy }}</p>
                  </div>
                </div>
              }
            </div>
          </cds-card>
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

    .cds-container { display: flex; flex-direction: column; gap: var(--cds-space-24); }

    /* leads-heading (title + datepicker | invite staff + generate report) */
    .so__heading { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-16); flex-wrap: wrap; }
    .so__heading-left { display: flex; align-items: center; gap: var(--cds-space-16); }
    .so__title { margin: 0; width: fit-content; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 22px; line-height: 26px; letter-spacing: -0.3px; color: var(--cds-text-primary); }
    .so__heading-right { display: flex; align-items: center; gap: var(--cds-space-12); }

    /* staff-analytics-container : left (flex) + right (fixed) columns */
    .so__grid { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: var(--cds-space-24); align-items: start; }
    .so__col-left { display: flex; flex-direction: column; gap: var(--cds-space-24); min-width: 0; }
    .so__col-right { display: flex; flex-direction: column; gap: var(--cds-space-12); }
    @media (max-width: 1100px) { .so__grid { grid-template-columns: 1fr; } }

    /* chart-heading (mirrors PDO .analytics-text / analytics-title / analytics-subtitle) */
    .chart-heading { display: flex; gap: var(--cds-space-12); margin-bottom: var(--cds-space-16); }
    .chart-heading--stacked { flex-direction: column; gap: var(--cds-space-4); }
    .chart-title { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 400; font-size: var(--cds-font-size-lg); line-height: var(--cds-line-height-19); color: var(--cds-text-primary); }
    .chart-subtitle { margin: 0; font-size: var(--cds-font-size-sm); line-height: var(--cds-line-height-14); color: var(--cds-text-secondary); }

    /* list section heading (PDO .analytics-text.d-flex.justify-content-between) */
    .list-heading { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-12); padding: var(--cds-space-8) 0; margin-bottom: var(--cds-space-8); }
    .analytics-title { margin: 0; font-family: var(--cds-font-family-medium); font-weight: var(--cds-weight-regular); font-size: var(--cds-font-size-lg); line-height: var(--cds-line-height-19); color: var(--cds-text-primary); }

    /* area/spline chart approximation */
    .spline { display: flex; align-items: stretch; gap: var(--cds-space-8); }
    .spline__plot { flex: 1 1 auto; min-height: 300px; display: flex; }
    .spline__svg { width: 100%; height: 300px; }
    .axis { font-family: Helvetica, Arial, sans-serif; font-size: var(--cds-font-size-sm); line-height: var(--cds-line-height-18); color: var(--cds-text-primary); writing-mode: vertical-rl; display: inline-flex; align-items: center; justify-content: center; }
    .axis--y { transform: rotate(180deg); }

    /* table cells */
    .cell-user { display: flex; align-items: center; gap: var(--cds-space-8); }
    .cell-roles { display: flex; align-items: center; gap: var(--cds-space-8); }
    td.email { color: var(--cds-primary-700); }

    /* stat-card 2×2 grid (PDO .staff-stats-card → two flex-columns) */
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--cds-space-24); }
    .stats-col { display: flex; flex-direction: column; gap: var(--cds-space-24); }

    /* recently joined (PDO .visit-schedules-activity) */
    .activity-title { margin: 0; padding: var(--cds-space-16) 0; font-family: var(--cds-font-family-regular); font-weight: var(--cds-weight-regular); font-size: var(--cds-font-size-lg); line-height: var(--cds-line-height-19); color: var(--cds-text-secondary); }
    .activity-list { display: flex; flex-direction: column; gap: var(--cds-space-16); }
    .activity-item { display: flex; align-items: center; gap: var(--cds-space-7); }
    .activity-item__body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .activity-item__info { margin: 0; }
    .user-name { font-family: var(--cds-font-family-semibold-face); font-weight: var(--cds-weight-regular); font-size: var(--cds-font-size-md); line-height: var(--cds-line-height-sm); color: var(--cds-text-primary); }
    .activity-item__time { margin: 0; font-size: var(--cds-font-size-sm); line-height: var(--cds-line-height-14); color: var(--cds-text-tertiary); }

    /* ---- cds component internals (scoped ::ng-deep so overrides land) ---- */
    /* transparent card boxes with #f2f4f7 border, radius-sm, no shadow (PDO cards) */
    :host ::ng-deep cds-card.chart-card--active-staff,
    :host ::ng-deep cds-card.chart-card--pending,
    :host ::ng-deep cds-card.chart-card--daily-active,
    :host ::ng-deep cds-card.chart-card--stats,
    :host ::ng-deep cds-card.chart-card--recently-joined {
      background: transparent; border-color: var(--cds-gray-100);
      border-radius: var(--cds-radius-sm); box-shadow: none; padding: var(--cds-space-16);
    }
    :host ::ng-deep cds-card.chart-card--active-staff .cds-card__body,
    :host ::ng-deep cds-card.chart-card--pending .cds-card__body,
    :host ::ng-deep cds-card.chart-card--daily-active .cds-card__body,
    :host ::ng-deep cds-card.chart-card--stats .cds-card__body,
    :host ::ng-deep cds-card.chart-card--recently-joined .cds-card__body { padding: 0; }

    /* groups 1+12 — "Invite staff" neutral secondary button (PDO .btn.btn-secondary-border):
       bg neutral-25 (#fcfcfd), 1px neutral-300 (#bdbdbd) border, body text (#212529),
       14px vertical padding (PDO .btn base $spacing-sm-3). Scoped to this button only. */
    :host ::ng-deep button.so__invite.cds-btn {
      background: var(--cds-gray-25); color: var(--cds-text-body);
      border: 1px solid var(--cds-border-neutral);
      padding-top: var(--cds-space-14); padding-bottom: var(--cds-space-14);
    }

    /* group 3 — "Go to staff" ghost/link buttons are padding-less text links (PDO .btn-ghost) */
    :host ::ng-deep .list-heading button.cds-btn { padding: 0; }

    /* group 4 — table HEADER cells render text-primary (#101828), not the global
       thead text-secondary (PDO list-table th inherits the content primary color) */
    :host ::ng-deep table.cds-table thead th { color: var(--cds-text-primary); }

    /* group 6 — ROLE badges: light-blue fill (PDO .badge-primary = #d1e9ff / info-100)
       with a 4px squared radius (PDO .badge-squared-xs = $radius-xs). Scoped to role
       badges on this page only; beats the component's own tone rule on specificity. */
    :host ::ng-deep cds-badge.so__role {
      background: var(--cds-info-100); border-radius: var(--cds-radius-xs);
    }

    /* group 8 — stat-tile labels (PDO .stat-label: lh 14, padding-bottom 12, flex gap 4) */
    :host ::ng-deep cds-stat-tile .cds-stat-tile__label {
      display: flex; align-items: center; gap: var(--cds-space-4);
      line-height: var(--cds-line-height-14); padding-bottom: var(--cds-space-12);
    }
  `],
})
export class StaffStaffOverviewPage {
  /** pdo-staffs-analytics stats (StaffStats). */
  stats = { all: 55, active: 30, inactive: 16, pending: 9 };

  /** staffs-pending-list (page_size 5) — INVITED staff. */
  pendingRows: PendingRow[] = [
    { email: 'user7@example.com', role: 'Processor Staff Test', dateInvited: 'Apr 6, 2026' },
    { email: 'user31@example.com', role: 'Processor Staff', dateInvited: 'Mar 10, 2026' },
    { email: 'user9@example.com', role: 'Documentation Staff', dateInvited: 'Jan 30, 2026' },
    { email: 'user36@example.com', role: 'Documentation Staff', dateInvited: 'Jan 30, 2026' },
  ];

  /** staffs-daily-active (page_size 5) — ACTIVE staff with last_active. */
  activeRows: ActiveRow[] = [
    { name: 'Elia Calder', email: 'user29@example.com', roles: ['Broker Manager', 'Brokers'], lastActive: 'Jul 9, 2026 at 1:59 am' },
    { name: 'Nils Barden', email: 'user7@example.com', roles: ['Processor Staff'], lastActive: 'Jul 8, 2026 at 4:21 pm' },
    { name: 'Gia Calder', email: 'user46@example.com', roles: ['Documentation Staff'], lastActive: 'Jul 8, 2026 at 9:03 am' },
    { name: 'Aria Ashby', email: 'user10@example.com', roles: ['Broker Manager', 'Brokers', 'Sales'], extra: 1, lastActive: 'Jul 7, 2026 at 2:44 pm' },
    { name: 'Kai Ashby', email: 'user26@example.com', roles: ['Brokers'], lastActive: 'Jul 7, 2026 at 11:12 am' },
  ];

  /** staffs-recently-joined (page_size 3) — newest ACTIVE staff. */
  recentlyJoined: JoinedRow[] = [
    { name: 'Elia Calder', invitedBy: 'Invited by Tactiv Admin (You)' },
    { name: 'Nils Barden', invitedBy: 'Invited by Tactiv Admin (You)' },
    { name: 'Gia Calder', invitedBy: 'Invited by Aria Ashby' },
  ];
}
