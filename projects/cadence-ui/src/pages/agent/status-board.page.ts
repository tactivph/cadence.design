import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsButtonComponent, CdsInputGroupComponent,
  CdsInputDirective, CdsAvatarComponent, CdsTabsComponent, CdsTabComponent,
  CdsKanbanColumnComponent, CdsKanbanCardComponent, CdsPipelineSwitcherComponent,
  CdsLeadTemperatureComponent, CdsPipelineItem, CdsTemperature,
} from '../../public-api';

/** One lead card inside a kanban column. */
interface Lead {
  name: string;
  phone: string;
  property: string;
  price: string;
  temp: CdsTemperature;
  days: number;
}
/** One kanban stage column: PDO's `pipelineColumns` entry + its summary. */
interface Column {
  title: string;
  total: string;
  count: number;
  leads: Lead[];
}

/**
 * MOCK page — Agent · Status board (`/agent/dashboard/status-board`).
 *
 * SOURCE-FIRST port of PDO `StatusBoardComponent`
 * (pages/agent/dashboard/_components/status-board), rendered inside the parent
 * `DashboardComponent` shell (top nav + "Dashboard" title + tabs), which the
 * captured reference shows in frame.
 *
 * Structure mirrors status-board.component.html 1:1:
 *   kanban-container
 *     ├ leads-heading  → "Client Status" + Filters button + Search
 *     ├ kanban-segments-row → pipeline switcher + auto-tag hint
 *     └ kanban-column-container → one cds-kanban-column per `pipelineColumns`
 *
 * Presentational only (no data loading / drag-scroll / filtering behaviour).
 */
@Component({
  selector: 'cds-page-agent-status-board',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent, CdsButtonComponent, CdsInputGroupComponent,
    CdsInputDirective, CdsAvatarComponent, CdsTabsComponent, CdsTabComponent,
    CdsKanbanColumnComponent, CdsKanbanCardComponent, CdsPipelineSwitcherComponent,
    CdsLeadTemperatureComponent,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item [active]="true" [hasCaret]="true">Dashboard</a>
      <a cds-nav-item>Leads</a>
      <a cds-nav-item>Clients</a>
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
      <section class="dash">
        <h1 class="dash__title">Dashboard</h1>

        <cds-tabs class="dash__tabs" [activeIndex]="0">
          <cds-tab label="Status board" icon="ph ph-kanban"></cds-tab>
          <cds-tab label="Analytics" icon="ph ph-presentation-chart"></cds-tab>
          <cds-tab label="Visit schedules" icon="ph ph-calendar-dots"></cds-tab>
        </cds-tabs>

        <!-- kanban-container -->
        <div class="kanban">
          <!-- leads-heading : title + filter/search -->
          <div class="kanban__heading">
            <h2 class="kanban__title">Client Status</h2>
            <div class="kanban__tools">
              <button cds-button variant="secondary" iconLeft="ph ph-funnel">Filters</button>
              <cds-input-group>
                <i cds-prefix class="ph ph-magnifying-glass" aria-hidden="true"></i>
                <input cdsInput type="search" placeholder="Search" />
              </cds-input-group>
            </div>
          </div>

          <!-- kanban-segments-row : pipeline switcher + auto-tag hint -->
          <div class="kanban__segments">
            <cds-pipeline-switcher [items]="pipelines" [activeIndex]="0"></cds-pipeline-switcher>
            <p class="kanban__hint">
              <i class="ph ph-warning-circle" aria-hidden="true"></i>
              <span>Statuses are tagged automatically as a lead progresses. No manual moving.</span>
            </p>
          </div>

          <!-- kanban-column-container : one column per visible stage -->
          <div class="kanban__columns">
            @for (col of columns; track col.title) {
              <cds-kanban-column [title]="col.title" [count]="col.count" [total]="col.total">
                @if (col.leads.length) {
                  @for (l of col.leads; track $index) {
                    <cds-kanban-card>
                      <div class="lc__head">
                        <cds-avatar [name]="l.name" size="sm"></cds-avatar>
                        <div class="lc__ident">
                          <span class="lc__name">{{ l.name }}</span>
                          <span class="lc__phone">{{ l.phone }}</span>
                        </div>
                      </div>
                      <hr class="lc__divider" />
                      <p class="lc__property">{{ l.property }}</p>
                      <div class="lc__price-row">
                        <span class="lc__price">{{ l.price }}</span>
                        <span class="lc__price-label">UNIT PRICE</span>
                      </div>
                      <div class="lc__foot">
                        <cds-lead-temperature [level]="l.temp" [info]="true"></cds-lead-temperature>
                        <span class="lc__days">{{ l.days }} days in stage</span>
                      </div>
                    </cds-kanban-card>
                  }
                } @else {
                  <p class="lc__empty">Cards land here as leads move through this stage.</p>
                }
              </cds-kanban-column>
            }
          </div>
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

    .dash { display: flex; flex-direction: column; gap: var(--cds-space-24); }
    .dash__title { margin: 0; width: fit-content; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 22px; line-height: 26px; letter-spacing: -0.3px; color: var(--cds-text-primary); }

    .kanban { display: flex; flex-direction: column; gap: var(--cds-space-20); }
    .kanban__heading { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-16); }
    .kanban__title { margin: 0; font-weight: 500; font-size: 20px; line-height: 24px; color: var(--cds-text-primary); }
    .kanban__tools { display: flex; align-items: center; gap: var(--cds-space-12); }

    .kanban__segments { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-16); flex-wrap: wrap; }
    .kanban__hint { display: inline-flex; align-items: center; gap: var(--cds-space-8); margin: 0; font-size: .8125rem; color: var(--cds-text-tertiary); }

    .kanban__columns { display: flex; gap: var(--cds-space-16); overflow-x: auto; padding-bottom: var(--cds-space-8); align-items: flex-start; }

    .lc__head { display: flex; align-items: center; gap: var(--cds-space-8); }
    .lc__ident { display: flex; flex-direction: column; line-height: 1.2; min-width: 0; }
    .lc__name { font-weight: 600; color: var(--cds-text-primary); font-size: var(--cds-font-size-md); line-height: var(--cds-line-height-md); }
    .lc__phone { font-size: var(--cds-font-size-sm); color: var(--cds-text-tertiary); }
    .lc__divider { border: 0; border-top: 1px solid var(--cds-border-subtle, #eaecf0); margin: var(--cds-space-12) 0; }
    .lc__property { font-size: var(--cds-font-size-md); color: var(--cds-text-primary); margin: 0; }
    .lc__price-row { display: flex; align-items: baseline; justify-content: space-between; margin-top: var(--cds-space-8); }
    .lc__price { font-weight: 600; color: var(--cds-text-secondary); font-size: .9375rem; }
    .lc__price-label { font-size: .6875rem; font-weight: 500; letter-spacing: .04em; color: var(--cds-text-tertiary); }
    .lc__foot { display: flex; align-items: center; justify-content: space-between; margin-top: var(--cds-space-12); }
    .lc__days { font-size: .8125rem; color: var(--cds-text-tertiary); }
    .lc__empty { font-size: .8125rem; color: var(--cds-text-tertiary); text-align: center; margin: var(--cds-space-24) auto; max-width: 180px; }
  `],
})
export class AgentStatusBoardPage {
  /** Neutral avatar placeholder (data URI so the chip carries a real <img>). */
  placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12" fill="rgb(207,212,220)"/></svg>'
  );

  /** kanban-segments — "Leads Pipeline" (active) vs "Requirements Pipeline". */
  pipelines: CdsPipelineItem[] = [
    { icon: 'ph-fill ph-funnel', title: 'Leads Pipeline', subtitle: 'Lead → Reservation', count: 7 },
    { icon: 'ph-fill ph-clipboard-text', title: 'Requirements Pipeline', subtitle: 'Pre-reservation → Turnover', count: 0 },
  ];

  /** `pipelineColumns` from StatusBoardComponent — the Leads Pipeline stages. */
  columns: Column[] = [
    { title: 'New Leads', total: '₱0', count: 4, leads: [
      { name: 'Sasha Ashby', phone: '+63 900-000-0027', property: 'Emerald Heights Residences', price: '—', temp: 'hot',  days: 118 },
      { name: 'Sasha Ashby', phone: '+63 900-000-0028', property: 'Townscapes Malvar',          price: '—', temp: 'warm', days: 119 },
      { name: 'Sasha Ashby', phone: '+63 900-000-0031', property: 'No target unit yet',          price: '—', temp: 'warm', days: 119 },
      { name: 'Sasha Ashby', phone: '+63 900-000-0031', property: 'No target unit yet',          price: '—', temp: 'warm', days: 119 },
    ]},
    { title: 'Engaged and Qualified Prospect', total: '₱0', count: 0, leads: [] },
    { title: 'Site Visit Scheduled', total: '₱0', count: 2, leads: [
      { name: 'Luca Ashby', phone: '+63 900-000-0017', property: 'Emerald Heights Residences', price: '—', temp: 'warm', days: 118 },
      { name: 'Asr Asr', phone: '+63 900-000-0019', property: 'Golden Acres',                price: '—', temp: 'warm', days: 167 },
    ]},
    { title: 'Site Visit Completed', total: '₱0', count: 1, leads: [
      { name: 'Sasha Ashby', phone: '+63 900-000-0030', property: 'Emerald Heights Residences', price: '—', temp: 'hot', days: 110 },
    ]},
    { title: 'Unit & Computation Finalized', total: '₱0', count: 0, leads: [] },
    { title: 'Reserved', total: '₱0', count: 0, leads: [] },
    { title: 'Dropped', total: '₱0', count: 0, leads: [] },
  ];
}
