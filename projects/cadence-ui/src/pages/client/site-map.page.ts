import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent,
  CdsUserChipComponent, CdsNotifBellComponent, CdsEmptyStateComponent,
} from '../../public-api';

/**
 * MOCK page — Client · Site Map (`/client/site-map`, `SiteMapComponent`).
 *
 * SOURCE-FIRST port of PDO `site-map.component.html`. The client route renders
 * the SAME `SiteMapComponent` as the agent/staff site map, only in client
 * context (client top-nav shell + client data).
 *
 * CAPTURE STATE — the reference DOM/PNG (`client-site-map.{dom.json,png}`) is
 * NOT a skeleton and NOT the loaded grid: it is the loaded-but-EMPTY branch of
 * the template — `@else if (!isLoading && !itemsList.length)` — which renders
 * the "No Sites Yet" / "No sites are available at this time." empty block with
 * the House illustration. Text nodes captured: Requirements · Site Map · 1 ·
 * Sites · "No Sites Yet" · "No sites are available at this time." The nav shows
 * three collapsed items (repeat:3 = Requirements / Property feed / Financing)
 * plus the active "Site Map". So this story mirrors that empty state, NOT the
 * 8-card grid the agent capture showed. (The agent sibling at
 * agent/site-map.page.ts ports the loaded grid, whose structure/styles are the
 * same heading+search region reused here.)
 *
 * Structure mirrors site-map.component.html 1:1 (empty branch):
 *   container.site-map-page
 *     └ .agents
 *         ├ .agents-heading (w-100, space-between)
 *         │   ├ h1.container__label "Sites"
 *         │   └ .agents-heading__tabs → search input (magnifying-glass icon)
 *         └ .developments-container (flex-grow)
 *             └ .table-container.my-auto → .table-empty-state
 *                   img(House.svg) + h4 "No Sites Yet"
 *                   + p "No sites are available at this time."
 *
 * COMPONENT MAPPING: the empty block → `cds-empty-state` (icon + title +
 * message), the closest primitive. The search box is a PDO `.input-with-icon`
 * text input rendered as plain icon-prefixed markup (no dedicated cds search
 * component). The client top-nav shell is reused verbatim from the ported
 * client sibling pages. Presentational only.
 */
@Component({
  selector: 'cds-page-client-site-map',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent,
    CdsUserChipComponent, CdsNotifBellComponent, CdsEmptyStateComponent,
  ],
  template: `
    <!-- CLIENT top-nav shell (navigation.service → client nav items) -->
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item>Requirements</a>
      <a cds-nav-item>Property feed</a>
      <a cds-nav-item>Financing</a>
      <a cds-nav-item [active]="true">Site Map</a>
      <div cds-topnav-actions class="hdr-actions">
        <cds-notif-bell [count]="1"></cds-notif-bell>
        <cds-user-chip name="James T." role="Client"></cds-user-chip>
      </div>
    </cds-top-nav>

    <main class="cds-container">
      <div class="site-map-page">
        <div class="agents">
          <div class="agents-heading">
            <div>
              <h1 class="agents-heading__title">Sites</h1>
            </div>
            <div class="agents-heading__tabs">
              <label class="search input-with-icon">
                <input class="search__input" type="text" placeholder="Search" />
                <i class="ph ph-magnifying-glass search__icon" aria-hidden="true"></i>
              </label>
            </div>
          </div>

          <!-- loaded-but-empty branch (!isLoading && !itemsList.length) -->
          <div class="developments-container">
            <cds-empty-state
              class="site-map-empty"
              icon="ph-fill ph-house"
              title="No Sites Yet"
              message="No sites are available at this time.">
            </cds-empty-state>
          </div>
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

    /* .agents — column stack, 24px gap (PDO) */
    .agents { display: flex; flex-direction: column; align-items: flex-start; gap: var(--cds-space-24); }

    /* heading row: title left, search right (PDO .agents-heading.w-100) */
    .agents-heading { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-16); width: 100%; }
    .agents-heading__title { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 22px; line-height: 26px; letter-spacing: -0.3px; color: var(--cds-text-primary); }
    .agents-heading__tabs { display: flex; gap: var(--cds-space-8); }

    /* search input — PDO .input-with-icon (icon left) */
    .search { position: relative; display: inline-flex; align-items: center; width: 224px; height: 40px; }
    .search__icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #a0a0ab; font-size: 13px; }
    .search__input { width: 100%; height: 40px; padding: 11px 16px 11px 40px; border: 1px solid var(--cds-border); border-radius: var(--cds-radius-sm); background: var(--cds-surface); font-family: var(--cds-font-family-base); font-size: var(--cds-font-size-md); color: var(--cds-text-primary); }
    .search__input::placeholder { color: #a0a0ab; }
    .search__input:focus { outline: none; border-color: var(--cds-primary-300); }

    /* empty-state container — fills the remaining viewport and centers the block (PDO .table-container.my-auto) */
    .developments-container { width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 60vh; }

    /* empty block — big muted house glyph (PDO .table-empty-state / House.svg) */
    :host ::ng-deep .site-map-empty .cds-empty__icon {
      width: auto; height: auto; margin-bottom: var(--cds-space-16); border-radius: 0;
      background: transparent; color: var(--cds-neutral-300, #cfd4dc);
      font-size: 64px;
    }
    :host ::ng-deep .site-map-empty .cds-empty__title {
      font-family: var(--cds-font-family-semibold-face);
      font-weight: 500;
      font-size: var(--cds-font-size-2xl); line-height: var(--cds-line-height-lg); color: var(--cds-text-primary);
    }
    :host ::ng-deep .site-map-empty .cds-empty__message {
      font-size: var(--cds-font-size-lg);
      line-height: var(--cds-line-height-lg);
      color: var(--cds-text-tertiary);
    }
  `],
})
export class ClientSiteMapPage {}
