/** Pure month-grid maths for `cds-calendar` (no Angular, no side effects). */

export const CALENDAR_ROWS = 6;
export const CALENDAR_COLUMNS = 7;
export const CALENDAR_CELLS = CALENDAR_ROWS * CALENDAR_COLUMNS;

export interface CdsCalendarCell {
  date: Date;
  /** `yyyy-MM-dd` in local time; the key used by the markers map. */
  key: string;
  day: number;
  inMonth: boolean;
}

/** Local-time `yyyy-MM-dd` key for a date. */
export function toDateKey(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mm}-${dd}`;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return !!a && !!b && toDateKey(a) === toDateKey(b);
}

/** The fixed 42 cells (Sunday-first) covering the month containing `month`. */
export function buildMonthGrid(month: Date): CdsCalendarCell[] {
  const first = startOfMonth(month);
  const gridStart = new Date(first.getFullYear(), first.getMonth(), 1 - first.getDay());
  return Array.from({ length: CALENDAR_CELLS }, (_, i) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    return {
      date,
      key: toDateKey(date),
      day: date.getDate(),
      inMonth: date.getMonth() === first.getMonth() && date.getFullYear() === first.getFullYear(),
    };
  });
}
