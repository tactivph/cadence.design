import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsPageHeaderComponent,
  CdsBreadcrumbComponent, CdsStepperComponent, CdsCardComponent,
  CdsFieldGroupComponent, CdsFormFieldComponent, CdsInputDirective,
  CdsButtonComponent, CdsAvatarComponent, CdsBreadcrumbItem, CdsStep,
} from '../../public-api';

/**
 * MOCK page — Client · Buyer's Information Sheet wizard (step 1 shown).
 * High-fidelity reference composed ONLY from Cadence components. No data loading
 * or behaviour (see the contract on Docs).
 */
@Component({
  selector: 'cds-page-client-bis',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsPageHeaderComponent,
    CdsBreadcrumbComponent, CdsStepperComponent, CdsCardComponent,
    CdsFieldGroupComponent, CdsFormFieldComponent, CdsInputDirective,
    CdsButtonComponent, CdsAvatarComponent,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand">Cadence</span>
      <a cds-nav-item [active]="true">Requirements</a>
      <a cds-nav-item>Property Feed</a>
      <a cds-nav-item>Financing</a>
      <a cds-nav-item>Site Map</a>
      <div cds-topnav-actions class="actions">
        <i class="ph ph-bell" aria-hidden="true"></i>
        <cds-avatar name="Maria Santos" size="sm"></cds-avatar>
      </div>
    </cds-top-nav>

    <main class="page">
      <cds-page-header title="Buyer's Information Sheet" subtitle="Step 1 of 6 · Personal details">
        <cds-breadcrumb cds-page-breadcrumb [items]="crumbs"></cds-breadcrumb>
      </cds-page-header>

      <cds-stepper [steps]="steps" [activeIndex]="0"></cds-stepper>

      <cds-card>
        <form class="form" (submit)="$event.preventDefault()">
          <cds-field-group legend="Personal details" hint="As shown on your valid government ID" layout="row">
            <cds-form-field label="First name" [required]="true" for="fn">
              <input cdsInput id="fn" type="text" value="Maria" />
            </cds-form-field>
            <cds-form-field label="Middle name" for="mn">
              <input cdsInput id="mn" type="text" value="Lopez" />
            </cds-form-field>
            <cds-form-field label="Last name" [required]="true" for="ln">
              <input cdsInput id="ln" type="text" value="Santos" />
            </cds-form-field>
          </cds-field-group>

          <cds-field-group legend="Contact" layout="row">
            <cds-form-field label="Mobile number" [required]="true" for="mob" hint="PH mobile, 11 digits">
              <input cdsInput id="mob" type="tel" value="+63 900-000-0012" />
            </cds-form-field>
            <cds-form-field label="Email address" [required]="true" for="em" error="Enter a valid email address">
              <input cdsInput id="em" type="email" [invalid]="true" value="maria.santos@" />
            </cds-form-field>
          </cds-field-group>

          <cds-field-group legend="Civil status & nationality" layout="row">
            <cds-form-field label="Civil status" for="cs">
              <select cdsInput id="cs">
                <option>Single</option><option selected>Married</option>
                <option>Widowed</option><option>Separated</option>
              </select>
            </cds-form-field>
            <cds-form-field label="Nationality" for="nat">
              <input cdsInput id="nat" type="text" value="Filipino" />
            </cds-form-field>
            <cds-form-field label="Date of birth" for="dob">
              <input cdsInput id="dob" type="date" value="1990-04-12" />
            </cds-form-field>
          </cds-field-group>
        </form>
      </cds-card>

      <div class="footer">
        <button cds-button variant="ghost" iconLeft="ph ph-arrow-left">Go back to requirements</button>
        <div class="footer__right">
          <button cds-button variant="secondary" disabled iconLeft="ph ph-caret-left">Previous</button>
          <button cds-button variant="primary" iconRight="ph ph-caret-right">Save &amp; Next</button>
        </div>
      </div>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface-subtle); min-height: 100vh; }
    .brand { font-family: var(--cds-font-display, inherit); font-weight: 700; font-size: 1.125rem; color: var(--cds-color-primary); }
    .actions { display: flex; align-items: center; gap: var(--cds-space-16); }
    .actions .ph-bell { font-size: 1.25rem; color: var(--cds-text-secondary); }
    .page { max-width: 920px; margin: 0 auto; padding: var(--cds-space-24); display: flex; flex-direction: column; gap: var(--cds-space-20); }
    .form { display: flex; flex-direction: column; gap: var(--cds-space-24); }
    .footer { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-12); }
    .footer__right { display: flex; gap: var(--cds-space-12); }
  `],
})
export class ClientBuyersInformationSheetPage {
  crumbs: CdsBreadcrumbItem[] = [
    { label: 'Requirements', href: '#' },
    { label: "Buyer's Information Sheet" },
  ];
  steps: CdsStep[] = [
    { label: 'Personal details' },
    { label: 'Spouse information' },
    { label: 'Representative' },
    { label: 'General questions' },
    { label: 'Review property' },
    { label: 'Privacy & consent' },
  ];
}
