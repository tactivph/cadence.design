import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CdsStatusVariant } from '../core/types';

/**
 * Inline alert / banner (PDO "CAS expired · Action needed", info banners…).
 * Presentational — emit (dismissed) and remove it in the app.
 */
@Component({
  selector: 'cds-alert',
  standalone: true,
  template: `
    <i class="cds-alert__icon {{ icon || defaultIcon }}" aria-hidden="true"></i>
    <div class="cds-alert__content">
      @if (title) { <p class="cds-alert__title">{{ title }}</p> }
      <div class="cds-alert__body"><ng-content></ng-content></div>
    </div>
    <div class="cds-alert__actions"><ng-content select="[cds-alert-actions]"></ng-content></div>
    @if (dismissible) {
      <button type="button" class="cds-alert__close" aria-label="Dismiss" (click)="dismissed.emit()">
        <i class="ph ph-x" aria-hidden="true"></i>
      </button>
    }
  `,
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cds-alert', role: 'alert', '[class]': '"cds-alert--" + variant' },
})
export class CdsAlertComponent {
  @Input() variant: CdsStatusVariant = 'info';
  @Input() title?: string;
  @Input() icon?: string;
  @Input() dismissible = false;
  @Output() dismissed = new EventEmitter<void>();

  get defaultIcon(): string {
    switch (this.variant) {
      case 'success': return 'ph ph-check-circle';
      case 'warning': return 'ph ph-warning';
      case 'danger':  return 'ph ph-warning-circle';
      default:        return 'ph ph-info';
    }
  }
}
