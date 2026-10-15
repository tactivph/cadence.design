import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsButtonComponent,
  CdsUserChipComponent, CdsNotifBellComponent, CdsCardComponent,
  CdsFormFieldComponent, CdsInputDirective, CdsAlertComponent,
  CdsEmptyStateComponent,
} from '../../public-api';

interface Scheme { title: string; desc: string; }

/**
 * MOCK page — Staff · Eligibility Calculator (`/staff/eligibility-calculator`).
 *
 * SOURCE-FIRST port of PDO `income-calculator.component.html` (+ its
 * `pdo-unit-selection` sub-component). The staff route renders the SAME
 * `IncomeCalculatorComponent` as the agent eligibility calculator, only in staff
 * context. The page BODY (no-lead state) is identical to the already-ported,
 * passing agent calculator; only the SHELL and `$auth.isStaff` branches change.
 *
 * STAFF vs AGENT differences:
 *   - Top-nav shell is the STAFF shell (copied verbatim from the staff calendar
 *     sibling: staff nav items, Admin caret, notif bell, user chip "Tactiv A." /
 *     Staff). ACTIVE nav item = "Calculator".
 *   - The captured reference shows the identical no-lead body; the template's
 *     `$auth.isStaff` branches only affect the lead-scoped header (breadcrumb /
 *     "STEP 1" subtitle) and gated computation sections, all collapsed in this
 *     no-lead state, so the visible body is the same as the agent view.
 *
 * CAPTURED STATE — no lead (`hasLead` false), no financing selected and no units
 * added. The template therefore renders only:
 *   - the `hasLead=false` header (h1 "Eligibility Calculator") + intro + Reset;
 *   - STEP 1 `pdo-unit-selection` card (#1 "Property Selection");
 *   - STEP 2 `pdo-reservation-step-card` (#2 "Financing Scheme", 6 options);
 *   - the Remarks side card.
 * Every gated section (`@if (selectedFinancing && selectedUnits.length)` — Buyer
 * Financial Details, Selling Price, Contract Price, eligibility result, etc.) and
 * the sticky "Computation Summary" aside (`@if (selectedFinancing)`) are collapsed
 * in this state, so they are correctly absent here.
 *
 * Structure mirrors the captured template top-to-bottom:
 *   container > income-calculator
 *     ├ income-calculator__header → h1 "Eligibility Calculator" + intro · Reset
 *     └ income-calculator__layout (main + aside)
 *         ├ main
 *         │   ├ pdo-unit-selection  (step 1 "Property Selection")
 *         │   │     ├ fields grid → Site · Project / House Type · Product Offering
 *         │   │     │                / Finish Type · Unit (6 selects, 2-up)
 *         │   │     ├ selection-bar → hint text + "Add property"
 *         │   │     ├ project-notice → info "All units in one transaction…"
 *         │   │     ├ list-divider + h3 "Property list"
 *         │   │     ├ empty-state "No property selected" / "Please choose a property…"
 *         │   │     └ footer → "0 unit(s) selected" · "Total: ₱ 0.00"
 *         │   └ pdo-reservation-step-card (step 2 "Financing Scheme")
 *         │         └ 6 scheme cards (Spot Cash … Bank Financing)
 *         └ aside → Remarks card: "Remarks" + (1)/(2) + sample computation note
 *
 * Presentational only (static fixture; no form wiring / dependent dropdowns).
 *
 * COMPONENT GAPS (approximated with the closest Cadence primitive, noted upstream):
 *   - PDO `<ng-select>` single-selects have no dedicated Cadence searchable-select.
 *     Each is reproduced as a native `<select cdsInput>` inside cds-form-field (the
 *     established pattern — see lead-create.page.ts address form), carrying the real
 *     placeholder as its disabled selected option.
 *   - PDO `pdo-reservation-step-card` / `pdo-unit-selection` are bespoke step cards
 *     → mapped to cds-card with a numbered step header (layout markup for the badge,
 *     which is layout, not a faked component).
 *   - The financing-scheme option buttons → interactive cds-card tiles.
 */
@Component({
  selector: 'cds-page-staff-eligibility-calculator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsButtonComponent,
    CdsUserChipComponent, CdsNotifBellComponent, CdsCardComponent,
    CdsFormFieldComponent, CdsInputDirective, CdsAlertComponent,
    CdsEmptyStateComponent,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item [hasCaret]="true">Dashboard</a>
      <a cds-nav-item>Approval</a>
      <a cds-nav-item>Leads</a>
      <a cds-nav-item>Clients</a>
      <a cds-nav-item>Processor</a>
      <a cds-nav-item>Sales Network</a>
      <a cds-nav-item>Calendar</a>
      <a cds-nav-item [active]="true">Calculator</a>
      <a cds-nav-item>Site Map</a>
      <div cds-topnav-actions class="hdr-actions">
        <a cds-nav-item [hasCaret]="true">Admin</a>
        <cds-notif-bell [count]="0"></cds-notif-bell>
        <cds-user-chip name="Tactiv A." role="Staff"></cds-user-chip>
      </div>
    </cds-top-nav>

    <main class="cds-container">
      <!-- income-calculator__header (hasLead=false branch) -->
      <header class="calc-top">
        <div class="calc-top__heading">
          <h1 class="calc-top__title">Eligibility Calculator</h1>
          <p class="calc-top__subtitle">Select the financing scheme for this assessment.</p>
        </div>
        <button cds-button variant="secondary-neutral" iconLeft="ph ph-arrow-counter-clockwise">Reset</button>
      </header>

      <div class="calc-grid">
        <div class="calc-main">
          <!-- pdo-unit-selection · step 1: Property Selection -->
          <cds-card>
            <div cds-card-header class="calc-step">
              <span class="calc-step__num">1</span>
              <h3 class="calc-step__title">Property Selection</h3>
            </div>

            <div class="calc-fields">
              <div class="calc-row">
                <cds-form-field label="Site">
                  <select cdsInput>
                    <option value="" disabled selected>Select a site</option>
                  </select>
                </cds-form-field>
                <cds-form-field label="Project">
                  <select cdsInput>
                    <option value="" disabled selected>Select a project</option>
                  </select>
                </cds-form-field>
              </div>
              <div class="calc-row">
                <cds-form-field label="House Type">
                  <select cdsInput>
                    <option value="" disabled selected>Select a house type</option>
                  </select>
                </cds-form-field>
                <cds-form-field label="Product Offering">
                  <select cdsInput>
                    <option value="" disabled selected>Select a product offering</option>
                  </select>
                </cds-form-field>
              </div>
              <div class="calc-row">
                <cds-form-field label="Finish Type">
                  <select cdsInput>
                    <option value="" disabled selected>Select a finish type</option>
                  </select>
                </cds-form-field>
                <cds-form-field label="Unit">
                  <select cdsInput>
                    <option value="" disabled selected>Select a unit</option>
                  </select>
                </cds-form-field>
              </div>
            </div>

            <div class="calc-add">
              <span class="calc-add__hint">Select a property, then click &lsquo;Add property&rsquo; to include it for this client.</span>
              <button cds-button variant="secondary-neutral">Add property</button>
            </div>

            <cds-alert variant="info">All units in one transaction must belong to the same project.</cds-alert>

            <div class="calc-divider"></div>

            <h3 class="calc-list__title">Property list</h3>
            <cds-empty-state icon="ph ph-buildings" title="No property selected"
              message="Please choose a property to add to your list."></cds-empty-state>

            <div cds-card-footer class="calc-foot">
              <span class="calc-foot__count">0 unit(s) selected</span>
              <span class="calc-foot__total">Total: &#8369; 0.00</span>
            </div>
          </cds-card>

          <!-- pdo-reservation-step-card · step 2: Financing Scheme -->
          <cds-card>
            <div cds-card-header class="calc-step">
              <span class="calc-step__num">2</span>
              <h3 class="calc-step__title">Financing Scheme</h3>
            </div>

            <div class="calc-schemes">
              @for (s of schemes; track s.title) {
                <cds-card [interactive]="true">
                  <span class="scheme__title">{{ s.title }}</span>
                  <span class="scheme__desc">{{ s.desc }}</span>
                </cds-card>
              }
            </div>
          </cds-card>
        </div>

        <!-- income-calculator__aside · Remarks card -->
        <aside class="calc-aside">
          <cds-card>
            <p class="remarks__heading">Remarks</p>
            <p class="remarks__item"><strong>(1)</strong> <span>Should there be an increase in the amount of Miscellaneous Fee (MF), Pueblo De Oro Development Corp. (PODC) reserves the right to collect the additional amount from the buyer and the buyer agrees to pay the same on demand.</span></p>
            <p class="remarks__item"><strong>(2)</strong> <span>Miscellaneous expenses such as registration fees, documentary stamps, transfer tax, water connection fee (if applicable), building plans (if applicable) shall be to the account of the BUYER. Charges of financial institutions (i.e. Pag-IBIG, Banks) involving application fees, appraisal/processing fees, mortgage redemption insurance, fire insurance and other premiums required by the financial institutions shall be paid by the BUYER when required.</span></p>
            <p class="remarks__sample">Sample computation for the monthly equity and loan amortization.</p>
            <p class="remarks__note">Indicative only and is subject to change. Final interest rates and amortization computation will be applied by the financing institution upon loan take out. Necessary adjustments in equity payments might happen due to changes in the final loan value.</p>
          </cds-card>
        </aside>
      </div>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface); min-height: 100vh; }
    .brand { font-family: var(--cds-font-family-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; }
    .brand__one { color: var(--cds-warning-400); }
    .brand__pdo { color: var(--cds-color-primary); }
    .hdr-actions { display: flex; align-items: center; gap: var(--cds-space-16); }

    /* staff caret nav items (Dashboard, Admin) align start, not center (page-scoped) */
    :host ::ng-deep .cds-nav-item--caret { text-align: start; }

    .calc-top { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--cds-space-16); margin-bottom: var(--cds-space-24); }
    /* hasLead=false header title — Inter Regular 28/600, line-height 1.2 (33.6px) */
    .calc-top__title { margin: 0; font-family: var(--cds-font-family-regular); font-weight: 600; font-size: var(--cds-font-size-5xl); line-height: 1.2; letter-spacing: -1px; color: var(--cds-text-primary); }
    .calc-top__subtitle { margin: var(--cds-space-4) 0 0; color: var(--cds-text-tertiary); font-size: var(--cds-font-size-sm); line-height: 1.5; }

    /* income-calculator__layout: main (~805px) + 20px gap + aside (~423px). */
    .calc-grid { display: grid; grid-template-columns: minmax(0, 1fr) 423px; gap: 20px; align-items: start; }
    .calc-main { display: flex; flex-direction: column; gap: var(--cds-space-24); min-width: 0; }

    /* reservation-step-card__header: numbered badge + title */
    .calc-step { display: flex; align-items: center; gap: var(--cds-space-12); }
    .calc-step__num { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: var(--cds-color-primary); color: #fff; font-weight: 700; font-size: 14px; }
    /* reservation-step-card__title — text-secondary, 16/500, line-height 1.2 (19.2px) */
    .calc-step__title { margin: 0; font-weight: var(--cds-weight-semibold); font-size: var(--cds-font-size-lg); line-height: 1.2; color: var(--cds-text-secondary); }

    .calc-fields { display: flex; flex-direction: column; gap: var(--cds-space-16); margin-top: var(--cds-space-16); }
    .calc-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--cds-space-16); }

    .calc-add { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-16); margin-top: var(--cds-space-20); }
    .calc-add__hint { color: var(--cds-text-primary); font-size: var(--cds-font-size-md); }
    /* disabled "Add property" — near-black label at 0.7 opacity */
    .calc-add button[cds-button] { color: var(--cds-text-primary); opacity: 0.7; }

    cds-alert { margin-top: var(--cds-space-16); display: block; }
    /* project-notice body — text-primary, 14/20 */
    :host ::ng-deep cds-alert .cds-alert__body { color: var(--cds-text-primary); font-size: var(--cds-font-size-md); line-height: 20px; }

    .calc-divider { height: 1px; background: var(--cds-border-subtle); margin-top: var(--cds-space-16); }

    .calc-list__title { margin: var(--cds-space-12) 0 var(--cds-space-8); font-family: var(--cds-font-family-regular); font-weight: 600; font-size: var(--cds-font-size-lg); color: var(--cds-text-primary); }

    .calc-foot { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-16); margin-top: var(--cds-space-16); }
    /* property-footer — 0.875rem (12.25px), line-height 1.5 (18.375px) */
    .calc-foot__count { color: var(--cds-text-secondary); font-size: 0.875rem; line-height: 1.5; }
    .calc-foot__total { font-weight: 600; color: var(--cds-text-primary); font-size: 0.875rem; line-height: 1.5; }

    .calc-schemes { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--cds-space-16); margin-top: var(--cds-space-16); }
    /* scheme-title — text-secondary, Inter Medium 500, left-aligned */
    .scheme__title { display: block; font-family: var(--cds-font-family-medium); font-weight: var(--cds-weight-semibold); color: var(--cds-text-secondary); text-align: left; }
    /* scheme-copy — 0.8125rem (11.375px), line-height 1.5 (17.0625px), left-aligned */
    .scheme__desc { display: block; margin-top: var(--cds-space-4); color: var(--cds-text-tertiary); font-size: 0.8125rem; line-height: 1.5; text-align: left; }

    .calc-aside { position: sticky; top: var(--cds-space-24); }
    /* panel-title (Remarks / sample) — 16/600, line-height 24 */
    .remarks__heading { margin: 0 0 var(--cds-space-12); font-weight: 600; font-size: var(--cds-font-size-lg); line-height: var(--cds-line-height-lg); color: var(--cds-text-primary); }
    .remarks__item { margin: 0 0 var(--cds-space-12); font-style: italic; font-size: var(--cds-font-size-sm); color: var(--cds-text-primary); }
    .remarks__sample { margin: var(--cds-space-16) 0 var(--cds-space-8); font-weight: 600; font-size: var(--cds-font-size-lg); line-height: var(--cds-line-height-lg); color: var(--cds-text-primary); }
    /* info-copy — text-primary, 14px, line-height 21, padding-top 12 */
    .remarks__note { margin: 0; padding-top: var(--cds-space-12); font-style: italic; font-size: var(--cds-font-size-md); line-height: var(--cds-line-height-md); color: var(--cds-text-primary); }

    /* ---- box styles (page-scoped ::ng-deep on the matched cds-cards / selects) ---- */
    /* box.reservation-step-card — step cards: neutral-25 surface, gray-300 border, 20px pad, no shadow */
    .calc-main > cds-card { background: var(--cds-gray-25); border-color: var(--cds-border); padding: var(--cds-space-20); box-shadow: none; }
    .calc-main > cds-card ::ng-deep .cds-card__body { padding: 0; }
    /* box.income-calculator__side-card — Remarks aside: gray-true-100 surface, borderless, 20px pad, no shadow */
    .calc-aside > cds-card { background: var(--cds-surface-remarks); border: 0; padding: var(--cds-space-20); box-shadow: none; }
    .calc-aside > cds-card ::ng-deep .cds-card__body { padding: 0; }
    /* box.ng-select-container — selects: neutral-25 surface, gray-200 border, 11px/16px pad */
    .calc-fields select { background: var(--cds-gray-25); border-color: var(--cds-border-subtle); padding: var(--cds-space-11) var(--cds-space-16); }

    /* cds-empty-state — compact empty: text-secondary title (Inter Regular 0.9375rem/600) + message */
    :host ::ng-deep cds-empty-state .cds-empty__title { color: var(--cds-text-secondary); font-family: var(--cds-font-family-regular); font-size: 0.9375rem; font-weight: 600; line-height: 1.5; }
    :host ::ng-deep cds-empty-state .cds-empty__message { font-size: 0.875rem; line-height: 1.5; }
  `],
})
export class StaffEligibilityCalculatorPage {
  placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12" fill="rgb(207,212,220)"/></svg>'
  );

  /** financingOptions (income-calculator.component.ts) — label + description. */
  schemes: Scheme[] = [
    { title: 'Spot Cash', desc: 'Full payment within 15-30 days' },
    { title: 'Deferred Cash (with DP)', desc: '30% downpayment, deferred balance' },
    { title: 'Deferred Cash (without DP)', desc: 'No downpayment, deferred payment' },
    { title: 'In-House Financing', desc: 'Developer-financed up to 5 years' },
    { title: 'HDMF / Pag-IBIG', desc: 'Government housing loan' },
    { title: 'Bank Financing', desc: 'Bank-financed mortgage' },
  ];
}
