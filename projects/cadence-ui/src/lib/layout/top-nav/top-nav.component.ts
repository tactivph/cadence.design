import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Application top navigation bar (PDO header). Presentational shell — project
 * the brand, the nav links (as `cds-nav-item`) and the right-side actions
 * (notifications, profile). Routing & active state come from the app.
 *
 *   <cds-top-nav>
 *     <img cds-topnav-brand src="logo.svg" alt="Cadence" />
 *     <a cds-nav-item [active]="true">Dashboard</a>
 *     <a cds-nav-item>Leads</a>
 *     <div cds-topnav-actions>…bell, avatar…</div>
 *   </cds-top-nav>
 */
@Component({
  selector: 'cds-top-nav',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="cds-topnav">
      <div class="cds-topnav__brand"><ng-content select="[cds-topnav-brand]"></ng-content></div>
      <nav class="cds-topnav__nav"><ng-content></ng-content></nav>
      <div class="cds-topnav__actions"><ng-content select="[cds-topnav-actions]"></ng-content></div>
    </header>
  `,
  styleUrl: './top-nav.component.scss',
  host: { class: 'cds-topnav-host' },
})
export class CdsTopNavComponent {}
