import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';

/**
 * Pagination control (PDO table pagination). Presentational — emits the page the
 * user wants; the app fetches that page.
 *
 *   <cds-pagination [page]="page" [pageCount]="totalPages" (pageChange)="load($event)" />
 */
@Component({
  selector: 'cds-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="cds-pagination" aria-label="Pagination">
      <button type="button" class="cds-pagination__btn" [disabled]="page <= 1"
              (click)="go(page - 1)" aria-label="Previous">
        <i class="ph ph-caret-left" aria-hidden="true"></i>
      </button>
      @for (p of pages(); track $index) {
        @if (p === '…') {
          <span class="cds-pagination__ellipsis">…</span>
        } @else {
          <button type="button" class="cds-pagination__btn"
                  [class.cds-pagination__btn--active]="p === page"
                  [attr.aria-current]="p === page ? 'page' : null" (click)="go(+p)">{{ p }}</button>
        }
      }
      <button type="button" class="cds-pagination__btn" [disabled]="page >= pageCount"
              (click)="go(page + 1)" aria-label="Next">
        <i class="ph ph-caret-right" aria-hidden="true"></i>
      </button>
    </nav>
  `,
  styleUrl: './pagination.component.scss',
})
export class CdsPaginationComponent {
  private _page = signal(1);
  private _count = signal(1);

  @Input() set page(v: number) { this._page.set(v); }
  get page() { return this._page(); }
  @Input() set pageCount(v: number) { this._count.set(v); }
  get pageCount() { return this._count(); }

  /** Pages shown on each side of the current one. */
  @Input() siblingCount = 1;

  @Output() pageChange = new EventEmitter<number>();

  pages = computed<(number | '…')[]>(() => {
    const total = this._count(), current = this._page(), sib = this.siblingCount;
    const range: (number | '…')[] = [];
    const left = Math.max(2, current - sib);
    const right = Math.min(total - 1, current + sib);
    range.push(1);
    if (left > 2) range.push('…');
    for (let i = left; i <= right; i++) range.push(i);
    if (right < total - 1) range.push('…');
    if (total > 1) range.push(total);
    return range;
  });

  go(p: number) {
    const target = Math.min(Math.max(1, p), this.pageCount);
    if (target !== this.page) this.pageChange.emit(target);
  }
}
