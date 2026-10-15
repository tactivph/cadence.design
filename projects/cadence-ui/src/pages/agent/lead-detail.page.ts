import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsButtonComponent, CdsAlertComponent,
  CdsCardComponent, CdsTabsComponent, CdsTabComponent,
  CdsEmptyStateComponent, CdsStatusBadgeComponent, CdsAvatarComponent,
} from '../../public-api';

/** One endorsement-checklist step — mirrors the 4 `article.checklist-card`s. */
interface Step {
  n: number;
  title: string;
  subtitle: string;
  action: string;
  done?: boolean;
  active?: boolean;
  withArrow?: boolean;
}

/** One profile cluster row (label / value) rendered in the right rail. */
interface Row { label: string; value: string; }

/**
 * MOCK page — Agent · Lead detail (`/agent/leads/:id`, `LeadDetailComponent`).
 *
 * SOURCE-FIRST port of PDO `lead-detail.component.html`. TOP-LEVEL agent page:
 * the captured reference (selector `app-root`) shows the top-nav shell in frame
 * with the "Leads" nav item active and NO dashboard sub-tabs. The shell is
 * copied verbatim from the leads-list sibling.
 *
 * Captured view = the DEFAULT loaded state (PNG): CAS-**expired** banner,
 * lead hero (name + favourite star + "Signed CAS" status tag), the endorsement
 * checklist (success note + 4 numbered cards), the primary tabs with the
 * **Prospect property** tab active (empty "Add property" state), and the
 * right-rail Profile tab (Account / Contact / Personal / Client appointment
 * slip / Site visit assessment clusters).
 *
 * Structure mirrors lead-detail.component.html 1:1:
 *   container > view-leads.lead-detail-page
 *     ├ header-breadcrumb              → ← Leads / <name>
 *     ├ cas-banner (switch: expired)   → cds-alert variant="danger"
 *     └ content
 *         ├ main
 *         │   ├ hero.title-row         → name + star + pdo-lead-tag
 *         │   ├ activity               → section-subtitle + status-banner (success) + checklist-grid (4 cards)
 *         │   └ panel                  → primary tabs (Prospect property | Endorsements) + tab-content
 *         └ sidebar (aside)            → sidebar tabs (Profile | Notes) + profile clusters
 *
 * Presentational only (no data loading / tab switching / favourite behaviour).
 *
 * COMPONENT GAPS (approximated with the closest Cadence primitive):
 *   - The numbered checklist cards are PDO bespoke `article`s (number chip +
 *     title + subtitle + CTA). No cds "numbered step card", so each is a
 *     `cds-card` with a small styled number chip (decoration only).
 *   - The "Add property" empty state is a PDO dashed add button; mapped to
 *     `cds-empty-state` (icon + title + message) — the closest primitive.
 *   - Profile clusters are label/value lists (no cds data-list component), so
 *     they render as plain `dl` markup inside the rail.
 */
@Component({
  selector: 'cds-page-agent-lead-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent, CdsButtonComponent, CdsAlertComponent,
    CdsCardComponent, CdsTabsComponent, CdsTabComponent,
    CdsEmptyStateComponent, CdsStatusBadgeComponent, CdsAvatarComponent,
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
      <div class="view-leads">
        <!-- header-breadcrumb -->
        <nav class="breadcrumb" aria-label="breadcrumb">
          <span class="breadcrumb__back"><i class="ph ph-arrow-left"></i><a>Leads</a></span>
          <span class="breadcrumb__sep">/</span>
          <span class="breadcrumb__active">Sasha Ashby</span>
        </nav>

        <!-- cas-banner (expired) -->
        <cds-alert variant="danger" icon="ph-bold ph-warning" title="CAS expired · Action needed">
          Expired on September 13, 2026. Upload a signed CAS or send a new online CAS to continue.
          <div cds-alert-actions class="banner-actions">
            <button cds-button variant="secondary-neutral" iconLeft="ph ph-paper-plane-tilt">Resend email</button>
            <button cds-button variant="primary" iconLeft="ph ph-upload-simple">Upload CAS</button>
          </div>
        </cds-alert>

        <div class="content">
          <!-- main column -->
          <div class="main">
            <!-- hero -->
            <div class="hero">
              <p class="hero__name">Remy Ashby</p>
              <i class="ph ph-star hero__favorite" aria-hidden="true"></i>
              <cds-status-badge kind="client-category" code="signed_cas" [info]="true"></cds-status-badge>
            </div>

            <!-- activity / endorsement checklist -->
            <section class="activity">
              <p class="activity__subtitle">Complete the steps below to proceed with endorsement.</p>

              <cds-alert variant="success" icon="ph-bold ph-info">
                This lead has completed all requirements and is ready for endorsement. Open Endorsements to continue.
                <div cds-alert-actions>
                  <button cds-button variant="link" iconRight="ph ph-arrow-right">Go to Endorsements</button>
                </div>
              </cds-alert>

              <div class="checklist">
                @for (s of steps; track s.n) {
                  <cds-card class="check-card" [class.is-active]="s.active">
                    <div class="check-card__chip" [class.is-done]="s.done" [class.is-active]="s.active"><span>{{ s.n }}</span></div>
                    <div class="check-card__text">
                      <p class="check-card__title">{{ s.title }}</p>
                      <p class="check-card__subtitle">{{ s.subtitle }}</p>
                    </div>
                    <button cds-button size="sm"
                      [variant]="s.active ? 'primary' : 'secondary-neutral'"
                      [iconRight]="s.withArrow ? 'ph-bold ph-arrow-right' : undefined">{{ s.action }}</button>
                  </cds-card>
                }
              </div>
            </section>

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

          <!-- sidebar -->
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
                              <dd class="cluster__person"><cds-avatar name="Hugo Calder" size="sm"></cds-avatar>{{ r.value }}</dd>
                            } @else if (c.title === 'Client appointment slip' && r.label === 'Status') {
                              <dd><cds-status-badge kind="client-category" code="expired" label="Expired" tone="danger" size="sm"></cds-status-badge></dd>
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
              <cds-tab label="Notes" icon="ph-bold ph-note">
                <cds-empty-state icon="ph ph-note" title="No notes yet"
                  message="Add a note to keep track of this lead."></cds-empty-state>
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

    .view-leads { display: flex; flex-direction: column; gap: var(--cds-space-24); align-items: stretch; }

    /* header-breadcrumb */
    .breadcrumb { display: flex; align-items: center; gap: var(--cds-space-8); margin: 0; padding: 0; font-size: var(--cds-font-size-sm); }
    .breadcrumb__back { display: inline-flex; align-items: center; gap: var(--cds-space-8); color: var(--cds-text-tertiary); cursor: pointer; }
    .breadcrumb__back i { font-size: 16px; }
    .breadcrumb__sep { color: var(--cds-text-tertiary); }
    .breadcrumb__active { font-family: var(--cds-font-family-medium); font-weight: 500; color: var(--cds-text-primary); }

    .banner-actions { display: flex; gap: var(--cds-space-8); }

    /* content: main + sidebar */
    .content { display: grid; grid-template-columns: 1fr 360px; gap: var(--cds-space-40); align-items: start; }
    @media (max-width: 900px) { .content { grid-template-columns: 1fr; } }
    .main { display: flex; flex-direction: column; gap: var(--cds-space-24); min-width: 0; }

    /* hero */
    .hero { display: flex; align-items: center; gap: var(--cds-space-12); }
    .hero__name { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 24px; line-height: 29px; letter-spacing: -0.3px; color: var(--cds-text-primary); }
    .hero__favorite { font-size: 20px; color: var(--cds-text-tertiary); cursor: pointer; }

    /* activity */
    .activity { display: flex; flex-direction: column; gap: var(--cds-space-16); }
    .activity__subtitle { margin: 0; font-size: 15px; color: var(--cds-text-secondary); }

    /* checklist grid: 4 numbered cards */
    .checklist { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--cds-space-16); }
    @media (max-width: 1100px) { .checklist { grid-template-columns: repeat(2, 1fr); } }
    .check-card { display: flex; flex-direction: column; gap: var(--cds-space-12); }
    .check-card.is-active { border-color: var(--cds-color-primary); }
    .check-card__chip { width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: var(--cds-neutral-200); color: var(--cds-text-secondary); font-size: 12px; font-family: var(--cds-font-family-medium); font-weight: 500; }
    .check-card__chip.is-done, .check-card__chip.is-active { background: var(--cds-color-primary); color: #fff; }
    .check-card__text { display: flex; flex-direction: column; gap: var(--cds-space-4); flex: 1; }
    .check-card__title { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 500; color: var(--cds-text-primary); }
    .check-card__subtitle { margin: 0; font-size: var(--cds-font-size-sm); color: var(--cds-text-tertiary); }

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
  `],
})
export class AgentLeadDetailPage {
  /** Neutral avatar placeholder (data URI so the chip carries a real <img>). */
  placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="20" fill="rgb(207,212,220)"/></svg>'
  );

  /** The 4 `article.checklist-card`s — labels verbatim from the template. */
  steps: Step[] = [
    { n: 1, title: 'Set schedule for visit', subtitle: 'Send a request to schedule a tripping', action: 'View schedule', done: true },
    { n: 2, title: 'Complete Site Visit', subtitle: 'Log details of site visit with lead', action: 'View completed site visit', done: true },
    { n: 3, title: 'Update lead profile', subtitle: 'Complete lead details required for reservation', action: 'View profile', done: true },
    { n: 4, title: 'Endorse for Reservation', subtitle: 'Validate financial eligibility and endorse to PDO for approval', action: 'Endorse', active: true, withArrow: true },
  ];

  /** Right-rail Profile clusters (labels verbatim from the template). */
  clusters: { title: string; rows: Row[] }[] = [
    {
      title: 'Account details',
      rows: [
        { label: 'Lead ID no.', value: '354' },
        { label: 'Lead Source', value: 'Agent/broker - website' },
        { label: 'Date Inquired', value: 'June 25, 2026' },
        { label: 'Enrolled by', value: 'Hugo Calder' },
      ],
    },
    {
      title: 'Contact details',
      rows: [
        { label: 'Email', value: 'user2@example.com' },
        { label: 'Phone Number', value: '+63 900-000-0033' },
      ],
    },
    {
      title: 'Personal details',
      rows: [
        { label: 'Date of Birth', value: 'June 6, 2001' },
        { label: 'Civil Status', value: 'Married' },
        { label: 'Nationality', value: 'Foreign' },
        { label: 'Gender', value: 'Female' },
        { label: 'Place of Residence', value: '-' },
      ],
    },
    {
      title: 'Client appointment slip',
      rows: [
        { label: 'Status', value: 'Expired' },
        { label: 'Activated', value: '-' },
        { label: 'Source', value: '-' },
        { label: 'Uploaded file', value: '-' },
        { label: 'Expiry', value: 'September 13, 2026' },
      ],
    },
    {
      title: 'Site visit assessment',
      rows: [
        { label: 'Assessment', value: '-' },
      ],
    },
  ];
}
