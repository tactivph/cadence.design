import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface CdsBreadcrumbItem {
  label: string;
  /** Optional href. Omit the last item's href (it's the current page). */
  href?: string;
  /** Optional payload passed back on (navigate). */
  data?: unknown;
}

/**
 * Breadcrumb trail. Presentational — pass items; handle `(navigate)` in the app
 * (e.g. router.navigate). The last item renders as the current page.
 *
 *   <cds-breadcrumb [items]="[{label:'Clients', href:'/clients'}, {label:'Evan Client'}]"
 *                   (navigate)="go($event)"></cds-breadcrumb>
 */
@Component({
  selector: 'cds-breadcrumb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="Breadcrumb">
      <ol class="cds-breadcrumb">
        @for (item of items; track $index; let last = $last) {
          <li class="cds-breadcrumb__item">
            @if (!last) {
              <a class="cds-breadcrumb__link" [attr.href]="item.href || null"
                 (click)="navigate.emit(item); $event.preventDefault()">{{ item.label }}</a>
              <i class="cds-breadcrumb__sep {{ separator }}" aria-hidden="true"></i>
            } @else {
              <span class="cds-breadcrumb__current" aria-current="page">{{ item.label }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styleUrl: './breadcrumb.component.scss',
  host: {
    class: 'cds-breadcrumb-host',
    '[class.cds-breadcrumb-host--md]': "size === 'md'",
  },
})
export class CdsBreadcrumbComponent {
  @Input() items: CdsBreadcrumbItem[] = [];
  @Input() separator = 'ph ph-caret-right';
  /**
   * Trail type scale. `'sm'` (default, 12/16) matches the detail pages; `'md'`
   * (14/21) matches the settings / form pages. Opt in with `size="md"`.
   */
  @Input() size: 'sm' | 'md' = 'sm';
  @Output() navigate = new EventEmitter<CdsBreadcrumbItem>();
}
