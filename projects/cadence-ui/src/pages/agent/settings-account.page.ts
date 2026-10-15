import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsButtonComponent,
  CdsUserChipComponent, CdsNotifBellComponent, CdsPageHeaderComponent,
} from '../../public-api';

interface DetailItem { label: string; value: string; }

/**
 * MOCK page — Agent · Account settings (`/settings`, `AccountSettingsComponent`).
 *
 * SOURCE-FIRST port of PDO `account-settings.component.html`. TOP-LEVEL agent
 * page: the captured reference (selector `app-root`) shows the agent top-nav
 * shell in frame with NO nav item active (settings has no nav entry). Shell
 * copied from the agent site-map sibling (user "Jude Calder" / Agent, notif 19,
 * Help button). Nav items match the reference DOM: Dashboard · Leads · Clients ·
 * Calendar · Calculator · Site Map (6 items, none highlighted).
 *
 * Structure mirrors account-settings.component.html 1:1:
 *   container.settings-page
 *     ├ section.page-header
 *     │   ├ h3  "Account settings"
 *     │   └ p   "Update your account information"
 *     └ div.page-body-header
 *         └ div.user-details  (centered, 500px)
 *             ├ __primary-details → img (100x100) + .labels (h4 name, h5 email)
 *             ├ __secondary-details → @for item: span label + p value
 *             │      (Mobile number / Date of birth / Gender / Address)
 *             └ __actions → Edit profile · Change address · Update password
 *
 * Presentational only (no profile loading / routing behaviour).
 *
 * COMPONENT MAPPING:
 *   - page-header (h3 + p)        → cds-page-header (title + subtitle)
 *   - action buttons (.btn)       → cds-button variant="link" (PDO inline green
 *                                     text actions; all three render identically
 *                                     in the reference, mirroring the real
 *                                     template's three identical `button.btn`).
 *   - profile photo               → plain <img> 100x100 (the real template uses a
 *                                     bare `<img [src]="user.photo">`; cds-avatar
 *                                     maxes at lg=48px which would collapse the
 *                                     primary-details row height and shift the
 *                                     detail rows out of their reference y-bands,
 *                                     so a raw image — not a faked component — is
 *                                     the faithful mapping here).
 *   - name/email + label/value rows → layout markup (headings + label/value
 *                                     pairs), no dedicated cds component exists.
 */
@Component({
  selector: 'cds-page-settings-account',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsButtonComponent,
    CdsUserChipComponent, CdsNotifBellComponent, CdsPageHeaderComponent,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item>Dashboard</a>
      <a cds-nav-item>Leads</a>
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
      <div class="settings-page">
        <cds-page-header class="page-header" title="Account settings" subtitle="Update your account information"></cds-page-header>

        <div class="page-body-header">
          <div class="user-details">
            <div class="user-details__primary-details">
              <img class="user-details__photo" [src]="photo" alt="" />
              <div class="labels">
                <h4 class="labels__name">Hugo Calder</h4>
                <h5 class="labels__email">user&#64;example.com</h5>
              </div>
            </div>

            <div class="user-details__secondary-details">
              @for (d of details; track d.label) {
                <div class="item">
                  <span>{{ d.label }}</span>
                  <p>{{ d.value }}</p>
                </div>
              }
            </div>

            <div class="user-details__actions">
              <button cds-button variant="link">Edit profile</button>
              <button cds-button variant="link">Change address</button>
              <button cds-button variant="link">Update password</button>
            </div>
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

    /* Column stack: page-header then centered profile block (PDO .settings-page). */
    .settings-page { display: flex; flex-direction: column; }

    /* Live app's heading/subtitle span the full container width; keep the
       page-header titles full-width so they line up with the real geometry. */
    .page-header ::ng-deep .cds-page-header__titles { width: 100%; }
    .page-header ::ng-deep .cds-page-header__title { font-size: 23px; line-height: 1.2; }
    /* PDO renders this page's subtitle at the larger body-lg scale (16/24),
       not the component default body-sm (12/16). Override page-locally with
       the shared type tokens. */
    .page-header ::ng-deep .cds-page-header__subtitle {
      font-size: var(--cds-font-size-lg);
      line-height: var(--cds-line-height-lg);
    }

    /* page-body-header centers the 500px profile block (PDO). */
    .page-body-header { display: flex; justify-content: center; }
    .user-details { display: flex; flex-direction: column; gap: var(--cds-space-24); width: 500px; }

    /* primary: 100x100 photo + name/email labels (PDO __primary-details). */
    .user-details__primary-details { display: flex; align-items: center; gap: var(--cds-space-8); }
    .user-details__photo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; flex: none; }
    .labels { display: flex; flex-direction: column; gap: var(--cds-space-8); }
    .labels__name { margin: 0; font-family: var(--cds-font-family-medium); font-weight: var(--cds-weight-semibold); font-size: 20px; line-height: 24px; letter-spacing: -0.3px; color: var(--cds-text-primary); }
    .labels__email { margin: 0; font-family: var(--cds-font-family-regular); font-weight: var(--cds-weight-semibold); font-size: 18px; line-height: 21px; letter-spacing: -0.3px; color: var(--cds-primary-500); }

    /* secondary: label/value detail rows (PDO __secondary-details, 16px gap). */
    .user-details__secondary-details { display: flex; flex-direction: column; gap: var(--cds-space-16); }
    .user-details__secondary-details .item { display: flex; flex-direction: column; gap: var(--cds-space-8); }
    .user-details__secondary-details .item span { color: var(--cds-text-tertiary); font-family: var(--cds-font-family-medium); font-size: var(--cds-font-size-lg); line-height: 19px; }
    .user-details__secondary-details .item p { margin: 0; color: var(--cds-text-primary); font-size: var(--cds-font-size-md); line-height: 24px; }

    /* actions: stacked inline green text links (PDO __actions, 16px gap). */
    .user-details__actions { display: flex; flex-direction: column; align-items: flex-start; gap: var(--cds-space-16); }
  `],
})
export class AgentSettingsAccountPage {
  placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12" fill="rgb(207,212,220)"/></svg>'
  );
  photo = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="rgb(45,20,60)"/><circle cx="50" cy="78" r="26" fill="rgb(120,40,90)"/><rect x="47" y="45" width="6" height="35" fill="rgb(60,30,20)"/></svg>'
  );
  details: DetailItem[] = [
    { label: 'Mobile number', value: '+63 900-000-0020' },
    { label: 'Date of birth', value: 'January 19, 2005' },
    { label: 'Gender', value: 'Male' },
    { label: 'Address', value: 'Agtango St., Agtangao Bangued (Capital), Abra' },
  ];
}
