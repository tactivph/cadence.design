import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsStepperComponent, CdsCardComponent,
  CdsBadgeComponent, CdsButtonComponent, CdsStatusBadgeComponent, CdsStep,
} from '../../public-api';

/**
 * One pre-reservation requirement row (reservation-requirements-list › requirement-item).
 * Every row in the real list-mode template has a title + subtitle; some carry a status pill.
 */
interface Req {
  title: string;
  subtitle: string;
  /** requirement preset code; omitted = no status pill. */
  statusCode?: 'draft' | 'submission' | 'for_review' | 'approved' | 'rejected';
}

/**
 * Client · Pre-reservation requirements — ported SOURCE-FIRST from the live PDO
 * `/client/requirements/pre-reservation` view (PreReservationComponent → pdo-pre-reservation).
 *
 * Source: pdo/web/src/app/pages/client/requirements/pre-reservation/pre-reservation.component.html
 * The captured reference (client-pre-reservation.dom.json) was a LOADING SKELETON — only the
 * client top-nav text ("Requirements"/"Property feed"/…) rendered; the `pdo-requirements`
 * container was empty. This LOADED state is reproduced from the real template (+ the sibling
 * requirements shell for the hero/stage-rail, which this route nests inside).
 *
 * Real template body (reservation-requirements):
 *   header  → title2 "Pre-reservation requirements" + "Submit for verification" button
 *   list    → requirement-item rows (folder icon + title + subtitle, trailing status/open cue)
 *             1. Buyer's information sheet      — "Provide accurate and complete information."
 *             2. Preliminary loan questionnaire — "Make sure to provide complete information" · Pending
 *
 * Composed only from Cadence components; presentational static fixture.
 */
@Component({
  selector: 'cds-page-client-pre-reservation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent, CdsStepperComponent, CdsCardComponent,
    CdsBadgeComponent, CdsButtonComponent, CdsStatusBadgeComponent,
  ],
  template: `
    <!-- CLIENT top-nav shell (navigation.service → client nav items) -->
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item [active]="true">Requirements</a>
      <a cds-nav-item>Property feed</a>
      <a cds-nav-item>Financing</a>
      <a cds-nav-item>Site Map</a>
      <div cds-topnav-actions class="hdr-actions">
        <cds-notif-bell [count]="1"></cds-notif-bell>
        <cds-user-chip name="James T." role="Client"></cds-user-chip>
      </div>
    </cds-top-nav>

    <main class="cds-container page">
      <!-- Project hero (reservation-requirements-hero) -->
      <section class="hero" aria-label="Project">
        <div class="hero__filter"></div>
        <div class="hero__content">
          <p class="hero__eyebrow">Townscapes Malvar</p>
          <div class="hero__row">
            <h1 class="hero__title">Townscapes Malvar</h1>
            <cds-badge tone="success" shape="rounded" icon="ph-bold ph-house">Block 5, Lot 11</cds-badge>
          </div>
        </div>
      </section>

      <!-- reservation-requirements: stage rail + the pre-reservation requirements list -->
      <div class="layout">
        <!-- reservation-requirements-sidecard → 12-stage timeline rail -->
        <aside class="rail" aria-label="Stages">
          <cds-stepper [steps]="stages" [activeIndex]="0" [clickable]="true" orientation="vertical"></cds-stepper>
        </aside>

        <!-- reservation-requirements-container → pre-reservation requirements -->
        <section class="panel" aria-label="Pre-reservation requirements">
          <cds-card>
            <!-- reservation-requirements-header -->
            <header cds-card-header class="panel__head">
              <h2 class="panel__title">Pre-reservation requirements</h2>
              <div class="panel__actions">
                <button cds-button variant="primary" size="sm">Submit for verification</button>
                <button cds-button variant="secondary" size="sm" iconOnly iconLeft="ph-bold ph-squares-four" aria-label="Grid view"></button>
                <button cds-button variant="secondary" size="sm" iconOnly iconLeft="ph-bold ph-list-bullets" aria-label="List view"></button>
              </div>
            </header>

            <!-- reservation-requirements-list (list-mode) -->
            <ul class="reqs">
              @for (r of requirements; track r.title; let i = $index) {
                <li class="req req--{{ i }}">
                  <span class="req__info">
                    <span class="req__icon" aria-hidden="true"><i class="ph-fill ph-file-text"></i></span>
                    <span class="req__text">
                      <span class="req__title">{{ r.title }}</span>
                      <span class="req__subtitle">{{ r.subtitle }}</span>
                    </span>
                  </span>
                  <span class="req__end">
                    @if (r.statusCode) {
                      <cds-status-badge kind="requirement" [code]="r.statusCode" size="lg"></cds-status-badge>
                    }
                    <i class="req__cue ph ph-arrow-square-out" aria-hidden="true"></i>
                  </span>
                </li>
              }
            </ul>
          </cds-card>
        </section>
      </div>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface-subtle); min-height: 100vh; }
    .brand { font-weight: 800; font-size: 1.25rem; }
    .brand__one { color: var(--cds-text-tertiary); }
    .brand__pdo { color: var(--cds-color-primary); }
    .hdr-actions { display: flex; align-items: center; gap: var(--cds-space-16); }

    .page { display: flex; flex-direction: column; gap: var(--cds-space-24); padding: var(--cds-space-24) var(--cds-space-40); }

    .hero { position: relative; border-radius: var(--cds-radius-lg); padding: var(--cds-space-24); min-height: 404px; display: flex; flex-direction: column; justify-content: flex-end; color: #fff; overflow: hidden; background: linear-gradient(135deg, #3f6f4a, #7fae6b); }
    .hero__filter { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(16,24,40,0) 40%, rgba(16,24,40,.55) 100%); }
    .hero__content { position: relative; }
    .hero__eyebrow { font-size: .875rem; opacity: .9; margin: 0; }
    .hero__row { display: flex; align-items: center; gap: var(--cds-space-12); margin-top: var(--cds-space-4); }
    .hero__title { font-size: 2rem; font-weight: 700; margin: 0; color: #fff; }

    .layout { display: grid; grid-template-columns: 320px 1fr; gap: var(--cds-space-24); align-items: start; }
    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } }

    .panel__head { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-16); padding-bottom: var(--cds-space-16); border-bottom: 1px solid var(--cds-border-subtle); }
    .panel__title { font-size: 1.125rem; font-weight: 600; margin: 0; color: var(--cds-text-primary); }
    .panel__actions { display: flex; align-items: center; gap: var(--cds-space-8); }

    .reqs { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .req { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-12); padding: var(--cds-space-16) 0; border-bottom: 1px solid var(--cds-border-subtle); }
    .req:last-child { border-bottom: 0; }
    .req__info { display: flex; align-items: center; gap: var(--cds-space-12); min-width: 0; }
    .req__icon { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: var(--cds-radius-sm); font-size: 1.25rem; color: #16a34a; background: rgba(22,163,74,.1); flex: none; }
    .req__text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .req__title { font-weight: 500; color: var(--cds-text-primary); }
    .req__subtitle { font-size: .8125rem; color: var(--cds-text-tertiary); }
    .req__end { display: flex; align-items: center; gap: var(--cds-space-16); flex: none; }
    .req__cue { color: var(--cds-text-tertiary); font-size: 1.125rem; }
  `],
})
export class ClientPreReservationPage {
  /** The 12 stages (contract_requirements categories) — the left timeline rail. */
  stages: CdsStep[] = [
    { label: 'Pre-reservation Requirements', status: 'current' },
    { label: 'Reservation Requirements', status: 'upcoming' },
    { label: 'First Equity', status: 'upcoming' },
    { label: 'Full Document Compliance', status: 'upcoming' },
    { label: 'HCR Requirements', status: 'upcoming' },
    { label: 'HCR Approval Documents', status: 'upcoming' },
    { label: 'Resubmission Of BIS', status: 'upcoming' },
    { label: 'Update Of Income Requirements', status: 'upcoming' },
    { label: 'Loan Documents Signing & Notary', status: 'upcoming' },
    { label: 'Annotation', status: 'upcoming' },
    { label: 'Booking', status: 'upcoming' },
    { label: 'Turnover', status: 'upcoming' },
  ];

  /** reservation-requirements-list › requirement-item rows (list-mode). */
  requirements: Req[] = [
    { title: "Buyer’s information sheet", subtitle: 'Provide accurate and complete information.' },
    { title: 'Preliminary loan questionnaire', subtitle: 'Make sure to provide complete information', statusCode: 'for_review' },
  ];
}
