import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsButtonComponent,
  CdsUserChipComponent, CdsNotifBellComponent, CdsBreadcrumbComponent,
  CdsFormFieldComponent, CdsInputDirective, CdsInputGroupComponent,
  CdsBreadcrumbItem,
} from '../../public-api';

interface Requirement { label: string; }

/**
 * MOCK page — Agent · Settings › Update password (`/settings/update-password`,
 * `UpdatePasswordComponent`). SOURCE-FIRST port of PDO
 * `update-password.component.html`.
 *
 * Reference selector is `app-root` → the AGENT top-nav shell is in frame
 * (user "Jude Calder"/Agent, notif 19). Settings has no top-nav entry, so NO
 * nav item is highlighted — matches the reference DOM (Dashboard · Leads ·
 * Clients · Calendar · Calculator · Site Map, none active).
 *
 * Structure mirrors update-password.component.html 1:1 (reference rects in []):
 *   div.update-password
 *     ├ section.general-container
 *     │   ├ nav.breadcrumb  "← Settings" / "Update password" (active)  [x=40 y=110]
 *     │   └ form.page-content          (centered 616 col, x=412)
 *     │       ├ div.page-header
 *     │       │     ├ h4 "Create your password"                        [x=412 y=163]
 *     │       │     └ p  "Secure your account by creating a strong …"  [x=412 y=191]
 *     │       └ div.input-fields  (single full-width column)
 *     │             ├ Current password  (eye suffix)                   [y=219]
 *     │             ├ Password  (eye suffix) + requirements list       [y=307]
 *     │             │     "8 characters minimum" · "an uppercase letter"
 *     │             │     · "a lowercase letter" · "a number"          [y=391..]
 *     │             └ Confirm password  (eye suffix)                   [y=515]
 *     └ div.update-password__footer → Cancel · Update password (right) [x=1110 y=820]
 *
 * Presentational only (no form group / password visibility toggle behaviour;
 * requirement icons are the static unmet state).
 *
 * COMPONENT MAPPING:
 *   - breadcrumb (ol.breadcrumb)       → cds-breadcrumb (size md). The template
 *                                         prepends a ph-arrow-left before the
 *                                         first crumb — a bare <i> in the crumb
 *                                         region (no back-button component).
 *   - password inputs                  → cds-form-field + input[cdsInput type=password]
 *   - show/hide eye toggle             → cds-input-group [cds-suffix] <i ph-eye-closed>
 *                                         (same pattern as edit-profile's calendar
 *                                         suffix; no dedicated password-field cmp)
 *   - requirement rows                 → plain <ul> list (no checklist component in
 *                                         the library) — static ph-x-circle markers
 *   - Cancel / Update password         → cds-button (secondary-neutral / primary).
 *                                         PDO renders the secondary-neutral Cancel
 *                                         borderless — page-scoped override below.
 *
 * GAPS: no password-strength / requirement-checklist component exists, so the
 * requirements list is a plain <ul> with Phosphor markers (not a faked cds-*).
 */
@Component({
  selector: 'cds-page-settings-update-password',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsButtonComponent,
    CdsUserChipComponent, CdsNotifBellComponent, CdsBreadcrumbComponent,
    CdsFormFieldComponent, CdsInputDirective, CdsInputGroupComponent,
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

    <main class="cds-container update-password">
      <section class="general-container">
        <div class="update-password__crumb">
          <i class="ph ph-arrow-left" aria-hidden="true"></i>
          <cds-breadcrumb [items]="crumbs" separator="ph ph-caret-right" size="md"></cds-breadcrumb>
        </div>

        <form class="page-content">
          <div class="page-header">
            <h4 class="page-header__title">Create your password</h4>
            <p class="page-header__subtitle">Secure your account by creating a strong password.</p>
          </div>

          <div class="input-fields">
            <div class="form-group field-current">
              <cds-form-field label="Current password">
                <cds-input-group>
                  <input cdsInput type="password" placeholder="Enter your current password" />
                  <i cds-suffix class="ph ph-eye-closed" aria-hidden="true"></i>
                </cds-input-group>
              </cds-form-field>
            </div>

            <div class="form-group field-new">
              <cds-form-field label="Password">
                <cds-input-group>
                  <input cdsInput type="password" placeholder="Enter your new password" />
                  <i cds-suffix class="ph ph-eye-closed" aria-hidden="true"></i>
                </cds-input-group>
              </cds-form-field>
              <ul class="requirements">
                @for (req of requirements; track req.label; let i = $index) {
                  <li class="requirements__item requirements__item--{{ i }}">
                    <i class="ph-fill ph-x-circle" aria-hidden="true"></i>{{ req.label }}
                  </li>
                }
              </ul>
            </div>

            <div class="form-group field-confirm">
              <cds-form-field label="Confirm password">
                <cds-input-group>
                  <input cdsInput type="password" placeholder="Re-enter your new password" />
                  <i cds-suffix class="ph ph-eye-closed" aria-hidden="true"></i>
                </cds-input-group>
              </cds-form-field>
            </div>
          </div>
        </form>
      </section>

      <div class="update-password__footer">
        <div class="buttons">
          <button cds-button variant="secondary-neutral">Cancel</button>
          <button cds-button variant="primary" [disabled]="true">Update password</button>
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

    .update-password { display: flex; flex-direction: column; gap: var(--cds-space-32); }

    /* Crumb row: back arrow + breadcrumb (PDO .header-breadcrumb). */
    .update-password__crumb { display: flex; align-items: center; gap: var(--cds-space-8); }
    .update-password__crumb > i { font-size: 1rem; color: var(--cds-text-primary); }
    /* Current crumb "Update password" is the Inter Regular face (PDO), not the
       breadcrumb md-rule semibold. */
    :host ::ng-deep cds-breadcrumb.cds-breadcrumb-host--md .cds-breadcrumb__current[aria-current] { font-family: var(--cds-font-family-regular); }

    /* Form is a centered 616px single column (labels land at x412). */
    .page-content { display: flex; flex-direction: column; gap: var(--cds-space-32); max-width: 616px; margin: 0 auto; width: 100%; }

    .page-header { display: flex; flex-direction: column; gap: var(--cds-space-4); }
    .page-header__title { margin: 0; font-family: var(--cds-font-family-semibold); font-weight: var(--cds-weight-semibold); font-size: var(--cds-font-size-2xl); line-height: var(--cds-line-height-lg); letter-spacing: var(--cds-letter-spacing-base); color: var(--cds-text-primary); }
    .page-header__subtitle { margin: 0; font-size: var(--cds-font-size-md); line-height: var(--cds-line-height-18); color: var(--cds-text-secondary); }

    .input-fields { display: flex; flex-direction: column; gap: var(--cds-space-16); }
    .form-group { display: flex; flex-direction: column; gap: var(--cds-space-8); }
    /* Labels hug their text (left-aligned), not the full field width. PDO renders
       form-field labels in the Medium face at weight 500 with the 21px body
       line-height; the shared label-md role resolves lighter, so pin it here. */
    .input-fields ::ng-deep .cds-field__label {
      align-self: flex-start;
      font-family: var(--cds-font-family-semibold);
      font-weight: var(--cds-weight-semibold);
      line-height: var(--cds-line-height-md);
    }

    /* Password requirements checklist (no library checklist component). */
    .requirements { list-style: none; margin: var(--cds-space-8) 0 0; padding: 0; display: flex; flex-direction: column; gap: var(--cds-space-8); }
    .requirements__item { display: flex; align-items: center; gap: var(--cds-space-10); color: var(--cds-text-secondary); }
    .requirements__item i { color: var(--cds-neutral-300); font-size: 20px; }

    /* Footer spans the full container width; buttons sit at the column's right
       edge (~x1110/x1207 in the reference), not the narrow 616px form's edge. */
    .update-password__footer { display: flex; justify-content: flex-end; }
    .buttons { display: flex; align-items: center; gap: var(--cds-space-12); }
    /* PDO renders this footer's secondary-neutral Cancel borderless, unlike the
       shared 1px neutral border — override page-scoped. */
    :host ::ng-deep button[cds-button].cds-btn--secondary-neutral { border: 0; }
  `],
})
export class AgentSettingsUpdatePasswordPage {
  placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12" fill="rgb(207,212,220)"/></svg>'
  );
  crumbs: CdsBreadcrumbItem[] = [
    { label: 'Settings', href: '#' },
    { label: 'Update password' },
  ];
  requirements: Requirement[] = [
    { label: '8 characters minimum' },
    { label: 'an uppercase letter' },
    { label: 'a lowercase letter' },
    { label: 'a number' },
  ];
}
