import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Chrome for a list/table surface: optional toolbar slot, the projected
 * `<table cdsTable>`, loading & empty states, and a footer (pagination) slot.
 * Presentational — the app owns rows, loading flag and paging.
 *
 *   <cds-data-table [loading]="loading" [empty]="rows.length === 0"
 *        emptyTitle="No clients yet" emptyIcon="ph ph-users">
 *     <div cds-data-table-toolbar><cds-filter-bar>…</cds-filter-bar></div>
 *     <table cdsTable>…</table>
 *     <div cds-data-table-footer><cds-pagination …></cds-pagination></div>
 *   </cds-data-table>
 */
@Component({
  selector: 'cds-data-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cds-data-table__toolbar"><ng-content select="[cds-data-table-toolbar]"></ng-content></div>
    <div class="cds-data-table__body">
      @if (loading) {
        <div class="cds-data-table__state">
          <span class="cds-data-table__spinner"></span>
          <p class="cds-data-table__state-title">Loading…</p>
        </div>
      } @else if (empty) {
        <div class="cds-data-table__state">
          <span class="cds-data-table__empty-icon"><i class="{{ emptyIcon }}" aria-hidden="true"></i></span>
          <p class="cds-data-table__state-title">{{ emptyTitle }}</p>
          @if (emptyMessage) { <p class="cds-data-table__state-msg">{{ emptyMessage }}</p> }
        </div>
      } @else {
        <ng-content></ng-content>
      }
    </div>
    <div class="cds-data-table__footer"><ng-content select="[cds-data-table-footer]"></ng-content></div>
  `,
  styleUrl: './data-table.component.scss',
  host: { class: 'cds-data-table' },
})
export class CdsDataTableComponent {
  @Input() loading = false;
  @Input() empty = false;
  @Input() emptyTitle = 'Nothing here yet';
  @Input() emptyMessage?: string;
  @Input() emptyIcon = 'ph ph-tray';
}
