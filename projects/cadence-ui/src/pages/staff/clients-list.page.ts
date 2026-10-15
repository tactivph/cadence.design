import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent,
  CdsInputGroupComponent, CdsInputDirective,
  CdsTableDirective, CdsTableHeaderComponent, CdsTablePaginationComponent,
  CdsTableColumn, CdsStatusBadgeComponent,
} from '../../public-api';

/** One client row — the PDO `client` fields the list-table loop renders. */
interface Row {
  id: string;
  name: string;        // first_name + last_name | titlecase
  status: string;      // client.current_status -> pdo-lead-tag (client-category)
  mobile: string;      // (+63) client.phone_number | phoneNumber
  email: string;
  enrolledBy: string;  // enrolled_by || agent (avatar + name)
  updated: string;     // updated_at | dateFormat
}

/**
 * MOCK page — Staff · Clients (`/staff/customers/clients`, `ClientListComponent`).
 *
 * SOURCE-FIRST port of PDO `client-list.component.html`. The staff clients route
 * renders the SAME `ClientListComponent` as the agent clients list, so the page
 * BODY is identical (clients-header + 8-column clients table + pagination). The
 * template has only ONE `$auth.isStaff` branch — the row `[routerLink]`
 * (`/staff/customers/clients/:id` vs `/agent/clients/:id`) — which is behavioural,
 * not presentational, so the staff BODY is structurally identical to the agent's.
 * The 8 columns come from a single `tableHeaders` array shared across both roles.
 *
 * The ONLY visible differences the staff context introduces, both confirmed
 * against the captured reference (selector `app-root`):
 *
 *   1. SHELL — the STAFF top-nav shell is in frame (copied verbatim from the
 *      sibling staff leads-list page: brand wordmark, staff nav items, Admin
 *      caret, notif bell, user chip "Tactiv A." / Staff). The reference
 *      highlights "Clients" (white text on the filled green pill) → that is the
 *      ACTIVE nav item.
 *
 *   2. DATA — staff values (any region's clients; the enrolling AGENT's name in
 *      the Enrolled-by cell, never "You"). The captured reference is the LOADED
 *      state, not a skeleton: 10 client rows, first row id 495 "Aria Ashby" /
 *      Expired / "Sd One", footer "Showing 10 of 17 clients", pages 1-2.
 *
 * Structure mirrors client-list.component.html 1:1:
 *   container > clients-list-page > leads
 *     ├ clients-header
 *     │   ├ labels    → "Clients" h1
 *     │   └ actions   → funnel filter + Search
 *     ├ table.list-table (pdo-table-header + one row per client)
 *     │   favorite · ID · Name · Category · Mobile Number · Email ·
 *     │   Enrolled by · Last Updated
 *     └ pdo-table-pagination
 *
 * Presentational only (no data loading / filtering / favorite behaviour).
 *
 * COMPONENT GAPS (approximated with the closest Cadence primitive):
 *   - the funnel filter button is a PDO ngbDropdown trigger; there is no cds
 *     dropdown component, so it renders as a static `.cds-icon-btn`.
 */
@Component({
  selector: 'cds-page-staff-clients-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent,
    CdsInputGroupComponent, CdsInputDirective,
    CdsTableDirective, CdsTableHeaderComponent, CdsTablePaginationComponent,
    CdsStatusBadgeComponent,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item [hasCaret]="true">Dashboard</a>
      <a cds-nav-item>Approval</a>
      <a cds-nav-item>Leads</a>
      <a cds-nav-item [active]="true">Clients</a>
      <a cds-nav-item>Processor</a>
      <a cds-nav-item>Sales Network</a>
      <a cds-nav-item>Calendar</a>
      <a cds-nav-item>Calculator</a>
      <a cds-nav-item>Site Map</a>
      <div cds-topnav-actions class="hdr-actions">
        <a cds-nav-item [hasCaret]="true">Admin</a>
        <cds-notif-bell [count]="0"></cds-notif-bell>
        <cds-user-chip name="Tactiv A." role="Staff"></cds-user-chip>
      </div>
    </cds-top-nav>

    <main class="cds-container">
      <section class="clients">
        <!-- clients-header: title left, filter + search right -->
        <div class="clients-header">
          <div class="clients-header__labels">
            <h1 class="clients-header__heading">Clients</h1>
          </div>
          <div class="clients-header__actions">
            <button class="cds-icon-btn" aria-label="Filters"><i class="ph-bold ph-funnel"></i></button>
            <cds-input-group class="clients-header__search">
              <i cds-prefix class="ph ph-magnifying-glass" aria-hidden="true"></i>
              <input cdsInput type="search" placeholder="Search" />
            </cds-input-group>
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
                  <td class="column-name">
                    <span class="user-cell"><img class="user-cell__avatar" [src]="placeholder" alt="" /> {{ r.name }}</span>
                  </td>
                  <td class="column-category"><cds-status-badge kind="client-category" [code]="r.status" [info]="false" size="lg"></cds-status-badge></td>
                  <td>{{ r.mobile }}</td>
                  <td class="email">{{ r.email }}</td>
                  <td class="column-name">
                    <span class="user-cell"><img class="user-cell__avatar" [src]="placeholder" alt="" /> {{ r.enrolledBy }}</span>
                  </td>
                  <td class="date-updated">{{ r.updated }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <cds-table-pagination
          itemName="client"
          [page]="1"
          [pageSize]="10"
          [collectionSize]="17"></cds-table-pagination>
      </section>
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

    /* .clients-list-page > .leads */
    .clients { display: flex; flex-direction: column; gap: var(--cds-space-24); }

    /* .clients-header — title left, actions right (single row) */
    .clients-header { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: var(--cds-space-12); flex-wrap: wrap; }
    /* PDO .clients-header .labels h1 { font-size: torem(20); line-height: 120% }
       — clients-specific (NOT the shared .container__label 22/26 that leads uses). */
    .clients-header__heading { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: var(--cds-font-size-2xl); line-height: var(--cds-line-height-lg); letter-spacing: -0.3px; color: var(--cds-text-primary); }

    .clients-header__actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: var(--cds-space-12); margin-left: auto; }
    /* Search field box — PDO .input { padding: 11px 16px } + .input-with-icon__left
       { padding-left: 40px } for the magnifier. Page-local so the shared
       cds-input-group default padding is not regressed. */
    .clients-header__search { width: 224px; padding: var(--cds-space-11) var(--cds-space-16) var(--cds-space-11) var(--cds-space-40); }

    /* Name / Enrolled-by cell: avatar + name (PDO .d-flex.gap-2 => 0.5rem) */
    .user-cell { display: inline-flex; align-items: center; gap: var(--cds-space-7); }
    .user-cell__avatar { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }

    /* Email cell link (PDO td.email { color: $primary-700 }) */
    .email { color: var(--cds-primary-700); }

    /* Category cell badge — PDO renders the client-category tag via pdo-lead-tag:
       default size lg (13px, from the shared --lg token) + the lead-tag tag
       box-model: :host .badge { line-height: 1; padding: 8px }. The shared cds-badge
       uses line-height 1.2 and 4px vertical padding, so restore the tag's 1 /
       8px here. Page-scoped (.column-category) so other cds-status-badge call
       sites — incl. the leads-list / lead-detail client-category pills — are untouched. */
    .column-category ::ng-deep .cds-badge { line-height: 1; padding-top: var(--cds-space-8); padding-bottom: var(--cds-space-8); }
  `],
})
export class StaffClientsListPage {
  /** Neutral avatar placeholder (data URI so the cell carries a real <img>). */
  placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12" fill="rgb(207,212,220)"/></svg>'
  );

  /** `tableHeaders` from ClientListComponent — 8 columns (shared across roles). */
  columns: CdsTableColumn[] = [
    { label: '' },                            // favorite
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Category', field: 'status' },
    { label: 'Mobile Number', field: 'mobile' },
    { label: 'Email', field: 'email' },
    { label: 'Enrolled by', field: 'enrolledBy' },
    { label: 'Last Updated', field: 'updated' },
  ];

  /** `clientList` — one page of a region's clients (staff view: 10 of 17). */
  rows: Row[] = [
    { id: '495', name: 'Aria Ashby', status: 'expired', mobile: '+63 900-000-0002', email: 'user18@example.com', enrolledBy: 'Sd One', updated: 'Jul 17, 2026 at 1:12 am' },
    { id: '488', name: 'Mara Barden', status: 'reserved_buyer', mobile: '+63 900-000-0004', email: 'user34@example.com', enrolledBy: 'Nils Ashby', updated: 'Jul 12, 2026 at 9:04 am' },
    { id: '472', name: 'Kira Ashby', status: 'endorsed', mobile: '+63 900-000-0005', email: 'user15@example.com', enrolledBy: 'Kira Calder', updated: 'Jul 9, 2026 at 3:28 pm' },
    { id: '466', name: 'Sasha Barden', status: 'seasoning_buyer', mobile: '+63 900-000-0010', email: 'user38@example.com', enrolledBy: 'Broker Two', updated: 'Jul 5, 2026 at 11:47 am' },
    { id: '451', name: 'Mika Barden', status: 'takeout_buyer', mobile: '+63 900-000-0001', email: 'user40@example.com', enrolledBy: 'John Doe', updated: 'Jun 30, 2026 at 8:15 am' },
    { id: '447', name: 'Reed Barden', status: 'homeowner', mobile: '+63 900-000-0009', email: 'user52@example.com', enrolledBy: 'Reed Ashby', updated: 'Jun 24, 2026 at 5:52 pm' },
    { id: '433', name: 'Dax Barden', status: 'pending', mobile: '+63 900-000-0008', email: 'user27@example.com', enrolledBy: 'Kai Ashby', updated: 'Jun 18, 2026 at 10:03 am' },
    { id: '420', name: 'Wren Barden', status: 'reserved_buyer', mobile: '+63 900-000-0011', email: 'user37@example.com', enrolledBy: 'Nils Ashby', updated: 'Jun 11, 2026 at 2:19 pm' },
    { id: '408', name: 'Beau Calder', status: 'endorsed', mobile: '+63 900-000-0003', email: 'user41@example.com', enrolledBy: 'Sd One', updated: 'Jun 3, 2026 at 7:41 am' },
    { id: '392', name: 'Ivy Ashby', status: 'expired', mobile: '+63 900-000-0007', email: 'user13@example.com', enrolledBy: 'Kira Calder', updated: 'May 28, 2026 at 4:30 pm' },
  ];
}
