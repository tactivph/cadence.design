import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Checkbox. Works with ngModel / reactive forms (ControlValueAccessor) — that's
 * form-control plumbing, not app logic.
 *   <cds-checkbox [(ngModel)]="agree">I agree</cds-checkbox>
 */
@Component({
  selector: 'cds-checkbox',
  standalone: true,
  template: `
    <label class="cds-checkbox" [class.cds-checkbox--disabled]="disabled">
      <input type="checkbox" class="cds-checkbox__native"
             [checked]="checked" [disabled]="disabled" [indeterminate]="indeterminate"
             (change)="toggle($event)" (blur)="onTouched()" />
      <span class="cds-checkbox__box" aria-hidden="true">
        <i class="ph" [class.ph-check]="checked && !indeterminate" [class.ph-minus]="indeterminate"></i>
      </span>
      <span class="cds-checkbox__label"><ng-content></ng-content></span>
    </label>
  `,
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CdsCheckboxComponent), multi: true }],
})
export class CdsCheckboxComponent implements ControlValueAccessor {
  @Input() checked = false;
  @Input() disabled = false;
  @Input() indeterminate = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  private onChange: (v: boolean) => void = () => {};
  onTouched: () => void = () => {};

  toggle(e: Event) {
    this.checked = (e.target as HTMLInputElement).checked;
    this.indeterminate = false;
    this.onChange(this.checked);
    this.checkedChange.emit(this.checked);
  }

  writeValue(v: boolean): void { this.checked = !!v; }
  registerOnChange(fn: (v: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled = d; }
}
