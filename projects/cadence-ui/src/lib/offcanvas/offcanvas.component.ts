import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

export type CdsOffcanvasPosition = 'start' | 'end' | 'top' | 'bottom';

/**
 * Slide-in panel (PDO off-canvas: upload-requirement, filters…). Presentational —
 * the app owns `open`.
 *
 *   <cds-offcanvas [open]="show" position="end" title="Filters" (closed)="show=false">
 *     …filter form…
 *     <div cds-offcanvas-footer><button cds-button (click)="apply()">Apply filter</button></div>
 *   </cds-offcanvas>
 */
@Component({
  selector: 'cds-offcanvas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open) {
      @if (backdrop) { <div class="cds-offcanvas__backdrop" (click)="onBackdrop()"></div> }
      <aside class="cds-offcanvas__panel cds-offcanvas__panel--{{ position }}"
             role="dialog" aria-modal="true" [attr.aria-label]="title || null">
        <header class="cds-offcanvas__header">
          <h2 class="cds-offcanvas__title">{{ title }}</h2>
          @if (dismissible) {
            <button type="button" class="cds-offcanvas__close" aria-label="Close" (click)="closed.emit()">
              <i class="ph ph-x" aria-hidden="true"></i>
            </button>
          }
        </header>
        <div class="cds-offcanvas__body"><ng-content></ng-content></div>
        <footer class="cds-offcanvas__footer"><ng-content select="[cds-offcanvas-footer]"></ng-content></footer>
      </aside>
    }
  `,
  styleUrl: './offcanvas.component.scss',
  host: { '[class.cds-offcanvas--open]': 'open' },
})
export class CdsOffcanvasComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() position: CdsOffcanvasPosition = 'end';
  @Input() dismissible = true;
  @Input() backdrop = true;
  @Input() closeOnBackdrop = true;
  @Output() closed = new EventEmitter<void>();

  onBackdrop() { if (this.closeOnBackdrop && this.dismissible) this.closed.emit(); }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.open && this.dismissible) this.closed.emit(); }
}
