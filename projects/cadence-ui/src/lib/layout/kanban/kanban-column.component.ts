import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * A pipeline column (PDO clients-pipeline / agent status board). Presentational —
 * project `cds-kanban-card`s inside. Statuses are auto-tagged in the app; this is
 * layout only.
 *
 *   <cds-kanban-column title="New Leads" [count]="4" total="₱0">
 *     <cds-kanban-card>…</cds-kanban-card>
 *   </cds-kanban-column>
 */
@Component({
  selector: 'cds-kanban-column',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (total !== undefined) {
      <div class="cds-kanban-col__total">
        <span class="cds-kanban-col__peso">{{ total }}</span>
        @if (count !== undefined) { <span class="cds-kanban-col__count">{{ count }}</span> }
      </div>
    } @else {
      <div class="cds-kanban-col__header">
        <span class="cds-kanban-col__title">{{ title }}</span>
        @if (count !== undefined) { <span class="cds-kanban-col__count cds-kanban-col__count--muted">{{ count }}</span> }
      </div>
    }
    <div class="cds-kanban-col__body">
      @if (total !== undefined) { <span class="cds-kanban-col__title">{{ title }}</span> }
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './kanban-column.component.scss',
  host: { class: 'cds-kanban-col' },
})
export class CdsKanbanColumnComponent {
  @Input() title = '';
  @Input() count?: number;
  /** Optional money/summary chip shown above the header (e.g. "₱0"). */
  @Input() total?: string;
}
