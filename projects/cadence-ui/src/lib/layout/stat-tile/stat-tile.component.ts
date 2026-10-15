import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * KPI / stat tile (PDO dashboard metrics: Property Visits, New Leads…).
 * Presentational — pass computed values.
 *
 *   <cds-stat-tile label="New Leads" value="168" delta="189.66% higher" trend="up" />
 */
@Component({
  selector: 'cds-stat-tile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="cds-stat-tile__label">{{ label }}</span>
    <span class="cds-stat-tile__value">{{ value }}</span>
    @if (delta) {
      <span class="cds-stat-tile__delta cds-stat-tile__delta--{{ trend }}">
        @if (trend !== 'none') { <i class="ph" [class.ph-arrow-up]="trend === 'up'" [class.ph-arrow-down]="trend === 'down'" aria-hidden="true"></i> }
        {{ delta }}
      </span>
    }
  `,
  styleUrl: './stat-tile.component.scss',
  host: { class: 'cds-stat-tile' },
})
export class CdsStatTileComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() delta?: string;
  @Input() trend: 'up' | 'down' | 'none' = 'none';
}
