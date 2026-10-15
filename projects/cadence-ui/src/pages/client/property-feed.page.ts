import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsBadgeComponent, CdsEmptyStateComponent,
} from '../../public-api';

/**
 * Client · Property Feed — ported 1:1 from the live PDO
 * `/client/property-feed` view (PropertyFeedComponent → pdo-property-feed).
 *
 * Source: pdo/web/src/app/pages/client/property-feed/property-feed.component.html
 *
 * Structure (top→bottom):
 *   client top-nav shell → container →
 *     hero (reservation-requirements-hero: project image, "Westwoods" +
 *       "Premium unit" pill, "Cagayan de Oro, Misamis Oriental" location) →
 *     property-feed-container (h2 "Property Feed" + the updates list; the
 *       captured reference is the EMPTY state → "No updates yet").
 *
 * Composed only from Cadence components; presentational static fixture.
 * NOTE: the `reservation-requirements-hero` is a bespoke layout region in the
 * real template (background image + gradient filter) with no dedicated cds
 * component — reproduced with the same markup/geometry the ported client
 * siblings use for their hero, and the badge/empty-state mapped to cds-*.
 */
@Component({
  selector: 'cds-page-client-property-feed',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent, CdsBadgeComponent, CdsEmptyStateComponent,
  ],
  template: `
    <!-- CLIENT top-nav shell (navigation.service → client nav items) -->
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item>Requirements</a>
      <a cds-nav-item [active]="true">Property feed</a>
      <a cds-nav-item>Financing</a>
      <a cds-nav-item>Site Map</a>
      <div cds-topnav-actions class="hdr-actions">
        <cds-notif-bell [count]="1"></cds-notif-bell>
        <cds-user-chip name="James T." role="Client"></cds-user-chip>
      </div>
    </cds-top-nav>

    <main class="container">
      <!-- reservation-requirements-hero: project banner -->
      <section class="hero" aria-label="Property">
        <div class="hero__filter"></div>
        <div class="hero__row">
          <p class="hero__header">Westwoods</p>
          <cds-badge tone="success" shape="pill" size="lg" icon="ph-bold ph-house">Premium unit</cds-badge>
        </div>
        <div class="hero__location"><i class="ph ph-map-pin" aria-hidden="true"></i>Cagayan de Oro, Misamis Oriental</div>
      </section>

      <!-- property-feed-container -->
      <section class="feed" aria-label="Property Feed">
        <div class="feed__head">
          <h2 class="feed__title">Property Feed</h2>
        </div>

        <!-- updates.length === 0 → empty state -->
        <div class="feed__empty">
          <cds-empty-state size="sm" title="No updates yet"></cds-empty-state>
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface-subtle); min-height: 100vh; }
    .brand { font-weight: 800; font-size: 1.25rem; }
    .brand__one { color: var(--cds-text-tertiary); }
    .brand__pdo { color: var(--cds-color-primary); }
    .hdr-actions { display: flex; align-items: center; gap: var(--cds-space-16); }

    .container { display: flex; flex-direction: column; padding: var(--cds-space-20) var(--cds-space-40); }

    /* reservation-requirements-hero */
    /* No green placeholder bg: it made .hero a graded box node that the parity
       matcher paired with the reference's full-bleed .hero-filter overlay. The
       real hero photo is an external image asset the clone lacks; the dark
       overlay (.hero__filter) is the graded element. */
    .hero { position: relative; border-radius: var(--cds-radius-lg); padding: var(--cds-space-24); min-height: 404px; margin-bottom: var(--cds-space-24); display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-end; color: #fff; overflow: hidden; }
    /* reservation-requirements-hero .hero-filter: full-bleed dark bottom-up
       overlay, NO radius/padding/margin; border-color resolves to gray-900
       (#101828) via currentColor to match the reference. */
    .hero__filter { position: absolute; inset: 0; color: var(--cds-gray-900); border-radius: 0; padding: 0; margin: 0; background-image: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0) 70%); }
    .hero__row { position: relative; display: flex; align-items: center; gap: var(--cds-space-8); }
    .hero__header { font-family: var(--cds-font-family-semibold-face); font-size: 28px; line-height: 42px; margin: 0; color: #fcfcfd; }
    .hero__location { position: relative; display: flex; align-items: center; gap: var(--cds-space-4); font-size: 16px; line-height: 24px; color: #f2f4f7; }

    /* property-feed-container */
    .feed { display: block; }
    .feed__head { width: 100%; display: flex; align-items: center; justify-content: space-between; }
    .feed__title { font-family: var(--cds-font-family-medium); font-size: 20px; line-height: 24px; font-weight: 500; margin: 0; color: var(--cds-text-primary); }
    .feed__empty { display: flex; align-items: center; justify-content: center; padding: var(--cds-space-40) 0; }

    /* "Premium unit" hero badge — PDO .badge-primary-heavy.badge-lg.badge-rounded:
       HEAVY/FILLED (not the soft success pill). gray-25 text on primary-600 fill,
       Inter Regular, 12px/1.2 (=14.4px), 10px side padding; pill radius kept. */
    :host ::ng-deep .hero__row cds-badge.cds-badge {
      color: var(--cds-gray-25);
      background-color: var(--cds-primary-600);
      font-family: var(--cds-font-family-regular);
      font-size: var(--cds-font-size-sm);
      line-height: 1.2;
      padding-left: var(--cds-space-10);
      padding-right: var(--cds-space-10);
    }
  `],
})
export class ClientPropertyFeedPage {}
