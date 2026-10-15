import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CdsTemperature } from '../core/types';

/**
 * Lead temperature chip (PDO pdo-lead-temperature) — pastel background per level
 * with neutral text. Presentational.
 *
 *   <cds-lead-temperature level="hot"></cds-lead-temperature>
 */
@Component({
  selector: 'cds-lead-temperature',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="cds-temp cds-temp--{{ level }}">{{ labels[level] }}@if (info) { <i class="ph-bold ph-info cds-temp__info" aria-hidden="true"></i> }</span>`,
  styleUrl: './lead-temperature.component.scss',
  host: { class: 'cds-temp-host' },
})
export class CdsLeadTemperatureComponent {
  @Input() level: CdsTemperature = 'warm';
  @Input() info = false;
  labels: Record<CdsTemperature, string> = { hot: 'Hot', warm: 'Warm', cold: 'Cold', dormant: 'Dormant' };
}
