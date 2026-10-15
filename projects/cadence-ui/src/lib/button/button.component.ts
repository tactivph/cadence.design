import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CdsButtonVariant, CdsSize } from '../core/types';

/**
 * Cadence button. Attribute-selector component applied to a native
 * `<button>` or `<a>` so semantics & accessibility come for free.
 *
 *   <button cds-button variant="primary" size="md">Save</button>
 *   <a cds-button variant="ghost" iconLeft="ph ph-plus">Add</a>
 *
 * Presentational only — emit your own (click) and handle it in the app.
 */
@Component({
  selector: 'button[cds-button], a[cds-button]',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cds-btn',
    '[class]': '"cds-btn--" + variant + " cds-btn--" + size',
    '[class.cds-btn--block]': 'block',
    '[class.cds-btn--loading]': 'loading',
    '[class.cds-btn--icon-only]': 'iconOnly',
    '[attr.aria-busy]': 'loading || null',
    '[attr.disabled]': '(disabled || loading) ? "" : null',
  },
})
export class CdsButtonComponent {
  @Input() variant: CdsButtonVariant = 'primary';
  @Input() size: CdsSize = 'md';
  @Input() block = false;
  @Input() loading = false;
  @Input() disabled = false;
  /** Phosphor icon class, e.g. "ph ph-plus". Rendered before the label. */
  @Input() iconLeft?: string;
  /** Phosphor icon class rendered after the label. */
  @Input() iconRight?: string;
  /** Icon-only button (square, centers the icon). */
  @Input() iconOnly = false;
}
