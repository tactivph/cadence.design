import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** A pill nav link for <cds-top-nav>. Put routerLink/(click) on it in the app. */
@Component({
  selector: 'a[cds-nav-item], button[cds-nav-item], div[cds-nav-item]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>@if (hasCaret) { <i class="ph-bold ph-caret-down cds-nav-item__caret" aria-hidden="true"></i> }`,
  styleUrl: './nav-item.component.scss',
  host: { class: 'cds-nav-item', '[class.cds-nav-item--active]': 'active', '[class.cds-nav-item--caret]': 'hasCaret' },
})
export class CdsNavItemComponent {
  @Input() active = false;
  /** Shows a caret (for items that open a dropdown). */
  @Input() hasCaret = false;
}
