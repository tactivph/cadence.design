import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

export type CdsModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Presentational modal dialog. The app owns the `open` state and reacts to
 * `(closed)` — no routing or data here.
 *
 *   <cds-modal [open]="show" title="Cancel reservation" (closed)="show=false">
 *     Are you sure?
 *     <div cds-modal-footer>
 *       <button cds-button variant="secondary" (click)="show=false">Keep</button>
 *       <button cds-button variant="danger" (click)="confirm()">Cancel reservation</button>
 *     </div>
 *   </cds-modal>
 */
@Component({
  selector: 'cds-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open) {
      <div class="cds-modal__backdrop" (click)="onBackdrop()"></div>
      <div class="cds-modal__dialog cds-modal__dialog--{{ size }}" role="dialog" aria-modal="true"
           [attr.aria-label]="title || null">
        <header class="cds-modal__header">
          <h2 class="cds-modal__title">{{ title }}</h2>
          @if (dismissible) {
            <button type="button" class="cds-modal__close" aria-label="Close" (click)="closed.emit()">
              <i class="ph ph-x" aria-hidden="true"></i>
            </button>
          }
        </header>
        <div class="cds-modal__body"><ng-content></ng-content></div>
        <footer class="cds-modal__footer"><ng-content select="[cds-modal-footer]"></ng-content></footer>
      </div>
    }
  `,
  styleUrl: './modal.component.scss',
  host: { '[class.cds-modal--open]': 'open' },
})
export class CdsModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() size: CdsModalSize = 'md';
  @Input() dismissible = true;
  /** Close when the backdrop is clicked. */
  @Input() closeOnBackdrop = true;
  @Output() closed = new EventEmitter<void>();

  onBackdrop() { if (this.closeOnBackdrop && this.dismissible) this.closed.emit(); }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.open && this.dismissible) this.closed.emit(); }
}
