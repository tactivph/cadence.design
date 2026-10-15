import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { CdsBadgeComponent } from '../badge/badge.component';
import { CdsBadgeShape, CdsBadgeStyle, CdsBadgeTone } from '../core/types';
import {
  CDS_CLIENT_CATEGORY, CDS_CONTRACT_STATUS, CDS_LEAD_PROGRESS,
  CDS_REQUIREMENT_STATUS, CDS_REVIEW_STATUS, CDS_TEMPERATURE, CdsStatusPreset,
} from '../core/status-presets';

export type CdsStatusKind =
  | 'client-category' | 'lead-progress' | 'contract'
  | 'requirement' | 'review' | 'temperature';

const MAPS: Record<CdsStatusKind, Record<string, CdsStatusPreset & { icon?: string }>> = {
  'client-category': CDS_CLIENT_CATEGORY,
  'lead-progress': CDS_LEAD_PROGRESS,
  'contract': CDS_CONTRACT_STATUS,
  'requirement': CDS_REQUIREMENT_STATUS,
  'review': CDS_REVIEW_STATUS,
  'temperature': CDS_TEMPERATURE,
};

/**
 * Domain status pill. Give it a `kind` + a status `code`; it renders the right
 * tone + label from the shared presets. Override `label`/`tone`/`preset` as
 * needed. Presentational only.
 *
 *   <cds-status-badge kind="client-category" code="expired" />
 *   <cds-status-badge kind="review" code="for_review" [showIcon]="true" />
 */
@Component({
  selector: 'cds-status-badge',
  standalone: true,
  imports: [CdsBadgeComponent],
  template: `
    <cds-badge [tone]="resolved().tone" [badgeStyle]="badgeStyle" [dot]="dot" [size]="size" [shape]="shape"
               [icon]="showIcon ? resolved().icon : undefined">
      {{ label ?? resolved().label }}@if (info) { <i class="ph-bold ph-info" style="margin-left:4px;font-size:1em;cursor:help" aria-hidden="true"></i> }
    </cds-badge>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdsStatusBadgeComponent {
  private _kind = signal<CdsStatusKind>('client-category');
  private _code = signal<string>('');

  @Input() set kind(v: CdsStatusKind) { this._kind.set(v); }
  @Input() set code(v: string) { this._code.set(v); }

  /** Override the label while keeping the preset tone. */
  @Input() label?: string;
  /** Override the tone entirely. */
  @Input() tone?: CdsBadgeTone;
  /** Supply a custom code→preset map for app-specific statuses. */
  @Input() preset?: Record<string, CdsStatusPreset & { icon?: string }>;
  /** Show the preset's icon (review statuses ship one). */
  @Input() showIcon = false;
  /** Trailing info (tooltip) icon, as on the leads status pill. */
  @Input() info = false;

  @Input() badgeStyle: CdsBadgeStyle = 'soft';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() shape: CdsBadgeShape = 'rounded';
  @Input() dot = false;

  resolved = computed<CdsStatusPreset & { icon?: string }>(() => {
    const map = this.preset ?? MAPS[this._kind()];
    const found = map?.[this._code()];
    return {
      label: this.label ?? found?.label ?? this._code(),
      tone: this.tone ?? found?.tone ?? 'neutral',
      icon: found?.icon,
    };
  });
}
