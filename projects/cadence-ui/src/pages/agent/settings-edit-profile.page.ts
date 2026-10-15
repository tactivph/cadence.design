import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsButtonComponent,
  CdsUserChipComponent, CdsNotifBellComponent, CdsBreadcrumbComponent,
  CdsBreadcrumbItem, CdsFormFieldComponent, CdsInputDirective,
  CdsInputGroupComponent, CdsRadioComponent,
} from '../../public-api';

/**
 * MOCK page — Agent · Settings › Edit profile (`/settings/edit-profile`,
 * `EditProfileComponent`). SOURCE-FIRST port of PDO
 * `edit-profile.component.html`.
 *
 * Reference selector is `app-root` → the AGENT top-nav shell is in frame
 * (user "Hugo Calder"/Agent, notif 19). Settings has no top-nav entry, so NO
 * nav item is highlighted — matches the reference DOM (Dashboard · Leads ·
 * Clients · Calendar · Calculator · Site Map, none active).
 *
 * Structure mirrors edit-profile.component.html 1:1 (reference rects in []):
 *   form.edit-profile-page
 *     ├ section.container
 *     │   ├ nav.breadcrumb  "Settings" / "Edit profile" (active)   [x=40 y=110]
 *     │   └ div.settings-user-details        (centered 616 col)    [x=412 y=155]
 *     │       ├ div.step-title → h4 "Tell us about yourself"       [y=155]
 *     │       │                + p subtitle                        [y=183]
 *     │       └ div.user-info__container
 *     │           ├ div.update-profile  → img(80) + "Change photo" [y=225]
 *     │           │     + "Remove" + ".jpg or .png up to 5 MB"
 *     │           └ div.input-fields  (single-column, full-width rows)
 *     │                First name* · Middle name · Last name* ·
 *     │                Mobile number* (+63 prefix) · Date of birth
 *     │                (calendar suffix) · Gender (Male/Female radios)
 *     └ div.user-info.actions → Cancel · Save changes  (right)     [x=1140 y=820]
 *
 * Presentational only (no form group / file upload / datepicker behaviour).
 *
 * COMPONENT MAPPING:
 *   - breadcrumb (ol.breadcrumb)       → cds-breadcrumb (size md)
 *   - profile photo (<img>)            → raw <img> 80x80 round. The real template
 *                                         renders a bare `<img [src]>` at 80x80;
 *                                         cds-avatar caps at lg=48px, which would
 *                                         shrink the row and pull the "Change
 *                                         photo" button left of its reference x.
 *                                         A plain image is the faithful port (not
 *                                         a faked component).
 *   - Change photo / Remove / Cancel   → cds-button (secondary-neutral / ghost-
 *                                         neutral / primary). PDO renders the
 *                                         secondary-neutral buttons borderless —
 *                                         page-scoped override below.
 *   - text/tel inputs                  → cds-form-field + input[cdsInput]
 *   - mobile "(+63)" prefix            → cds-input-group [cds-prefix]
 *   - date-of-birth calendar icon      → cds-input-group [cds-suffix]
 *   - Gender radios                    → cds-radio (Male/Female)
 */
@Component({
  selector: 'cds-page-settings-edit-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsButtonComponent,
    CdsUserChipComponent, CdsNotifBellComponent, CdsBreadcrumbComponent,
    CdsFormFieldComponent, CdsInputDirective, CdsInputGroupComponent,
    CdsRadioComponent,
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

    <main class="cds-container edit-profile">
      <cds-breadcrumb [items]="crumbs" separator="ph ph-caret-right" size="md"></cds-breadcrumb>

      <form class="edit-profile__form">
        <div class="step-title">
          <h4 class="step-title__heading">Tell us about yourself</h4>
          <p class="step-title__sub">This helps us identify you and ensure a smooth experience. Your details will remain secure.</p>
        </div>

        <!-- Photo row: bare 80x80 <img> + Change photo / Remove + help text -->
        <div class="update-profile">
          <img class="update-profile__photo" [src]="photo" alt="" />
          <div class="update-profile__actions">
            <div class="update-profile__buttons">
              <button cds-button variant="secondary-neutral" iconLeft="ph ph-camera-plus">Change photo</button>
              <button cds-button variant="ghost-neutral">Remove</button>
            </div>
            <p class="update-profile__help">.jpg or .png up to 5 MB</p>
          </div>
        </div>

        <!-- Fields — single full-width column, in template order. Each row gets a
             distinct class so no run of >2 identical cds-form-field siblings
             collapses in the blueprint. -->
        <div class="fields">
          <div class="fields__row fields__row--first">
            <cds-form-field label="First name" [required]="true">
              <input cdsInput type="text" value="Ivy" placeholder="First name" />
            </cds-form-field>
          </div>

          <div class="fields__row fields__row--middle">
            <cds-form-field label="Middle name">
              <input cdsInput type="text" placeholder="Middle name" />
            </cds-form-field>
          </div>

          <div class="fields__row fields__row--last">
            <cds-form-field label="Last name" [required]="true">
              <input cdsInput type="text" value="Broker" placeholder="Last name" />
            </cds-form-field>
          </div>

          <div class="fields__row fields__row--mobile">
            <cds-form-field label="Mobile number" [required]="true">
              <cds-input-group>
                <span cds-prefix>(+63)</span>
                <input cdsInput type="text" value="934-827-6465" placeholder="Mobile number" />
              </cds-input-group>
            </cds-form-field>
          </div>

          <div class="fields__row fields__row--dob">
            <cds-form-field label="Date of birth">
              <cds-input-group>
                <input cdsInput type="text" value="01/19/2005" placeholder="mm/dd/yyyy" />
                <i cds-suffix class="ph ph-calendar-blank" aria-hidden="true"></i>
              </cds-input-group>
            </cds-form-field>
          </div>

          <div class="fields__row fields__row--gender">
            <cds-form-field label="Gender">
              <div class="gender-group">
                <cds-radio name="gender" value="male" [checked]="true">Male</cds-radio>
                <cds-radio name="gender" value="female">Female</cds-radio>
              </div>
            </cds-form-field>
          </div>
        </div>
      </form>

      <!-- Full-width action bar, buttons right-aligned (PDO .user-info.actions) -->
      <div class="edit-profile__actions">
        <div class="edit-profile__buttons">
          <button cds-button variant="secondary-neutral">Cancel</button>
          <button cds-button variant="primary" [disabled]="true">Save changes</button>
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

    .edit-profile { display: flex; flex-direction: column; gap: var(--cds-space-24); }

    .step-title { display: flex; flex-direction: column; gap: var(--cds-space-4); max-width: 616px; margin: 0 auto; width: 100%; }
    .step-title__heading { margin: 0; font-family: var(--cds-font-family-semibold); font-weight: var(--cds-weight-semibold); font-size: var(--cds-font-size-2xl); line-height: var(--cds-line-height-lg); letter-spacing: var(--cds-letter-spacing-base); color: var(--cds-text-primary); }
    .step-title__sub { margin: 0; font-size: var(--cds-font-size-md); line-height: var(--cds-line-height-18); color: var(--cds-text-secondary); }
    /* Breadcrumb current crumb "Edit profile" is Inter Regular (beat md rule 0,4,0) */
    :host ::ng-deep cds-breadcrumb.cds-breadcrumb-host--md .cds-breadcrumb__current[aria-current] { font-family: var(--cds-font-family-regular); }
    /* Remove = borderless ghost with near-black (#212529) label */
    :host ::ng-deep button[cds-button].cds-btn--ghost-neutral { color: var(--cds-text-body); }

    /* Photo row: 80x80 image + Change photo/Remove + help (PDO .update-profile). */
    .update-profile { display: flex; align-items: center; gap: var(--cds-space-24); max-width: 616px; margin: 0 auto; width: 100%; }
    .update-profile__photo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; flex: none; }
    .update-profile__actions { display: flex; flex-direction: column; gap: var(--cds-space-8); }
    .update-profile__buttons { display: flex; align-items: center; gap: var(--cds-space-12); }
    .update-profile__help { margin: 0; color: var(--cds-text-secondary); }

    .fields { display: flex; flex-direction: column; gap: var(--cds-space-16); max-width: 616px; margin: 0 auto; width: 100%; }
    /* Live app stacks every field full-width in one column (labels at x412). */
    .fields__row { display: grid; grid-template-columns: 1fr; gap: var(--cds-space-16); }
    .fields__row cds-form-field { min-width: 0; }
    /* Labels hug their text (left-aligned), not the full field width. PDO renders
       form-field labels in the Medium face at weight 500 with the 21px body
       line-height (the shared cds-form-field label-md resolves to weight 400 /
       16px — see shared-component note in the handback). */
    .fields ::ng-deep .cds-field__label {
      align-self: flex-start;
      font-family: var(--cds-font-family-semibold);
      font-weight: var(--cds-weight-semibold);
      line-height: var(--cds-line-height-md);
    }
    .gender-group { display: flex; align-items: center; gap: var(--cds-space-24); }

    .edit-profile__actions { display: flex; justify-content: flex-end; padding-top: var(--cds-space-20); border-top: 1px solid var(--cds-border); }
    .edit-profile__buttons { display: flex; align-items: center; gap: var(--cds-space-12); }
    /* PDO renders this page's secondary-neutral buttons (Change photo, Cancel)
       borderless, unlike the shared 1px neutral border — override page-scoped. */
    :host ::ng-deep button[cds-button].cds-btn--secondary-neutral { border: 0; }
  `],
})
export class AgentSettingsEditProfilePage {
  placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12" fill="rgb(207,212,220)"/></svg>'
  );
  photo = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="rgb(45,20,60)"/><circle cx="40" cy="62" r="21" fill="rgb(150,50,110)"/><rect x="37" y="34" width="6" height="30" fill="rgb(60,30,20)"/></svg>'
  );
  crumbs: CdsBreadcrumbItem[] = [
    { label: 'Settings', href: '#' },
    { label: 'Edit profile' },
  ];
}
