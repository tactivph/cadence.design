import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsButtonComponent,
  CdsUserChipComponent, CdsNotifBellComponent,
  CdsTabsComponent, CdsTabComponent, CdsEmptyStateComponent,
} from '../../public-api';

interface DayCell { label: string; outside: boolean; today: boolean; }

/**
 * MOCK page — Agent · Calendar (`/agent/calendar`, `CalendarComponent`).
 *
 * SOURCE-FIRST port of PDO `calendar.component.html`. TOP-LEVEL agent page: the
 * captured reference (selector `app-root`) shows the top-nav shell in frame with
 * the "Calendar" nav item active. Shell is copied verbatim from the clients-list
 * sibling with the active nav item moved to "Calendar".
 *
 * Captured view = MONTH grid, October 2026, day 13 selected (today), with an
 * EMPTY schedule side panel ("Your schedule is free!").
 *
 * Structure mirrors calendar.component.html 1:1:
 *   container > calendar-page
 *     ├ calendar-container
 *     │   ├ calendar-header  → h3 "October 2026" + caret-down toggle
 *     │   │                    · actions: prev / Today / next
 *     │   └ calendar-datepicker
 *     │       ├ custom-header → 7 full weekday names (Sunday … Saturday)
 *     │       └ month grid    → 6×7 day cells (outside + in-month, 13 = today)
 *     └ schedules (side panel)
 *         ├ schedules__header → "Schedule" + date subtitle + "Log past visit"
 *         ├ schedules__tabs   → Incomplete (active) / Completed
 *         └ schedules__empty-state → "Your schedule is free!"
 *
 * Presentational only (no data loading / navigation / offcanvas behaviour).
 *
 * COMPONENT GAP: Cadence has no calendar / month-grid component. The weekday
 * header row and the 6×7 day-cell grid are rendered as plain layout markup
 * (that is layout, not a faked component). Reported upstream as a missing
 * component. The month-label dropdown toggle is a PDO ngbDropdown with no cds
 * equivalent, so it renders as a static caret icon.
 */
@Component({
  selector: 'cds-page-agent-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdsTopNavComponent, CdsNavItemComponent, CdsButtonComponent,
    CdsUserChipComponent, CdsNotifBellComponent,
    CdsTabsComponent, CdsTabComponent, CdsEmptyStateComponent,
  ],
  template: `
    <cds-top-nav>
      <span cds-topnav-brand class="brand"><span class="brand__one">one</span><span class="brand__pdo">PDO</span></span>
      <a cds-nav-item [hasCaret]="true">Dashboard</a>
      <a cds-nav-item>Leads</a>
      <a cds-nav-item>Clients</a>
      <a cds-nav-item [active]="true">Calendar</a>
      <a cds-nav-item>Calculator</a>
      <a cds-nav-item>Site Map</a>
      <div cds-topnav-actions class="hdr-actions">
        <button class="cds-icon-btn" aria-label="Help"><i class="ph-bold ph-question"></i></button>
        <cds-notif-bell [count]="19"></cds-notif-bell>
        <cds-user-chip name="Jude Calder" role="Agent" [src]="placeholder"></cds-user-chip>
      </div>
    </cds-top-nav>

    <main class="cds-container">
      <div class="calendar-page">
        <!-- Left: month calendar -->
        <section class="calendar-container">
          <header class="calendar-header">
            <div class="calendar-title">
              <h3 class="calendar-title__month">October 2026</h3>
              <i class="ph ph-caret-down" aria-hidden="true"></i>
            </div>
            <div class="calendar-controls">
              <button cds-button variant="secondary-neutral" [iconOnly]="true" iconLeft="ph ph-caret-left" aria-label="Previous month"></button>
              <button cds-button variant="secondary-neutral">Today</button>
              <button cds-button variant="secondary-neutral" [iconOnly]="true" iconLeft="ph ph-caret-right" aria-label="Next month"></button>
            </div>
          </header>

          <div class="calendar-datepicker">
            <div class="weekday-row">
              @for (w of weekdays; track w) {
                <div class="weekday">{{ w }}</div>
              }
            </div>

            <div class="month-grid">
              @for (d of days; track $index) {
                <div class="day-cell" [class.day-cell--outside]="d.outside" [class.day-cell--today]="d.today">
                  <span class="day-cell__num">{{ d.label }}</span>
                </div>
              }
            </div>
          </div>
        </section>

        <!-- Right: schedule side panel -->
        <aside class="schedules">
          <div class="schedules__header">
            <div class="schedules__header-row">
              <div class="schedules__header-text">
                <div class="schedules__header-text-title">
                  <p class="schedules__title">Schedule</p>
                </div>
                <p class="schedules__subtitle">October 13, 2026</p>
              </div>
              <button cds-button variant="primary" class="schedules__log-past" iconLeft="ph-bold ph-clock-clockwise">Log past visit</button>
            </div>
          </div>

          <cds-tabs variant="plain" [activeIndex]="0">
            <cds-tab label="Incomplete" icon="ph-bold ph-calendar-x">
              <cds-empty-state icon="ph ph-calendar-blank"
                title="Your schedule is free!"
                message="No scheduled visits at the moment.">
              </cds-empty-state>
            </cds-tab>
            <cds-tab label="Completed" icon="ph-bold ph-calendar-check">
              <cds-empty-state icon="ph ph-calendar-blank"
                title="Your schedule is free!"
                message="No scheduled visits at the moment.">
              </cds-empty-state>
            </cds-tab>
          </cds-tabs>
        </aside>
      </div>
    </main>
  `,
  styles: [`
    :host { display: block; background: var(--cds-surface); min-height: 100vh; }
    .brand { font-family: var(--cds-font-family-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -1px; }
    .brand__one { color: var(--cds-warning-400); }
    .brand__pdo { color: var(--cds-color-primary); }
    .hdr-actions { display: flex; align-items: center; gap: var(--cds-space-16); }

    .calendar-page { display: flex; gap: var(--cds-space-32); align-items: flex-start; }
    .calendar-container { flex: 1 1 auto; display: flex; flex-direction: column; gap: var(--cds-space-24); min-width: 0; }

    /* header */
    .calendar-header { display: flex; align-items: center; justify-content: space-between; }
    .calendar-title { display: flex; align-items: center; gap: var(--cds-space-8); }
    .calendar-title__month { margin: 0; font-family: var(--cds-font-family-semibold); font-weight: var(--cds-weight-semibold); font-size: var(--cds-font-size-3xl); line-height: var(--cds-line-height-xl); letter-spacing: -0.3px; color: var(--cds-text-primary); }
    .calendar-controls { display: flex; align-items: center; gap: var(--cds-space-8); }

    /* weekday header row */
    .weekday-row { display: grid; grid-template-columns: repeat(7, 1fr); }
    .weekday { padding: 8px 12px; font-family: var(--cds-font-family-medium); font-weight: var(--cds-weight-medium); font-size: var(--cds-font-size-md); line-height: var(--cds-line-height-sm); color: var(--cds-text-weekday); }

    /* month grid — PDO: each ngb-dp-day carries its own 1px gray-200 border, no padding */
    .month-grid { display: grid; grid-template-columns: repeat(7, 1fr); }
    .day-cell { min-height: 112px; padding: 0; border: 1px solid var(--cds-border-grid); }
    .day-cell__num { font-size: var(--cds-font-size-md); color: var(--cds-text-primary); }
    .day-cell--outside .day-cell__num { color: var(--cds-text-disabled, #d1d1d6); }
    .day-cell--today { background: var(--cds-surface-muted, #f4f4f5); }
    .day-cell--today .day-cell__num { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 100px; background: var(--cds-color-primary); color: #fff; }

    /* schedule side panel */
    .schedules { flex: 0 0 320px; width: 320px; display: flex; flex-direction: column; gap: var(--cds-space-24); }
    .schedules__header-row { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--cds-space-16); }
    .schedules__title { margin: 0; font-family: var(--cds-font-family-semibold); font-weight: var(--cds-weight-semibold); font-size: var(--cds-font-size-lg); line-height: var(--cds-line-height-lg); color: var(--cds-text-primary); }
    .schedules__subtitle { margin: 0; font-size: var(--cds-font-size-md); line-height: 22.4px; color: var(--cds-text-secondary); } /* PDO .schedules__header p line-height */

    /* toolbar nav buttons (prev / Today / next) — PDO renders 0 vertical / 12px horizontal padding */
    .calendar-controls ::ng-deep .cds-btn:not(.cds-btn--icon-only) { padding: 0 var(--cds-space-12); }

    /* "Log past visit" — PDO matches the inner text span: transparent, borderless, no radius/padding, 500 weight, 14px line-box */
    .schedules__header-row ::ng-deep .cds-btn.schedules__log-past {
      background: transparent; border: 0; border-radius: 0; padding: 0; gap: normal;
      font-weight: var(--cds-weight-semibold); line-height: 14px;
    }

    /* schedules empty-state — PDO renders a compact, start-aligned block (not the centered hero) */
    .schedules ::ng-deep cds-empty-state .cds-empty__title {
      font-size: var(--cds-font-size-lg); font-weight: var(--cds-weight-medium);
      line-height: 19px; color: var(--cds-text-secondary); text-align: start;
    }
    .schedules ::ng-deep cds-empty-state .cds-empty__message {
      font-size: var(--cds-font-size-md); line-height: var(--cds-line-height-md); text-align: start;
    }
  `],
})
export class AgentCalendarPage {
  placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12" fill="rgb(207,212,220)"/></svg>'
  );

  // Full weekday names — real template getWeekdays(), first day Sunday.
  weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  days: DayCell[] = this.buildDays();

  private buildDays(): DayCell[] {
    const cells: DayCell[] = [];
    // Leading outside days from September (Oct 1 2026 is a Thursday)
    for (const n of [27, 28, 29, 30]) cells.push({ label: String(n), outside: true, today: false });
    // October 1..31 (13 = today / selected)
    for (let n = 1; n <= 31; n++) cells.push({ label: String(n), outside: false, today: n === 13 });
    // Trailing outside days from November to fill 6 weeks (42 cells)
    for (let n = 1; cells.length < 42; n++) cells.push({ label: String(n), outside: true, today: false });
    return cells;
  }
}
