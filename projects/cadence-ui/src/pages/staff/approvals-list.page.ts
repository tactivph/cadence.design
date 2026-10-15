import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsPageHeaderComponent,
  CdsStatTileComponent, CdsTabsComponent, CdsTabComponent,
  CdsStatusBadgeComponent, CdsButtonComponent, CdsInputGroupComponent,
  CdsInputDirective, CdsAvatarComponent, CdsTableDirective,
  CdsTableHeaderComponent, CdsTablePaginationComponent,
  CdsNotifBellComponent, CdsUserChipComponent, CdsTableColumn,
} from '../../public-api';

/** One queue row — the PDO `EndorsementRequest` fields the Calculations
 *  (verification) table renders: lead, property, submitted-by, submitted, status. */
interface ApprovalRow {
  lead: string;         // item.lead.first_name + last_name | titlecase
  property: string;     // item.property_label
  submittedBy: string;  // item.requested_by.first_name + last_name | titlecase
  submitted: string;    // item.created_at | dateFormat 'MMM D, YYYY · h:mm A'
  status: string;       // item.status -> pdo-status-badge
}

/**
 * MOCK page — Staff · Approvals list (`/staff/approvals`, `ApprovalsListComponent`).
 *
 * SOURCE-FIRST port of PDO `approvals-list.component.html`. Two checks live on
 * this screen — verifying broker-submitted calculations, and confirming
 * reservation endorsements — each a queue behind the Calculations/Endorsements
 * switcher. Captured reference (selector `app-root`) is the LOADED Calculations
 * queue: 10 rows, "Showing 10 of 19 requests", pages 1-2.
 *
 * Shell: the STAFF top-nav shell is in frame (copied verbatim from the sibling
 * staff clients-list page: brand wordmark, staff nav items, Admin caret, notif
 * bell, user chip "Tactiv A." / Staff). The reference highlights "Approval"
 * (white text on the filled green pill) → that is the ACTIVE nav item.
 *
 * Structure mirrors approvals-list.component.html 1:1 — four siblings inside
 * `.reservation-requests` (flex column, gap 24px):
 *   ├ rr-header (.w-100)         → title + subtitle (left) · two rr-stat-cards (right)
 *   ├ rr-tabs (nav-tabs)         → Calculations (2) · Endorsements (3) switcher
 *   ├ rr-controls (.w-100)       → "2 awaiting review" badge (left) · funnel + search (right)
 *   └ table-container            → list-table (5 cols) + pdo-table-pagination
 *
 * The Calculations queue columns (from the `!isEndorsementTab` branch):
 *   Lead · Property · Submitted by · Submitted · Status.
 *
 * Presentational only (no tab switching / filtering / row navigation).
 *
 * COMPONENT GAPS (approximated with the closest Cadence primitive):
 *   - rr-header (title+subtitle+stats) → cds-page-header with cds-stat-tiles in
 *     the [cds-page-actions] slot; the PDO header is a bespoke flex row, there is
 *     no dedicated header-with-stats component.
 *   - The nav-tabs switcher → cds-tabs (bar only); the real template keeps the
 *     controls + table as siblings of the tab bar (content is swapped per queue,
 *     not nested in a tab panel), so the cds-tab panels are left empty.
 *   - The funnel filter button is a PDO ngbDropdown trigger; there is no cds
 *     dropdown trigger, so it renders as a borderless ghost-neutral icon button.
 *   - Empty / loading states are conditional branches (hidden in the captured
 *     loaded state) and are omitted from this static story.
 */
@Component({
  selector: 'cds-page-staff-approvals-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsPageHeaderComponent,
    CdsStatTileComponent, CdsTabsComponent, CdsTabComponent,
    CdsStatusBadgeComponent, CdsButtonComponent, CdsInputGroupComponent,
    CdsInputDirective, CdsAvatarComponent, CdsTableDirective,
    CdsTableHeaderComponent, CdsTablePaginationComponent,
    CdsNotifBellComponent, CdsUserChipComponent,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item [hasCaret]="true">Dashboard</a>
      <a cds-nav-item [active]="true">Approval</a>
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
      <section class="reservation-requests">
        <!-- rr-header: title + subtitle (left), two stat cards (right) -->
        <cds-page-header
          class="rr-header"
          title="Approvals"
          subtitle="Two checks happen here: verify the figures on broker-submitted calculations, and endorse reservations once the buyer's reservation fee is paid.">
          <div cds-page-actions class="rr-header__stats">
            <cds-stat-tile value="2" label="calculations to verify"></cds-stat-tile>
            <cds-stat-tile value="3" label="endorsements to confirm"></cds-stat-tile>
          </div>
        </cds-page-header>

        <!-- Queue tabs: Calculations / Endorsements switcher (bar only) -->
        <cds-tabs class="rr-tabs" [activeIndex]="0">
          <cds-tab label="Calculations" [count]="2"></cds-tab>
          <cds-tab label="Endorsements" [count]="3"></cds-tab>
        </cds-tabs>

        <!-- Controls: awaiting tally (left), filter + search (right) -->
        <div class="rr-controls">
          <cds-status-badge kind="review" code="for_review" label="2 awaiting review" [showIcon]="true" size="md"></cds-status-badge>
          <div class="rr-controls__actions">
            <button cds-button variant="ghost-neutral" [iconOnly]="true" iconLeft="ph-bold ph-funnel" aria-label="Filters"></button>
            <cds-input-group class="rr-search">
              <i cds-prefix class="ph ph-magnifying-glass" aria-hidden="true"></i>
              <input cdsInput type="search" placeholder="Search lead, reference, broker, or unit..." />
            </cds-input-group>
          </div>
        </div>

        <!-- Table: Calculations queue (Lead / Property / Submitted by / Submitted / Status) -->
        <div class="table-container">
          <table cdsTable class="list-table">
            <thead><tr><cds-table-header [columns]="columns"></cds-table-header></tr></thead>
            <tbody>
              @for (r of rows; track $index) {
                <tr>
                  <td>
                    <span class="rr-cell-user">
                      <cds-avatar [name]="r.lead" size="sm"></cds-avatar>
                      {{ r.lead }}
                    </span>
                  </td>
                  <td>{{ r.property || '—' }}</td>
                  <td>
                    <span class="rr-cell-user">
                      <cds-avatar [name]="r.submittedBy" size="sm"></cds-avatar>
                      {{ r.submittedBy }}
                    </span>
                  </td>
                  <td>{{ r.submitted }}</td>
                  <td><cds-status-badge kind="review" code="approved" [label]="r.status" [showIcon]="true" size="md"></cds-status-badge></td>
                </tr>
              }
            </tbody>
          </table>

          <cds-table-pagination itemName="request" [page]="1" [pageSize]="10" [collectionSize]="19"></cds-table-pagination>
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

    /* staff caret nav items (Dashboard, Admin) align start, not center (page-scoped) */
    :host ::ng-deep .cds-nav-item--caret { text-align: start; }

    /* .leads.reservation-requests — flex column, 24px gap between the four regions */
    .reservation-requests { display: flex; flex-direction: column; gap: var(--cds-space-24); }

    /* rr-header__stats: two stat cards side by side (PDO .rr-header__stats gap-sm) */
    .rr-header__stats { display: flex; align-items: stretch; gap: var(--cds-space-12); }

    /* rr-controls: awaiting tally left, actions right (PDO .rr-controls w-100) */
    .rr-controls { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: var(--cds-space-16); }
    .rr-controls__actions { display: flex; align-items: center; gap: var(--cds-space-8); }
    /* PDO .rr-search { width: 350px } */
    .rr-search { width: 350px; max-width: 100%; }

    /* rr-cell-user: avatar + name. Reference-wins: the lead cell renders with no
       flex gap (the avatar carries its own spacing), so gap is normal here. */
    .rr-cell-user { display: inline-flex; align-items: center; gap: normal; }

    /* PAGE-LOCAL type alignment to PDO (reference-wins), expressed with shared
       tokens — no magic numbers. PDO renders the Approvals header per-page:
       • "Approvals" title: heading-h4 ramp (20px / 24px), not the cds-page-header
         default heading-h3 (22px / 26px).
       • Subtitle: body md (14px) in text-secondary; its 16px line-height already
         matches the component's body-sm default. */
    :host ::ng-deep .rr-header .cds-page-header__title {
      font-size: var(--cds-font-size-2xl);   /* 20px — DS heading-h4 size */
      line-height: var(--cds-space-24);       /* 24px */
    }
    :host ::ng-deep .rr-header .cds-page-header__subtitle {
      font-size: var(--cds-font-size-md);    /* 14px */
      color: var(--cds-text-secondary);       /* gray-700 */
    }

    /* ── Queue tabs (reference-wins, PAGE-SCOPED only — the status-board page's
       cds-tabs stays on the shared component defaults and is untouched). ──────
       PDO .rr-tabs .nav-link renders centered with an 8px icon/label gap
       (gap: $spacing-xs-2), and the Bootstrap .nav-tabs .nav-link pulls up -1px
       to overlap the bar's bottom border. */
    :host ::ng-deep cds-tabs.rr-tabs .cds-tabs__tab {
      text-align: center;                     /* PDO .nav-link justify-content: center */
      gap: var(--cds-space-8);                /* PDO .rr-tabs .nav-link gap: $spacing-xs-2 (8px) */
      margin-bottom: -1px;                    /* Bootstrap .nav-tabs .nav-link overlap */
    }
    /* PDO nav-tabs BAR sits on the white surface; its own bottom border is 0
       (the active link draws the 2px underline). */
    :host ::ng-deep cds-tabs.rr-tabs .cds-tabs__list {
      background: var(--cds-surface);         /* white — rgb(255,255,255) */
      border-bottom-width: 0;
    }

    /* "2 awaiting review" review badge (PDO .status-badge--md, reference-wins):
       Inter Medium 14/16.8, no letter-spacing, left-aligned, 10px side padding.
       Page-scoped to the controls-row badge — the table status pills are not
       affected. */
    :host ::ng-deep .rr-controls cds-status-badge .cds-badge.cds-badge--md {
      font-size: var(--cds-font-size-md);     /* 14px (PDO $size-base) */
      line-height: 1.2;                        /* 16.8px = 14 × 1.2 */
      letter-spacing: normal;                  /* PDO $letter-spacing-default: 0 */
      text-align: start;
      padding-inline: var(--cds-space-10);     /* 10px (PDO $spacing-sm) */
    }
  `],
})
export class StaffApprovalsListPage {
  /** Calculations-queue columns — the `!isEndorsementTab` thead branch. */
  columns: CdsTableColumn[] = [
    { label: 'Lead' },
    { label: 'Property' },
    { label: 'Submitted by' },
    { label: 'Submitted' },
    { label: 'Status' },
  ];

  /** `itemsList` — one page of the Calculations queue (10 of 19). */
  rows: ApprovalRow[] = [
    { lead: 'Nico Ashby', property: 'Townscapes Malvar · Residences · Block 5, Lot 11', submittedBy: 'Broker Two', submitted: 'Oct 7, 2026 · 5:22 PM', status: 'Approved' },
    { lead: 'Evan Client', property: 'Townscapes Malvar · Residences · Block 6, Lot 17', submittedBy: 'Reed Ashby', submitted: 'Sep 24, 2026 · 11:35 PM', status: 'Approved' },
    { lead: 'Aria Ashby', property: 'Townscapes Malvar · Enclave · Block 35, Lot 10', submittedBy: 'Brokersf One', submitted: 'Sep 10, 2026 · 5:43 PM', status: 'Approved' },
    { lead: 'Client Twentyfive', property: 'Townscapes Malvar · Residences · Block 10, Lot 8', submittedBy: 'Aria Ashby', submitted: 'Aug 13, 2026 · 1:55 PM', status: 'Approved' },
    { lead: 'Client Twentyone', property: 'Townscapes Malvar · Residences · Block 10, Lot 9', submittedBy: 'Melencio Garcia', submitted: 'Aug 13, 2026 · 10:41 AM', status: 'Approved' },
    { lead: 'Nico Ashby', property: 'Site B · Residences · Block 1, Lot 5', submittedBy: 'Broker Two', submitted: 'Aug 13, 2026 · 9:48 AM', status: 'Approved' },
    { lead: 'Reed Ashby', property: 'Townscapes Malvar · Residences · Block 10, Lot 5', submittedBy: 'Cynthia Bautista', submitted: 'Aug 12, 2026 · 11:54 AM', status: 'Approved' },
    { lead: 'Reed Ashby', property: 'Townscapes Malvar · Enclave · Block 35, Lot 10', submittedBy: 'Cynthia Bautista', submitted: 'Aug 12, 2026 · 10:38 AM', status: 'Approved' },
    { lead: 'Client Ten', property: 'Site B · Residences · Block 1, Lot 6', submittedBy: 'Broker Two', submitted: 'Jul 31, 2026 · 2:15 PM', status: 'Approved' },
    { lead: 'Kaya Cruz', property: '', submittedBy: 'Broker Two', submitted: 'Jul 29, 2026 · 1:24 AM', status: 'Approved' },
  ];
}
