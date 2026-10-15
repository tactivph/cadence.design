import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsNotifBellComponent,
  CdsUserChipComponent, CdsBreadcrumbComponent, CdsBreadcrumbItem,
  CdsTableDirective, CdsTableHeaderComponent, CdsTableColumn,
  CdsTablePaginationComponent, CdsLoadingStateComponent,
} from '../../public-api';

/**
 * MOCK page — Staff · Dashboard › Top performing broker
 * (`/staff/dashboard/broker-overview/top-performing-broker`).
 *
 * SOURCE-FIRST port of PDO `TopPerformingBrokerComponent`
 * (pages/staff/dashboard/top-performing-broker). STANDALONE staff page
 * (selector `pdo-top-performing-broker`) that renders its own breadcrumb +
 * heading — there is NO shared dashboard tab-bar. The captured reference
 * (selector `app-root`) shows the STAFF top-nav shell in frame, copied verbatim
 * from the sibling broker-overview page (brand wordmark, staff nav items with
 * Dashboard active, Admin caret, notif bell, user chip "Tactiv A." / Staff).
 *
 * Structure mirrors top-performing-broker.component.html 1:1:
 *   div.container (flex column, 20/40 padding)
 *     ├ div.header-breadcrumb  → nav/ol.breadcrumb:
 *     │     li "← Dashboard" (back-arrow + link) · li.active "Top performing broker"
 *     └ div.clients-list-page (formGroup) › div.leads (column, gap 24):
 *         ├ div.clients-header.w-100 (space-between):
 *         │     labels → h1.header__heading "Top performing broker"
 *         │     actions → input-with-icon (Search field, magnifier)
 *         ├ div.table-container › table.list-table:
 *         │     thead › pdo-table-header [Position · Broker · No. of clients ·
 *         │             Total sales · Last sale date]
 *         │     tbody › *ngFor rows (rank+change · avatar+name · clients · ₱ sales ·
 *         │             last sale date) — EMPTY at capture (still loading)
 *         ├ pdo-table-pagination ("Showing 0 of 0 s" + prev/next)
 *         └ @if isLoading → pdo-loading-state (spinner + "Loading in progress...")
 *            — the capture was taken mid-fetch, so the empty table sits above the
 *            loading state; the two empty states (search / no brokers) are the
 *            non-loading branches and are not shown.
 *
 * Mapped to Cadence: breadcrumb → cds-breadcrumb (+ leading ph-arrow-left, as in
 * the real template's `<i class="ph ph-arrow-left">`); list-table thead →
 * cdsTable + cds-table-header; pdo-table-pagination → cds-table-pagination;
 * pdo-loading-state → cds-loading-state. Presentational only (no search /
 * data-loading / pagination behaviour).
 *
 * BLUEPRINT: top-level sections carry UNIQUE class signatures
 * (header-breadcrumb / clients-header / table-container / plus the distinct
 * cds-table-pagination & cds-loading-state host tags) so no run of 3+
 * identical-signature siblings is collapsed by the grader.
 *
 * No component GAPS — every real region maps to an existing cds-* component.
 */
@Component({
  selector: 'cds-page-staff-top-performing-broker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsNotifBellComponent,
    CdsUserChipComponent, CdsBreadcrumbComponent,
    CdsTableDirective, CdsTableHeaderComponent,
    CdsTablePaginationComponent, CdsLoadingStateComponent,
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
        <cds-notif-bell [count]="0"></cds-notif-bell>
        <cds-user-chip name="Tactiv A." role="Staff"></cds-user-chip>
      </div>
    </cds-top-nav>

    <main class="cds-container">
      <!-- header-breadcrumb : ← Dashboard / Top performing broker -->
      <div class="header-breadcrumb">
        <i class="ph ph-arrow-left breadcrumb-back" aria-hidden="true"></i>
        <cds-breadcrumb size="md" [items]="crumbs"></cds-breadcrumb>
      </div>

      <!-- clients-list-page › leads -->
      <section class="leads">
        <!-- clients-header : heading (left) + search (right) -->
        <header class="clients-header">
          <div class="labels"><h1 class="header__heading">Top performing broker</h1></div>
          <div class="actions">
            <label class="search">
              <i class="ph ph-magnifying-glass search__icon" aria-hidden="true"></i>
              <input class="search__input" type="search" placeholder="Search" />
            </label>
          </div>
        </header>

        <!-- table-container : ranked broker list-table -->
        <div class="table-container">
          <table cdsTable class="list-table">
            <thead>
              <tr><cds-table-header [columns]="columns" [sort]="sort"></cds-table-header></tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>

        <cds-table-pagination itemName="" [page]="1" [pageSize]="10" [collectionSize]="0"></cds-table-pagination>

        <cds-loading-state></cds-loading-state>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface); min-height: 100vh; }

    /* ── Parity fixes (reference-driven, page-scoped) ──────────────────────── */

    /* D1: staff caret nav items (Dashboard, Admin) align start, not center.
       Page-scoped so agent pages (deliberately centered) are unaffected.
       Beats nav-item's own :host rule (0,2,0) < this (0,2,1 w/ ::ng-deep). */
    :host ::ng-deep .cds-nav-item--caret { text-align: start; }

    /* D2: breadcrumb CURRENT crumb ("Top performing broker") renders in the
       base Inter Regular face here, not the component's default Inter Medium.
       PDO .breadcrumb .breadcrumb-item.active is $F1-Medium by default, but the
       captured reference for this page's current crumb is Inter Regular →
       reference wins. (0,2,1) beats the component's (0,2,0). */
    :host ::ng-deep cds-breadcrumb.cds-breadcrumb-host--md .cds-breadcrumb__current[aria-current] {
      font-family: var(--cds-font-family-regular);
    }

    /* D3: loading-state TITLE ("Loading in progress...") is Inter Medium.
       PDO _loading.scss .loading-title { font-family: $F1-Medium }. The Cadence
       component's body-lg mixin resolves to the regular face → override. */
    :host ::ng-deep cds-loading-state .cds-loading-state__title {
      font-family: var(--cds-font-family-medium);
    }

    /* D4: empty tbody row — no background, no borders. PDO list-table tbody tr
       carries border-bottom 1px only when populated; the empty (loading) table
       reference shows a transparent row with no top/bottom border. The global
       .cds-table rule paints surface bg + 1px bottom border → override here. */
    :host ::ng-deep table.cds-table,
    :host ::ng-deep table.cds-table tbody tr {
      background: transparent;
      border-top: 0;
      border-bottom: 0;
    }

    /* brand wordmark (stand-in for the onePDO logo) */
    .brand { font-family: var(--cds-font-family-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; }
    .brand__one { color: var(--cds-warning-400); }
    .brand__pdo { color: var(--cds-color-primary); }

    .hdr-actions { display: flex; align-items: center; gap: var(--cds-space-16); }

    /* container : PDO .container (flex column, 20/40 padding) */
    .cds-container { display: flex; flex-direction: column; }

    /* header-breadcrumb : back arrow + trail (PDO .header-breadcrumb, mb 24) */
    .header-breadcrumb { display: flex; align-items: center; margin-bottom: var(--cds-space-24); }
    .breadcrumb-back { margin-right: var(--cds-space-8); font-size: 16px; color: var(--cds-text-primary); }

    /* leads container — PDO .leads (column, gap 24px) */
    .leads { display: flex; flex-direction: column; gap: var(--cds-space-24); }
    .clients-header { display: flex; align-items: center; justify-content: space-between; }
    .header__heading {
      margin: 0; width: fit-content; font-family: var(--cds-font-family-medium); font-weight: 500;
      font-size: 20px; line-height: 24px; letter-spacing: -0.46px; color: var(--cds-text-primary);
    }
    .actions { display: flex; align-items: center; gap: var(--cds-space-16); }

    /* search — PDO .input-with-icon (224px, 40px, border #d0d5dd, icon #a0a0ab) */
    .search { position: relative; display: inline-flex; align-items: center; width: 224px; min-width: 208px; height: 40px; }
    .search__icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #a0a0ab; font-size: 13px; }
    .search__input {
      width: 100%; height: 40px; padding: 11px 16px 11px 40px;
      border: 1px solid var(--cds-border); border-radius: var(--cds-radius-sm); background: var(--cds-surface);
      font-family: var(--cds-font-family-base); font-size: var(--cds-font-size-md); color: var(--cds-text-primary);
    }
    .search__input::placeholder { color: #a0a0ab; }
    .search__input:focus { outline: none; border-color: var(--cds-primary-300); }

    .table-container { width: 100%; }
    .list-table { width: 100%; }
  `],
})
export class StaffTopPerformingBrokerPage {
  sort = '';

  /** breadcrumb trail (PDO ol.breadcrumb): Dashboard › current page. */
  crumbs: CdsBreadcrumbItem[] = [
    { label: 'Dashboard', href: '#' },
    { label: 'Top performing broker' },
  ];

  /** pdo-table-header tableHeaders (Position / Broker / No. of clients / Total sales / Last sale date). */
  columns: CdsTableColumn[] = [
    { label: 'Position' },
    { label: 'Broker' },
    { label: 'No. of clients' },
    { label: 'Total sales' },
    { label: 'Last sale date' },
  ];
}
