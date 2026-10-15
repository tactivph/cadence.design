import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsButtonComponent,
  CdsInputGroupComponent, CdsInputDirective,
  CdsTableDirective, CdsTableHeaderComponent, CdsTablePaginationComponent,
  CdsTableColumn, CdsStatusBadgeComponent,
  CdsLeadProgressTagComponent, CdsLeadTemperatureComponent, CdsTemperature,
} from '../../public-api';

/** One lead row — the PDO `Lead` fields the list-table loop renders. */
interface Row {
  id: string;
  name: string;
  progress: string;     // lead.progress -> pdo-lead-progress-tag
  status: string;       // lead.current_status -> pdo-lead-tag
  mobile: string;       // +63 lead.phone_number | phoneNumber
  email: string;
  expiry: string | null;// lead.cas_expiry | date : 'Expired' when past
  temp: CdsTemperature; // lead.lead_temperature (default 'warm')
}

/**
 * MOCK page — Agent · Leads (`/agent/leads`, `LeadListComponent`).
 *
 * SOURCE-FIRST port of PDO `lead-list.component.html`. This is a TOP-LEVEL agent
 * page (not a dashboard child): the captured reference (selector `app-root`) shows
 * the top-nav shell in frame with the "Leads" nav item active and NO dashboard
 * sub-tabs. The shell is copied verbatim from the status-board sibling.
 *
 * Structure mirrors lead-list.component.html 1:1:
 *   container > leads
 *     ├ leads-heading
 *     │   ├ leads-heading__row--top    → "Leads" h1 + Export / Share enrollment
 *     │   │                              form / Manual enrollment actions
 *     │   ├ leads-heading__divider
 *     │   └ leads-heading__row--bottom → info hint + funnel filter + Search
 *     ├ table.list-table (pdo-table-header + one row per lead)
 *     │   favorite · ID · Name · Lead Progress · Status · Mobile Number ·
 *     │   Email · Enrolled by · Expiry Date · Lead Temperature (+ caret)
 *     └ pdo-table-pagination
 *
 * Presentational only (no data loading / filtering / favorite / export behaviour).
 *
 * COMPONENT GAPS (approximated with the closest Cadence primitive):
 *   - funnel filter button + per-row temperature caret are PDO ngbDropdown
 *     triggers; there is no cds dropdown component, so they render as a
 *     `.cds-icon-btn` / bare caret button (static, no menu).
 */
@Component({
  selector: 'cds-page-agent-leads',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent, CdsButtonComponent,
    CdsInputGroupComponent, CdsInputDirective,
    CdsTableDirective, CdsTableHeaderComponent, CdsTablePaginationComponent,
    CdsStatusBadgeComponent, CdsLeadProgressTagComponent, CdsLeadTemperatureComponent,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item [hasCaret]="true">Dashboard</a>
      <a cds-nav-item [active]="true">Leads</a>
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
      <section class="leads">
        <!-- leads-heading -->
        <div class="leads-heading">
          <!-- Row 1: title + primary actions -->
          <div class="leads-heading__row leads-heading__row--top">
            <h1 class="leads-heading__title">Leads</h1>
            <div class="leads-heading__actions">
              <button cds-button variant="ghost-neutral" iconLeft="ph-bold ph-download-simple">Export</button>
              <button cds-button variant="secondary-neutral" iconLeft="ph ph-share-network">Share enrollment form</button>
              <button cds-button variant="primary" iconLeft="ph-bold ph-clipboard-text">Manual enrollment</button>
            </div>
          </div>

          <!-- Divider -->
          <div class="leads-heading__divider"></div>

          <!-- Row 2: hint + filter/search -->
          <div class="leads-heading__row leads-heading__row--bottom">
            <p class="leads-heading__hint">
              <i class="ph-bold ph-info"></i>
              <span>Once status is &ldquo;<span class="leads-heading__hint-strong">Signed CAS</span>&rdquo;, open the lead to continue.</span>
            </p>
            <div class="leads-heading__tools">
              <button class="cds-icon-btn" aria-label="Filters"><i class="ph-bold ph-funnel"></i></button>
              <cds-input-group class="leads-heading__search">
                <i cds-prefix class="ph ph-magnifying-glass" aria-hidden="true"></i>
                <input cdsInput type="search" placeholder="Search" />
              </cds-input-group>
            </div>
          </div>
        </div>

        <!-- Data Table -->
        <div class="cds-table-wrap">
          <table cdsTable class="list-table">
            <thead><tr><cds-table-header [columns]="columns"></cds-table-header></tr></thead>
            <tbody>
              @for (r of rows; track r.id) {
                <tr>
                  <td class="favorite"><i class="ph ph-star"></i></td>
                  <td class="column-id">{{ r.id }}</td>
                  <td>{{ r.name }}</td>
                  <td><cds-lead-progress-tag [code]="r.progress"></cds-lead-progress-tag></td>
                  <td><cds-status-badge kind="client-category" [code]="r.status" [info]="true"></cds-status-badge></td>
                  <td>{{ r.mobile }}</td>
                  <td class="email">{{ r.email }}</td>
                  <td>
                    <span class="enrolled-by">
                      <img class="enrolled-by__avatar" [src]="placeholder" alt="" />
                      You
                    </span>
                  </td>
                  <td class="cas-expiry" [class.is-expired]="r.expiry === 'Expired'">{{ r.expiry || '-' }}</td>
                  <td>
                    <div class="lead-temperature-cell">
                      <cds-lead-temperature [level]="r.temp" [info]="true"></cds-lead-temperature>
                      <button class="lead-temperature__caret-btn" aria-label="Change temperature">
                        <i class="ph-bold ph-caret-down"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <cds-table-pagination
          itemName="lead"
          [page]="1"
          [pageSize]="10"
          [collectionSize]="rows.length"></cds-table-pagination>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface); min-height: 100vh; }
    .brand { font-family: var(--cds-font-family-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; }
    .brand__one { color: var(--cds-warning-400); }
    .brand__pdo { color: var(--cds-color-primary); }
    .hdr-actions { display: flex; align-items: center; gap: var(--cds-space-16); }

    /* .leads */
    .leads { display: flex; flex-direction: column; gap: var(--cds-space-24); }

    /* .leads-heading */
    .leads-heading { display: flex; flex-direction: column; gap: var(--cds-space-16); }
    .leads-heading__row { display: flex; width: 100%; align-items: flex-end; justify-content: space-between; gap: var(--cds-space-12); flex-wrap: wrap; }
    .leads-heading__row--bottom { align-items: center; }
    .leads-heading__title { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 22px; line-height: 26px; letter-spacing: -0.3px; color: var(--cds-text-primary); }

    .leads-heading__actions { display: flex; flex-wrap: wrap; align-items: center; gap: var(--cds-space-12); margin-left: auto; }

    .leads-heading__divider { height: 0.5px; width: 100%; background-color: var(--cds-border); }

    .leads-heading__hint { display: inline-flex; align-items: center; gap: var(--cds-space-8); margin: 0; font-family: var(--cds-font-family-base); font-weight: 400; font-size: var(--cds-font-size-sm); line-height: 1; color: var(--cds-text-primary); }
    .leads-heading__hint i { font-size: 14px; color: inherit; }
    .leads-heading__hint-strong { font-family: var(--cds-font-family-medium); font-weight: 500; }

    .leads-heading__tools { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: var(--cds-space-12); margin-left: auto; }
    /* Search field box — PDO .input { padding: 11px $spacing-md(16px) } with
       .input-with-icon__left { padding-left: $spacing-xlg-2(40px) } for the magnifier.
       Overridden here (page-local) so the shared cds-input-group default padding
       (0 12px, used by visit-schedules search) is not regressed. */
    .leads-heading__search { width: 216px; padding: var(--cds-space-11) var(--cds-space-16) var(--cds-space-11) var(--cds-space-40); }

    /* Email cell link (PDO td.email { color: $primary-700 }) */
    .email { color: var(--cds-primary-700); }

    /* Enrolled-by cell: avatar + name (PDO .d-flex.gap-2 => 0.5rem = 7px @ 14px root) */
    .enrolled-by { display: inline-flex; align-items: center; gap: var(--cds-space-7); }
    .enrolled-by__avatar { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }

    /* Expiry cell: PDO .cas-expiry { padding-right: 30px } (room for caret) */
    .cas-expiry { padding-right: var(--cds-space-30); }
    .cas-expiry.is-expired { color: var(--cds-danger-700); }

    /* Heading action buttons — PDO renders these taller than the Cadence md default.
       Scoped page-locally so the shared cds-button metrics (used by passing pages)
       are untouched. Export = PDO .btn (14px pad, F1-Medium weight 500); Share/Manual
       = PDO .btn-md (12px pad, 16px line-height). */
    .leads-heading__actions ::ng-deep button[cds-button].cds-btn--ghost-neutral {
      padding-top: var(--cds-space-14); padding-bottom: var(--cds-space-14);
      font-weight: var(--cds-weight-semibold);
    }
    .leads-heading__actions ::ng-deep button[cds-button].cds-btn--secondary-neutral,
    .leads-heading__actions ::ng-deep button[cds-button].cds-btn--primary {
      padding-top: var(--cds-space-12); padding-bottom: var(--cds-space-12);
      line-height: var(--cds-line-height-sm);
    }

    /* Lead-temperature cell: badge left, caret trigger right (PDO .lead-temperature-cell) */
    .lead-temperature-cell { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-8); }
    .lead-temperature__caret-btn { display: inline-flex; align-items: center; justify-content: center; padding: 0; border: none; background: transparent; cursor: pointer; }
    .lead-temperature__caret-btn i { font-size: 12px; color: var(--cds-text-tertiary); }
  `],
})
export class AgentLeadsListPage {
  /** Neutral avatar placeholder (data URI so the cell carries a real <img>). */
  placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12" fill="rgb(207,212,220)"/></svg>'
  );

  /** `tableHeaders` from LeadListComponent.initializeTableHeaders() — 10 columns. */
  columns: CdsTableColumn[] = [
    { label: '' },                            // favorite
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Lead Progress' },               // isSort: false
    { label: 'Status', field: 'status' },
    { label: 'Mobile Number', field: 'mobile' },
    { label: 'Email', field: 'email' },
    { label: 'Enrolled by' },                 // no sort field
    { label: 'Expiry Date', field: 'expiry' },
    { label: 'Lead Temperature', field: 'temp' },
  ];

  /** `leadList` (Lead[]) — one page of enrolled leads. */
  rows: Row[] = [
    { id: '354', name: 'Sasha Ashby', progress: 'site_visit_completed', status: 'signed_cas', mobile: '+63 900-000-0030', email: 'user2@example.com', expiry: 'Expired', temp: 'hot' },
    { id: '340', name: 'Sasha Ashby', progress: 'new_lead', status: 'available', mobile: '+63 900-000-0027', email: 'user47@example.com', expiry: null, temp: 'hot' },
    { id: '336', name: 'Luca Ashby', progress: 'site_visit_scheduled', status: 'signed_cas', mobile: '+63 900-000-0017', email: 'user50@example.com', expiry: 'Expired', temp: 'warm' },
    { id: '335', name: 'Sasha Ashby', progress: 'new_lead', status: 'available', mobile: '+63 900-000-0028', email: 'user5@example.com', expiry: null, temp: 'warm' },
    { id: '334', name: 'Sasha Ashby', progress: 'new_lead', status: 'available', mobile: '+63 900-000-0031', email: 'user25@example.com', expiry: null, temp: 'warm' },
    { id: '333', name: 'Sasha Ashby', progress: 'new_lead', status: 'available', mobile: '+63 900-000-0031', email: 'user3@example.com', expiry: null, temp: 'warm' },
    { id: '329', name: 'Gia Barden', progress: 'site_visit_completed', status: 'available', mobile: '+63 900-000-0022', email: 'user4@example.com', expiry: null, temp: 'warm' },
    { id: '328', name: 'Wren Ashby', progress: 'site_visit_scheduled', status: 'signed_cas', mobile: '+63 900-000-0023', email: 'user1@example.com', expiry: 'Expired', temp: 'warm' },
    { id: '253', name: 'Asr Asr', progress: 'site_visit_scheduled', status: 'unavailable', mobile: '+63 900-000-0019', email: 'user51@example.com', expiry: null, temp: 'warm' },
    { id: '252', name: 'Dsad Asd', progress: 'site_visit_scheduled', status: 'signed_cas', mobile: '+63 900-000-0016', email: 'user49@example.com', expiry: 'Expired', temp: 'warm' },
  ];
}
