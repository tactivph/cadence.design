import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsEmptyStateComponent,
} from '../../public-api';

/**
 * Client · Financing — ported 1:1 from the live PDO `/client/financing`
 * view (FinancingComponent → pdo-financing).
 *
 * Source: pdo/web/src/app/pages/client/financing/financing.component.html + .scss
 *
 * Structure (top→bottom):
 *   client top-nav shell → container →
 *     .financing (column, gap 16) →
 *       .financing__tabs — a 3-step strip, each step .financing__tab = flex:1,
 *         centered, ph-bold ph-check-circle icon + bare <span> label; box carries
 *         8/24 padding + 0.5px bottom border, NO radius. Steps: "Choose a Bank"
 *         (ACTIVE → 1.5px primary-500 underline), "Apply" / "Application Status"
 *         (disabled, 0.5 opacity). →
 *       Step 1 (CHOOSE) empty branch (!banks.length): .financing__empty →
 *         ph-bold ph-bank icon, title "No bank recommendations yet" (Inter
 *         Medium 18/21, weight 400), subtitle "Once your endorsement is
 *         processed, the banks most likely to approve you will appear here."
 *         (Inter Regular 16/24).
 *
 * The live template also has (behind data/other tabs, not in this capture):
 *   the loaded CHOOSE branch — pre-qualification banner + "Choose a bank"
 *   title + banks table + security info banner + Back/Continue actions — and
 *   the APPLY branch (Review & apply summary). The reference DOM shows only the
 *   empty CHOOSE state, so that is what this story mirrors.
 *
 * The step strip is bespoke markup in the real template (a full-width button
 * row with per-step Phosphor icon + underline, disabled states). No cds-*
 * component renders that chrome, so it is reproduced as plain markup matching
 * the real `.financing__*` scss exactly (cds-tabs added radius/padding/green
 * underline/Medium label the real strip does not have). The empty state maps
 * to cds-empty-state; the client top-nav shell is reused from the sibling
 * ported client pages.
 */
@Component({
  selector: 'cds-page-client-financing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent, CdsEmptyStateComponent,
  ],
  template: `
    <!-- CLIENT top-nav shell (navigation.service → client nav items) -->
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item>Requirements</a>
      <a cds-nav-item>Property feed</a>
      <a cds-nav-item [active]="true">Financing</a>
      <a cds-nav-item>Site Map</a>
      <div cds-topnav-actions class="hdr-actions">
        <cds-notif-bell [count]="1"></cds-notif-bell>
        <cds-user-chip name="James T." role="Client"></cds-user-chip>
      </div>
    </cds-top-nav>

    <main class="container">
      <div class="financing">
        <!-- Step strip: Choose a Bank / Apply / Application Status -->
        <div class="financing__tabs">
          <button type="button" class="financing__tab financing__tab--active">
            <i class="financing__tab-icon ph-bold ph-check-circle" aria-hidden="true"></i>
            <span>Choose a Bank</span>
          </button>
          <button type="button" class="financing__tab financing__tab--disabled">
            <i class="financing__tab-icon ph-bold ph-check-circle" aria-hidden="true"></i>
            <span>Apply</span>
          </button>
          <button type="button" class="financing__tab financing__tab--disabled">
            <i class="financing__tab-icon ph-bold ph-check-circle" aria-hidden="true"></i>
            <span>Application Status</span>
          </button>
        </div>

        <!-- Step 1 · empty branch (!banks.length) -->
        <cds-empty-state
          class="financing__empty"
          icon="ph-bold ph-bank"
          title="No bank recommendations yet"
          message="Once your endorsement is processed, the banks most likely to approve you will appear here.">
        </cds-empty-state>
      </div>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface); min-height: 100vh; }
    .brand { font-weight: 800; font-size: 1.25rem; }
    .brand__one { color: var(--cds-text-tertiary); }
    .brand__pdo { color: var(--cds-color-primary); }
    .hdr-actions { display: flex; align-items: center; gap: var(--cds-space-16); }

    .container { display: flex; flex-direction: column; padding: var(--cds-space-20) var(--cds-space-40); }

    /* .financing */
    .financing { display: flex; flex-direction: column; gap: var(--cds-space-16); width: 100%; }

    /* ── Step strip ─────────────────────────────── */
    .financing__tabs { display: flex; width: 100%; }
    .financing__tab {
      flex: 1 0 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--cds-space-4);
      height: 38px;
      padding: var(--cds-space-8) var(--cds-space-24);
      background-color: transparent;
      border: none;
      border-bottom: 0.5px solid var(--cds-border);
      border-radius: 0;
      font-family: var(--cds-font-family-medium);
      font-size: 14px;
      color: var(--cds-text-tertiary);
      cursor: pointer;
    }
    /* bare label text node: Inter Regular, no box chrome */
    .financing__tab span {
      font-family: var(--cds-font-family-regular);
      color: var(--cds-text-primary);
    }
    .financing__tab-icon { font-size: 16px; }
    .financing__tab--active {
      border-bottom: 1.5px solid var(--cds-primary-500);
      color: var(--cds-text-primary);
    }
    .financing__tab--disabled { opacity: 0.5; cursor: not-allowed; }

    /* ── Empty state ────────────────────────────── */
    /* bare Phosphor icon (no muted box) */
    :host ::ng-deep .financing__empty .cds-empty__icon {
      width: auto; height: auto; margin-bottom: 0; border-radius: 0;
      background: transparent; color: var(--cds-text-tertiary);
      font-size: 40px;
    }
    /* title: Inter Medium 18/21, weight 400 */
    :host ::ng-deep .financing__empty .cds-empty__title {
      font-family: var(--cds-font-family-medium);
      font-weight: 400;
      font-size: 18px; line-height: 21px; color: var(--cds-text-primary);
    }
    /* subtitle: Inter Regular 16/24 */
    :host ::ng-deep .financing__empty .cds-empty__message {
      max-width: 360px;
      font-size: var(--cds-font-size-md);
      line-height: var(--cds-line-height-md);
      color: var(--cds-text-secondary);
    }
  `],
})
export class ClientFinancingPage {}
