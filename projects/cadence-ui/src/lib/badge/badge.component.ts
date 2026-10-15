import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CdsBadgeShape, CdsBadgeStyle, CdsBadgeTone } from '../core/types';

/**
 * Status badge / pill — the workhorse status indicator across PDO
 * (lead progress, contract status, requirement status, tags…).
 *
 *   <cds-badge tone="success">Verified</cds-badge>
 *   <cds-badge tone="neutral" size="lg">Expired</cds-badge>
 *
 * Every domain status is one `<cds-badge>` fed a `tone`; the tone→colour map
 * lives once in badge.scss. For domain codes use the presets in
 * `status-presets.ts` via `<cds-status-badge>`.
 */
@Component({
  selector: 'cds-badge',
  standalone: true,
  template: `
    @if (dot) { <span class="cds-badge__dot" aria-hidden="true"></span> }
    @if (icon) { <i class="cds-badge__icon {{ icon }}" aria-hidden="true"></i> }
    <ng-content></ng-content>
  `,
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cds-badge',
    '[class]': '"cds-badge--" + tone + " cds-badge--" + badgeStyle + " cds-badge--" + size + " cds-badge--shape-" + shape',
  },
})
export class CdsBadgeComponent {
  /** Colour tone (see CdsBadgeTone). */
  @Input() tone: CdsBadgeTone = 'neutral';
  /** @deprecated alias for `tone`, kept for existing call sites. */
  @Input() set variant(v: CdsBadgeTone) { this.tone = v; }
  @Input() badgeStyle: CdsBadgeStyle = 'soft';
  /** Corner shape — 'rounded' (8px, default tag) or 'pill' (100px, status pill). */
  @Input() shape: CdsBadgeShape = 'rounded';
  @Input() size: CdsSizeBadge = 'md';
  @Input() dot = false;
  /** Optional Phosphor icon class. */
  @Input() icon?: string;
}

type CdsSizeBadge = 'sm' | 'md' | 'lg';
