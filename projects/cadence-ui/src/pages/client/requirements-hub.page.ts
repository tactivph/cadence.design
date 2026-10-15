import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsStepperComponent, CdsCardComponent,
  CdsBadgeComponent, CdsButtonComponent, CdsStatusBadgeComponent, CdsStep,
} from '../../public-api';

/** One requirement item in the selected stage's list. */
interface Req {
  title: string;
  /** form = Phosphor file-text, folder = document folder. */
  kind: 'form' | 'folder' | 'folder-active';
  /** requirement preset code; omitted = no status pill. */
  statusCode?: 'draft' | 'submission' | 'for_review' | 'approved' | 'rejected';
  /** forms open in a new view (arrow-square-out); folders drill in (caret-right). */
  action: 'open' | 'chevron';
}

/**
 * Client · Requirements hub — ported 1:1 from the live PDO
 * `/client/requirements` view (RequirementsComponent → pdo-client-requirements).
 *
 * Source: pdo/web/src/app/components/client-requirements/client-requirements.component.html
 * The captured reference was a LOADING SKELETON (only the client top-nav text was
 * present); this LOADED state is reproduced from the real template + the reference PNG.
 *
 * Structure (top→bottom):
 *   client top-nav shell → hero (project banner) → two-column body
 *   (left: 12-stage timeline rail, right: selected stage's requirement list).
 * Composed only from Cadence components; presentational static fixture.
 */
@Component({
  selector: 'cds-page-client-requirements',
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

      <!-- reservation-requirements-pre: sidecard rail + requirements panel -->
      <div class="layout">
        <!-- reservation-requirements-sidecard → timeline (the 12 stages) -->
        <aside class="rail" aria-label="Stages">
          <cds-stepper [steps]="stages" [activeIndex]="0" [clickable]="true" orientation="vertical"></cds-stepper>
        </aside>

        <!-- reservation-requirements-container → the selected stage's items -->
        <section class="panel" aria-label="Pre-reservation Requirements">
          <cds-card>
            <header cds-card-header class="panel__head">
              <h2 class="panel__title">Pre-reservation Requirements <span class="panel__hint">(To be filled by 'You')</span></h2>
              <div class="panel__actions">
                <button cds-button variant="primary" size="sm" [disabled]="true">Submit for verification</button>
                <button cds-button variant="secondary" size="sm" iconOnly iconLeft="ph-bold ph-squares-four" aria-label="Grid view"></button>
                <button cds-button variant="secondary" size="sm" iconOnly iconLeft="ph-bold ph-list-bullets" aria-label="List view"></button>
              </div>
            </header>

            <ul class="reqs">
              @for (r of requirements; track r.title; let i = $index) {
                <li class="req req--{{ i }}">
                  <span class="req__icon req__icon--{{ r.kind }}" aria-hidden="true">
                    @if (r.kind === 'form') { <i class="ph-fill ph-file-text"></i> }
                    @else { <i class="ph-fill ph-folder"></i> }
                  </span>
                  <span class="req__title">{{ r.title }}</span>
                  <span class="req__end">
                    @if (r.statusCode) {
                      <cds-status-badge kind="requirement" [code]="r.statusCode"></cds-status-badge>
                    }
                    @if (r.action === 'open') { <i class="req__cue ph ph-arrow-square-out" aria-hidden="true"></i> }
                    @else { <i class="req__cue ph ph-caret-right" aria-hidden="true"></i> }
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
    .panel__hint { font-weight: 400; color: var(--cds-text-tertiary); }
    .panel__actions { display: flex; align-items: center; gap: var(--cds-space-8); }

    .reqs { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .req { display: flex; align-items: center; gap: var(--cds-space-12); padding: var(--cds-space-16) 0; border-bottom: 1px solid var(--cds-border-subtle); }
    .req:last-child { border-bottom: 0; }
    .req__icon { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: var(--cds-radius-sm); font-size: 1.25rem; }
    .req__icon--form { color: #16a34a; }
    .req__icon--folder { color: #2563eb; }
    .req__icon--folder-active { color: #16a34a; }
    .req__title { flex: 1; font-weight: 500; color: var(--cds-text-primary); }
    .req__end { display: flex; align-items: center; gap: var(--cds-space-12); }
    .req__cue { color: var(--cds-text-tertiary); font-size: 1rem; }
  `],
})
export class ClientRequirementsHubPage {
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

  /** The selected stage's user_requirements (forms + document folders). */
  requirements: Req[] = [
    { title: "Buyer's Information Sheet", kind: 'form', statusCode: 'draft', action: 'open' },
    { title: 'Preliminary Loan Questionnaire', kind: 'form', statusCode: 'draft', action: 'open' },
    { title: 'Quotation Sheet', kind: 'folder', action: 'chevron' },
    { title: 'Reservation Sheet', kind: 'folder', action: 'chevron' },
    { title: 'Proof Of Payment', kind: 'folder-active', statusCode: 'submission', action: 'chevron' },
  ];
}
