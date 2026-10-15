import { Directive, Input } from '@angular/core';

/**
 * Styles a native <table> as a Cadence table. Keeps the table semantics and
 * lets the app own the rows/data.
 *   <table cdsTable [hover]="true">
 *     <thead><tr><th>Lead</th><th>Status</th></tr></thead>
 *     <tbody>…</tbody>
 *   </table>
 * Styles live in the global theme (styles/components/_tables.scss) so tables
 * stay centralized.
 */
@Directive({
  selector: 'table[cdsTable]',
  standalone: true,
  host: {
    class: 'cds-table',
    '[class.cds-table--hover]': 'hover',
    '[class.cds-table--striped]': 'striped',
    '[class.cds-table--bordered]': 'bordered',
    '[class.cds-table--compact]': 'compact',
  },
})
export class CdsTableDirective {
  @Input() hover = true;
  @Input() striped = false;
  @Input() bordered = false;
  @Input() compact = false;
}
