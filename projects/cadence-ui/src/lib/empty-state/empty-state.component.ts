import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Empty-state block (PDO pattern: "No pending requirements", "No seller yet"…).
 * Project actions via the default slot.
 *   <cds-empty-state icon="ph ph-file" title="No pending requirements"
 *       message="This page clears as you complete processing.">
 *     <button cds-button>Refresh</button>
 *   </cds-empty-state>
 */
@Component({
  selector: 'cds-empty-state',
  standalone: true,
  template: `
    @if (icon) { <span class="cds-empty__icon"><i class="{{ icon }}" aria-hidden="true"></i></span> }
    <h3 class="cds-empty__title">{{ title }}</h3>
    @if (message) { <p class="cds-empty__message">{{ message }}</p> }
    <div class="cds-empty__actions"><ng-content></ng-content></div>
  `,
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cds-empty', '[class.cds-empty--sm]': "size === 'sm'" },
})
export class CdsEmptyStateComponent {
  @Input() icon?: string;
  @Input() title = '';
  @Input() message?: string;
  /** `md` (default) = hero empty block, centered 20/24 heading.
   *  `sm` = compact inline empty line (14/21 body, start-aligned) — PDO list empties. */
  @Input() size: 'md' | 'sm' = 'md';
}
