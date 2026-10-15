import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Styled radio. Presentational — manage the group (name/value/selection) in the
 * app and bind [checked] + (selected).
 *   <cds-radio name="scheme" value="bank" [checked]="v==='bank'" (selected)="v=$event">Bank</cds-radio>
 */
@Component({
  selector: 'cds-radio',
  standalone: true,
  template: `
    <label class="cds-radio" [class.cds-radio--disabled]="disabled">
      <input type="radio" class="cds-radio__native"
             [name]="name" [value]="value" [checked]="checked" [disabled]="disabled"
             (change)="selected.emit(value)" />
      <span class="cds-radio__dot" aria-hidden="true"></span>
      <span class="cds-radio__label"><ng-content></ng-content></span>
    </label>
  `,
  styleUrl: './radio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdsRadioComponent {
  @Input() name?: string;
  @Input() value?: string;
  @Input() checked = false;
  @Input() disabled = false;
  @Output() selected = new EventEmitter<string | undefined>();
}
