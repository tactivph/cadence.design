import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** A menu item for <cds-dropdown>. Put your handler on (click) in the app. */
@Component({
  selector: 'button[cds-menu-item], a[cds-menu-item]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (icon) { <i class="cds-menu-item__icon {{ icon }}" aria-hidden="true"></i> }
    <span class="cds-menu-item__label"><ng-content></ng-content></span>
  `,
  styleUrl: './menu-item.component.scss',
  host: { class: 'cds-menu-item', role: 'menuitem', '[class.cds-menu-item--danger]': 'danger' },
})
export class CdsMenuItemComponent {
  @Input() icon?: string;
  @Input() danger = false;
}
