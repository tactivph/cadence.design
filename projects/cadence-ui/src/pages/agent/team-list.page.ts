import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsButtonComponent,
  CdsUserChipComponent, CdsNotifBellComponent, CdsEmptyStateComponent,
  CdsInputGroupComponent, CdsInputDirective,
} from '../../public-api';

/**
 * MOCK page — Agent · Team (`/agent/team`, `SellersComponent`).
 *
 * SOURCE-FIRST port of PDO `sellers.component.html`. This is a TOP-LEVEL agent
 * page: the captured reference (selector `app-root`) shows the top-nav shell in
 * frame. The agent nav (navigation.service `getNavigationRoutes('agent')`) has
 * seven items — Dashboard · Leads · Clients · Sellers · Calendar · Calculator ·
 * Site Map — and `/agent/team` activates the "Sellers" item (its label is
 * `teamLabel()` = "Sellers" for a Broker). The shell is copied from the
 * clients-list sibling with the "Sellers" item added and made active.
 *
 * The captured reference is the LOADED EMPTY state: the template's
 * `@else if (!isLoading && !agentsList.length)` branch — i.e. a Broker with no
 * sellers yet. That branch renders:
 *   section.agents
 *     ├ .agents-heading (space-between)
 *     │   ├ h1.container__label "Sellers profile" (pageTitle for a Broker)
 *     │   └ .agents-heading__tabs → funnel filter · Search · "Invite seller"
 *     └ .table-container > .table-empty-state
 *         img(users.svg) · h4 "No seller yet" · p(subtitle) ·
 *         btn-primary "Invite seller"  (inviteButtonLabel for a Broker)
 *
 * Presentational only (no data loading / filtering / invite behaviour).
 *
 * COMPONENT GAPS (approximated with the closest Cadence primitive):
 *   - the funnel filter button is a PDO ngbDropdown trigger; there is no cds
 *     dropdown component, so it renders as a static `.cds-icon-btn` (same as
 *     the leads/clients siblings).
 */
@Component({
  selector: 'cds-page-agent-team-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsButtonComponent,
    CdsUserChipComponent, CdsNotifBellComponent, CdsEmptyStateComponent,
    CdsInputGroupComponent, CdsInputDirective,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item>Dashboard</a>
      <a cds-nav-item>Leads</a>
      <a cds-nav-item>Clients</a>
      <a cds-nav-item [active]="true">Sellers</a>
      <a cds-nav-item>Calendar</a>
      <a cds-nav-item>Calculator</a>
      <a cds-nav-item>Site Map</a>
      <div cds-topnav-actions class="hdr-actions">
        <button class="cds-icon-btn" aria-label="Help"><i class="ph-bold ph-question"></i></button>
        <cds-notif-bell [count]="19"></cds-notif-bell>
        <cds-user-chip name="Jude Calder" role="Agent" [src]="placeholder"></cds-user-chip>
      </div>
    </cds-top-nav>

    <main class="cds-container">
      <section class="agents">
        <!-- .agents-heading: title left, filter + search + invite right -->
        <header class="agents-heading">
          <div>
            <h1 class="agents-heading__title">Sellers profile</h1>
          </div>
          <div class="agents-heading__tabs">
            <button class="cds-icon-btn" aria-label="Filters"><i class="ph-bold ph-funnel"></i></button>
            <cds-input-group class="agents-heading__search">
              <i cds-prefix class="ph ph-magnifying-glass" aria-hidden="true"></i>
              <input cdsInput type="search" placeholder="Search" />
            </cds-input-group>
            <button cds-button variant="primary" iconLeft="ph ph-plus">Invite seller</button>
          </div>
        </header>

        <!-- Roster is empty for this Broker -->
        <div class="table-container">
          <cds-empty-state
            icon="ph ph-users"
            title="No seller yet"
            message="Start building your team and streamline your workflow. Add seller to manage your leads effectively.">
            <button cds-button variant="primary" iconLeft="ph ph-plus">Invite seller</button>
          </cds-empty-state>
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface); min-height: 100vh; }
    .brand { font-family: var(--cds-font-family-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; }
    .brand__one { color: var(--cds-warning-400); }
    .brand__pdo { color: var(--cds-color-primary); }
    .hdr-actions { display: flex; align-items: center; gap: var(--cds-space-16); }

    /* .agents */
    .agents { display: flex; flex-direction: column; gap: var(--cds-space-24); }

    /* .agents-heading — title left, tools right (single row, space-between) */
    .agents-heading { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: var(--cds-space-16); }
    /* h1.container__label — shared PDO heading: 22/26, Inter Medium 500 */
    .agents-heading__title { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 22px; line-height: 26px; letter-spacing: -0.3px; color: var(--cds-text-primary); }

    /* .agents-heading__tabs — funnel + search + invite */
    .agents-heading__tabs { display: flex; align-items: center; gap: var(--cds-space-16); }
    /* Search field box — PDO .input { padding: 11px 16px } + .input-with-icon__left
       { padding-left: 40px } for the magnifier. Page-local so the shared
       cds-input-group default padding is not regressed. */
    .agents-heading__search { width: 224px; padding: var(--cds-space-11) var(--cds-space-16) var(--cds-space-11) var(--cds-space-40); }

    /* .table-container.my-auto — empty state fills the remaining height, centered */
    .table-container { display: flex; align-items: center; justify-content: center; min-height: 460px; }

    /* "Invite seller" CTA — PDO .btn.btn-primary (heading .btn-md, empty-state
       .btn-sm) renders 12px vertical padding + 16px line-height, taller than the
       Cadence md default (8px pad / 21px line-height). Scoped page-locally so the
       shared cds-button metrics (used by passing pages) are untouched — same fix
       already applied on lead-create footer + leads-list heading buttons.
       Source: pdo/web/src/styles/components/_buttons.scss (.btn-md / $line-height-label-16). */
    :host ::ng-deep button[cds-button].cds-btn--primary {
      padding-top: var(--cds-space-12); padding-bottom: var(--cds-space-12);
      line-height: var(--cds-line-height-sm);
    }

    /* Empty-state title — PDO .table-empty-state .labels h4 uses $F1-SemiBold (the
       TRUE "Inter SemiBold" face), not the Medium face the shared heading-h4 mixin
       resolves to. Page-scoped so other pages' empty-state titles (Medium/Regular)
       are untouched. Source: pdo/web/src/styles/components/_tables.scss. */
    .table-container ::ng-deep .cds-empty__title {
      font-family: var(--cds-font-family-semibold-face);
    }
  `],
})
export class AgentTeamListPage {
  /** Neutral avatar placeholder (data URI so the user-chip carries a real <img>). */
  placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12" fill="rgb(207,212,220)"/></svg>'
  );
}
