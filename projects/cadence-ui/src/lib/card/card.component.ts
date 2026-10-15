import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Surface container. Use projection slots for header/footer:
 *   <cds-card>
 *     <div cds-card-header>Title</div>
 *     body…
 *     <div cds-card-footer>actions</div>
 *   </cds-card>
 */
@Component({
  selector: 'cds-card',
  standalone: true,
  template: `
    <ng-content select="[cds-card-header]"></ng-content>
    <div class="cds-card__body"><ng-content></ng-content></div>
    <ng-content select="[cds-card-footer]"></ng-content>
  `,
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cds-card',
    '[class.cds-card--interactive]': 'interactive',
    '[class.cds-card--flush]': 'flush',
    '[attr.tabindex]': 'interactive ? 0 : null',
  },
})
export class CdsCardComponent {
  /** Adds hover/active affordance for clickable cards. */
  @Input() interactive = false;
  /** Removes body padding (e.g. when the card holds a table). */
  @Input() flush = false;
}
