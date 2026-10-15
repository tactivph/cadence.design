import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** One selectable pipeline summary pill. */
export interface CdsPipelineItem {
  /** Phosphor icon class for the leading square (e.g. "ph-fill ph-funnel"). */
  icon: string;
  /** Bold primary label (line 1) — the pipeline name. */
  title: string;
  /** Muted label (line 2) — the stage range. */
  subtitle: string;
  /** Trailing count badge value. */
  count: number;
}

/**
 * Dual-pipeline switcher (PDO clients-pipeline header) — a horizontal row of
 * selectable summary pills joined by a muted arrow. Each pill carries a leading
 * square icon, a two-line label (name + stage range) and a trailing count
 * badge. The active pill reads green (tinted fill, green border, filled icon
 * box, emphasis count); inactive pills read neutral. Presentational only — an
 * `activeIndex` input sets which pill is highlighted; no routing/behaviour.
 *
 *   <cds-pipeline-switcher [items]="pipelines" [activeIndex]="0" />
 */
@Component({
  selector: 'cds-pipeline-switcher',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (item of items; track item.title; let i = $index; let last = $last) {
      <div class="cds-pl" [class.cds-pl--active]="i === activeIndex">
        <span class="cds-pl__icon" aria-hidden="true"><i class="{{ item.icon }}"></i></span>
        <span class="cds-pl__label">
          <span class="cds-pl__title">{{ item.title }}</span>
          <span class="cds-pl__subtitle">{{ item.subtitle }}</span>
        </span>
        <span class="cds-pl__count">{{ item.count }}</span>
      </div>
      @if (!last) { <i class="cds-pl__arrow ph ph-arrow-right" aria-hidden="true"></i> }
    }
  `,
  styleUrl: './pipeline-switcher.component.scss',
  host: { class: 'cds-pipeline-switcher', role: 'group' },
})
export class CdsPipelineSwitcherComponent {
  @Input() items: CdsPipelineItem[] = [];
  /** Index of the highlighted pill. */
  @Input() activeIndex = 0;
}
