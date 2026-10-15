import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Joins an input with leading/trailing addons (icon or text) into one control —
 * PDO search bars, the "+63" phone prefix, "₱" currency, etc. Presentational.
 *
 *   <cds-input-group>
 *     <i cds-prefix class="ph ph-magnifying-glass"></i>
 *     <input cdsInput type="search" placeholder="Search" />
 *   </cds-input-group>
 *
 *   <cds-input-group>
 *     <span cds-prefix>+63</span>
 *     <input cdsInput type="tel" placeholder="9XX XXX XXXX" />
 *   </cds-input-group>
 */
@Component({
  selector: 'cds-input-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content select="[cds-prefix]"></ng-content>
    <ng-content></ng-content>
    <ng-content select="[cds-suffix]"></ng-content>
  `,
  styleUrl: './input-group.component.scss',
  host: { class: 'cds-input-group', '[class.cds-input-group--invalid]': 'invalid', '[class.cds-input-group--disabled]': 'disabled' },
})
export class CdsInputGroupComponent {
  @Input() invalid = false;
  @Input() disabled = false;
}
