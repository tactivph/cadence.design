import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsCardComponent, CdsTabsComponent, CdsTabComponent,
  CdsEmptyStateComponent, CdsStatusBadgeComponent, CdsAvatarComponent,
} from '../../public-api';

/** One unit under a contract — mirrors the `contract.properties` loop. */
interface Unit {
  development: string;   // contract.development?.name (uppercase)
  title: string;         // property.unit?.unit_name || house_type?.name
  project: string;       // contract.project?.name
  houseType: string;     // property.house_type?.name
  price: string;         // property.unit?.selling_price | currency
}

/** One contract section — mirrors the `contracts` loop in client-contracts. */
interface Contract {
  id: string;            // sap_contract_no || id
  endorsed: string;      // endorsed_at | date
  status: string;        // current_status -> contract status badge
  units: Unit[];
  total: string;         // total_contract_price | currency
}

/** One profile cluster (label / value rows) rendered in the right rail. */
interface Row { label: string; value: string; }
interface Cluster { title: string; rows: Row[]; }

/**
 * MOCK page — Staff · Client detail
 * (`/staff/customers/clients/:clientId`, `ClientDetailComponent`).
 *
 * SOURCE-FIRST port of PDO `client-detail.component.html`. The staff clients
 * route renders the SAME `ClientDetailComponent` as the agent client detail, so
 * the page BODY is identical. The template has NO `$auth.isStaff` presentational
 * branches — the only staff-aware member is the `isStaffClient` getter in the TS
 * (= `$auth.isStaff`), which is behavioural and never gates a template region.
 * So the staff BODY is structurally 1:1 with the agent's, copied verbatim from
 * the already-ported, PASSING agent client detail page.
 *
 * The ONLY staff difference is the SHELL — the STAFF top-nav (copied verbatim
 * from the sibling staff clients-list page: brand wordmark, staff nav items,
 * Admin caret, notif bell, user chip "Tactiv A." / Staff). The route is
 * `/staff/customers/clients/...` → ACTIVE nav item = "Clients".
 *
 * NOTE — the captured reference DOM/PNG (`staff-client-detail`) is a
 * LOADING-SKELETON capture: only the STAFF top-nav text
 * (Dashboard / Approval / Leads / Clients / Processor / Admin …) is in frame,
 * with placeholder boxes and NO page-body text. The LOADED state below is built
 * from the REAL TEMPLATE + the component TS field shapes + the PNG layout.
 *
 * Captured loaded view = the DEFAULT loaded state (`isRootRoute`, `!isLoading`):
 *   container > view-leads
 *     ├ breadcrumb                       → ← Clients / <name>
 *     ├ view-leads-user                  → avatar + name + favourite star (NO status tag)
 *     └ view-leads-main (main + sidebar)
 *         ├ w-100 (main)
 *         │   ├ primary tabs             → Properties (ph-buildings, ACTIVE) | Activity (ph-lightning)
 *         │   └ tab-content
 *         │       ├ Properties → <pdo-client-contracts> : contract sections
 *         │       │   (header: Contract ID + Endorsed + status tag,
 *         │       │    unit cards: thumb + development + title + Project/House type/Price,
 *         │       │    Total contract price)
 *         │       └ Activity   → <pdo-client-activities> : activity timeline
 *         └ view-leads-separator (sidebar)
 *             └ Profile tab               → profile clusters:
 *                  Account details / Personal details / Address
 *
 * ACTIVE_TAB_1 defaults to PROSPECT_PROJECT ("Properties"); ACTIVE_TAB_2 defaults
 * to PROFILE — so the DEFAULT landing shows the Properties panel + Profile rail.
 *
 * Presentational only (no data loading / tab switching / favourite behaviour).
 *
 * COMPONENT GAPS (approximated with the closest Cadence primitive):
 *   - The PDO `unit-card` is a bespoke bordered `<button>` (thumb + development +
 *     title + detail grid). No cds "unit card", so each renders as a `cds-card`
 *     with a plain thumbnail box (decoration only).
 *   - The Activity tab hosts `pdo-activity-timeline`; there is no cds timeline
 *     component, so it renders a `cds-empty-state` placeholder.
 *   - Profile clusters are label/value lists (no cds data-list component), so
 *     they render as plain `dl` markup inside the rail.
 */
@Component({
  selector: 'cds-page-staff-client-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent, CdsCardComponent, CdsTabsComponent, CdsTabComponent,
    CdsEmptyStateComponent, CdsStatusBadgeComponent, CdsAvatarComponent,
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
      <div class="view-leads">
        <!-- breadcrumb -->
        <nav class="breadcrumb" aria-label="breadcrumb">
          <span class="breadcrumb__back"><i class="ph ph-arrow-left"></i><a>Clients</a></span>
          <span class="breadcrumb__sep"></span>
          <span class="breadcrumb__active">Beau Ashby</span>
        </nav>

        <!-- view-leads-user: avatar + name + favourite star -->
        <div class="hero">
          <cds-avatar name="Beau Ashby" [src]="heroPhoto" size="lg"></cds-avatar>
          <p class="hero__name">Beau Ashby</p>
          <i class="ph ph-star hero__favorite" aria-hidden="true"></i>
        </div>

        <div class="content">
          <!-- main column -->
          <div class="main">
            <cds-tabs>
              <!-- Properties = PROSPECT_PROJECT (default active) -->
              <cds-tab label="Properties" icon="ph-bold ph-buildings">
                <div class="contracts">
                  @for (c of contracts; track c.id) {
                    <section class="contract">
                      <div class="contract__header">
                        <div class="contract__heading">
                          <p class="contract__title">Contract ID: {{ c.id }}</p>
                          <span class="contract__endorsed">Endorsed {{ c.endorsed }}</span>
                        </div>
                        <cds-status-badge kind="contract" [code]="c.status" size="md"></cds-status-badge>
                      </div>

                      <div class="contract__units">
                        @for (u of c.units; track u.title) {
                          <cds-card class="unit-card">
                            <div class="unit-card__row">
                              <div class="unit-card__thumb"></div>
                              <div class="unit-card__body">
                                <span class="unit-card__development">{{ u.development }}</span>
                                <span class="unit-card__title">{{ u.title }}</span>
                                <div class="unit-card__details">
                                  <div class="unit-card__detail">
                                    <span class="unit-card__label">Project</span>
                                    <span class="unit-card__value">{{ u.project }}</span>
                                  </div>
                                  <div class="unit-card__detail">
                                    <span class="unit-card__label">House type</span>
                                    <span class="unit-card__value">{{ u.houseType }}</span>
                                  </div>
                                  <div class="unit-card__detail">
                                    <span class="unit-card__label">Price</span>
                                    <span class="unit-card__value">{{ u.price }}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </cds-card>
                        }
                      </div>

                      <div class="contract__total">
                        <span class="contract__total-label">Total contract price</span>
                        <span class="contract__total-amount">{{ c.total }}</span>
                      </div>
                    </section>
                  }
                </div>
              </cds-tab>

              <!-- Activity = ACTIVITY -->
              <cds-tab label="Activity" icon="ph-bold ph-lightning">
                <cds-empty-state icon="ph ph-lightning" title="No activity yet"
                  message="Updates and milestones for this client will appear here."></cds-empty-state>
              </cds-tab>
            </cds-tabs>
          </div>

          <!-- sidebar / separator -->
          <aside class="sidebar">
            <cds-tabs>
              <cds-tab label="Profile" icon="ph-bold ph-user">
                <div class="profile">
                  @for (cl of clusters; track cl.title) {
                    <div class="cluster">
                      <p class="cluster__title">{{ cl.title }}</p>
                      <dl class="cluster__rows">
                        @for (r of cl.rows; track r.label) {
                          <div class="cluster__row">
                            <dt>{{ r.label }}</dt>
                            @if (cl.title === 'Account details' && r.label === 'Enrolled by') {
                              <dd class="cluster__person"><cds-avatar name="Hugo Calder" [src]="placeholder" size="sm"></cds-avatar>{{ r.value }}</dd>
                            } @else {
                              <dd>{{ r.value }}</dd>
                            }
                          </div>
                        }
                      </dl>
                    </div>
                  }
                </div>
              </cds-tab>
            </cds-tabs>
          </aside>
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

    /* staff caret nav items (Dashboard, Admin) align start, not center (page-scoped) */
    :host ::ng-deep .cds-nav-item--caret { text-align: start; }

    .view-leads { display: flex; flex-direction: column; gap: var(--cds-space-24); align-items: stretch; }

    /* breadcrumb */
    .breadcrumb { display: flex; align-items: center; gap: var(--cds-space-8); margin: 0; padding: 0; font-size: var(--cds-font-size-sm); }
    .breadcrumb__back { display: inline-flex; align-items: center; gap: var(--cds-space-8); color: var(--cds-text-tertiary); cursor: pointer; }
    .breadcrumb__back i { font-size: 16px; }
    .breadcrumb__sep { width: 1px; height: 14px; background: var(--cds-border); }
    .breadcrumb__active { font-family: var(--cds-font-family-medium); font-weight: 500; color: var(--cds-text-primary); }

    /* hero: avatar + name + star */
    .hero { display: flex; align-items: center; gap: var(--cds-space-16); }
    .hero__name { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 24px; line-height: 29px; letter-spacing: -0.3px; color: var(--cds-text-primary); }
    .hero__favorite { font-size: 20px; color: var(--cds-text-tertiary); cursor: pointer; }

    /* content: main + sidebar */
    .content { display: grid; grid-template-columns: 1fr 360px; gap: var(--cds-space-40); align-items: start; }
    @media (max-width: 900px) { .content { grid-template-columns: 1fr; } }
    .main { display: flex; flex-direction: column; gap: var(--cds-space-24); min-width: 0; }

    /* client-contracts */
    .contracts { display: flex; flex-direction: column; gap: var(--cds-space-24); padding-top: var(--cds-space-16); }
    .contract { display: flex; flex-direction: column; gap: var(--cds-space-12); }
    .contract__header { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-12); }
    .contract__heading { display: flex; align-items: baseline; gap: var(--cds-space-8); min-width: 0; }
    .contract__title { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 500; letter-spacing: -0.3px; color: var(--cds-text-primary); }
    .contract__endorsed { font-size: var(--cds-font-size-sm); color: var(--cds-text-tertiary); }
    .contract__units { display: flex; flex-direction: column; gap: var(--cds-space-12); }
    .contract__total { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-12); padding: var(--cds-space-12) var(--cds-space-16); border-radius: var(--cds-radius-sm); background: var(--cds-surface-subtle); }
    .contract__total-label { font-size: var(--cds-font-size-sm); color: var(--cds-text-secondary); }
    .contract__total-amount { font-family: var(--cds-font-family-semibold); font-weight: 600; color: var(--cds-text-primary); white-space: nowrap; }

    /* unit-card */
    /* Real PDO \`.unit-card\` (client-contracts.component.scss) is a transparent bordered
       button: 1px \$stroke-default (gray-300 #d0d5dd as rendered), \$radius-sm 8px,
       \$spacing-sm-2 12px padding, 14px top margin, NO shadow — NOT the default cds-card
       12px-radius / gray-200 border / shadow-xs shell. Override at page level (::ng-deep on
       the matched host) so cds-card stays correct for other pages. */
    .contract__units ::ng-deep .cds-card.unit-card { border-color: var(--cds-gray-300); border-radius: var(--cds-radius-sm); padding: var(--cds-space-12); margin-top: var(--cds-space-14); box-shadow: none; }
    .contract__units ::ng-deep .cds-card.unit-card .cds-card__body { padding: 0; }
    .unit-card__row { display: flex; flex-direction: row; align-items: stretch; gap: var(--cds-space-16); text-align: left; }
    .unit-card__thumb { width: 104px; height: 78px; min-width: 104px; border-radius: var(--cds-radius-xs); background: var(--cds-surface-subtle); }
    .unit-card__body { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: var(--cds-space-4); }
    .unit-card__development { font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 11px; line-height: 16px; letter-spacing: 0.5px; text-transform: uppercase; color: var(--cds-color-primary); }
    .unit-card__title { font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 18px; line-height: 24px; letter-spacing: -0.3px; color: var(--cds-text-primary); }
    .unit-card__details { display: flex; flex-wrap: wrap; gap: var(--cds-space-8) var(--cds-space-32); padding-top: var(--cds-space-8); }
    .unit-card__detail { display: flex; flex-direction: column; gap: var(--cds-space-4); min-width: 0; }
    .unit-card__label { font-size: var(--cds-font-size-xs); color: var(--cds-text-tertiary); }
    .unit-card__value { font-size: var(--cds-font-size-sm); color: var(--cds-text-primary); }

    /* sidebar / profile clusters */
    .sidebar { border-left: 1px solid var(--cds-border); padding-left: var(--cds-space-24); }
    .profile { display: flex; flex-direction: column; gap: var(--cds-space-24); padding-top: var(--cds-space-16); }
    .cluster { display: flex; flex-direction: column; gap: var(--cds-space-12); }
    .cluster__title { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 500; color: var(--cds-text-primary); }
    .cluster__rows { display: flex; flex-direction: column; gap: var(--cds-space-12); margin: 0; }
    .cluster__row { display: flex; align-items: flex-start; gap: var(--cds-space-24); }
    .cluster__row dt { min-width: 130px; max-width: 130px; color: var(--cds-text-tertiary); font-size: var(--cds-font-size-sm); }
    .cluster__row dd { margin: 0; color: var(--cds-text-secondary); font-size: var(--cds-font-size-sm); text-align: left; }
    .cluster__person { display: inline-flex; align-items: center; gap: var(--cds-space-8); }
  `],
})
export class StaffClientDetailPage {
  /** Neutral avatar placeholder (data URI so the chip carries a real <img>). */
  placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="20" fill="rgb(207,212,220)"/></svg>'
  );
  /** Larger neutral placeholder for the hero avatar. */
  heroPhoto = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><circle cx="40" cy="40" r="40" fill="rgb(207,212,220)"/></svg>'
  );

  /** `contracts` — one page of the client's contracts (Properties tab). */
  contracts: Contract[] = [
    {
      id: 'SAP-00294',
      endorsed: '12 Apr 2026',
      status: 'reserved_buyer',
      total: '₱ 4,250,000.00',
      units: [
        {
          development: 'Pueblo Verde',
          title: 'Lot 12',
          project: 'Pueblo Verde',
          houseType: 'Single Detached',
          price: '₱ 4,250,000.00',
        },
      ],
    },
  ];

  /** Right-rail Profile clusters (labels verbatim from the template). */
  clusters: Cluster[] = [
    {
      title: 'Account details',
      rows: [
        { label: 'Client ID no.', value: '340' },
        { label: 'Date inquired', value: 'June 25, 2026' },
        { label: 'Enrolled by', value: 'Hugo Calder' },
      ],
    },
    {
      title: 'Personal details',
      rows: [
        { label: 'Email', value: 'user48@example.com' },
        { label: 'Mobile Number', value: '+63 900-000-0006' },
        { label: 'Date of Birth', value: 'June 6, 2001' },
        { label: 'Gender', value: 'Female' },
        { label: 'Civil Status', value: 'Married' },
        { label: 'Nationality', value: 'Filipino' },
      ],
    },
    {
      title: 'Address',
      rows: [
        { label: 'Home Address', value: 'Cebu, Cebu City, Lahug, 12 Salinas Drive' },
      ],
    },
  ];
}
