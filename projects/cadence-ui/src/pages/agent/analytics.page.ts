import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsButtonComponent, CdsDropdownComponent,
  CdsTabsComponent, CdsTabComponent, CdsCardComponent, CdsEmptyStateComponent,
} from '../../public-api';

/** One funnel bar (PDO `FunnelStage` + its taper color). */
interface FunnelStage { label: string; count: number; pct: string; color: string; width: number; dark?: boolean; }
/** One horizontal bar (client distribution / top-selling). */
interface BarRow { label: string; value: string; pct: number; }
/** One legend chip. */
interface LegendItem { label: string; color: string; shape: 'dot' | 'square'; }

/**
 * MOCK page — Agent · Dashboard › Analytics (`/agent/dashboard/analytics`).
 *
 * SOURCE-FIRST port of PDO `AnalyticsComponent`
 * (pages/agent/dashboard/_components/analytics), rendered inside the parent
 * `DashboardComponent` shell (top nav + "Dashboard" title + nav-tabs with
 * "Analytics" active), which the captured reference (selector `app-root`)
 * shows in frame — the shell is copied verbatim from the two already-ported
 * sibling tabs (status-board, visit-schedules); only the active tab + body
 * differ.
 *
 * Structure mirrors analytics.component.html 1:1:
 *   kanban-container
 *     ├ leads-heading
 *     │   ├ leads-heading__header → "Analytics" + range datepicker
 *     │   └ leads-heading__tabs   → Filters + Generate report
 *     └ analytics-container (chart-container cards, in template order):
 *         1 pdo-leads-pipeline-funnel        (Leads Pipeline Funnel)
 *         2 pdo-requirements-pipeline-funnel (Buyer Requirements — empty)
 *         3 pdo-line-chart                   (Property reservations over time)
 *         4 pdo-bar-chart                    (Client distribution)
 *         5 pdo-bar-chart                    (Top-selling properties over time)
 *         6 pdo-combo-mixed-chart            (Sales revenue and units sold overview)
 *         7 pdo-combo-mixed-stacked          (Conversions over time)
 *
 * CHART / FUNNEL GAPS — none of PDO's ApexCharts wrappers (pdo-funnel-chart,
 * pdo-line-chart, pdo-bar-chart, pdo-combo-mixed-chart, pdo-combo-mixed-stacked)
 * have a Cadence equivalent, so each chart card is a cds-card carrying the real
 * chart-heading (title / subtitle / legend from the component + sub-component
 * TS) with the plot body approximated by minimal presentational markup (CSS
 * funnel bars, CSS/SVG bars and lines). Empty states reuse cds-empty-state.
 * Presentational only (no data loading / filtering / report generation).
 */
@Component({
  selector: 'cds-page-agent-analytics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent, CdsButtonComponent, CdsDropdownComponent,
    CdsTabsComponent, CdsTabComponent, CdsCardComponent, CdsEmptyStateComponent,
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

        <cds-tabs class="dash__tabs" [activeIndex]="1">
          <cds-tab label="Status board" icon="ph ph-kanban"></cds-tab>
          <cds-tab label="Analytics" icon="ph ph-presentation-chart"></cds-tab>
          <cds-tab label="Visit schedules" icon="ph ph-calendar-dots"></cds-tab>
        </cds-tabs>

        <!-- kanban-container -->
        <div class="an">
          <!-- leads-heading -->
          <div class="an__heading">
            <!-- leads-heading__header : title + range datepicker -->
            <div class="an__heading-left">
              <h1 class="an__title">Analytics</h1>
              <cds-dropdown>
                <button cds-dropdown-trigger cds-button variant="secondary" iconRight="ph ph-caret-down">
                  Last 285 days: Jan 1, 2026 - Oct 13, 2026
                </button>
              </cds-dropdown>
            </div>
            <!-- leads-heading__tabs : filters + generate report -->
            <div class="an__heading-right">
              <button cds-button variant="secondary" iconLeft="ph ph-funnel">Filters</button>
              <button cds-button variant="primary">Generate report</button>
            </div>
          </div>

          <!-- analytics-container -->
          <div class="an__grid">
            <!-- 1 · Leads Pipeline Funnel (pdo-leads-pipeline-funnel) -->
            <cds-card class="chart-card">
              <div class="chart-heading">
                <p class="chart-title">Leads Pipeline Funnel</p>
                <div class="chart-heading__meta">
                  <p class="chart-subtitle">From first contact to closed sale</p>
                </div>
              </div>
              <div class="funnel">
                @for (s of leadsFunnel; track s.label) {
                  <div class="funnel__bar" [style.width.%]="s.width"
                       [style.background]="s.color" [class.funnel__bar--dark]="!s.dark">
                    <span class="funnel__label">{{ s.label }}</span>
                    <span class="funnel__value">{{ s.count }} ({{ s.pct }})</span>
                  </div>
                }
              </div>
            </cds-card>

            <!-- 2 · Buyer Requirements Pipeline Funnel (pdo-requirements-pipeline-funnel) -->
            <cds-card class="chart-card">
              <div class="chart-heading">
                <p class="chart-title">Buyer Requirements Pipeline Funnel</p>
                <div class="chart-heading__meta">
                  <p class="chart-subtitle">From reservation to homeowner</p>
                </div>
              </div>
              <cds-empty-state
                icon="ph-fill ph-chart-bar"
                title=""
                message="No buyers in this period yet. Reserved buyers appear here as they move from reservation to homeowner.">
                <button cds-button variant="secondary" iconLeft="ph-bold ph-target">Enroll a lead</button>
              </cds-empty-state>
            </cds-card>

            <!-- 3 · Property reservations over time (pdo-line-chart) -->
            <cds-card class="chart-card">
              <div class="chart-heading">
                <p class="chart-title">Property reservations over time</p>
                <div class="chart-heading__meta">
                  <div class="chart-legend">
                    @for (l of reservationsLegend; track l.label) {
                      <span class="chart-legend__item">
                        <span class="chart-legend__marker chart-legend__marker--dot" [style.background]="l.color"></span>
                        {{ l.label }}
                      </span>
                    }
                  </div>
                </div>
              </div>
              <div class="chart-plot">
                <svg viewBox="0 0 320 180" preserveAspectRatio="none" class="chart-plot__svg" aria-hidden="true">
                  <polyline fill="none" stroke="#16B364" stroke-width="2"
                    points="0,150 40,120 80,130 120,90 160,100 200,60 240,70 280,40 320,55"></polyline>
                  <polyline fill="none" stroke="#EAAA08" stroke-width="2"
                    points="0,165 40,150 80,155 120,130 160,140 200,110 240,120 280,95 320,105"></polyline>
                </svg>
              </div>
            </cds-card>

            <!-- 4 · Client distribution (pdo-bar-chart) -->
            <cds-card class="chart-card">
              <div class="chart-heading chart-heading--stacked">
                <p class="chart-title">Client distribution</p>
                <p class="chart-subtitle">Customer segmented by categories</p>
              </div>
              <div class="hbars">
                @for (b of distribution; track b.label) {
                  <div class="hbar">
                    <span class="hbar__label">{{ b.label }}</span>
                    <div class="hbar__track">
                      <div class="hbar__fill" [style.width.%]="b.pct" [style.background]="'#16B364'"></div>
                    </div>
                    <span class="hbar__value">{{ b.value }}</span>
                  </div>
                }
              </div>
            </cds-card>

            <!-- 5 · Top-selling properties over time (pdo-bar-chart) -->
            <cds-card class="chart-card">
              <div class="chart-heading chart-heading--stacked">
                <p class="chart-title">Top-selling properties over time</p>
                <p class="chart-subtitle">Ranked by units sold over time</p>
              </div>
              <div class="hbars">
                @for (b of topSelling; track b.label) {
                  <div class="hbar">
                    <span class="hbar__label">{{ b.label }}</span>
                    <div class="hbar__track">
                      <div class="hbar__fill" [style.width.%]="b.pct" [style.background]="'#FAC515'"></div>
                    </div>
                    <span class="hbar__value">{{ b.value }}</span>
                  </div>
                }
              </div>
            </cds-card>

            <!-- 6 · Sales revenue and units sold overview (pdo-combo-mixed-chart) -->
            <cds-card class="chart-card">
              <div class="chart-heading">
                <p class="chart-title">Sales revenue and units sold overview</p>
                <div class="chart-heading__meta">
                  <div class="chart-legend">
                    @for (l of salesLegend; track l.label) {
                      <span class="chart-legend__item">
                        <span class="chart-legend__marker"
                          [class.chart-legend__marker--square]="l.shape === 'square'"
                          [class.chart-legend__marker--dot]="l.shape === 'dot'"
                          [style.background]="l.color"></span>
                        {{ l.label }}
                      </span>
                    }
                  </div>
                </div>
              </div>
              <div class="combo">
                @for (v of salesColumns; track $index) {
                  <div class="combo__col" [style.height.%]="v"></div>
                }
                <svg viewBox="0 0 320 160" preserveAspectRatio="none" class="combo__line" aria-hidden="true">
                  <polyline fill="none" stroke="#EAAA08" stroke-width="2"
                    points="13,120 53,90 93,105 133,60 173,80 213,45 253,55 293,30"></polyline>
                </svg>
              </div>
            </cds-card>

            <!-- 7 · Conversions over time (pdo-combo-mixed-stacked) -->
            <cds-card class="chart-card chart-card--wide">
              <div class="chart-heading">
                <p class="chart-title">Conversions over time</p>
                <div class="chart-heading__meta">
                  <p class="chart-subtitle">Tracks the percentage of leads successfully converting into homeowners over time</p>
                  <div class="chart-legend">
                    @for (l of conversionLegend; track l.label) {
                      <span class="chart-legend__item">
                        <span class="chart-legend__marker"
                          [class.chart-legend__marker--square]="l.shape === 'square'"
                          [class.chart-legend__marker--circle]="l.shape === 'dot'"
                          [style.background]="l.color"></span>
                        {{ l.label }}
                      </span>
                    }
                  </div>
                </div>
              </div>
              <div class="combo combo--tall">
                @for (col of conversionColumns; track $index) {
                  <div class="combo__stack">
                    @for (seg of col; track $index) {
                      <div class="combo__seg" [style.height.%]="seg.h" [style.background]="seg.color"></div>
                    }
                  </div>
                }
                <svg viewBox="0 0 320 220" preserveAspectRatio="none" class="combo__line" aria-hidden="true">
                  <polyline fill="none" stroke="#667085" stroke-width="2"
                    points="26,170 66,150 106,130 146,110 186,95 226,75 266,60 306,45"></polyline>
                </svg>
              </div>
            </cds-card>
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
    /* Inter Medium token on the dashboard h1 (prior audit: was on base/Regular). */
    .dash__title { margin: 0; width: fit-content; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 22px; line-height: 26px; letter-spacing: -0.3px; color: var(--cds-text-primary); }

    /* kanban-container */
    .an { display: flex; flex-direction: column; gap: var(--cds-space-20); }

    /* leads-heading */
    .an__heading { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-16); flex-wrap: wrap; }
    .an__heading-left { display: flex; align-items: center; gap: var(--cds-space-12); }
    .an__title { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 20px; line-height: 24px; color: var(--cds-text-primary); }
    .an__heading-right { display: flex; align-items: center; gap: var(--cds-space-12); }

    /* analytics-container */
    .an__grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--cds-space-24); }
    .chart-card--wide { grid-column: 1 / -1; }

    /* chart-heading (mirrors PDO .chart-heading / .chart-title / .chart-subtitle / .chart-legend) */
    .chart-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--cds-space-12); margin-bottom: var(--cds-space-16); }
    .chart-heading--stacked { flex-direction: column; gap: var(--cds-space-4); }
    .chart-title { margin: 0; font-weight: 600; font-size: 1rem; color: var(--cds-text-primary); }
    .chart-subtitle { margin: 0; font-size: var(--cds-font-size-md); color: var(--cds-text-tertiary); }
    .chart-heading__meta { display: flex; flex-direction: column; align-items: flex-end; gap: var(--cds-space-8); }

    .chart-legend { display: flex; flex-wrap: wrap; gap: var(--cds-space-12); }
    .chart-legend__item { display: inline-flex; align-items: center; gap: var(--cds-space-6); font-size: .8125rem; color: var(--cds-text-secondary); }
    .chart-legend__marker { width: 8px; height: 8px; display: inline-block; }
    .chart-legend__marker--dot, .chart-legend__marker--circle { border-radius: 50%; }
    .chart-legend__marker--square { border-radius: 2px; }

    /* Funnel approximation (no cds funnel chart) — tapering colored bars. */
    .funnel { display: flex; flex-direction: column; align-items: center; gap: var(--cds-space-8); padding: var(--cds-space-8) 0; }
    .funnel__bar { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: var(--cds-space-16) var(--cds-space-12); text-align: center; border-radius: var(--cds-radius-xs, 4px); color: #fff; }
    .funnel__bar--dark { color: var(--cds-text-primary); }
    .funnel__label { font-weight: 600; font-size: .875rem; }
    .funnel__value { font-size: .8125rem; }

    /* Line / combo plot approximations. */
    .chart-plot { min-height: 200px; display: flex; align-items: stretch; }
    .chart-plot__svg { width: 100%; height: 200px; }

    .hbars { display: flex; flex-direction: column; gap: var(--cds-space-12); padding-top: var(--cds-space-8); }
    .hbar { display: grid; grid-template-columns: 140px 1fr auto; align-items: center; gap: var(--cds-space-12); }
    .hbar__label { font-size: .8125rem; color: var(--cds-text-secondary); }
    .hbar__track { background: var(--cds-surface-subtle, #f2f4f7); border-radius: var(--cds-radius-xs, 4px); height: 21px; overflow: hidden; }
    .hbar__fill { height: 100%; border-radius: var(--cds-radius-xs, 4px); }
    .hbar__value { font-size: .8125rem; font-weight: 600; color: var(--cds-text-primary); }

    .combo { position: relative; display: flex; align-items: flex-end; justify-content: space-around; gap: var(--cds-space-8); height: 200px; padding-top: var(--cds-space-8); }
    .combo--tall { height: 300px; }
    .combo__col { flex: 1 1 0; background: var(--cds-color-primary); border-radius: var(--cds-radius-xs, 4px) var(--cds-radius-xs, 4px) 0 0; min-height: 4px; }
    .combo__stack { flex: 1 1 0; display: flex; flex-direction: column-reverse; height: 100%; }
    .combo__seg { width: 100%; }
    .combo__line { position: absolute; inset: 0; width: 100%; height: 100%; }
  `],
})
export class AgentAnalyticsPage {
  /** Neutral avatar placeholder (data URI so the chip carries a real <img>). */
  placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12" fill="rgb(207,212,220)"/></svg>'
  );

  /** Leads funnel — `colors` + sample stages from LeadsPipelineFunnelComponent. */
  leadsFunnel: FunnelStage[] = [
    { label: 'New Leads',                      count: 13, pct: '100.0%', color: '#085D3A', width: 100 },
    { label: 'Engaged and Qualified Prospect', count: 9,  pct: '69.2%',  color: '#099250', width: 88 },
    { label: 'Site Visit Scheduled',           count: 9,  pct: '69.2%',  color: '#16B364', width: 76 },
    { label: 'Site Visit Completed',           count: 5,  pct: '38.5%',  color: '#3CCB7F', width: 64 },
    { label: 'Unit & Computation Finalized',   count: 0,  pct: '0.0%',   color: '#6CE9A6', width: 52, dark: true },
    { label: 'Reserved',                       count: 0,  pct: '0.0%',   color: '#AAF0C4', width: 44, dark: true },
  ];

  /** pdo-line-chart `PropertyReservations.series` names + colors. */
  reservationsLegend: LegendItem[] = [
    { label: 'Leads',       color: '#16B364', shape: 'dot' },
    { label: 'Reservation', color: '#EAAA08', shape: 'dot' },
  ];

  /** pdo-bar-chart (customerDistribution) — Homeowner / Client / Lead counts. */
  distribution: BarRow[] = [
    { label: 'Homeowner', value: '4',  pct: 20 },
    { label: 'Client',    value: '11', pct: 55 },
    { label: 'Lead',      value: '20', pct: 100 },
  ];

  /** pdo-bar-chart (topSellingProperties) — ranked units sold. */
  topSelling: BarRow[] = [
    { label: 'Emerald Heights Residences', value: '9', pct: 100 },
    { label: 'Townscapes Malvar',          value: '6', pct: 67 },
    { label: 'Westwood Height',            value: '4', pct: 44 },
    { label: 'Golden Acres',               value: '2', pct: 22 },
  ];

  /** pdo-combo-mixed-chart (salesOverviewSeries) legend. */
  salesLegend: LegendItem[] = [
    { label: 'Sales revenue', color: '#16B364', shape: 'square' },
    { label: 'Units sold',    color: '#EAAA08', shape: 'dot' },
  ];
  salesColumns = [40, 62, 48, 78, 55, 90, 70, 95];

  /** pdo-combo-mixed-stacked (conversionRate.series) legend + conversionColors. */
  conversionLegend: LegendItem[] = [
    { label: 'Lead',            color: '#D3F8DF', shape: 'dot' },
    { label: 'Endorsed',        color: '#AAF0C4', shape: 'dot' },
    { label: 'Reserved',        color: '#73E2A3', shape: 'dot' },
    { label: 'Seasoning',       color: '#3CCB7F', shape: 'dot' },
    { label: 'Takeout',         color: '#16B364', shape: 'dot' },
    { label: 'Homeowner',       color: '#EAAA08', shape: 'dot' },
    { label: 'Conversion Rate', color: '#667085', shape: 'square' },
  ];
  /** Stacked bar columns — each a set of segments (bottom → top) for a month. */
  conversionColumns: { h: number; color: string }[][] = [
    [ { h: 40, color: '#D3F8DF' }, { h: 20, color: '#AAF0C4' }, { h: 10, color: '#73E2A3' } ],
    [ { h: 45, color: '#D3F8DF' }, { h: 22, color: '#AAF0C4' }, { h: 12, color: '#73E2A3' }, { h: 6, color: '#3CCB7F' } ],
    [ { h: 50, color: '#D3F8DF' }, { h: 24, color: '#AAF0C4' }, { h: 14, color: '#73E2A3' }, { h: 8, color: '#3CCB7F' } ],
    [ { h: 48, color: '#D3F8DF' }, { h: 26, color: '#AAF0C4' }, { h: 16, color: '#73E2A3' }, { h: 10, color: '#16B364' } ],
    [ { h: 55, color: '#D3F8DF' }, { h: 28, color: '#AAF0C4' }, { h: 18, color: '#73E2A3' }, { h: 12, color: '#16B364' } ],
    [ { h: 60, color: '#D3F8DF' }, { h: 30, color: '#AAF0C4' }, { h: 20, color: '#73E2A3' }, { h: 14, color: '#EAAA08' } ],
    [ { h: 58, color: '#D3F8DF' }, { h: 32, color: '#AAF0C4' }, { h: 22, color: '#73E2A3' }, { h: 16, color: '#EAAA08' } ],
    [ { h: 65, color: '#D3F8DF' }, { h: 34, color: '#AAF0C4' }, { h: 24, color: '#73E2A3' }, { h: 18, color: '#EAAA08' } ],
  ];
}
