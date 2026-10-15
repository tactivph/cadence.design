import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** A card inside a <cds-kanban-column>. Project your own content. */
@Component({
  selector: 'cds-kanban-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  styleUrl: './kanban-card.component.scss',
  host: { class: 'cds-kanban-card', '[class.cds-kanban-card--interactive]': 'interactive', '[attr.tabindex]': 'interactive ? 0 : null' },
})
export class CdsKanbanCardComponent {
  @Input() interactive = true;
}
