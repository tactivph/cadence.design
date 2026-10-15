import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { CdsPaginationComponent } from '../pagination/pagination.component';

/**
 * Table footer — "Showing X of Y items" + page controls. Faithful to PDO
 * `pdo-table-pagination`. Presentational: emits the requested page.
 *
 *   <cds-table-pagination itemName="client" [page]="1" [pageSize]="10"
 *       [collectionSize]="128" (pageChange)="load($event)" />
 */
@Component({
  selector: 'cds-table-pagination',
  standalone: true,
  imports: [CdsPaginationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cds-table-pagination">
      <p class="cds-table-pagination__info">
        Showing {{ shownTo() }} of {{ collectionSize }} {{ collectionSize === 1 ? itemName : itemName + 's' }}
      </p>
      <cds-pagination [page]="page" [pageCount]="pageCount()" (pageChange)="pageChange.emit($event)"></cds-pagination>
    </div>
  `,
  styleUrl: './table-pagination.component.scss',
})
export class CdsTablePaginationComponent {
  private _page = signal(1);
  @Input() set page(v: number) { this._page.set(v); }
  get page() { return this._page(); }

  @Input() pageSize = 10;
  @Input() collectionSize = 0;
  @Input() itemName = 'item';
  @Output() pageChange = new EventEmitter<number>();

  pageCount = computed(() => Math.max(1, Math.ceil(this.collectionSize / this.pageSize)));
  shownTo = computed(() => Math.min(this._page() * this.pageSize, this.collectionSize));
}
