import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Header notification bell with unread-count badge. Faithful to PDO
 * `.notif-icon` + `.badge-notif-count`. Presentational — the app opens the
 * panel on (click) and supplies the count.
 *
 *   <cds-notif-bell [count]="19"></cds-notif-bell>
 */
@Component({
  selector: 'cds-notif-bell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="cds-icon-btn" type="button" aria-label="Notifications">
      <i class="ph-bold ph-bell" aria-hidden="true"></i>
    </button>
    @if (count > 0) {
      <span class="cds-notif-bell__count">{{ count > max ? max + '+' : count }}</span>
    }
  `,
  styleUrl: './notif-bell.component.scss',
  host: { class: 'cds-notif-bell' },
})
export class CdsNotifBellComponent {
  @Input() count = 0;
  /** Cap shown before "+". */
  @Input() max = 99;
}
