import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsTabsComponent, CdsTabComponent,
  CdsInputGroupComponent, CdsInputDirective,
  CdsTableDirective, CdsTableHeaderComponent, CdsTablePaginationComponent,
  CdsTableColumn, CdsStatusBadgeComponent,
  CdsCardComponent, CdsEmptyStateComponent,
} from '../../public-api';

/** One visit-schedule row — PDO `Schedule` fields the table renders. */
interface Row {
  id: string;
  lead: string;        // item.lead.first_name + last_name
  property: string;    // item.property.development.name
  datetime: string;    // item.date_of_viewing | dateFormat
  complete: boolean;   // item.report ? Complete : Incomplete
}

/**
 * MOCK page — Agent · Dashboard › Visit schedules
 * (`/agent/dashboard/visit-schedules`).
 *
 * SOURCE-FIRST port of PDO `VisitSchedulesComponent`
 * (pages/agent/dashboard/_components/visit-schedules), rendered inside the
 * parent `DashboardComponent` shell (top nav + "Dashboard" title + nav-tabs),
 * which the captured reference (selector `app-root`) shows in frame. The tabs
 * are the dashboard chrome; the routed visit-schedules body renders BELOW them
 * — exactly as the status-board sibling composes its shell.
 *
 * Structure mirrors visit-schedules.component.html 1:1:
 *   kanban-container
 *     ├ leads-heading  → "List of visit schedules" title + Search
 *     └ visit-schedules (two columns)
 *         ├ main   → list-table (Lead name · Requested by · Property name ·
 *         │          Date & time · Status) + table-pagination
 *         └ visit-schedules-activity → "Activity" + empty state
 *
 * Presentational only (no data loading / offcanvas / filtering behaviour).
 */
@Component({
  selector: 'cds-page-agent-visit-schedules',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent, CdsTabsComponent, CdsTabComponent,
    CdsInputGroupComponent, CdsInputDirective,
    CdsTableDirective, CdsTableHeaderComponent, CdsTablePaginationComponent,
    CdsStatusBadgeComponent, CdsCardComponent, CdsEmptyStateComponent,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item [active]="true" [hasCaret]="true">Dashboard</a>
      <a cds-nav-item>Leads</a>
      <a cds-nav-item>Clients</a>
      <a cds-nav-item>Calendar</a>
      <a cds-nav-item>Calculator</a>
      <a cds-nav-item>Site Map</a>
      <div cds-topnav-actions class="hdr-actions">
        <button class="cds-icon-btn" aria-label="Help"><i class="ph-bold ph-question"></i></button>
        <cds-notif-bell [count]="19"></cds-notif-bell>
        <cds-user-chip name="Jude Calder" role="Agent" [src]="placeholder"></cds-user-chip>
      </div>
    </cds-top-nav>

    <main class="cds-container">
      <section class="dash">
        <h1 class="dash__title">Dashboard</h1>

        <cds-tabs class="dash__tabs" [activeIndex]="2">
          <cds-tab label="Status board" icon="ph ph-kanban"></cds-tab>
          <cds-tab label="Analytics" icon="ph ph-presentation-chart"></cds-tab>
          <cds-tab label="Visit schedules" icon="ph ph-calendar-dots"></cds-tab>
        </cds-tabs>

        <!-- kanban-container -->
        <div class="vs">
          <!-- leads-heading : title + search -->
          <div class="vs__heading">
            <h1 class="vs__title">List of visit schedules</h1>
            <div class="vs__tools">
              <cds-input-group class="vs__search">
                <i cds-prefix class="ph ph-magnifying-glass" aria-hidden="true"></i>
                <input cdsInput type="search" placeholder="Search" />
              </cds-input-group>
            </div>
          </div>

          <!-- visit-schedules : table + activity -->
          <div class="vs__body">
            <!-- main column -->
            <div class="vs__main">
              <div class="cds-table-wrap">
                <table cdsTable class="list-table">
                  <thead><tr><cds-table-header [columns]="columns"></cds-table-header></tr></thead>
                  <tbody>
                    @for (r of rows; track r.id) {
                      <tr>
                        <td>{{ r.lead }}</td>
                        <td>
                          <span class="vs-user">
                            <img class="vs-user__avatar" [src]="placeholder" alt="" />
                            You
                          </span>
                        </td>
                        <td>{{ r.property }}</td>
                        <td>{{ r.datetime }}</td>
                        <td>
                          <cds-status-badge
                            [label]="r.complete ? 'Complete' : 'Incomplete'"
                            [tone]="r.complete ? 'success' : 'danger'"></cds-status-badge>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              <cds-table-pagination
                itemName="Visit schedule"
                [page]="1"
                [pageSize]="10"
                [collectionSize]="35"></cds-table-pagination>
            </div>

            <!-- visit-schedules-activity -->
            <aside class="vs__activity">
              <cds-card>
                <p class="vs__activity-title">Activity</p>
                <cds-empty-state
                  icon="ph-fill ph-chart-bar"
                  title="No activity yet"
                  message="Your team's updates, visits, submissions, endorsements show up here.">
                </cds-empty-state>
              </cds-card>
            </aside>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface); min-height: 100vh; }
    .brand { font-family: var(--cds-font-family-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; }
    .brand__one { color: var(--cds-warning-400); }
    .brand__pdo { color: var(--cds-color-primary); }
    .hdr-actions { display: flex; align-items: center; gap: var(--cds-space-16); }

    .dash { display: flex; flex-direction: column; gap: var(--cds-space-24); }
    .dash__title { margin: 0; width: fit-content; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 22px; line-height: 26px; letter-spacing: -0.3px; color: var(--cds-text-primary); }

    /* kanban-container */
    .vs { display: flex; flex-direction: column; gap: var(--cds-space-20); }

    /* leads-heading : title left, search right */
    .vs__heading { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-16); }
    .vs__title { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 18px; line-height: var(--cds-line-height-xl); letter-spacing: -0.3px; color: var(--cds-text-primary); }
    .vs__tools { display: flex; align-items: center; gap: var(--cds-space-12); }
    .vs__search { width: 280px; }

    /* visit-schedules : two columns */
    .vs__body { display: flex; align-items: flex-start; gap: var(--cds-space-24); }
    .vs__main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: var(--cds-space-8); }

    .vs__activity { flex: 0 0 340px; }
    .vs__activity-title { margin: 0; padding: var(--cds-space-16) 0; font-size: var(--cds-font-size-lg); line-height: 19px; color: var(--cds-text-secondary); }

    /* Real \`.visit-schedules-activity\` is a transparent, lighter-bordered 8px box
       (border 1px $neutral-100 #f2f4f7, radius $radius-sm 8px) — NOT the default
       cds-card white surface / eaecf0 border / 12px radius. Override at page level
       so cds-card stays correct elsewhere. */
    .vs__activity ::ng-deep .cds-card { background: transparent; border-color: var(--cds-gray-100); border-radius: var(--cds-radius-sm); box-shadow: none; }
    /* Compact activity empty-state (PDO \`.activity-empty__title\` 14/21, \`.activity-empty__desc\` 12/18). */
    .vs__activity ::ng-deep .cds-empty__title { font-size: var(--cds-font-size-md); line-height: var(--cds-line-height-md); }
    .vs__activity ::ng-deep .cds-empty__message { font-size: var(--cds-font-size-sm); line-height: 18px; }

    .vs-user { display: inline-flex; align-items: center; gap: var(--cds-space-8); }
    .vs-user__avatar { width: 24px; height: 24px; border-radius: 50%; }
  `],
})
export class AgentVisitSchedulesPage {
  /** Neutral avatar placeholder (data URI so the cell carries a real <img>). */
  placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12" fill="rgb(207,212,220)"/></svg>'
  );

  /** `tableHeaders` from VisitSchedulesComponent.initializeTableHeaders(). */
  columns: CdsTableColumn[] = [
    { label: 'Lead name' },
    { label: 'Requested by' },
    { label: 'Property name' },
    { label: 'Date & time' },
    { label: 'Status' },
  ];

  /** `itemsList` (Schedule[]) — one page of visit requests. */
  rows: Row[] = [
    { id: '1', lead: 'Luca Ashby', property: 'Emerald Heights Residences', datetime: 'Jul 26, 2026 02:00 AM', complete: false },
    { id: '2', lead: 'Luca Ashby', property: 'Emerald Heights Residences', datetime: 'Jul 19, 2026 02:30 AM', complete: false },
    { id: '3', lead: 'Luca Ashby', property: 'Emerald Heights Residences', datetime: 'Jul 18, 2026 02:00 AM', complete: false },
    { id: '4', lead: 'Sasha Ashby', property: 'Emerald Heights Residences', datetime: 'Jun 27, 2026 02:30 PM', complete: true },
    { id: '5', lead: 'Luca Ashby', property: 'Emerald Heights Residences', datetime: 'Jun 17, 2026 09:00 PM', complete: false },
    { id: '6', lead: 'Gia Barden', property: 'Townscapes Malvar', datetime: 'Jun 18, 2026 12:00 PM', complete: true },
    { id: '7', lead: 'Gia Barden', property: 'Townscapes Malvar', datetime: 'Jun 20, 2026 04:00 AM', complete: true },
    { id: '8', lead: 'Kevin Piso', property: 'Westwood Height', datetime: 'Jun 05, 2026 11:00 AM', complete: true },
    { id: '9', lead: 'Wren Ashby', property: 'Townscapes Malvar', datetime: 'Jun 04, 2026 04:00 AM', complete: false },
    { id: '10', lead: 'Dsad Asd', property: 'Westwood Height', datetime: 'May 20, 2026 11:30 AM', complete: false },
  ];
}
