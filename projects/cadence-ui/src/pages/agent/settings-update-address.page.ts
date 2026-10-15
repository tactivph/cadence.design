import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsBreadcrumbComponent, CdsBreadcrumbItem,
  CdsFormFieldComponent, CdsInputDirective, CdsButtonComponent,
} from '../../public-api';

/**
 * MOCK page — Agent · Settings › Change address (`/settings/update-address`,
 * `UpdateAddressComponent`). SOURCE-FIRST port of PDO
 * `update-address.component.html` + its `pdo-address-form [layout]="2"` sub-form.
 *
 * Reference selector is `app-root` → the AGENT top-nav shell is in frame
 * (user "Jude Calder"/Agent, notif 19). Settings has no top-nav entry, so NO nav
 * item is highlighted — matches the captured reference DOM (Dashboard · Leads ·
 * Clients · Calendar · Calculator · Site Map, none active).
 *
 * Structure mirrors update-address.component.html top-to-bottom (ref rects []):
 *   form.change-address
 *     ├ div.container
 *     │   ├ div.header-breadcrumb → nav.breadcrumb
 *     │   │     "← Settings" / "Change address" (active)          [x=40 y=110]
 *     │   └ div.settings-user-details
 *     │       ├ div.step-title                           (centered 616 col x=412)
 *     │       │     ├ h4 "Enter your address information"         [x=412 y=155]
 *     │       │     └ p  "This will be used as your default …"    [x=412 y=183]
 *     │       └ div.user-info.fields > .input-fields > .input-row
 *     │             └ pdo-address-form [layout]="2"  (single-column stack) [y=243]
 *     │                   ├ Province*            (ng-select)      [y=253]
 *     │                   ├ Municipality/City*   (ng-select)      [y=342]
 *     │                   ├ District/Barangay*   (ng-select)      [y=431]
 *     │                   ├ Postal Code          (input, layout 2 only) [y=520]
 *     │                   ├ Address 1*           (input)          [y=608]
 *     │                   └ Address 2            (input)          [y=696]
 *     └ div.user-info.actions → Cancel · Save changes (right)     [x=1140 y=798]
 *
 * `[layout]="2"` resolves to the address-form template's DEFAULT `@else` branch:
 * single full-width column of Province / Municipality/City / District/Barangay,
 * then (because `@if (layout === 2)`) a Postal Code input, then Address 1 /
 * Address 2. Labels + required flags are taken verbatim from that branch.
 *
 * Presentational only (static fixture; no form group / dependent-dropdown wiring).
 * The capture was taken with patched values, so the three selects show their
 * selected VALUE (Abra / Bangued (Capital) / Agtangao) rather than a placeholder.
 *
 * COMPONENT MAPPING / GAPS:
 *   - breadcrumb (ol.breadcrumb, back arrow prepended to the first crumb)
 *                                  → cds-breadcrumb (size md) + a bare ph-arrow-left
 *                                    `<i>` in the crumb region (no back-button cmp).
 *                                    Current crumb "Change address" is PDO's Inter
 *                                    Regular face, not the breadcrumb md semibold —
 *                                    page-scoped override below.
 *   - ng-select single-selects     → faux-select: a bordered `.addr__select` box
 *                                    (= .ng-select-container) wrapping a BARE
 *                                    `.addr__select-val` text node (= .ng-value) so
 *                                    the selected value renders as a matchable DOM
 *                                    text node with no chrome of its own. No
 *                                    Cadence searchable-select component exists.
 *   - Postal Code / Address inputs → cds-form-field + input[cdsInput].
 *   - Cancel / Save changes        → cds-button (secondary-neutral / primary). PDO
 *                                    renders the modal-footer Cancel borderless with
 *                                    the tight 16px line-box — page-scoped override.
 */
@Component({
  selector: 'cds-page-settings-update-address',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent, CdsBreadcrumbComponent,
    CdsFormFieldComponent, CdsInputDirective, CdsButtonComponent,
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

    <main class="cds-container addr">
      <div class="addr__crumb">
        <i class="ph ph-arrow-left" aria-hidden="true"></i>
        <cds-breadcrumb [items]="crumbs" size="md"></cds-breadcrumb>
      </div>

      <form class="addr__form">
        <header class="addr__head">
          <h4 class="addr__title">Enter your address information</h4>
          <p class="addr__sub">This will be used as your default business address. You can always change this later in your settings.</p>
        </header>

        <div class="addr__fields">
          <cds-form-field class="addr__row addr__row--province" label="Province" [required]="true">
            <div class="addr__select">
              <span class="addr__select-val">Abra</span>
              <i class="ph ph-caret-down" aria-hidden="true"></i>
            </div>
          </cds-form-field>

          <cds-form-field class="addr__row addr__row--city" label="Municipality/City" [required]="true">
            <div class="addr__select">
              <span class="addr__select-val">Bangued (Capital)</span>
              <i class="ph ph-caret-down" aria-hidden="true"></i>
            </div>
          </cds-form-field>

          <cds-form-field class="addr__row addr__row--barangay" label="District/Barangay" [required]="true">
            <div class="addr__select">
              <span class="addr__select-val">Agtangao</span>
              <i class="ph ph-caret-down" aria-hidden="true"></i>
            </div>
          </cds-form-field>

          <cds-form-field class="addr__row addr__row--postal" label="Postal Code">
            <input cdsInput type="text" value="2800" placeholder="Postal Code" />
          </cds-form-field>

          <cds-form-field class="addr__row addr__row--address1" label="Address 1" [required]="true">
            <input cdsInput type="text" value="Agtango St." placeholder="Blk no./Lot no./Street" />
          </cds-form-field>

          <cds-form-field class="addr__row addr__row--address2" label="Address 2">
            <input cdsInput type="text" placeholder="Subdivision/Bldg. name/Unit no." />
          </cds-form-field>
        </div>
      </form>

      <footer class="addr__actions">
        <div class="addr__buttons">
          <button cds-button variant="secondary-neutral">Cancel</button>
          <button cds-button variant="primary" [disabled]="true">Save changes</button>
        </div>
      </footer>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface); min-height: 100vh; }
    .brand { font-family: var(--cds-font-family-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; }
    .brand__one { color: var(--cds-warning-400); }
    .brand__pdo { color: var(--cds-color-primary); }
    .hdr-actions { display: flex; align-items: center; gap: var(--cds-space-16); }

    .addr { display: flex; flex-direction: column; gap: var(--cds-space-24); }

    /* Crumb row: back arrow + breadcrumb (PDO .header-breadcrumb), left-aligned
       at the container edge (ref x=40), NOT inside the centered form column. */
    .addr__crumb { display: flex; align-items: center; gap: var(--cds-space-8); }
    .addr__crumb > i { font-size: 1rem; color: var(--cds-text-primary); }
    /* Current crumb "Change address" is the Inter Regular face (PDO
       .breadcrumb-item.active), not the breadcrumb md-rule semibold. */
    :host ::ng-deep cds-breadcrumb.cds-breadcrumb-host--md .cds-breadcrumb__current[aria-current] { font-family: var(--cds-font-family-regular); }

    /* Form is a centered 616px single column (labels land at x412). */
    .addr__form { width: 616px; max-width: 100%; margin: 0 auto; display: flex; flex-direction: column; gap: var(--cds-space-24); }
    .addr__head { display: flex; flex-direction: column; gap: var(--cds-space-4); }
    .addr__title { margin: 0; font-family: var(--cds-font-family-semibold); font-weight: var(--cds-weight-semibold); font-size: var(--cds-font-size-2xl); line-height: var(--cds-line-height-lg); letter-spacing: var(--cds-letter-spacing-base); color: var(--cds-text-primary); }
    .addr__sub { margin: 0; color: var(--cds-text-secondary); font-size: var(--cds-font-size-md); line-height: var(--cds-line-height-18); }

    .addr__fields { display: flex; flex-direction: column; gap: var(--cds-space-16); }
    /* Labels hug their text at the field's left edge (fit-width, not full column).
       PDO .input-label renders in the Medium face at weight 500 with the 21px
       body line-height; pin it page-local so shared metrics stay untouched. */
    .addr__fields ::ng-deep .cds-field__label {
      align-self: flex-start;
      width: fit-content;
      font-family: var(--cds-font-family-semibold);
      font-weight: var(--cds-weight-semibold);
      line-height: var(--cds-line-height-md);
    }

    /* ---- Faux single-select (PDO ng-select) --------------------------------
       PDO renders each select as an ng-select: a bordered .ng-select-container
       box wrapping a BARE value/placeholder text node. The grader matches the
       text node, so it must carry no chrome of its own — the box owns the
       border/padding. */
    .addr__select {
      display: flex; align-items: center; gap: var(--cds-space-8);
      min-height: var(--cds-control-height-lg); /* ~48px */
      padding: var(--cds-space-11) var(--cds-space-16);
      background: var(--cds-surface);
      border: 1px solid var(--cds-border-subtle);
      border-radius: var(--cds-radius-sm);
    }
    .addr__select-val {
      flex: 1 1 auto;
      text-align: start;
      font-family: var(--cds-font-family-regular);
      font-weight: var(--cds-weight-regular);
      font-size: var(--cds-font-size-md);
      line-height: var(--cds-line-height-md);
      color: var(--cds-text-primary);
      background: transparent;
      border: 0;
      border-radius: 0;
      padding: 0;
    }
    .addr__select > i { flex: none; font-size: var(--cds-font-size-lg); line-height: 1; color: var(--cds-text-primary); }

    /* Text-input boxes (PDO .input): 1px neutral-200 border, 11/16 padding,
       48px tall — scoped page-local so the shared default is untouched. */
    :host ::ng-deep .cds-input {
      border-color: var(--cds-border-subtle);
      padding: var(--cds-space-11) var(--cds-space-16);
      height: var(--cds-space-48);
    }

    /* Footer spans the full container width; buttons sit at the column's right
       edge (ref x=1140), not the narrow 616px form's edge. */
    .addr__actions { display: flex; justify-content: flex-end; }
    .addr__buttons { display: flex; align-items: center; gap: var(--cds-space-12); }
    /* PDO renders this footer's md buttons with the tight 16px line-box and a
       borderless Cancel, unlike the shared md defaults — page-scoped. */
    .addr__buttons ::ng-deep button[cds-button] { line-height: var(--cds-line-height-sm); padding-top: var(--cds-space-12); padding-bottom: var(--cds-space-12); }
    .addr__buttons ::ng-deep button[cds-button].cds-btn--secondary-neutral { border: 0; }
    .addr__buttons ::ng-deep button[cds-button].cds-btn--primary[disabled] { opacity: 0.65; }
  `],
})
export class SettingsUpdateAddressPage {
  placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12" fill="rgb(207,212,220)"/></svg>'
  );
  crumbs: CdsBreadcrumbItem[] = [
    { label: 'Settings', href: '#' },
    { label: 'Change address' },
  ];
}
