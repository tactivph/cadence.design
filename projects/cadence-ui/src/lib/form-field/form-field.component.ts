import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Field wrapper: label + required marker + hint + error, around a projected
 * control (use with `cdsInput`, cds-checkbox, ng-select, etc.).
 *
 *   <cds-form-field label="Email" [required]="true" error="Required">
 *     <input cdsInput type="email" />
 *   </cds-form-field>
 */
@Component({
  selector: 'cds-form-field',
  standalone: true,
  template: `
    @if (label) {
      <label class="cds-field__label" [attr.for]="for">
        {{ label }}@if (required) { <span class="cds-field__required" aria-hidden="true">*</span> }
      </label>
    }
    <div class="cds-field__control"><ng-content></ng-content></div>
    @if (error) {
      <p class="cds-field__error"><i class="ph ph-warning-circle" aria-hidden="true"></i>{{ error }}</p>
    } @else if (hint) {
      <p class="cds-field__hint">{{ hint }}</p>
    }
  `,
  styleUrl: './form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cds-field', '[class.cds-field--invalid]': '!!error' },
})
export class CdsFormFieldComponent {
  @Input() label?: string;
  @Input() hint?: string;
  @Input() error?: string | null;
  @Input() required = false;
  /** `for`/`id` association to the projected control. */
  @Input() for?: string;
}
