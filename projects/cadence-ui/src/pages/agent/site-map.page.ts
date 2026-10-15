import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent,
  CdsUserChipComponent, CdsNotifBellComponent, CdsCardComponent,
} from '../../public-api';

interface Site {
  name: string;
  address: string;
  products: string;
  image: string;
}

/**
 * MOCK page — Agent · Site Map (`/agent/site-map`, `SiteMapComponent`).
 *
 * SOURCE-FIRST port of PDO `site-map.component.html`. TOP-LEVEL agent page: the
 * captured reference (selector `app-root`) shows the top-nav shell in frame with
 * the "Site Map" nav item active. Shell copied from the calendar sibling.
 *
 * NOTE on nav count: the captured reference DOM renders SEVEN agent nav items
 * (Dashboard + 5 + Site Map active). `navigation.service.ts` confirms the agent
 * routes are Dashboard · Leads · Clients · Sellers (team) · Calendar · Calculator
 * · Site Map, so the "Sellers" (team) item is included here to match the DOM.
 *
 * Structure mirrors site-map.component.html 1:1:
 *   container.site-map-page
 *     └ .agents
 *         ├ .agents-heading (w-100, space-between)
 *         │   ├ h1.container__label "Sites"
 *         │   └ .agents-heading__tabs → search input (magnifying-glass icon)
 *         └ .developments-container (grid) → @for site:
 *             article.developments-card.site-map-card
 *               ├ .site-map-card__image-wrap → img + hover overlay
 *               │      (overlay "View site map" is opacity:0 like PDO — not
 *               │       captured in the reference, shown only on hover)
 *               └ .developments-card__content
 *                   ├ .developments-card__text
 *                   │   ├ h3.developments-card__title  → site name
 *                   │   └ .developments-card__location → map-pin + address
 *                   └ .developments-card__product     → folder + projects
 *
 * Presentational only (no data loading / search / navigation behaviour).
 *
 * COMPONENT MAPPING: each site article → `cds-card` (interactive + flush). The
 * image-wrap / hover overlay and the icon+text meta rows are layout markup inside
 * the card (that is layout, not a faked component). The search box is a PDO
 * `.input-with-icon` text input — rendered as plain markup since there is no
 * dedicated cds search component; closest primitive would be cds-input but the
 * real control is a bare icon-prefixed input.
 */
@Component({
  selector: 'cds-page-agent-site-map',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent,
    CdsUserChipComponent, CdsNotifBellComponent, CdsCardComponent,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item>Dashboard</a>
      <a cds-nav-item>Leads</a>
      <a cds-nav-item>Clients</a>
      <a cds-nav-item>Sellers</a>
      <a cds-nav-item>Calendar</a>
      <a cds-nav-item>Calculator</a>
      <a cds-nav-item [active]="true">Site Map</a>
      <div cds-topnav-actions class="hdr-actions">
        <button class="cds-icon-btn" aria-label="Help"><i class="ph-bold ph-question"></i></button>
        <cds-notif-bell [count]="19"></cds-notif-bell>
        <cds-user-chip name="Jude Calder" role="Agent" [src]="placeholder"></cds-user-chip>
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

          <div class="developments-container">
            @for (s of sites; track $index) {
              <cds-card [interactive]="true" [flush]="true" class="site-map-card">
                <div class="site-map-card__image-wrap">
                  <img [src]="s.image" alt="" />
                  <div class="site-map-card__overlay">
                    <span class="site-map-card__view-btn">
                      <i class="ph-bold ph-eye"></i>
                      View site map
                    </span>
                  </div>
                </div>
                <div class="developments-card__content">
                  <div class="developments-card__text">
                    <h3 class="developments-card__title">{{ s.name }}</h3>
                    <div class="developments-card__location">
                      <i class="ph ph-map-pin" aria-hidden="true"></i>
                      <p class="developments-card__subtitle">{{ s.address }}</p>
                    </div>
                  </div>
                  <div class="developments-card__product">
                    <i class="ph ph-folder" aria-hidden="true"></i>
                    <p class="developments-card__subtitle text-truncate">{{ s.products }}</p>
                  </div>
                </div>
              </cds-card>
            }
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

    /* sites grid — PDO .developments-container: 4-col grid, 16px/18px gaps */
    .developments-container { width: 100%; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px 18px; align-items: start; }

    /* each card is flush (no inner padding); PDO article is borderless/transparent */
    .site-map-card { background: transparent; }
    .site-map-card ::ng-deep .cds-card__body { display: flex; flex-direction: column; gap: 12px; padding: 0; }

    .site-map-card__image-wrap { position: relative; width: 100%; height: 200px; border-radius: 8px; overflow: hidden; background: var(--cds-neutral-100, #eceef2); }
    .site-map-card__image-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
    /* hover overlay — hidden by default (matches PDO; not captured in reference) */
    .site-map-card__overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(16, 24, 40, 0.45); opacity: 0; transition: opacity .15s ease; }
    .site-map-card:hover .site-map-card__overlay { opacity: 1; }
    .site-map-card__view-btn { display: inline-flex; align-items: center; gap: 8px; color: #fff; font-weight: 600; font-size: var(--cds-font-size-md); }

    .developments-card__content { display: flex; flex-direction: column; gap: 8px; }
    .developments-card__text { display: flex; flex-direction: column; gap: 10px; }
    .developments-card__title { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 18px; line-height: 21px; letter-spacing: -0.3px; color: var(--cds-text-primary); }
    .developments-card__location,
    .developments-card__product { display: flex; align-items: center; gap: 4px; color: var(--cds-text-secondary); font-size: var(--cds-font-size-md); line-height: var(--cds-line-height-sm); min-width: 0; }
    .developments-card__location i,
    .developments-card__product i { color: var(--cds-text-tertiary); font-size: 14px; flex: 0 0 auto; }
    .developments-card__subtitle { margin: 0; }
    .text-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  `],
})
export class AgentSiteMapPage {
  placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12" fill="rgb(207,212,220)"/></svg>'
  );

  private img = (fill: string) => 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="324" height="200"><rect width="324" height="200" fill="${fill}"/></svg>`
  );

  sites: Site[] = [
    { name: 'Townscapes Malvar', address: 'Malvar, Batangas 4233', products: 'Enclave , Townhomes , Residences', image: this.img('#8fae7a') },
    { name: 'Site B', address: 'Batangas City (Capital), Batangas 4200', products: 'Residences', image: this.img('#b7a98f') },
    { name: 'Emerald Heights Residences', address: 'Batangas City (Capital), Batangas 4200', products: 'Residential Subdivision', image: this.img('#9db87e') },
    { name: 'Townscapes Malvar', address: 'Malvar, Batangas 4233', products: 'Townhomes , Enclave , Residences , Samplewood', image: this.img('#8fae7a') },
    { name: 'Golden Acres', address: 'Taysan, Batangas 4228', products: 'Residences , The Enclaves', image: this.img('#c3b393') },
    { name: 'Silver Meadows', address: 'Ibaan, Batangas 4230', products: 'The Enclaves , Residences , Townhomes', image: this.img('#8ba2b0') },
    { name: 'Emerald Heights', address: 'Batangas City (Capital), Batangas 4200', products: 'Residences , Townhomes', image: this.img('#a8b59a') },
    { name: 'Hillcrest Villas', address: 'Lipa City, Batangas 4217', products: 'Residences', image: this.img('#b0a890') },
  ];
}
