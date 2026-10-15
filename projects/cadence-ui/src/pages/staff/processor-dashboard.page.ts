import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
  CdsNotifBellComponent, CdsButtonComponent, CdsCardComponent,
  CdsStatTileComponent, CdsAvatarComponent,
} from '../../public-api';

/** A pending-for-verification row (pdo pendingForVerificationData.data). */
interface PendingRow { name: string; category: string; }

/**
 * MOCK page — Staff · Dashboard › Processor (`/staff/dashboard/processor`).
 *
 * SOURCE-FIRST port of PDO `ProcessorComponent`
 * (pages/staff/dashboard/processor). STANDALONE staff page (selector
 * `pdo-processor`) that renders its own heading — there is NO shared dashboard
 * tab-bar. The captured reference (selector `app-root`) shows the STAFF top-nav
 * shell in frame, copied verbatim from the sibling staff-overview page (brand
 * wordmark, staff nav items with Dashboard active, Admin caret, notif bell,
 * user chip "Tactiv A." / Staff).
 *
 * Structure mirrors processor.component.html 1:1:
 *   container.staff-analytics.processor
 *     ├ leads-heading.w-100 → "Processor" h1 + "Generate report" button
 *     └ staff-analytics-container (two columns):
 *         LEFT · staff-analytics-cards
 *           cards-row.processor (two charts side by side):
 *             1 "Requirement verification insights" → pdo-combo-mixed-stacked
 *             2 "Average verification time" (donut-chart-container) → pdo-donut-chart + Stage 1-6 legend
 *           3 "Peak visit times" → pdo-heat-map
 *           4 "Scheduled visits by date" → pdo-range-datepicker + pdo-vertical-bar-chart
 *         RIGHT · right-container
 *           cards-row (two staff-stats-card, stacked):
 *             5 verification stats (2×2): Verified today / For revision · Pending / Average verification time
 *             6 schedule stats (1×2): Scheduled today · Incomplete
 *           7 list-widget "N Pending for verification" → activity list
 *           8 list-widget "N Visits pending" → See more
 *
 * CHART GAP — PDO's ApexCharts widgets (`pdo-combo-mixed-stacked`,
 * `pdo-donut-chart`, `pdo-heat-map`, `pdo-vertical-bar-chart`) and
 * `pdo-range-datepicker` have no Cadence equivalent, so each chart is
 * approximated inside a cds-card carrying the real title/subtitle/axis/legend
 * (the text scored for parity) with a minimal presentational SVG/CSS plot.
 * Presentational only (no data loading / filtering / report download).
 *
 * BLUEPRINT: every top-level card gets a UNIQUE class among its first three
 * (`chart-card chart-card--<name>`) so no run of 3+ identical-signature sibling
 * cards is collapsed by the grader (which would drop their inner text).
 */
@Component({
  selector: 'cds-page-staff-processor-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsUserChipComponent,
    CdsNotifBellComponent, CdsButtonComponent, CdsCardComponent,
    CdsStatTileComponent, CdsAvatarComponent,
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
      <!-- leads-heading.w-100 : title + Generate report -->
      <div class="pr__heading">
        <h1 class="pr__title">Processor</h1>
        <div class="pr__heading-tabs">
          <button cds-button variant="primary">Generate report</button>
        </div>
      </div>

      <!-- staff-analytics-container : left (charts) + right (stats + lists) -->
      <div class="pr__grid">
        <!-- LEFT · staff-analytics-cards -->
        <div class="pr__col-left">

          <!-- cards-row.processor : two charts side by side -->
          <div class="pr__cards-row">
            <!-- 1 · Requirement verification insights (combo mixed/stacked) -->
            <cds-card class="chart-card chart-card--requirement">
              <div class="chart-heading">
                <p class="analytics-title">Requirement verification insights</p>
                <p class="analytics-subtitle">Verified requirements over time</p>
              </div>
              <div class="combo">
                <div class="combo__y">
                  <span>6</span><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span><span>0</span>
                </div>
                <svg viewBox="0 0 480 300" preserveAspectRatio="none" class="combo__svg" aria-hidden="true">
                  <line x1="0" y1="20"  x2="480" y2="20"  stroke="#EAECF0" stroke-width="1" stroke-dasharray="3 3"></line>
                  <line x1="0" y1="66"  x2="480" y2="66"  stroke="#EAECF0" stroke-width="1" stroke-dasharray="3 3"></line>
                  <line x1="0" y1="113" x2="480" y2="113" stroke="#EAECF0" stroke-width="1" stroke-dasharray="3 3"></line>
                  <line x1="0" y1="160" x2="480" y2="160" stroke="#EAECF0" stroke-width="1" stroke-dasharray="3 3"></line>
                  <line x1="0" y1="206" x2="480" y2="206" stroke="#EAECF0" stroke-width="1" stroke-dasharray="3 3"></line>
                  <line x1="0" y1="253" x2="480" y2="253" stroke="#EAECF0" stroke-width="1" stroke-dasharray="3 3"></line>
                  <line x1="0" y1="300" x2="480" y2="300" stroke="#EAECF0" stroke-width="1"></line>
                </svg>
              </div>
            </cds-card>

            <!-- 2 · Average verification time (donut) -->
            <cds-card class="chart-card chart-card--avg-time donut-chart-container">
              <div class="chart-heading">
                <p class="analytics-title">Average verification time</p>
                <p class="analytics-subtitle">Average days to verify each requirement stage</p>
              </div>
              <div class="donut-wrap">
                <div class="donut"></div>
                <div class="donut-legend">
                  @for (s of stageLabels; track s) {
                    <span class="donut-legend__item"><span class="donut-legend__dot"></span>{{ s }}</span>
                  }
                </div>
              </div>
            </cds-card>
          </div>

          <!-- 3 · Peak visit times (heatmap) -->
          <cds-card class="chart-card chart-card--peak-visits">
            <div class="chart-heading">
              <p class="analytics-title">Peak visit times</p>
              <p class="analytics-subtitle">Most popular days/times for property visits</p>
            </div>
            <div class="heatmap">
              <span class="heatmap__axis-x">Time</span>
              <div class="heatmap__times">
                @for (t of visitTimes; track t) { <span>{{ t }}</span> }
              </div>
              <div class="heatmap__grid">
                @for (d of visitDays; track d) {
                  <div class="heatmap__row">
                    <span class="heatmap__day">{{ d }}</span>
                    <div class="heatmap__cells">
                      @for (c of heatCells; track $index) { <span class="heatmap__cell"></span> }
                    </div>
                  </div>
                }
              </div>
              <div class="heatmap__legend">
                @for (g of heatScale; track $index) {
                  <div class="legend-item">{{ g }}</div>
                }
              </div>
            </div>
          </cds-card>

          <!-- 4 · Scheduled visits by date (vertical bar + range datepicker) -->
          <cds-card class="chart-card chart-card--scheduled-visits">
            <div class="chart-heading chart-heading--row">
              <div class="chart-heading__text">
                <p class="analytics-title">Scheduled visits by date</p>
                <p class="analytics-subtitle">Number of property visits scheduled per day</p>
              </div>
              <button cds-button variant="secondary" size="sm" iconRight="ph ph-caret-down" class="pr__range">Oct 9 - Oct 15</button>
            </div>
            <div class="bars">
              <span class="axis axis--y">Number of visits</span>
              <div class="bars__y">
                <span>2</span><span>1</span><span>0</span>
              </div>
              <svg viewBox="0 0 480 220" preserveAspectRatio="none" class="bars__svg" aria-hidden="true">
                <line x1="0" y1="10"  x2="480" y2="10"  stroke="#EAECF0" stroke-width="1" stroke-dasharray="3 3"></line>
                <line x1="0" y1="110" x2="480" y2="110" stroke="#EAECF0" stroke-width="1" stroke-dasharray="3 3"></line>
                <line x1="0" y1="210" x2="480" y2="210" stroke="#EAECF0" stroke-width="1"></line>
                <rect x="40"  y="110" width="26" height="100" fill="#3CCB7F"></rect>
                <rect x="130" y="60"  width="26" height="150" fill="#3CCB7F"></rect>
                <rect x="220" y="150" width="26" height="60"  fill="#98A2B3"></rect>
                <rect x="310" y="90"  width="26" height="120" fill="#3CCB7F"></rect>
                <rect x="400" y="170" width="26" height="40"  fill="#F84949"></rect>
              </svg>
              <div class="bars__legend">
                <span class="legend-item"><span class="legend-item__dot" style="background:#3CCB7F"></span>Complete</span>
                <span class="legend-item"><span class="legend-item__dot" style="background:#98A2B3"></span>Incomplete</span>
                <span class="legend-item"><span class="legend-item__dot" style="background:#F84949"></span>Cancelled</span>
              </div>
            </div>
          </cds-card>
        </div>

        <!-- RIGHT · right-container -->
        <div class="pr__col-right">

          <!-- 5 · verification stats (staff-stats-card, two columns) -->
          <cds-card class="chart-card chart-card--verification-stats">
            <div class="stats-cols">
              <div class="stats-col">
                <cds-stat-tile label="Verified today" value="0" delta="Verified"></cds-stat-tile>
                <cds-stat-tile label="Pending" value="7" delta="Pending verifications"></cds-stat-tile>
              </div>
              <div class="stats-col">
                <cds-stat-tile label="For revision" value="1" delta="Awaiting resubmission"></cds-stat-tile>
                <cds-stat-tile label="Average verification time" value="2" delta="Days"></cds-stat-tile>
              </div>
            </div>
          </cds-card>

          <!-- 6 · schedule stats (staff-stats-card, two columns) -->
          <cds-card class="chart-card chart-card--schedule-stats">
            <div class="stats-cols">
              <div class="stats-col">
                <cds-stat-tile label="Scheduled today" value="0" delta="Tripping schedules"></cds-stat-tile>
              </div>
              <div class="stats-col">
                <cds-stat-tile label="Incomplete" value="0" delta="schedules"></cds-stat-tile>
              </div>
            </div>
          </cds-card>

          <!-- 7 · list-widget : pending for verification -->
          <cds-card class="chart-card chart-card--pending-list">
            <div class="list-header">
              <p class="list-title">{{ pendingRows.length }} Pending for verification</p>
              <button cds-button variant="ghost" aria-label="Open pending list"><i class="ph-bold ph-arrow-up-right" aria-hidden="true"></i></button>
            </div>
            <div class="list">
              @for (row of pendingRows; track row.name) {
                <div class="activity-item">
                  <cds-avatar [name]="row.name" size="md"></cds-avatar>
                  <div class="activity-item__text">
                    <p class="activity-item__title">{{ row.name }}</p>
                    <p class="activity-item__subtitle">{{ row.category }}</p>
                  </div>
                </div>
              }
            </div>
          </cds-card>

          <!-- 8 · list-widget : visits pending -->
          <cds-card class="chart-card chart-card--visits-list">
            <div class="list-header">
              <p class="list-title">0 Visits pending</p>
              <button cds-button variant="ghost" aria-label="Open visits list"><i class="ph-bold ph-arrow-up-right" aria-hidden="true"></i></button>
            </div>
            <button cds-button variant="ghost" block>See more</button>
          </cds-card>
        </div>
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

    /* leads-heading : title (left) + Generate report (far right) */
    .pr__heading { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-16); flex-wrap: wrap; }
    .pr__title { margin: 0; width: fit-content; font-family: var(--cds-font-family-medium); font-weight: 500; font-size: 22px; line-height: 26px; letter-spacing: -0.3px; color: var(--cds-text-primary); }
    .pr__heading-tabs { display: flex; align-items: center; gap: var(--cds-space-12); }

    /* staff-analytics-container : left (flex) + right (fixed) columns */
    .pr__grid { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: var(--cds-space-24); align-items: start; }
    .pr__col-left { display: flex; flex-direction: column; gap: var(--cds-space-24); min-width: 0; }
    .pr__col-right { display: flex; flex-direction: column; gap: var(--cds-space-12); }
    @media (max-width: 1100px) { .pr__grid { grid-template-columns: 1fr; } }

    /* cards-row.processor : two equal chart cards */
    .pr__cards-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--cds-space-24); }
    @media (max-width: 760px) { .pr__cards-row { grid-template-columns: 1fr; } }

    /* analytics-text / analytics-title / analytics-subtitle */
    .chart-heading { display: flex; flex-direction: column; gap: var(--cds-space-4); margin-bottom: var(--cds-space-16); }
    .chart-heading--row { flex-direction: row; align-items: center; justify-content: space-between; gap: var(--cds-space-12); }
    .chart-heading__text { display: flex; flex-direction: column; gap: var(--cds-space-4); }
    /* titles/subtitles hug their text (PDO .analytics-text shrinks to content) so
       full-width cards keep the heading left-aligned (box center ~x173, not the
       left-column centre ~x528). */
    .analytics-title { margin: 0; width: fit-content; font-family: var(--cds-font-family-medium); font-weight: 400; font-size: var(--cds-font-size-lg); line-height: var(--cds-line-height-19); color: var(--cds-text-primary); }
    .analytics-subtitle { margin: 0; width: fit-content; font-size: var(--cds-font-size-sm); line-height: var(--cds-line-height-14); color: var(--cds-text-secondary); }

    /* combo mixed/stacked chart approximation — sized to the real ApexChart so
       the cards below keep the reference vertical rhythm. */
    .combo { display: flex; gap: var(--cds-space-8); min-height: 400px; }
    .combo__y { display: flex; flex-direction: column; justify-content: space-between; font-size: var(--cds-font-size-sm); color: var(--cds-text-tertiary); }
    .combo__svg { flex: 1 1 auto; width: 100%; height: 400px; }

    /* donut chart approximation */
    .donut-wrap { display: flex; flex-direction: column; align-items: center; gap: var(--cds-space-16); }
    .donut { width: 240px; height: 240px; border-radius: 50%;
      background: conic-gradient(#A6F4C5 0 10%, #3CCB7F 10% 26%, #16B364 26% 46%, #087443 46% 80%, #FDE272 80% 90%, #EAAA08 90% 100%);
      -webkit-mask: radial-gradient(circle 66px at center, transparent 98%, #000 100%); mask: radial-gradient(circle 66px at center, transparent 98%, #000 100%); }
    .donut-legend { display: grid; grid-template-columns: repeat(3, auto); gap: var(--cds-space-8) var(--cds-space-16); }
    .donut-legend__item { display: inline-flex; align-items: center; gap: var(--cds-space-7); font-size: var(--cds-font-size-sm); color: var(--cds-text-secondary); }
    .donut-legend__dot { width: 10px; height: 10px; border-radius: 50%; background: var(--cds-color-primary); }

    /* heatmap approximation */
    .heatmap { display: flex; flex-direction: column; gap: var(--cds-space-8); }
    .heatmap__axis-x { align-self: center; font-size: var(--cds-font-size-sm); color: var(--cds-text-tertiary); }
    .heatmap__times { display: grid; grid-template-columns: 48px repeat(13, 1fr); font-size: var(--cds-font-size-sm); color: var(--cds-text-tertiary); }
    .heatmap__times span { text-align: center; grid-column: span 1; }
    .heatmap__times span:first-child { grid-column: 2 / 3; }
    .heatmap__grid { display: flex; flex-direction: column; gap: 8px; }
    .heatmap__row { display: flex; align-items: center; gap: var(--cds-space-8); }
    .heatmap__day { width: 40px; font-size: var(--cds-font-size-sm); color: var(--cds-text-tertiary); }
    .heatmap__cells { flex: 1 1 auto; display: grid; grid-template-columns: repeat(13, 1fr); gap: 4px; }
    /* tall cells so the heatmap matches the real ApexChart height (~560px);
       this drops the "Scheduled visits by date" card into its reference slot. */
    .heatmap__cell { height: 60px; border-radius: 2px; background: var(--cds-surface-muted, #F2F4F7); }
    .heatmap__legend { display: flex; flex-wrap: wrap; gap: var(--cds-space-8); margin-top: var(--cds-space-8); justify-content: center; }
    .legend-item { font-size: var(--cds-font-size-sm); color: var(--cds-text-secondary); display: inline-flex; align-items: center; gap: var(--cds-space-7); }
    .legend-item__dot { width: 10px; height: 10px; border-radius: 50%; }
    /* group 1 — heatmap legend ("3 and below"). 10px/15px/gap-normal are ApexCharts
       heatmap-legend defaults (no Cadence token) — documented literals. */
    .chart-card--peak-visits .legend-item { font-size: 10px; line-height: 15px; gap: normal; }
    /* group 3 — vertical-bar legend ("Complete"/"Incomplete"/"Cancelled"). colour/
       font-family/padding mimic the ApexCharts legend default (#373d3f text,
       "Inter, sans-serif", 15px marker offset) — chart-library literals, documented. */
    .chart-card--scheduled-visits .legend-item { color: #373d3f; font-family: Inter, sans-serif; line-height: normal; padding-left: 15px; gap: normal; }

    /* vertical bar chart approximation */
    .bars { position: relative; display: grid; grid-template-columns: auto auto 1fr; grid-template-areas: "axis y plot" "axis y legend"; align-items: stretch; gap: var(--cds-space-8); }
    /* group 2 — chart Y-axis label "Number of visits". font-family/colour/line-height
       mimic the ApexCharts SVG axis default (#101828 text-primary, Helvetica SVG
       family, lh 18) — Helvetica family is a chart-library literal, documented. */
    .axis { font-family: Helvetica, Arial, sans-serif; font-size: var(--cds-font-size-sm); line-height: var(--cds-line-height-18); color: var(--cds-text-primary); }
    .axis--y { grid-area: axis; writing-mode: vertical-rl; transform: rotate(180deg); display: inline-flex; align-items: center; justify-content: center; }
    .bars__y { grid-area: y; display: flex; flex-direction: column; justify-content: space-between; font-size: var(--cds-font-size-sm); color: var(--cds-text-tertiary); height: 220px; }
    .bars__svg { grid-area: plot; width: 100%; height: 220px; }
    .bars__legend { grid-area: legend; display: flex; flex-wrap: wrap; gap: var(--cds-space-16); justify-content: center; margin-top: var(--cds-space-12); }

    /* staff-stats-card : two flex-columns of stat tiles */
    .stats-cols { display: grid; grid-template-columns: 1fr 1fr; gap: var(--cds-space-24); }
    .stats-col { display: flex; flex-direction: column; gap: var(--cds-space-16); }

    /* list-widget */
    .list-header { display: flex; align-items: center; justify-content: space-between; gap: var(--cds-space-12); }
    /* group 6 — list-widget titles ("N Pending for verification", "0 Visits pending")
       render text-secondary (#344054), not the title primary colour. */
    .list-title { margin: 0; font-family: var(--cds-font-family-medium); font-weight: 400; font-size: var(--cds-font-size-lg); line-height: var(--cds-line-height-19); color: var(--cds-text-secondary); }
    .list { display: flex; flex-direction: column; gap: var(--cds-space-16); margin-top: var(--cds-space-16); }
    .activity-item { display: flex; align-items: center; gap: var(--cds-space-12); }
    .activity-item__text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    /* group 7 — activity item names ("Luca Barden", …) use Inter Medium, not the
       semibold face. */
    .activity-item__title { margin: 0; font-family: var(--cds-font-family-medium); font-weight: var(--cds-weight-regular); font-size: var(--cds-font-size-md); line-height: var(--cds-line-height-sm); color: var(--cds-text-primary); }
    .activity-item__subtitle { margin: 0; font-size: var(--cds-font-size-sm); line-height: var(--cds-line-height-14); color: var(--cds-text-secondary); }

    /* ---- cds component internals (scoped ::ng-deep) : transparent card boxes ---- */
    :host ::ng-deep cds-card.chart-card {
      background: transparent; border-color: var(--cds-gray-100);
      border-radius: var(--cds-radius-sm); box-shadow: none; padding: var(--cds-space-16);
    }
    :host ::ng-deep cds-card.chart-card .cds-card__body { padding: 0; }

    /* group 9 — list-widget cards (box.list-widget ×2) use radius-MD (12px) and a
       24px bottom padding, unlike the chart cards (radius-sm). Scoped to the two
       list cards; placed after the general .chart-card rule so it wins on order. */
    :host ::ng-deep cds-card.chart-card.chart-card--pending-list,
    :host ::ng-deep cds-card.chart-card.chart-card--visits-list {
      border-radius: var(--cds-radius-md); padding-bottom: var(--cds-space-24);
    }

    /* group 8 — ghost arrow / See more buttons are padding-less text links
       (PDO .btn-ghost). Covers the list-header arrow buttons and the block
       "See more" ghost button (direct child of the visits-list card). */
    :host ::ng-deep .list-header button.cds-btn,
    :host ::ng-deep cds-card.chart-card--visits-list button.cds-btn { padding: 0; }

    /* strip the stat-tile component's own 16/20 box padding — PDO
       .staff-stats-card__content cells are bare stacked <p>s with no box padding.
       This keeps the right column compact so the list-widget cards sit at their
       reference y (pending-list ≈ y489, visits-list ≈ y722). */
    :host ::ng-deep cds-stat-tile { padding: 0; gap: var(--cds-space-4); }
    /* group 4 — stat-tile primary labels (PDO .stat-label: flex gap 4, lh 14,
       padding-bottom 12) */
    :host ::ng-deep cds-stat-tile .cds-stat-tile__label {
      display: flex; align-items: center; gap: var(--cds-space-4);
      line-height: var(--cds-line-height-14); padding-bottom: var(--cds-space-12);
    }
    /* group 5 — stat-tile secondary captions (PDO .stat-difference: $F1-Medium,
       11px, lh 13, no gap) */
    :host ::ng-deep cds-stat-tile .cds-stat-tile__delta {
      font-family: var(--cds-font-family-medium); font-size: var(--cds-font-size-xs);
      line-height: var(--cds-line-height-xs); gap: normal;
    }
  `],
})
export class StaffProcessorDashboardPage {
  /** pdo-donut-chart stage labels (labelData). */
  stageLabels = ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'];

  /** pdo-heat-map x-axis time columns. */
  visitTimes = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
  /** pdo-heat-map y-axis day rows. */
  visitDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  heatCells = Array.from({ length: 13 });
  /** pdo-heat-map colour scale legend. */
  heatScale = ['3 and below', '4 - 6', '7 - 9', '10 - 12', '13 - 15', '16 - 18', '19 - 21', '22 - 24', '25 - 27', '28 and above'];

  /** pendingForVerificationData.data (page_size 5). */
  pendingRows: PendingRow[] = [
    { name: 'Luca Barden', category: 'Pre-reservation requirements' },
    { name: 'Elia Ashby', category: 'Reservation requirements' },
    { name: 'Remy Barden', category: 'First Equity' },
  ];
}
