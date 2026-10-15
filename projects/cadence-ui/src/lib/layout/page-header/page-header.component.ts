import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Page header: optional breadcrumb slot, title + subtitle, and a right-aligned
 * actions slot. Presentational.
 *
 *   <cds-page-header title="Clients" subtitle="Every lead and client">
 *     <cds-breadcrumb cds-page-breadcrumb [items]="crumbs"></cds-breadcrumb>
 *     <div cds-page-actions><button cds-button>Invite</button></div>
 *   </cds-page-header>
 */
@Component({
  selector: 'cds-page-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cds-page-header__crumb"><ng-content select="[cds-page-breadcrumb]"></ng-content></div>
    <div class="cds-page-header__row">
      <div class="cds-page-header__titles">
        <h1 class="cds-page-header__title">{{ title }}</h1>
        @if (subtitle) { <p class="cds-page-header__subtitle">{{ subtitle }}</p> }
      </div>
      <div class="cds-page-header__actions"><ng-content select="[cds-page-actions]"></ng-content></div>
    </div>
    <ng-content></ng-content>
  `,
  styleUrl: './page-header.component.scss',
  host: { class: 'cds-page-header' },
})
export class CdsPageHeaderComponent {
  @Input() title = '';
  @Input() subtitle?: string;
}
