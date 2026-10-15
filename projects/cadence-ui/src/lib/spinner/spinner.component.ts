import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Indeterminate loading spinner. Presentational. */
@Component({
  selector: 'cds-spinner',
  standalone: true,
  template: `<span class="cds-spinner__ring" [style.width.px]="diameter" [style.height.px]="diameter"
                  [style.borderWidth.px]="thickness"></span>`,
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cds-spinner', role: 'status', '[attr.aria-label]': 'label' },
})
export class CdsSpinnerComponent {
  @Input() diameter = 24;
  @Input() thickness = 3;
  @Input() label = 'Loading';
}
