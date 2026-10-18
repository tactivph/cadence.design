import { describe, expect, it } from 'vitest';
import { CALENDAR_CELLS, addMonths, buildMonthGrid, isSameDay, startOfMonth, toDateKey } from './calendar-grid';

describe('calendar-grid', () => {
  it('always builds 42 Sunday-first cells', () => {
    for (const m of [0, 1, 2, 8, 11]) {
      const grid = buildMonthGrid(new Date(2026, m, 15));
      expect(grid.length).toBe(CALENDAR_CELLS);
      expect(grid[0].date.getDay()).toBe(0);
    }
  });

  it('flags only the visible month as in-month', () => {
    const grid = buildMonthGrid(new Date(2026, 9, 18)); // Oct 2026 starts on Thursday
    expect(grid[0].key).toBe('2026-09-27');
    expect(grid[0].inMonth).toBe(false);
    expect(grid.filter(c => c.inMonth).length).toBe(31);
    expect(grid.find(c => c.inMonth)!.key).toBe('2026-10-01');
  });

  it('formats local date keys and compares days', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(isSameDay(new Date(2026, 0, 5, 1), new Date(2026, 0, 5, 23))).toBe(true);
    expect(isSameDay(null, new Date())).toBe(false);
  });

  it('adds months across year boundaries', () => {
    expect(toDateKey(addMonths(new Date(2026, 11, 20), 1))).toBe('2027-01-01');
    expect(toDateKey(startOfMonth(new Date(2026, 4, 20)))).toBe('2026-05-01');
  });
});
