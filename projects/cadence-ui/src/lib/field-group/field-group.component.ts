import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Groups related form fields under an optional legend, with consistent spacing —
 * a reusable `fieldset` for sections like "Personal details" / "Employment info".
 * Presentational layout only.
 *
 *   <cds-field-group legend="Personal details" hint="As shown on your ID">
 *     <cds-form-field …></cds-form-field>
 *     <cds-form-field …></cds-form-field>
 *   </cds-field-group>
 */
@Component({
  selector: 'cds-field-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fieldset class="cds-field-group__set">
      @if (legend) {
        <legend class="cds-field-group__legend">
          {{ legend }}
          @if (hint) { <span class="cds-field-group__hint">{{ hint }}</span> }
        </legend>
      }
      <div class="cds-field-group__body" [class.cds-field-group__body--row]="layout === 'row'">
        <ng-content></ng-content>
      </div>
    </fieldset>
  `,
  styleUrl: './field-group.component.scss',
  host: { class: 'cds-field-group' },
})
export class CdsFieldGroupComponent {
  @Input() legend?: string;
  @Input() hint?: string;
  @Input() layout: 'stack' | 'row' = 'stack';
}
