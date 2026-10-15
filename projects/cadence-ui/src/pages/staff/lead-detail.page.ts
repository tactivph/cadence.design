import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsAlertComponent,
  CdsTabsComponent, CdsTabComponent,
  CdsEmptyStateComponent, CdsStatusBadgeComponent, CdsAvatarComponent,
} from '../../public-api';

/** One profile cluster row (label / value) rendered in the right rail. */
interface Row { label: string; value: string; }

/**
 * MOCK page — Staff · Lead detail (`/staff/customers/leads/:id`, `LeadDetailComponent`).
 *
 * SOURCE-FIRST port of PDO `lead-detail.component.html`. The staff leads route
 * renders the SAME `LeadDetailComponent` as the agent lead detail, so the page
 * BODY is the same component — only the staff-context template branches differ.
 *
 * NOTE ON THE CAPTURE: `staff-lead-detail.dom.json` is a LOADING-SKELETON
 * capture — it contains only the staff top-nav text (Dashboard / Approval /
 * Leads / Clients / Admin) with no page body. So the LOADED state below is built
 * from the real template (`@if (!isLoading && lead)` branch) + the PNG.
 *
 * STAFF vs AGENT body differences (all from `@if (!$auth.isStaff)` guards in the
 * template), confirmed against the PNG:
 *   1. Favourite star next to the name is HIDDEN for staff (line 153 guard).
 *   2. The whole endorsement-checklist `section.activity` (success/warning status
 *      banner + 4 numbered checklist cards) is HIDDEN for staff (line 168 guard).
 *   3. The sidebar "Notes" tab is HIDDEN for staff — only "Profile" remains
 *      (line 425 guard). `pdo-lead-notes` is the agent's own record.
 * The hero name + status tag, CAS banner, Prospect/Endorsements primary tabs and
 * the Profile clusters are identical to the agent view. The captured PNG shows
 * the CAS banner in its **active** state (switch `@case ('active')`).
 *
 * Structure mirrors the staff branch of lead-detail.component.html 1:1:
 *   container > view-leads.lead-detail-page
 *     ├ header-breadcrumb              → ← Leads / <name>
 *     ├ cas-banner (switch: active)    → cds-alert variant="info"
 *     └ content
 *         ├ main
 *         │   ├ hero.title-row         → name + pdo-lead-tag (NO favourite star)
 *         │   └ panel                  → primary tabs (Prospect property | Endorsements)
 *         └ sidebar (aside)            → sidebar tabs (Profile only) + profile clusters
 *
 * Presentational only (no data loading / tab switching behaviour).
 *
 * COMPONENT GAPS (approximated with the closest Cadence primitive):
 *   - The "Add property" empty state is a PDO dashed add button; mapped to
 *     `cds-empty-state` (icon + title + message) — the closest primitive.
 *   - Profile clusters are label/value lists (no cds data-list component), so
 *     they render as plain `dl` markup inside the rail.
 */
@Component({
  selector: 'cds-page-staff-lead-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent, CdsAlertComponent,
    CdsTabsComponent, CdsTabComponent,
    CdsEmptyStateComponent, CdsStatusBadgeComponent, CdsAvatarComponent,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item [hasCaret]="true">Dashboard</a>
      <a cds-nav-item>Approval</a>
      <a cds-nav-item [active]="true">Leads</a>
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
      <div class="view-leads">
        <!-- header-breadcrumb -->
        <nav class="breadcrumb" aria-label="breadcrumb">
          <span class="breadcrumb__back"><i class="ph ph-arrow-left"></i><a>Leads</a></span>
          <span class="breadcrumb__sep">/</span>
          <span class="breadcrumb__active">Nico Ashby</span>
        </nav>

        <!-- cas-banner (active) -->
        <cds-alert variant="info" icon="ph ph-info" title="CAS active · 24 days remaining.">
          Active since October 7, 2026. Expires on
          <span class="cas-strong">November 6, 2026</span>. This is the current CAS on record.
        </cds-alert>

        <div class="content">
          <!-- main column -->
          <div class="main">
            <!-- hero (staff: no favourite star) -->
            <div class="hero">
              <p class="hero__name">Nico Ashby</p>
              <cds-status-badge kind="client-category" code="signed_cas" [info]="true"></cds-status-badge>
            </div>

            <!-- panel: primary tabs -->
            <section class="panel">
              <cds-tabs>
                <cds-tab label="Prospect property" icon="ph-bold ph-buildings">
                  <cds-empty-state icon="ph-bold ph-plus" title="Add property"
                    message="You can only add up to 10 property per lead."></cds-empty-state>
                </cds-tab>
                <cds-tab label="Endorsements" icon="ph-bold ph-folders">
                  <cds-empty-state icon="ph ph-folders" title="No endorsements yet"
                    message="Endorse this lead for reservation to see it here."></cds-empty-state>
                </cds-tab>
              </cds-tabs>
            </section>
          </div>

          <!-- sidebar (staff: Profile tab only, no Notes) -->
          <aside class="sidebar">
            <cds-tabs>
              <cds-tab label="Profile" icon="ph-bold ph-user">
                <div class="profile">
                  @for (c of clusters; track c.title) {
                    <div class="cluster">
                      <p class="cluster__title">{{ c.title }}</p>
                      <dl class="cluster__rows">
                        @for (r of c.rows; track r.label) {
                          <div class="cluster__row">
                            <dt>{{ r.label }}</dt>
                            @if (c.title === 'Account details' && r.label === 'Enrolled by') {
                              <dd class="cluster__person"><cds-avatar name="Broker Two" size="sm"></cds-avatar>{{ r.value }}</dd>
                            } @else if (c.title === 'Client appointment slip' && r.label === 'Status') {
                              <dd><cds-status-badge kind="client-category" code="active" label="Active" tone="success" size="sm"></cds-status-badge></dd>
                            } @else if (c.title === 'Client appointment slip' && r.label === 'Uploaded file') {
                              <dd><a class="cluster__link" href="#">{{ r.value }}</a></dd>
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

    /* header-breadcrumb */
    .breadcrumb { display: flex; align-items: center; gap: var(--cds-space-8); margin: 0; padding: 0; font-size: var(--cds-font-size-sm); }
    .breadcrumb__back { display: inline-flex; align-items: center; gap: var(--cds-space-8); color: var(--cds-text-tertiary); cursor: pointer; }
    .breadcrumb__back i { font-size: 16px; }
    .breadcrumb__sep { color: var(--cds-text-tertiary); }
    .breadcrumb__active { font-family: var(--cds-font-family-medium); font-weight: 500; color: var(--cds-text-primary); }

    .cas-strong { font-family: var(--cds-font-family-medium); font-weight: 500; color: var(--cds-text-primary); }

    /* content: main + sidebar */
    .content { display: grid; grid-template-columns: 1fr 360px; gap: var(--cds-space-40); align-items: start; }
    @media (max-width: 900px) { .content { grid-template-columns: 1fr; } }
    .main { display: flex; flex-direction: column; gap: var(--cds-space-24); min-width: 0; }

    /* hero */
    .hero { display: flex; align-items: center; gap: var(--cds-space-12); }
    .hero__name { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 24px; line-height: 29px; letter-spacing: -0.3px; color: var(--cds-text-primary); }

    /* sidebar */
    .sidebar { border-left: 1px solid var(--cds-border); padding-left: var(--cds-space-24); }
    .profile { display: flex; flex-direction: column; gap: var(--cds-space-24); padding-top: var(--cds-space-16); }
    .cluster { display: flex; flex-direction: column; gap: var(--cds-space-8); }
    .cluster__title { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 500; color: var(--cds-text-primary); }
    .cluster__rows { display: flex; flex-direction: column; gap: var(--cds-space-8); margin: 0; }
    .cluster__row { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-16); }
    .cluster__row dt { color: var(--cds-text-tertiary); font-size: var(--cds-font-size-sm); }
    .cluster__row dd { margin: 0; color: var(--cds-text-primary); font-size: var(--cds-font-size-sm); text-align: right; }
    .cluster__person { display: inline-flex; align-items: center; gap: var(--cds-space-8); }
    .cluster__link { color: var(--cds-color-primary); text-decoration: none; }
  `],
})
export class StaffLeadDetailPage {
  /** Right-rail Profile clusters (labels verbatim from the template; values from the PNG). */
  clusters: { title: string; rows: Row[] }[] = [
    {
      title: 'Account details',
      rows: [
        { label: 'Lead ID no.', value: '385' },
        { label: 'Lead Source', value: 'Agent/broker - website' },
        { label: 'Date Inquired', value: 'July 29, 2026' },
        { label: 'Enrolled by', value: 'Broker Two' },
      ],
    },
    {
      title: 'Contact details',
      rows: [
        { label: 'Email', value: 'user14@example.com' },
        { label: 'Phone Number', value: '+63 900-000-0032' },
      ],
    },
    {
      title: 'Personal details',
      rows: [
        { label: 'Date of Birth', value: 'August 1, 2008' },
        { label: 'Civil Status', value: 'Single' },
        { label: 'Nationality', value: 'Filipino' },
        { label: 'Gender', value: 'Male' },
        { label: 'Place of Residence', value: 'Antique, Hamtic, Bongbongan Iii, 123 Orange Street' },
      ],
    },
    {
      title: 'Client appointment slip',
      rows: [
        { label: 'Status', value: 'Active' },
        { label: 'Activated', value: 'Oct 7, 2026, 5:20 PM' },
        { label: 'Source', value: 'Via upload' },
        { label: 'Uploaded file', value: '1791357631-image_7.png' },
        { label: 'Expiry', value: 'November 6, 2026' },
      ],
    },
    {
      title: 'Site visit assessment',
      rows: [
        { label: 'Assessment', value: 'Closeable' },
      ],
    },
  ];
}
