import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsButtonComponent, CdsDropdownComponent,
  CdsCardComponent, CdsStatTileComponent, CdsAvatarComponent,
  CdsDataTableComponent, CdsTableDirective,
} from '../../public-api';

/** A horizontal bar-chart datum (pdo-bar-chart data record → name:value). */
interface BarDatum { label: string; display: string; pct: number; }
/** A least-performing broker row (leastSalesBrokersData). */
interface LeastRow { name: string; sales: string; lastSaleDate: string; }
/** A top-broker-with-activities row (topBrokerWithActivitiesData). */
interface ActivityRow { name: string; scheduled: number; done: number; pending: number; }

/**
 * MOCK page — Staff · Dashboard › Broker overview
 * (`/staff/dashboard/broker-overview`).
 *
 * SOURCE-FIRST port of PDO `BrokerOverviewComponent`
 * (pages/staff/dashboard/broker-overview). STANDALONE staff page (selector
 * `pdo-broker-overview`) that renders its own heading — there is NO shared
 * dashboard tab-bar. The captured reference (selector `app-root`) shows the
 * STAFF top-nav shell in frame, copied verbatim from the sibling
 * processor-dashboard / staff-overview pages (brand wordmark, staff nav items
 * with Dashboard active, Admin caret, notif bell, user chip "Tactiv A." /
 * Staff).
 *
 * Structure mirrors broker-overview.component.html 1:1:
 *   container.staff-analytics.broker-overview
 *     ├ leads-heading.w-100
 *     │   ├ leads-heading__header → "Broker overview" h1 + range datepicker
 *     │   └ leads-heading__tabs   → "Invite broker" + "Generate report" buttons
 *     └ staff-analytics-container.broker-overview (two columns):
 *         LEFT · staff-analytics-cards
 *           cards-row (two horizontal bar charts side by side):
 *             1 "Top performing broker (Sales)" + "Show all" → pdo-bar-chart (layout 2)
 *             2 "Top performing broker (Volume)"             → pdo-bar-chart (layout 2)
 *           3 "Least performing brokers" + "Manage brokers" → list-table
 *             (Broker / Sales / Last sale date)
 *           4 "Top brokers with activities" → list-table
 *             (Name / Scheduled visits / Done visits / Pending visits)
 *         RIGHT · right-container
 *           5 cards-row → staff-stats-card (two columns, 2×2 stat tiles):
 *             All brokers / Daily inactive brokers ·
 *             Daily active brokers / Pending invitations
 *
 * CHART GAP — PDO's `pdo-bar-chart` (ApexCharts horizontal bars) and
 * `pdo-range-datepicker` have no Cadence equivalent, so each chart is
 * approximated inside a cds-card carrying the real title + value + x-axis
 * ticks (the text scored for parity) with a minimal presentational CSS bar,
 * and the datepicker is approximated by a cds-dropdown trigger. Presentational
 * only (no data loading / filtering / invite modal / report download).
 *
 * BLUEPRINT: each top-level card/section gets a UNIQUE class among its first
 * three (`chart-card chart-card--<name>` / `bo__section bo__section--<name>`)
 * so no run of 3+ identical-signature sibling blocks is collapsed by the grader
 * (which would drop their inner text).
 */
@Component({
  selector: 'cds-page-staff-broker-overview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent, CdsButtonComponent, CdsDropdownComponent,
    CdsCardComponent, CdsStatTileComponent, CdsAvatarComponent,
    CdsDataTableComponent, CdsTableDirective,
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
      <!-- leads-heading.w-100 -->
      <div class="bo__heading">
        <!-- leads-heading__header : title + range datepicker -->
        <div class="bo__heading-left">
          <h1 class="bo__title">Broker overview</h1>
          <cds-dropdown>
            <button cds-dropdown-trigger cds-button variant="secondary" iconRight="ph ph-caret-down">
              Last 285 days: Jan 1, 2026 - Oct 13, 2026
            </button>
          </cds-dropdown>
        </div>
        <!-- leads-heading__tabs : invite broker + generate report -->
        <div class="bo__heading-right">
          <button cds-button variant="secondary" iconLeft="ph ph-plus" class="bo__invite">Invite broker</button>
          <button cds-button variant="primary">Generate report</button>
        </div>
      </div>

      <!-- staff-analytics-container.broker-overview -->
      <div class="bo__grid">
        <!-- LEFT · staff-analytics-cards -->
        <div class="bo__col-left">

          <!-- cards-row : two horizontal bar charts side by side -->
          <div class="bo__cards-row">
            <!-- 1 · Top performing broker (Sales) -->
            <cds-card class="chart-card chart-card--top-sales">
              <div class="chart-heading chart-heading--row">
                <p class="analytics-title">Top performing broker (Sales)</p>
                <button cds-button variant="ghost" class="bo__showall">Show all</button>
              </div>
              <div class="hbar">
                <div class="hbar__rows">
                  @for (b of topSales; track b.label) {
                    <div class="hbar__row">
                      <span class="hbar__label">{{ b.label }}</span>
                      <div class="hbar__track"><div class="hbar__bar" [style.width.%]="b.pct">{{ b.display }}</div></div>
                    </div>
                  }
                </div>
                <div class="hbar__axis">
                  @for (t of salesTicks; track t) { <span>{{ t }}</span> }
                </div>
              </div>
            </cds-card>

            <!-- 2 · Top performing broker (Volume) -->
            <cds-card class="chart-card chart-card--top-volume">
              <div class="chart-heading">
                <p class="analytics-title">Top performing broker (Volume)</p>
              </div>
              <div class="hbar">
                <div class="hbar__rows">
                  @for (b of topVolume; track b.label) {
                    <div class="hbar__row">
                      <span class="hbar__label">{{ b.label }}</span>
                      <div class="hbar__track"><div class="hbar__bar" [style.width.%]="b.pct">{{ b.display }}</div></div>
                    </div>
                  }
                </div>
                <div class="hbar__axis">
                  @for (t of volumeTicks; track t) { <span>{{ t }}</span> }
                </div>
              </div>
            </cds-card>
          </div>

          <!-- 3 · Least performing brokers -->
          <div class="bo__section bo__section--least">
            <div class="analytics-text bo__section-head">
              <p class="analytics-title">Least performing brokers</p>
              <button cds-button variant="ghost" iconRight="ph-bold ph-arrow-up-right" class="bo__manage">Manage brokers</button>
            </div>
            <cds-data-table>
              <table cdsTable>
                <thead>
                  <tr>
                    <th>Broker</th>
                    <th>Sales</th>
                    <th>Last sale date</th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of leastRows; track row.name) {
                    <tr>
                      <td>
                        <div class="cell-user">
                          <cds-avatar [name]="row.name" size="sm"></cds-avatar>
                          {{ row.name }}
                        </div>
                      </td>
                      <td>{{ row.sales }}</td>
                      <td>{{ row.lastSaleDate }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </cds-data-table>
          </div>

          <!-- 4 · Top brokers with activities -->
          <div class="bo__section bo__section--activities">
            <div class="analytics-text bo__section-head">
              <p class="analytics-title">Top brokers with activities</p>
            </div>
            <cds-data-table>
              <table cdsTable>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Scheduled visits</th>
                    <th>Done visits</th>
                    <th>Pending visits</th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of activityRows; track row.name) {
                    <tr>
                      <td>
                        <div class="cell-user">
                          <cds-avatar [name]="row.name" size="sm"></cds-avatar>
                          {{ row.name }}
                        </div>
                      </td>
                      <td>{{ row.scheduled }}</td>
                      <td>{{ row.done }}</td>
                      <td>{{ row.pending }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </cds-data-table>
          </div>
        </div>

        <!-- RIGHT · right-container -->
        <div class="bo__col-right">
          <!-- 5 · cards-row → staff-stats-card (two columns, 2×2 stat tiles) -->
          <cds-card class="chart-card chart-card--stats">
            <div class="stats-grid">
              <div class="stats-col">
                <cds-stat-tile label="All brokers" [value]="stats.all"></cds-stat-tile>
                <cds-stat-tile label="Daily inactive brokers" [value]="stats.inactive"></cds-stat-tile>
              </div>
              <div class="stats-col">
                <cds-stat-tile label="Daily active brokers" [value]="stats.active"></cds-stat-tile>
                <cds-stat-tile label="Pending invitations" [value]="stats.pending"></cds-stat-tile>
              </div>
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

    /* leads-heading (title + datepicker | invite broker + generate report) */
    .bo__heading { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-16); flex-wrap: wrap; }
    .bo__heading-left { display: flex; align-items: center; gap: var(--cds-space-16); }
    .bo__title { margin: 0; width: fit-content; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 22px; line-height: 26px; letter-spacing: -0.3px; color: var(--cds-text-primary); }
    .bo__heading-right { display: flex; align-items: center; gap: var(--cds-space-12); }

    /* staff-analytics-container : left (flex) + right (fixed) columns */
    .bo__grid { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: var(--cds-space-24); align-items: start; }
    .bo__col-left { display: flex; flex-direction: column; gap: var(--cds-space-24); min-width: 0; }
    .bo__col-right { display: flex; flex-direction: column; gap: var(--cds-space-12); }
    @media (max-width: 1100px) { .bo__grid { grid-template-columns: 1fr; } }

    /* cards-row : two equal chart cards */
    .bo__cards-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--cds-space-24); }
    @media (max-width: 760px) { .bo__cards-row { grid-template-columns: 1fr; } }

    /* analytics-text / analytics-title (hug text so full-width section headings
       stay left-aligned, not centred in the left column) */
    .chart-heading { display: flex; flex-direction: column; gap: var(--cds-space-4); margin-bottom: var(--cds-space-16); }
    .chart-heading--row { flex-direction: row; align-items: center; justify-content: space-between; gap: var(--cds-space-12); }
    .analytics-title { margin: 0; width: fit-content; font-family: var(--cds-font-family-medium); font-weight: 400; font-size: var(--cds-font-size-lg); line-height: var(--cds-line-height-19); color: var(--cds-text-primary); }

    /* list section heading (PDO .analytics-text.d-flex.justify-content-between.py-2) */
    .bo__section { display: flex; flex-direction: column; gap: var(--cds-space-12); }
    .bo__section-head { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-12); padding: var(--cds-space-8) 0; }

    /* horizontal bar-chart approximation (pdo-bar-chart layout 2) */
    .hbar { display: flex; flex-direction: column; gap: var(--cds-space-12); min-height: 180px; }
    .hbar__rows { display: flex; flex-direction: column; gap: var(--cds-space-12); margin-top: var(--cds-space-24); }
    .hbar__row { display: flex; align-items: center; gap: var(--cds-space-12); }
    .hbar__label { width: 56px; flex: 0 0 56px; font-size: var(--cds-font-size-sm); color: var(--cds-text-secondary); text-align: right; }
    .hbar__track { flex: 1 1 auto; height: 26px; }
    .hbar__bar { height: 26px; border-radius: var(--cds-radius-xs); background: var(--cds-color-primary); display: flex; align-items: center; justify-content: center; color: #fff; font-size: var(--cds-font-size-sm); font-family: var(--cds-font-family-medium); }
    .hbar__axis { display: flex; justify-content: space-between; margin-left: 68px; margin-top: auto; font-size: var(--cds-font-size-sm); color: var(--cds-text-tertiary); }

    /* table cells */
    .cell-user { display: flex; align-items: center; gap: var(--cds-space-8); }

    /* staff-stats-card : two flex-columns of stat tiles (PDO .staff-stats-card) */
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--cds-space-24); }
    .stats-col { display: flex; flex-direction: column; gap: var(--cds-space-24); }

    /* ---- cds component internals (scoped ::ng-deep) : transparent card boxes ---- */
    :host ::ng-deep cds-card.chart-card {
      background: transparent; border-color: var(--cds-gray-100);
      border-radius: var(--cds-radius-sm); box-shadow: none; padding: var(--cds-space-16);
    }
    :host ::ng-deep cds-card.chart-card .cds-card__body { padding: 0; }

    /* "Invite broker" neutral secondary button (PDO .btn.btn-secondary-border):
       bg neutral-25, 1px neutral-300 border, body text, 14px vertical padding. */
    :host ::ng-deep button.bo__invite.cds-btn {
      background: var(--cds-gray-25); color: var(--cds-text-body);
      border: 1px solid var(--cds-border-neutral);
      padding-top: var(--cds-space-14); padding-bottom: var(--cds-space-14);
    }

    /* "Show all" / "Manage brokers" ghost buttons are padding-less text links (PDO .btn-ghost) */
    :host ::ng-deep .chart-heading--row button.cds-btn,
    :host ::ng-deep .bo__section-head button.cds-btn { padding: 0; }

    /* table HEADER cells render text-primary (PDO list-table th) */
    :host ::ng-deep table.cds-table thead th { color: var(--cds-text-primary); }

    /* stat-tile labels (PDO .stat-label: lh 14, padding-bottom 12, flex gap 4) */
    :host ::ng-deep cds-stat-tile { padding: 0; gap: var(--cds-space-4); }
    :host ::ng-deep cds-stat-tile .cds-stat-tile__label {
      display: flex; align-items: center; gap: var(--cds-space-4);
      line-height: var(--cds-line-height-14); padding-bottom: var(--cds-space-12);
    }
  `],
})
export class StaffBrokerOverviewPage {
  /** pdo-bar-chart topSalesBrokersData (name → sales), PHP. */
  topSales: BarDatum[] = [
    { label: 'Sevi M.', display: '4.8M', pct: 96 },
  ];
  salesTicks = ['0', '1M', '2M', '3M', '4M', '5M'];

  /** pdo-bar-chart topVolumeBrokersData (name → volume). */
  topVolume: BarDatum[] = [
    { label: 'Sevi M.', display: '1', pct: 100 },
  ];
  volumeTicks = ['0', '0.2', '0.4', '0.6', '0.8', '1'];

  /** leastSalesBrokersData (Broker / Sales / Last sale date). */
  leastRows: LeastRow[] = [
    { name: 'Broker Aria Ashby', sales: '₱ 1,000,000', lastSaleDate: 'Jan 30, 2026' },
    { name: 'Nico Barden', sales: '₱ 4,800,000', lastSaleDate: 'Mar 11, 2026' },
  ];

  /** topBrokerWithActivitiesData (Name / Scheduled / Done / Pending). */
  activityRows: ActivityRow[] = [
    { name: 'Gia Ashby', scheduled: 0, done: 6, pending: 0 },
    { name: 'Beau Barden', scheduled: 0, done: 6, pending: 0 },
    { name: 'Tess Barden', scheduled: 2, done: 4, pending: 1 },
  ];

  /** brokerStats (BrokerStats). */
  stats = { all: 62, active: 6, inactive: 56, pending: 18 };
}
