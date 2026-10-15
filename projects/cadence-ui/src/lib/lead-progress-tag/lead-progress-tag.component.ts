import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { CDS_LEAD_PROGRESS } from '../core/status-presets';

/**
 * Lead "Lead Progress" milestone chip (PDO pdo-lead-progress-tag) — a single
 * dark-slate chip; the code only changes the label. Presentational.
 *
 *   <cds-lead-progress-tag code="site_visit_completed"></cds-lead-progress-tag>
 */
@Component({
  selector: 'cds-lead-progress-tag',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (resolvedLabel()) { <span class="cds-lead-progress">{{ resolvedLabel() }}</span> } @else { <span class="cds-lead-progress__empty">-</span> }`,
  styleUrl: './lead-progress-tag.component.scss',
  host: { class: 'cds-lead-progress-host' },
})
export class CdsLeadProgressTagComponent {
  private _code = signal('');
  @Input() set code(v: string) { this._code.set(v); }
  @Input() label?: string;
  resolvedLabel = computed(() => this.label ?? CDS_LEAD_PROGRESS[this._code()]?.label ?? '');
}
