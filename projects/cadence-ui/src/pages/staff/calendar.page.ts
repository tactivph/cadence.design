import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CdsTopNavComponent, CdsNavItemComponent, CdsButtonComponent,
  CdsUserChipComponent, CdsNotifBellComponent,
  CdsTabsComponent, CdsTabComponent, CdsEmptyStateComponent,
} from '../../public-api';

interface DayCell { label: string; outside: boolean; today: boolean; dot?: 'pending' | 'success'; }

/**
 * MOCK page — Staff · Calendar (`/staff/calendar`, `CalendarComponent`).
 *
 * SOURCE-FIRST port of PDO `calendar.component.html`. The staff route renders the
 * SAME `CalendarComponent` as the agent calendar, only in staff context. The page
 * BODY (month grid + schedule side panel) is identical to the already-ported,
 * passing agent calendar; only the SHELL and the `isStaff` template branches change.
 *
 * STAFF vs AGENT differences:
 *   - Top-nav shell is the STAFF shell (copied verbatim from the staff
 *     requests-processor sibling: staff nav items, Admin caret, notif bell,
 *     user chip "Tactiv A." / Staff). ACTIVE nav item = "Calendar".
 *   - The "Log past visit" button in the schedule header is guarded by
 *     `@if (!$auth.isStaff)` in the template, so it is HIDDEN for staff
 *     (confirmed absent in the captured reference) and is omitted here.
 *
 * Captured view = MONTH grid, October 2026, day 13 selected (today), schedule
 * dots on Oct 6 (pending), 7 (completed), 8 (completed); EMPTY schedule side
 * panel ("Your schedule is free!").
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
 *         ├ schedules__header → "Schedule" + date subtitle (NO "Log past visit")
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
  selector: 'cds-page-staff-calendar',
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
      <a cds-nav-item>Approval</a>
      <a cds-nav-item>Leads</a>
      <a cds-nav-item>Clients</a>
      <a cds-nav-item>Processor</a>
      <a cds-nav-item>Sales Network</a>
      <a cds-nav-item [active]="true">Calendar</a>
      <a cds-nav-item>Calculator</a>
      <a cds-nav-item>Site Map</a>
      <div cds-topnav-actions class="hdr-actions">
        <a cds-nav-item [hasCaret]="true">Admin</a>
        <cds-notif-bell [count]="0"></cds-notif-bell>
        <cds-user-chip name="Tactiv A." role="Staff"></cds-user-chip>
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
                  @if (d.dot) {
                    <span class="day-cell__dot" [class.day-cell__dot--pending]="d.dot === 'pending'" [class.day-cell__dot--success]="d.dot === 'success'"></span>
                  }
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
              <!-- "Log past visit" is guarded by @if (!$auth.isStaff) in PDO — hidden for staff -->
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

    /* staff caret nav items (Dashboard, Admin) align start, not center (page-scoped) */
    :host ::ng-deep .cds-nav-item--caret { text-align: start; }

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
    .day-cell { position: relative; min-height: 112px; padding: 0; border: 1px solid var(--cds-border-grid); }
    .day-cell__num { font-size: var(--cds-font-size-md); color: var(--cds-text-primary); }
    .day-cell--outside .day-cell__num { color: var(--cds-text-disabled, #d1d1d6); }
    .day-cell--today { background: var(--cds-surface-muted, #f4f4f5); }
    .day-cell--today .day-cell__num { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 100px; background: var(--cds-color-primary); color: #fff; }
    /* schedule dots (compact per-day indicator) */
    .day-cell__dot { position: absolute; left: 12px; top: 48px; width: 8px; height: 8px; border-radius: 100px; }
    .day-cell__dot--pending { background: var(--cds-warning-400); }
    .day-cell__dot--success { background: var(--cds-color-primary); }

    /* schedule side panel */
    .schedules { flex: 0 0 320px; width: 320px; display: flex; flex-direction: column; gap: var(--cds-space-24); }
    .schedules__header-row { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--cds-space-16); }
    .schedules__title { margin: 0; font-family: var(--cds-font-family-semibold); font-weight: var(--cds-weight-semibold); font-size: var(--cds-font-size-lg); line-height: var(--cds-line-height-lg); color: var(--cds-text-primary); }
    .schedules__subtitle { margin: 0; font-size: var(--cds-font-size-md); line-height: 22.4px; color: var(--cds-text-secondary); } /* PDO .schedules__header p line-height */

    /* toolbar nav buttons (prev / Today / next) — PDO renders 0 vertical / 12px horizontal padding */
    .calendar-controls ::ng-deep .cds-btn:not(.cds-btn--icon-only) { padding: 0 var(--cds-space-12); }

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
export class StaffCalendarPage {
  // Full weekday names — real template getWeekdays(), first day Sunday.
  weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  days: DayCell[] = this.buildDays();

  private buildDays(): DayCell[] {
    const cells: DayCell[] = [];
    // Leading outside days from September (Oct 1 2026 is a Thursday)
    for (const n of [27, 28, 29, 30]) cells.push({ label: String(n), outside: true, today: false });
    // October 1..31 (13 = today / selected); dots on 6 / 7 / 8 per the reference
    for (let n = 1; n <= 31; n++) {
      const dot: DayCell['dot'] = n === 6 ? 'pending' : n === 7 || n === 8 ? 'success' : undefined;
      cells.push({ label: String(n), outside: false, today: n === 13, dot });
    }
    // Trailing outside days from November to fill 6 weeks (42 cells)
    for (let n = 1; cells.length < 42; n++) cells.push({ label: String(n), outside: true, today: false });
    return cells;
  }
}
