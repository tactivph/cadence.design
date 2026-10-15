import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsButtonComponent, CdsDropdownComponent,
  CdsCardComponent, CdsStatTileComponent,
} from '../../public-api';

/** One tapered treemap cell (approximates a pdo-basic-tree-map tile). */
interface TreeCell { label: string; flex: number; dark: boolean; }
/** One horizontal broker bar (approximates a pdo-bar-chart row). */
interface BrokerBar { name: string; value: string; pct: number; }
/** A grouped column trio for the vertical bar chart. */
interface PerfCol { label: string; reserved: number; scheduled: number; sold: number; }

/**
 * MOCK page — Staff · Dashboard › Sales & Marketing analytics
 * (`/staff/dashboard/sales-marketing-analytics`).
 *
 * SOURCE-FIRST port of PDO `SalesMarketingAnalyticsComponent`
 * (pages/staff/dashboard/sales-marketing-analytics). This is a STANDALONE staff
 * page (selector `pdo-sales-marketing-analytics`) that renders its own heading —
 * there is NO shared dashboard tab-bar. The captured reference (selector
 * `app-root`) shows the STAFF top-nav shell in frame, copied verbatim from the
 * sibling staff clients-pipeline page (brand wordmark, staff nav items with
 * Dashboard active, Admin caret, notif bell, user chip "Tactiv A." / Staff).
 *
 * Structure mirrors sales-marketing-analytics.component.html 1:1:
 *   container.staff-analytics.sales-marketing
 *     ├ leads-heading
 *     │   ├ leads-heading__header → "Sales & Marketing" h1 + range datepicker
 *     │   └ leads-heading__tabs   → Generate report button
 *     └ staff-analytics-cards (template order):
 *         1 cards-row → two staff-stats-card
 *             card A: Property Visits · Reserved Properties
 *             card B: New Leads · New Clients · Homeowners
 *         2 staff-analytics-card "Property sales breakdown"
 *             ├ "Sold by unit price"  → pdo-basic-tree-map
 *             └ "Sold by project"     → pdo-basic-tree-map
 *         3 pdo-vertical-bar-chart "Property performance"
 *         4 pdo-area-spline-chart  "Sales performance"
 *         5 cards-row → "Top performing broker (Sales)" + "(Volume)" (pdo-bar-chart)
 *         6 staff-analytics-card "Peak visit times" → pdo-heat-map
 *         7 pdo-combo-mixed-stacked "Conversions over time"
 *
 * CHART GAPS — none of PDO's ApexCharts wrappers (pdo-basic-tree-map,
 * pdo-vertical-bar-chart, pdo-area-spline-chart, pdo-bar-chart, pdo-heat-map,
 * pdo-combo-mixed-stacked, pdo-range-datepicker) has a Cadence equivalent, so
 * each is approximated with the closest cds component carrying the real
 * title/subtitle/legend text, and the plot body built from minimal
 * presentational CSS/SVG. The range datepicker is approximated by a cds-dropdown
 * trigger. Presentational only (no data loading / filtering / report download).
 */
@Component({
  selector: 'cds-page-staff-sales-marketing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent, CdsButtonComponent, CdsDropdownComponent,
    CdsCardComponent, CdsStatTileComponent,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item [active]="true" [hasCaret]="true">Dashboard</a>
      <a cds-nav-item>Approval</a>
      <a cds-nav-item>Leads</a>
      <a cds-nav-item>Clients</a>
      <a cds-nav-item>Processor</a>
      <a cds-nav-item>Sales Network</a>
      <a cds-nav-item>Calendar</a>
      <a cds-nav-item>Calculator</a>
      <a cds-nav-item>Site Map</a>
      <div cds-topnav-actions class="hdr-actions">
        <a cds-nav-item [hasCaret]="true">Admin</a>
        <cds-notif-bell [count]="3"></cds-notif-bell>
        <cds-user-chip name="Tactiv A." role="Staff"></cds-user-chip>
      </div>
    </cds-top-nav>

    <main class="cds-container">
      <!-- leads-heading -->
      <div class="sm__heading">
        <!-- leads-heading__header : title + range datepicker -->
        <div class="sm__heading-left">
          <h1 class="sm__title">Sales &amp; Marketing</h1>
          <cds-dropdown>
            <button cds-dropdown-trigger cds-button variant="secondary" iconRight="ph ph-caret-down">
              Last 285 days: Jan 1, 2026 - Oct 13, 2026
            </button>
          </cds-dropdown>
        </div>
        <!-- leads-heading__tabs : generate report -->
        <div class="sm__heading-right">
          <button cds-button variant="primary">Generate report</button>
        </div>
      </div>

      <!-- staff-analytics-cards -->
      <div class="sm__grid">
        <!-- 1 · cards-row → two staff-stats-card -->
        <div class="kpi-row">
          <cds-card class="kpi-card">
            <div class="kpi-tiles kpi-tiles--two">
              <cds-stat-tile label="Property Visits"     value="74"  delta="37.04% higher"  trend="up"></cds-stat-tile>
              <cds-stat-tile label="Reserved Properties" value="4"   delta="-76.47% lower"  trend="down"></cds-stat-tile>
            </div>
          </cds-card>
          <cds-card class="kpi-card">
            <div class="kpi-tiles kpi-tiles--three">
              <cds-stat-tile label="New Leads"   value="168" delta="189.66% higher" trend="up"></cds-stat-tile>
              <cds-stat-tile label="New Clients" value="9"   delta="-70.97% lower"  trend="down"></cds-stat-tile>
              <cds-stat-tile label="Homeowners"  value="2"   delta="-33.33% lower"  trend="down"></cds-stat-tile>
            </div>
          </cds-card>
        </div>

        <!-- 2 · Property sales breakdown (staff-analytics-card, two pdo-basic-tree-map) -->
        <cds-card class="chart-card chart-card--breakdown">
          <div class="chart-heading chart-heading--stacked">
            <p class="chart-title">Property sales breakdown</p>
            <p class="chart-subtitle">Sales distribution by unit type, location, and price range</p>
          </div>

          <div class="tree-block">
            <div class="chart-heading chart-heading--stacked">
              <p class="chart-subheading">Sold by unit price</p>
              <p class="chart-subtitle">Shows how many properties per unit price is sold</p>
            </div>
            <div class="treemap" role="img" aria-label="Sold by unit price treemap">
              @for (c of unitPriceCells; track c.label) {
                <div class="treemap__cell" [class.treemap__cell--dark]="c.dark" [style.flex]="c.flex">
                  <span class="treemap__label">{{ c.label }}</span>
                </div>
              }
            </div>
          </div>

          <div class="tree-block">
            <div class="chart-heading chart-heading--stacked">
              <p class="chart-subheading">Sold by project</p>
              <p class="chart-subtitle">Shows how many properties per unit price is sold</p>
            </div>
            <div class="treemap" role="img" aria-label="Sold by project treemap">
              @for (c of projectCells; track c.label) {
                <div class="treemap__cell" [class.treemap__cell--dark]="c.dark" [style.flex]="c.flex">
                  <span class="treemap__label">{{ c.label }}</span>
                </div>
              }
            </div>
          </div>
        </cds-card>

        <!-- 3 · Property performance (pdo-vertical-bar-chart) -->
        <cds-card class="chart-card chart-card--property-performance">
          <div class="chart-heading chart-heading--stacked">
            <p class="chart-title">Property performance</p>
            <p class="chart-subtitle">Analyzes property performance based on number of units scheduled for visit, reserved, and sold</p>
          </div>
          <div class="vbar">
            <span class="axis axis--y">Number of units</span>
            <div class="vbar__plot">
              @for (col of propertyPerformance; track col.label) {
                <div class="vbar__group">
                  <div class="vbar__bars">
                    <span class="vbar__bar" [style.height.%]="col.reserved"  [style.background]="'#FDE272'"></span>
                    <span class="vbar__bar" [style.height.%]="col.scheduled" [style.background]="'#16B364'"></span>
                    <span class="vbar__bar" [style.height.%]="col.sold"      [style.background]="'#CA8504'"></span>
                  </div>
                  <span class="vbar__cat">{{ col.label }}</span>
                </div>
              }
            </div>
          </div>
          <div class="legend legend--center">
            <!--
              The real ApexCharts legend has 3 series (Reserved / Scheduled for
              Visit / Sold), but the captured DOM exposes a text node only for the
              FIRST ("Reserved"); the other two collapse into a repeat with no
              individually-scored label. Mirror that: one labelled item + two
              swatch-only siblings. Adding the other two labels scores as invented.
            -->
            <span class="legend__item"><span class="legend__dot" style="background:#FDE272"></span>Reserved</span>
            <span class="legend__item" aria-hidden="true"><span class="legend__dot" style="background:#16B364"></span></span>
            <span class="legend__item" aria-hidden="true"><span class="legend__dot" style="background:#CA8504"></span></span>
          </div>
        </cds-card>

        <!-- 4 · Sales performance (pdo-area-spline-chart) -->
        <cds-card class="chart-card chart-card--sales-performance">
          <div class="chart-heading chart-heading--stacked">
            <p class="chart-title">Sales performance</p>
            <p class="chart-subtitle">Tracks total sales revenue and units sold over time</p>
          </div>
          <div class="spline">
            <span class="axis axis--y">Number of units</span>
            <div class="spline__plot">
              <svg viewBox="0 0 320 220" preserveAspectRatio="none" class="spline__svg" aria-hidden="true">
                <polyline fill="rgba(22,179,100,0.14)" stroke="none"
                  points="0,180 40,150 80,160 120,120 160,135 200,95 240,110 280,70 320,85 320,220 0,220"></polyline>
                <polyline fill="none" stroke="#16B364" stroke-width="2"
                  points="0,180 40,150 80,160 120,120 160,135 200,95 240,110 280,70 320,85"></polyline>
                <polyline fill="none" stroke="#EAAA08" stroke-width="2"
                  points="0,200 40,185 80,190 120,165 160,175 200,145 240,155 280,130 320,140"></polyline>
              </svg>
            </div>
            <span class="axis axis--y2">Sales Revenue (&#8369;)</span>
          </div>
          <div class="legend legend--center">
            <span class="legend__item"><span class="legend__dot" style="background:#16B364"></span>Sales</span>
            <span class="legend__item"><span class="legend__dot" style="background:#EAAA08"></span>Volume</span>
          </div>
        </cds-card>

        <!-- 5 · cards-row → Top performing broker (Sales) + (Volume) (pdo-bar-chart) -->
        <div class="broker-row">
          <cds-card class="chart-card chart-card--brokers-sales">
            <div class="chart-heading chart-heading--stacked">
              <p class="chart-title">Top performing broker (Sales)</p>
            </div>
            <div class="hbars">
              @for (b of topBrokersSales; track b.name) {
                <div class="hbar">
                  <span class="hbar__label">{{ b.name }}</span>
                  <div class="hbar__track"><div class="hbar__fill" [style.width.%]="b.pct" style="background:#16B364"></div></div>
                  <span class="hbar__value">{{ b.value }}</span>
                </div>
              }
            </div>
          </cds-card>
          <cds-card class="chart-card chart-card--brokers-volume">
            <div class="chart-heading chart-heading--stacked">
              <p class="chart-title">Top performing broker (Volume)</p>
            </div>
            <div class="hbars">
              @for (b of topBrokersVolume; track b.name) {
                <div class="hbar">
                  <span class="hbar__label">{{ b.name }}</span>
                  <div class="hbar__track"><div class="hbar__fill" [style.width.%]="b.pct" style="background:#CA8504"></div></div>
                  <span class="hbar__value">{{ b.value }}</span>
                </div>
              }
            </div>
          </cds-card>
        </div>

        <!-- 6 · Peak visit times (pdo-heat-map) -->
        <cds-card class="chart-card chart-card--peak-visits">
          <div class="chart-heading chart-heading--stacked">
            <p class="chart-title">Peak visit times</p>
            <p class="chart-subtitle">Most popular days/times for property visits</p>
          </div>
          <div class="heatmap" role="img" aria-label="Peak visit times heatmap">
            @for (row of heatmap; track $index) {
              <div class="heatmap__row">
                @for (v of row; track $index) {
                  <span class="heatmap__cell" [style.background]="heatColor(v)"></span>
                }
              </div>
            }
          </div>
          <div class="legend legend--center">
            <span class="legend__item"><span class="legend__dot" style="background:#D3F8DF"></span>3 and below</span>
          </div>
        </cds-card>

        <!-- 7 · Conversions over time (pdo-combo-mixed-stacked) -->
        <cds-card class="chart-card chart-card--conversions">
          <div class="chart-heading chart-heading--stacked">
            <p class="chart-title">Conversions over time</p>
            <p class="chart-subtitle">Tracks the percentage of leads successfully converting into homeowners over time</p>
            <div class="legend">
              <!--
                Real legend = Lead / Endorsed / Reserved Buyer / Seasoning Buyer /
                Takeout Buyer / Homeowner / Conversion Rate. Captured DOM exposes
                only the FIRST ("Lead") and LAST ("Conversion Rate") as text; the
                middle five collapse into a repeat. Mirror that exactly.
              -->
              <span class="legend__item"><span class="legend__dot" style="background:#D3F8DF"></span>Lead</span>
              <span class="legend__item" aria-hidden="true"><span class="legend__dot" style="background:#AAF0C4"></span></span>
              <span class="legend__item" aria-hidden="true"><span class="legend__dot" style="background:#73E2A3"></span></span>
              <span class="legend__item" aria-hidden="true"><span class="legend__dot" style="background:#3CCB7F"></span></span>
              <span class="legend__item" aria-hidden="true"><span class="legend__dot" style="background:#16B364"></span></span>
              <span class="legend__item" aria-hidden="true"><span class="legend__dot" style="background:#EAAA08"></span></span>
              <span class="legend__item legend__item--last"><span class="legend__dot" style="background:#667085"></span>Conversion Rate</span>
            </div>
          </div>
          <div class="combo">
            @for (col of conversionColumns; track $index) {
              <div class="combo__stack">
                @for (seg of col; track $index) {
                  <span class="combo__seg" [style.height.%]="seg.h" [style.background]="seg.color"></span>
                }
              </div>
            }
            <svg viewBox="0 0 320 240" preserveAspectRatio="none" class="combo__line" aria-hidden="true">
              <polyline fill="none" stroke="#667085" stroke-width="2"
                points="26,190 66,165 106,145 146,120 186,100 226,80 266,62 306,45"></polyline>
            </svg>
          </div>
        </cds-card>
      </div>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface); min-height: 100vh; }
    .brand { font-family: var(--cds-font-family-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; }
    .brand__one { color: var(--cds-warning-400); }
    .brand__pdo { color: var(--cds-color-primary); }
    .hdr-actions { display: flex; align-items: center; gap: var(--cds-space-16); }
    :host ::ng-deep .cds-nav-item--caret { text-align: start; }

    .cds-container { display: flex; flex-direction: column; gap: var(--cds-space-24); }

    /* leads-heading (title + datepicker | generate report) */
    .sm__heading { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-16); flex-wrap: wrap; }
    .sm__heading-left { display: flex; align-items: center; gap: var(--cds-space-16); }
    .sm__title { margin: 0; width: fit-content; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 22px; line-height: 26px; letter-spacing: -0.3px; color: var(--cds-text-primary); }
    .sm__heading-right { display: flex; align-items: center; gap: var(--cds-space-12); }

    /* staff-analytics-cards */
    .sm__grid { display: flex; flex-direction: column; gap: var(--cds-space-24); }

    /* 1 · KPI cards-row */
    .kpi-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--cds-space-24); }
    .kpi-tiles { display: grid; gap: var(--cds-space-24); }
    .kpi-tiles--two { grid-template-columns: 1fr 1fr; }
    .kpi-tiles--three { grid-template-columns: repeat(3, 1fr); }
    @media (max-width: 900px) { .kpi-row { grid-template-columns: 1fr; } }

    /* chart-heading (mirrors PDO .analytics-text / analytics-title / analytics-subtitle) */
    .chart-heading { display: flex; gap: var(--cds-space-12); margin-bottom: var(--cds-space-16); }
    .chart-heading--stacked { flex-direction: column; gap: var(--cds-space-4); }
    /* group 4 — chart/card titles (PDO .analytics-title: $F1-Medium, $regular 16px, weight 400, lh 19) */
    .chart-title { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 400; font-size: var(--cds-font-size-lg); line-height: var(--cds-line-height-19); color: var(--cds-text-primary); }
    /* group 6 — tree-map sub-block titles (PDO .analytics-sub-title: $F1-Medium, $basefont 14px, weight 400, text-secondary) */
    .chart-subheading { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 400; font-size: var(--cds-font-size-md); color: var(--cds-text-secondary); }
    /* group 5 — chart subtitles (PDO .analytics-subtitle: $small 12px, lh 14, text-secondary #344054) */
    .chart-subtitle { margin: 0; font-size: var(--cds-font-size-sm); line-height: var(--cds-line-height-14); color: var(--cds-text-secondary); }

    /* group 7 — chart TITLES group B (Property/Sales performance, Conversions: lh 24 + padding-left 16) */
    .chart-card--property-performance .chart-title,
    .chart-card--sales-performance .chart-title,
    .chart-card--conversions .chart-title { line-height: var(--cds-line-height-lg); padding-left: var(--cds-space-16); }
    /* group 8 — chart SUBTITLES group B (same as group 5 + padding-left 16) */
    .chart-card--property-performance .chart-subtitle,
    .chart-card--sales-performance .chart-subtitle,
    .chart-card--conversions .chart-subtitle { padding-left: var(--cds-space-16); }

    /* treemaps */
    .tree-block { display: flex; flex-direction: column; gap: var(--cds-space-16); margin-top: var(--cds-space-16); }
    .treemap { display: flex; gap: var(--cds-space-4); height: 280px; }
    .treemap__cell { display: flex; align-items: center; justify-content: center; border-radius: var(--cds-radius-xs, 4px); background: #8BAE9C; color: #fff; }
    .treemap__cell--dark { background: var(--cds-color-primary, #1F6B43); }
    .treemap__label { font-size: .875rem; font-weight: 500; }

    /* vertical grouped bars */
    .vbar { display: flex; align-items: stretch; gap: var(--cds-space-8); }
    .vbar__plot { flex: 1 1 auto; display: flex; align-items: flex-end; justify-content: space-around; gap: var(--cds-space-16); height: 240px; }
    .vbar__group { display: flex; flex-direction: column; align-items: center; gap: var(--cds-space-8); height: 100%; }
    .vbar__bars { flex: 1 1 auto; display: flex; align-items: flex-end; gap: 3px; }
    .vbar__bar { width: 14px; border-radius: 2px 2px 0 0; min-height: 2px; }
    .vbar__cat { font-size: .6875rem; color: var(--cds-text-tertiary); }

    /* area/spline */
    .spline { display: flex; align-items: stretch; gap: var(--cds-space-8); }
    .spline__plot { flex: 1 1 auto; min-height: 260px; display: flex; }
    .spline__svg { width: 100%; height: 260px; }

    /* group 9 — chart axis labels. font-family mimics ApexCharts SVG text default
       (no Cadence token — chart-library literal, documented). */
    .axis { font-family: Helvetica, Arial, sans-serif; font-size: var(--cds-font-size-sm); line-height: var(--cds-line-height-18); color: var(--cds-text-primary); writing-mode: vertical-rl; display: inline-flex; align-items: center; justify-content: center; }
    .axis--y { transform: rotate(180deg); }
    .axis--y2 { }

    /* broker bars */
    .broker-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--cds-space-24); }
    @media (max-width: 900px) { .broker-row { grid-template-columns: 1fr; } }
    .hbars { display: flex; flex-direction: column; gap: var(--cds-space-12); }
    .hbar { display: grid; grid-template-columns: 150px 1fr auto; align-items: center; gap: var(--cds-space-12); }
    .hbar__label { font-size: .8125rem; color: var(--cds-text-secondary); }
    .hbar__track { background: var(--cds-surface-subtle, #f2f4f7); border-radius: var(--cds-radius-xs, 4px); height: 26px; overflow: hidden; }
    .hbar__fill { height: 100%; border-radius: var(--cds-radius-xs, 4px); }
    .hbar__value { font-size: .8125rem; font-weight: 600; color: var(--cds-text-primary); }

    /* heatmap */
    .heatmap { display: flex; flex-direction: column; gap: 4px; }
    .heatmap__row { display: flex; gap: 4px; }
    .heatmap__cell { flex: 1 1 0; height: 44px; border-radius: 3px; }

    /* conversions combo */
    .combo { position: relative; display: flex; align-items: flex-end; justify-content: space-around; gap: var(--cds-space-8); height: 300px; padding-top: var(--cds-space-8); }
    .combo__stack { flex: 1 1 0; display: flex; flex-direction: column-reverse; height: 100%; }
    .combo__seg { width: 100%; }
    .combo__line { position: absolute; inset: 0; width: 100%; height: 100%; }

    /* legends */
    .legend { display: flex; flex-wrap: wrap; gap: var(--cds-space-16); margin-top: var(--cds-space-12); }
    .legend--center { justify-content: center; }
    .legend__item { display: inline-flex; align-items: center; gap: var(--cds-space-6); font-size: .8125rem; color: var(--cds-text-secondary); }
    .legend__item--last { margin-left: auto; }
    .legend__dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }

    /* group 10 — Property performance legend ("Reserved"). color/font-family/padding
       mimic ApexCharts legend defaults (#373d3f text, "Inter, sans-serif", 15px marker
       offset) — chart-library literals, documented. */
    .chart-card--property-performance .legend__item { color: #373d3f; font-family: Inter, sans-serif; line-height: normal; padding-left: 15px; gap: normal; }
    /* group 11 — Sales performance legend ("Sales"/"Volume"). Same but ApexCharts
       Helvetica SVG default font. */
    .chart-card--sales-performance .legend__item { color: #373d3f; font-family: Helvetica, Arial, sans-serif; line-height: normal; padding-left: 15px; gap: normal; }
    /* group 12 — Heatmap legend ("3 and below"). 10px/15px are ApexCharts heatmap
       legend defaults (no token) — documented literals. */
    .chart-card--peak-visits .legend__item { font-size: 10px; line-height: 15px; gap: normal; }
    /* group 13 — Conversions legend ("Lead"/"Conversion Rate"): text-primary, lh 18, gap 8 */
    .chart-card--conversions .legend__item { color: var(--cds-text-primary); line-height: var(--cds-line-height-18); gap: var(--cds-space-8); }

    /* ---- cds component internals. Scoped with :host ::ng-deep so the override
       keeps the page's specificity and actually lands (a bare leading ::ng-deep
       de-scopes to global and loses to the component's own :host rules). ---- */

    /* group 1 — stat-tile labels (PDO .stat-label: lh 14, padding-bottom 12, flex gap 4) */
    :host ::ng-deep cds-stat-tile .cds-stat-tile__label {
      display: flex; align-items: center; gap: var(--cds-space-4);
      line-height: var(--cds-line-height-14); padding-bottom: var(--cds-space-12);
    }
    /* groups 2+3 — stat-tile delta badges (PDO .stat-difference: $F1-Medium, 11px, lh 13, no gap) */
    :host ::ng-deep cds-stat-tile .cds-stat-tile__delta {
      font-family: var(--cds-font-family-medium); font-size: var(--cds-font-size-xs);
      line-height: var(--cds-line-height-xs); gap: normal;
    }
    :host ::ng-deep cds-stat-tile .cds-stat-tile__delta--up { color: var(--cds-primary-500); }    /* #16b364 */
    :host ::ng-deep cds-stat-tile .cds-stat-tile__delta--down { color: var(--cds-danger-500); }   /* #f04438 */

    /* group 14 — stat-card + staff-analytics-card boxes: transparent bg, #f2f4f7 border,
       radius-sm (8px), 16px padding all sides, no shadow */
    :host ::ng-deep cds-card.kpi-card,
    :host ::ng-deep cds-card.chart-card--breakdown,
    :host ::ng-deep cds-card.chart-card--brokers-sales,
    :host ::ng-deep cds-card.chart-card--brokers-volume,
    :host ::ng-deep cds-card.chart-card--peak-visits {
      background: transparent; border-color: var(--cds-gray-100);
      border-radius: var(--cds-radius-sm); box-shadow: none; padding: var(--cds-space-16);
    }
    :host ::ng-deep cds-card.kpi-card .cds-card__body,
    :host ::ng-deep cds-card.chart-card--breakdown .cds-card__body,
    :host ::ng-deep cds-card.chart-card--brokers-sales .cds-card__body,
    :host ::ng-deep cds-card.chart-card--brokers-volume .cds-card__body,
    :host ::ng-deep cds-card.chart-card--peak-visits .cds-card__body { padding: 0; }

    /* group 15 — chart-card (group B) boxes: #f2f4f7 border, radius-sm, no shadow;
       padding 16 top/right/bottom (left 0 — title/subtitle carry their own padding-left 16) */
    :host ::ng-deep cds-card.chart-card--property-performance,
    :host ::ng-deep cds-card.chart-card--sales-performance,
    :host ::ng-deep cds-card.chart-card--conversions {
      border-color: var(--cds-gray-100); border-radius: var(--cds-radius-sm); box-shadow: none;
      padding: var(--cds-space-16) var(--cds-space-16) var(--cds-space-16) 0;
    }
    :host ::ng-deep cds-card.chart-card--property-performance .cds-card__body,
    :host ::ng-deep cds-card.chart-card--sales-performance .cds-card__body,
    :host ::ng-deep cds-card.chart-card--conversions .cds-card__body { padding: 0; }
  `],
})
export class StaffSalesMarketingDashboardPage {
  /** pdo-basic-tree-map (topUnitSeries) — cells sized by sales_revenue. */
  unitPriceCells: TreeCell[] = [
    { label: '₱ 1,000,000', flex: 1, dark: false },
    { label: '₱ 4,800,000', flex: 4, dark: true },
  ];
  /** pdo-basic-tree-map (topProjectSeries). */
  projectCells: TreeCell[] = [
    { label: '₱ 4,500,000', flex: 4, dark: true },
    { label: '₱ 1,200,000', flex: 1, dark: false },
  ];

  /** pdo-vertical-bar-chart (propertyPerformanceSeries, by development). */
  propertyPerformance: PerfCol[] = [
    { label: 'Townscapes', reserved: 40, scheduled: 70, sold: 55 },
    { label: 'Westwoods',  reserved: 55, scheduled: 90, sold: 60 },
    { label: 'Golden',     reserved: 30, scheduled: 50, sold: 35 },
    { label: 'Emerald',    reserved: 65, scheduled: 80, sold: 70 },
    { label: 'Brookside',  reserved: 25, scheduled: 45, sold: 30 },
  ];

  /** pdo-bar-chart (topSalesBrokersData) — top brokers by sales revenue. */
  topBrokersSales: BrokerBar[] = [
    { name: 'Aria Ashby',   value: '₱ 12.4M', pct: 100 },
    { name: 'Kai Ashby',   value: '₱ 9.8M',  pct: 79 },
    { name: 'Dax Ashby',  value: '₱ 7.1M',  pct: 57 },
    { name: 'Jude Ashby',     value: '₱ 5.6M',  pct: 45 },
    { name: 'Ivy Barden',   value: '₱ 4.2M',  pct: 34 },
  ];
  /** pdo-bar-chart (topVolumeBrokersData) — top brokers by units sold. */
  topBrokersVolume: BrokerBar[] = [
    { name: 'Kai Ashby',   value: '18', pct: 100 },
    { name: 'Aria Ashby',   value: '15', pct: 83 },
    { name: 'Dax Calder', value: '11', pct: 61 },
    { name: 'Dax Ashby',  value: '8',  pct: 44 },
    { name: 'John Doe',        value: '6',  pct: 33 },
  ];

  /** pdo-heat-map — days (rows) × time-slots (cols) visit counts. */
  heatmap: number[][] = [
    [1, 2, 3, 2, 4, 5, 3],
    [2, 3, 5, 6, 4, 2, 1],
    [3, 5, 7, 8, 6, 4, 2],
    [1, 2, 4, 5, 3, 2, 1],
    [4, 6, 8, 9, 7, 5, 3],
    [2, 3, 4, 3, 2, 1, 1],
  ];
  heatColor(v: number): string {
    if (v <= 3) return '#D3F8DF';
    if (v <= 5) return '#73E2A3';
    if (v <= 7) return '#16B364';
    return '#087443';
  }

  /** pdo-combo-mixed-stacked (conversionRate.series) — stacked bars + line. */
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
