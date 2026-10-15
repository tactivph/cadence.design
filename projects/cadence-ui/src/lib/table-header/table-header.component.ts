import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface CdsTableColumn {
  label: string;
  /** Sort field key; omit for non-sortable columns. */
  field?: string;
  /** Force-disable sorting even with a field. */
  sortable?: boolean;
}

/**
 * Sortable table header cells. Faithful to PDO `pdo-table-header`. Render inside
 * a `<tr>`. Presentational: emits the active sort; the app re-queries.
 *
 *   <tr><cds-table-header [columns]="cols" [sort]="sort" (sortChange)="s=$event"/></tr>
 */
@Component({
  selector: 'cds-table-header, [cds-table-header]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cds-table-header-host', style: 'display: contents' },
  template: `
    @for (col of columns; track col.label) {
      <th (click)="col.field && col.sortable !== false ? toggle(col.field) : null">
        <div class="cds-table-header" [class.cds-table-header--center]="center">
          {{ col.label }}
          @if (col.field && col.sortable !== false) {
            <span class="cds-table-header__sort">
              <i class="ph-bold ph-caret-up" [class.cds-active]="dir(col.field) === 'asc'"></i>
              <i class="ph-bold ph-caret-down" [class.cds-active]="dir(col.field) === 'desc'"></i>
            </span>
          }
        </div>
      </th>
    }
  `,
  styleUrl: './table-header.component.scss',
})
export class CdsTableHeaderComponent {
  @Input() columns: CdsTableColumn[] = [];
  @Input() center = false;
  /** Active sort, e.g. "name" or "-name" (desc). */
  @Input() sort = '';
  @Output() sortChange = new EventEmitter<string>();

  dir(field: string): 'asc' | 'desc' | null {
    if (this.sort === field) return 'asc';
    if (this.sort === `-${field}`) return 'desc';
    return null;
  }
  toggle(field: string) {
    const next = this.sort === field ? `-${field}` : this.sort === `-${field}` ? '' : field;
    this.sort = next;
    this.sortChange.emit(next);
  }
}
