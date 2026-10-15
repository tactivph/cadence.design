import { Directive, Input } from '@angular/core';

/**
 * Styles a native input/textarea/select as a Cadence control. Keeps native
 * behavior (you bind value / ngModel in the app).
 *   <input cdsInput type="text" placeholder="Search" />
 *   <input cdsInput [invalid]="form.invalid" />
 * Styles live in the global theme (styles/components/_forms.scss) so form
 * controls stay centralized.
 */
@Directive({
  selector: 'input[cdsInput], textarea[cdsInput], select[cdsInput]',
  standalone: true,
  host: {
    class: 'cds-input',
    '[class.cds-input--invalid]': 'invalid',
  },
})
export class CdsInputDirective {
  @Input() invalid = false;
}
