import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Toolbar row for list pages — filters on the left, search/actions on the right.
 * Presentational container.
 *
 *   <cds-filter-bar>
 *     <!-- default slot: filters -->
 *     <cds-dropdown>…All brokers…</cds-dropdown>
 *     <div cds-filter-actions><cds-input-group>…search…</cds-input-group></div>
 *   </cds-filter-bar>
 */
@Component({
  selector: 'cds-filter-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cds-filter-bar__filters"><ng-content></ng-content></div>
    <div class="cds-filter-bar__actions"><ng-content select="[cds-filter-actions]"></ng-content></div>
  `,
  styleUrl: './filter-bar.component.scss',
  host: { class: 'cds-filter-bar' },
})
export class CdsFilterBarComponent {}
