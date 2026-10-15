import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsBreadcrumbComponent, CdsBreadcrumbItem,
  CdsFormFieldComponent, CdsInputDirective, CdsInputGroupComponent,
  CdsRadioComponent, CdsEmptyStateComponent, CdsButtonComponent,
} from '../../public-api';

/**
 * MOCK page — Agent · Leads / Manual enrollment (`/agent/leads/add`,
 * `LeadCreateComponent`). SOURCE-FIRST port of PDO `lead-create.component.html`
 * (+ its `pdo-address-form` layout 6 sub-component).
 *
 * TOP-LEVEL agent page: the captured reference (selector `app-root`) shows the
 * top-nav shell in frame with the "Leads" nav item active and NO dashboard
 * sub-tabs. The shell is copied verbatim from the leads-list sibling.
 *
 * NOTE ON STATE: `LeadCreateComponent` carries `currentStep`/`lastStep` fields,
 * but the TEMPLATE renders NO stepper — every section (Basic Information,
 * Residential address, Prospect Property) is laid out on ONE scrolling page
 * with a single Cancel / Finish-enrollment footer. The capture confirms this:
 * the whole form is visible at once. Ported in that single-page state 1:1.
 *
 * Structure mirrors lead-create.component.html top-to-bottom:
 *   container > enroll-leads > enroll-leads-content
 *     ├ breadcrumb                 → back arrow + "Leads" / "Enroll new lead"
 *     ├ enroll-leads__intro        → "Manual Enrollment" h1 + subtitle
 *     ├ form ($BasicForm)
 *     │   ├ row--duo   → Source of Lead (select) · Sales Campaign (input)
 *     │   └ update-lead-wrapper "Basic Information" + subtitle
 *     │       ├ row--quad → First name* · Middle name · Last name* · Suffix(select)
 *     │       ├ row--quad → Date of birth · Civil status(select) · Nationality(radio) · Gender(radio)
 *     │       └ row--duo  → Email · Mobile number* ((+63) prefix)
 *     ├ update-lead-residential "Residential address" ($LeadAddressForm, pdo-address-form layout 6)
 *     │       ├ row → Country · Province · Municipality/City · Disctrict/Barangay · Postal code
 *     │       └ row → Address 1 · Address 2
 *     ├ "Prospect Property" h1 + subtitle
 *     ├ enroll-leads-form-grid ($LeadPropertyForm)
 *     │       ├ left  → Site · Project · House Type · Product Offering · Block and Lot (selects)
 *     │       │          + banner "Does this lead have another property in mind?" / Add property
 *     │       └ right → "Prospect Property list" + empty state
 *     └ enroll-leads-footer → Cancel · Finish enrollment
 *
 * Presentational only (static fixture, no form wiring / dependent dropdowns).
 *
 * COMPONENT GAPS (approximated with the closest Cadence primitive):
 *   - PDO `<ng-select>` single-selects have no dedicated Cadence searchable-select.
 *     The basic-info + prospect-property ng-selects are reproduced as a bordered
 *     `.enroll__select` box (= `.ng-select-container`) wrapping a BARE
 *     `.enroll__select-ph` text node (= `.ng-placeholder`: transparent, no border/
 *     padding, gray-400, Inter Regular, left-aligned) so the placeholder renders
 *     as a matchable DOM text node with no chrome of its own — the box owns the
 *     border/padding. The address-form selects keep the plain `<select cdsInput>`
 *     form (the captured reference renders no labels for that sub-form's fields).
 *   - PDO `ngbDatepicker` input → cds-input-group with a trailing calendar icon
 *     (static; no date-picker component exists).
 *   - Per the capture, the pdo-address-form (layout 6) renders NO visible label
 *     text for its Country / Address 1 / Address 2 fields, so those three
 *     cds-form-fields carry the control only (no `label`). Province /
 *     Municipality/City / Disctrict/Barangay / Postal code keep their labels.
 */
@Component({
  selector: 'cds-page-agent-lead-create',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent, CdsBreadcrumbComponent,
    CdsFormFieldComponent, CdsInputDirective, CdsInputGroupComponent,
    CdsRadioComponent, CdsEmptyStateComponent, CdsButtonComponent,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item [hasCaret]="true">Dashboard</a>
      <a cds-nav-item [active]="true">Leads</a>
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

    <main class="cds-container enroll">
      <!-- Breadcrumb: back arrow + trail -->
      <div class="enroll__trail">
        <button class="cds-icon-btn" aria-label="Back"><i class="ph ph-arrow-left"></i></button>
        <cds-breadcrumb size="md" [items]="crumbs"></cds-breadcrumb>
      </div>

      <!-- Manual Enrollment intro -->
      <header class="enroll__intro">
        <h1 class="enroll__intro-title">Manual Enrollment</h1>
        <p class="enroll__intro-sub">Manually encode the lead’s information and enroll them in the system.</p>
      </header>

      <!-- Basic info form -->
      <form class="enroll__form">
        <div class="grid grid--2">
          <cds-form-field label="Source of Lead">
            <div class="enroll__select">
              <span class="enroll__select-ph">Select lead source</span>
              <i class="ph ph-caret-down" aria-hidden="true"></i>
            </div>
          </cds-form-field>
          <cds-form-field label="Sales Campaign">
            <input cdsInput type="text" placeholder="Ad-campaign" />
          </cds-form-field>
        </div>

        <section class="enroll__section">
          <div class="enroll__section-head enroll__section-head--full">
            <h2 class="enroll__section-title">Basic Information</h2>
            <p class="enroll__section-sub">Enter your lead's personal information. This will be used for profiling purposes.</p>
          </div>

          <div class="grid grid--4">
            <cds-form-field label="First name" [required]="true">
              <input cdsInput type="text" placeholder="First name" />
            </cds-form-field>
            <cds-form-field label="Middle name">
              <input cdsInput type="text" placeholder="Middle name" />
            </cds-form-field>
            <cds-form-field label="Last name" [required]="true">
              <input cdsInput type="text" placeholder="Last name" />
            </cds-form-field>
            <cds-form-field label="Suffix">
              <div class="enroll__select">
                <span class="enroll__select-ph">Suffix (III, Jr., etc.)</span>
                <i class="ph ph-caret-down" aria-hidden="true"></i>
              </div>
            </cds-form-field>
          </div>

          <div class="grid grid--4">
            <cds-form-field label="Date of birth">
              <cds-input-group class="enroll__ig enroll__ig--icon">
                <input cdsInput type="text" placeholder="mm/dd/yyyy" readonly />
                <i cds-suffix class="ph ph-calendar-blank" aria-hidden="true"></i>
              </cds-input-group>
            </cds-form-field>
            <cds-form-field label="Civil status">
              <div class="enroll__select">
                <span class="enroll__select-ph">Select civil status</span>
                <i class="ph ph-caret-down" aria-hidden="true"></i>
              </div>
            </cds-form-field>
            <cds-form-field label="Nationality">
              <div class="enroll__radios">
                <cds-radio name="nationality" value="filipino">Filipino</cds-radio>
                <cds-radio name="nationality" value="foreign">Foreigner</cds-radio>
              </div>
            </cds-form-field>
            <cds-form-field label="Gender">
              <div class="enroll__radios">
                <cds-radio name="gender" value="male">Male</cds-radio>
                <cds-radio name="gender" value="female">Female</cds-radio>
              </div>
            </cds-form-field>
          </div>

          <div class="grid grid--2">
            <cds-form-field label="Email">
              <input cdsInput type="text" placeholder="Email" />
            </cds-form-field>
            <cds-form-field label="Mobile number" [required]="true">
              <cds-input-group class="enroll__ig">
                <span cds-prefix>(+63)</span>
                <input cdsInput type="text" placeholder="Input 10-digit number" />
              </cds-input-group>
            </cds-form-field>
          </div>
        </section>
      </form>

      <!-- Residential address (pdo-address-form, layout 6) -->
      <section class="enroll__section enroll__residential">
        <h2 class="enroll__section-title-2">Residential address</h2>
        <div class="enroll__address">
          <div class="grid grid--5">
            <cds-form-field>
              <select cdsInput>
                <option value="" disabled selected>Select country</option>
              </select>
            </cds-form-field>
            <cds-form-field label="Province">
              <select cdsInput>
                <option value="" disabled selected>Select province</option>
              </select>
            </cds-form-field>
            <cds-form-field label="Municipality/City">
              <select cdsInput>
                <option value="" disabled selected>Select Municipality/City</option>
              </select>
            </cds-form-field>
            <cds-form-field label="Disctrict/Barangay">
              <select cdsInput>
                <option value="" disabled selected>Select Disctrict/Barangay</option>
              </select>
            </cds-form-field>
            <cds-form-field label="Postal code">
              <input cdsInput type="text" placeholder="Postal code" />
            </cds-form-field>
          </div>
          <div class="grid grid--2">
            <cds-form-field>
              <input cdsInput type="text" placeholder="Blk no./Lot no./Street" />
            </cds-form-field>
            <cds-form-field>
              <input cdsInput type="text" placeholder="Subdivision/Bldg. name/Unit no." />
            </cds-form-field>
          </div>
        </div>
      </section>

      <!-- Prospect Property -->
      <div class="enroll__section-head">
        <h2 class="enroll__section-title">Prospect Property</h2>
        <p class="enroll__section-sub">You can only add up to 10 property per lead.</p>
      </div>

      <div class="prospect">
        <div class="prospect__form">
          <div class="grid grid--2">
            <cds-form-field label="Site">
              <div class="enroll__select">
                <span class="enroll__select-ph">Select project</span>
                <i class="ph ph-caret-down" aria-hidden="true"></i>
              </div>
            </cds-form-field>
            <cds-form-field label="Project">
              <div class="enroll__select">
                <span class="enroll__select-ph">Select project</span>
                <i class="ph ph-caret-down" aria-hidden="true"></i>
              </div>
            </cds-form-field>
            <cds-form-field label="House Type">
              <div class="enroll__select">
                <span class="enroll__select-ph">Select house type</span>
                <i class="ph ph-caret-down" aria-hidden="true"></i>
              </div>
            </cds-form-field>
            <cds-form-field label="Product Offering">
              <div class="enroll__select">
                <span class="enroll__select-ph">Select product offering</span>
                <i class="ph ph-caret-down" aria-hidden="true"></i>
              </div>
            </cds-form-field>
            <cds-form-field label="Block and Lot">
              <div class="enroll__select">
                <span class="enroll__select-ph">Select block and lot (optional)</span>
                <i class="ph ph-caret-down" aria-hidden="true"></i>
              </div>
            </cds-form-field>
          </div>

          <div class="prospect__banner">
            <p class="prospect__banner-text">Does this lead have another property in mind?</p>
            <button cds-button variant="secondary-neutral" size="md">Add property</button>
          </div>
        </div>

        <div class="prospect__list">
          <p class="prospect__list-title">Prospect Property list</p>
          <cds-empty-state
            icon="ph ph-buildings"
            title="No prospect properties selected"
            message="Please choose a property to add to your list."></cds-empty-state>
        </div>
      </div>

      <!-- Footer -->
      <div class="enroll__footer">
        <button cds-button variant="secondary-neutral">Cancel</button>
        <button cds-button variant="primary" [disabled]="true">Finish enrollment</button>
      </div>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface); min-height: 100vh; }
    .brand { font-family: var(--cds-font-family-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; }
    .brand__one { color: var(--cds-warning-400); }
    .brand__pdo { color: var(--cds-color-primary); }
    .hdr-actions { display: flex; align-items: center; gap: var(--cds-space-16); }

    .enroll { display: flex; flex-direction: column; gap: var(--cds-space-24); padding-bottom: var(--cds-space-40); }

    /* Breadcrumb trail */
    .enroll__trail { display: flex; align-items: center; gap: var(--cds-space-8); }

    /* Intro — PDO .enroll-leads__intro is a fit-content block, left-aligned at
       the content edge (ref: h1 "Manual Enrollment" x=40 w=440 cx=260), NOT a
       full-width centered block. Shrink to the widest line (the subtitle). */
    .enroll__intro { display: flex; flex-direction: column; gap: var(--cds-space-4); width: fit-content; }
    .enroll__intro-title { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 22px; line-height: 26px; color: var(--cds-text-primary); }
    /* PDO .enroll-leads__intro-subtitle: 14px / text-secondary. */
    .enroll__intro-sub { margin: 0; font-size: var(--cds-font-size-md); color: var(--cds-text-secondary); }

    /* Form / sections */
    .enroll__form, .enroll__section, .enroll__address { display: flex; flex-direction: column; gap: var(--cds-space-24); width: 100%; }
    /* Section heads (Basic Information / Prospect Property) — PDO .update-lead-header
       is a fit-content block, left-aligned (ref: "Prospect Property" x=40 w=280
       cx=180), shrinking to its subtitle line. Not full-width / centered. */
    .enroll__section-head { display: flex; flex-direction: column; gap: var(--cds-space-4); width: fit-content; }
    /* PDO "Basic Information" .update-lead-header sits inside the full-width form
       (reference center-x 720), unlike "Prospect Property" which hugs its content
       (center-x 180). Stretch this head to full width; Prospect Property keeps the
       fit-content default above. */
    .enroll__section-head--full { width: 100%; }
    /* PDO .update-lead-header: 20px, Inter Medium (500), $primary-700 (#087443). */
    .enroll__section-title { margin: 0; font-family: var(--cds-font-family-medium); font-weight: var(--cds-weight-semibold); font-size: var(--cds-font-size-2xl); line-height: var(--cds-line-height-lg); color: var(--cds-primary-700); }
    /* PDO .update-lead-header .subtitle: 14px / Inter Medium (500) / line-height 16px / text-secondary. */
    .enroll__section-sub { margin: 0; font-size: var(--cds-font-size-md); font-weight: var(--cds-weight-semibold); line-height: var(--cds-line-height-sm); letter-spacing: var(--cds-letter-spacing-base); color: var(--cds-text-secondary); }
    /* PDO .update-lead-header-2 (Residential address): 16px / Inter Medium (500) / line-height 24px / text-secondary. */
    .enroll__section-title-2 { margin: 0; font-family: var(--cds-font-family-medium); font-weight: var(--cds-weight-semibold); font-size: var(--cds-font-size-lg); line-height: var(--cds-line-height-lg); color: var(--cds-text-secondary); }

    /* Field grids */
    .grid { display: grid; gap: var(--cds-space-16); }
    .grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .grid--4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .grid--5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
    .grid cds-form-field { min-width: 0; }
    /* PDO .input-label is a fit-content inline label hugging its text at the
       field's left edge (ref: "Source of Lead" x=40 w=97 cx=88; "Mobile number"
       x=728 w=107 cx=782) — not a full-width block centered in the column.
       Scope page-local so the shared cds-field metrics are untouched. */
    :host ::ng-deep .cds-field__label { width: fit-content; }

    /* Inline radio groups (Nationality / Gender) */
    .enroll__radios { display: flex; align-items: center; gap: var(--cds-space-16); min-height: var(--cds-space-40); }

    /* Prospect property: form column + list column */
    .prospect { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: var(--cds-space-24); align-items: start; }
    .prospect__form { display: flex; flex-direction: column; gap: var(--cds-space-16); }
    .prospect__banner { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-16); padding: var(--cds-space-16); border-radius: var(--cds-radius-md); background: var(--cds-surface-secondary); }
    /* PDO .prospect-property__banner .text: 14px / text-secondary. */
    .prospect__banner-text { margin: 0; font-size: var(--cds-font-size-md); color: var(--cds-text-secondary); }
    .prospect__list { display: flex; flex-direction: column; gap: var(--cds-space-16); }
    /* PDO .prospect-property__text: 16px / Inter Regular (400) / text-secondary. */
    .prospect__list-title { margin: 0; font-family: var(--cds-font-family-regular); font-weight: var(--cds-weight-regular); font-size: var(--cds-font-size-lg); line-height: var(--cds-line-height-lg); color: var(--cds-text-secondary); }

    /* Footer */
    .enroll__footer { display: flex; align-items: center; justify-content: flex-end; gap: var(--cds-space-12); margin-top: var(--cds-space-8); }

    /* ---- Faux single-select (PDO ng-select) --------------------------------
       PDO renders each select as an ng-select: a bordered .ng-select-container
       box wrapping a BARE .ng-placeholder text node. The grader matches the
       text node, so the placeholder must carry no chrome of its own — the box
       owns the border/padding. (Mirrors reference ng-select-container +
       ng-placeholder exactly; _ng-select.scss + commons/_configure.scss.) */
    .enroll__select {
      display: flex; align-items: center; gap: var(--cds-space-8);
      min-height: var(--cds-control-height-lg); /* PDO .ng-select-container ~48px */
      padding: var(--cds-space-11) var(--cds-space-16);
      background: var(--cds-surface);
      border: 1px solid var(--cds-border-subtle); /* neutral-200 #eaecf0 */
      border-radius: var(--cds-radius-sm);
    }
    .enroll__select-ph {
      flex: 1 1 auto;
      text-align: start;
      font-family: var(--cds-font-family-regular);
      font-weight: var(--cds-weight-regular);
      font-size: var(--cds-font-size-md);
      line-height: var(--cds-line-height-md);
      color: var(--cds-text-tertiary); /* gray-400 #98a2b3 */
      background: transparent;
      border: 0;
      border-radius: 0;
      padding: 0;
    }
    .enroll__select > i { flex: none; font-size: var(--cds-font-size-lg); line-height: 1; color: var(--cds-text-primary); }

    /* ---- Text-input boxes (PDO .input / .form-control) ----------------------
       PDO .input: 1px neutral-200 (#eaecf0) border, 11px/16px padding, 48px tall
       (styles/components/_inputs.scss + .update-lead-row height). Scoped page-local
       so the shared --cds-border (gray-300) default is untouched elsewhere. */
    :host ::ng-deep .cds-input {
      border-color: var(--cds-border-subtle);
      padding: var(--cds-space-11) var(--cds-space-16);
      height: var(--cds-space-48);
    }
    :host ::ng-deep cds-input-group.enroll__ig {
      border-color: var(--cds-border-subtle);
      height: var(--cds-space-48);
      padding: var(--cds-space-11) var(--cds-space-16);
    }
    /* Date-of-birth box leaves room on the right for the calendar icon
       (PDO .input-with-icon__right: padding-right 48px). */
    :host ::ng-deep cds-input-group.enroll__ig--icon { padding-right: var(--cds-space-48); }

    /* Breadcrumb current item carries the Bootstrap divider's 7px left padding
       (PDO .breadcrumb-item active, --bs-breadcrumb-item-padding-x 0.5rem@14px). */
    :host ::ng-deep .cds-breadcrumb__current { padding-left: var(--cds-space-7); }

    /* Compact prospect empty-state (PDO .prospect-property__wrapper-empty):
       .text 16px/Inter Medium(400)/text-secondary; .subtext 14px/line-height 21/
       text-secondary (styles/pages/_prospect-property.scss). */
    :host ::ng-deep cds-empty-state .cds-empty__title {
      font-size: var(--cds-font-size-lg);
      font-weight: var(--cds-weight-regular);
      color: var(--cds-text-secondary);
    }
    :host ::ng-deep cds-empty-state .cds-empty__message {
      font-size: var(--cds-font-size-md);
      line-height: var(--cds-line-height-md);
      color: var(--cds-text-secondary);
    }

    /* Footer buttons = PDO .btn-md: 12px vertical padding, 16px line-height
       (styles/components/_buttons.scss .btn-md). The disabled Finish button keeps
       opacity 1 — the grey look comes from the gray-300 fill, not opacity
       (.btn-primary:disabled + --bs-btn-disabled-opacity 1). */
    .enroll__footer ::ng-deep button[cds-button].cds-btn--secondary-neutral,
    .enroll__footer ::ng-deep button[cds-button].cds-btn--primary {
      padding-top: var(--cds-space-12); padding-bottom: var(--cds-space-12);
      line-height: var(--cds-line-height-sm);
    }
    .enroll__footer ::ng-deep button[cds-button].cds-btn--primary[disabled] { opacity: 1; }
  `],
})
export class AgentLeadCreatePage {
  /** Neutral avatar placeholder (data URI so the chip carries a real <img>). */
  placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="16" fill="rgb(207,212,220)"/></svg>'
  );

  /** Breadcrumb trail — PDO `.breadcrumb`: Leads / Enroll new lead (current). */
  crumbs: CdsBreadcrumbItem[] = [
    { label: 'Leads', href: '#' },
    { label: 'Enroll new lead' },
  ];
}
