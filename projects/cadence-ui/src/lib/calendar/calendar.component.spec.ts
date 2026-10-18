import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { CdsCalendarComponent } from './calendar.component';

function setup(init: (c: CdsCalendarComponent) => void = () => {}) {
  const fixture = TestBed.createComponent(CdsCalendarComponent);
  const c = fixture.componentInstance;
  c.month = new Date(2026, 9, 1);
  c.today = new Date(2026, 9, 18);
  init(c);
  fixture.detectChanges();
  return { fixture, c, el: fixture.nativeElement as HTMLElement };
}

describe('CdsCalendarComponent', () => {
  it('renders the label, 7 weekday headers and 42 cells', () => {
    const { el } = setup();
    expect(el.querySelector('.cds-calendar__title')!.textContent).toContain('October 2026');
    expect(el.querySelectorAll('[role=columnheader]').length).toBe(7);
    expect(el.querySelectorAll('.cds-calendar__body [role=gridcell]').length).toBe(42);
  });

  it('mutes outside days as non-interactive and highlights today', () => {
    const { el } = setup();
    const outside = el.querySelector('.cds-calendar__cell--outside')!;
    expect(outside.tagName).toBe('DIV');
    expect(outside.getAttribute('aria-disabled')).toBe('true');
    expect(el.querySelector('.cds-calendar__cell--today')!.getAttribute('data-date')).toBe('2026-10-18');
  });

  it('shows markers and the selected state', () => {
    const { el } = setup(c => {
      c.markers = { '2026-10-05': ['warning', 'success'] };
      c.selectedDate = new Date(2026, 9, 5);
    });
    const cell = el.querySelector('[data-date="2026-10-05"]')!;
    expect(cell.querySelectorAll('.cds-calendar__dot').length).toBe(2);
    expect(cell.getAttribute('aria-selected')).toBe('true');
  });

  it('emits selectedDateChange on click and Enter, not for outside days', () => {
    const { c, el } = setup();
    const spy = vi.fn();
    c.selectedDateChange.subscribe(spy);
    const cell = el.querySelector<HTMLElement>('[data-date="2026-10-09"]')!;
    cell.click();
    cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(spy).toHaveBeenCalledTimes(2);
    el.querySelector<HTMLElement>('.cds-calendar__cell--outside')!.click();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('emits monthChange for previous, next and today', () => {
    const { c, el } = setup();
    const month = vi.fn();
    const day = vi.fn();
    c.monthChange.subscribe(month);
    c.selectedDateChange.subscribe(day);
    const [prev, today, next] = Array.from(el.querySelectorAll<HTMLElement>('.cds-calendar__controls button'));
    prev.click(); next.click(); today.click();
    expect(month.mock.calls.map(([d]) => d.getMonth())).toEqual([8, 10, 9]);
    expect(day).toHaveBeenCalledTimes(1);
  });

  it('moves focus with arrow keys and keeps one tab stop', async () => {
    const { fixture, c, el } = setup();
    document.body.appendChild(el);
    const start = el.querySelector<HTMLElement>('[data-date="2026-10-18"]')!;
    expect(el.querySelectorAll('[tabindex="0"]:not(.cds-btn)').length).toBe(1);
    start.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    await Promise.resolve();
    expect(document.activeElement!.getAttribute('data-date')).toBe('2026-10-19');
    start.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    await Promise.resolve();
    expect(document.activeElement!.getAttribute('data-date')).toBe('2026-10-25');
    expect(c).toBeTruthy();
    el.remove();
  });

  it('renders skeleton cells while loading but keeps header and controls', () => {
    const { el } = setup(c => (c.loading = true));
    expect(el.querySelectorAll('cds-skeleton').length).toBe(42);
    expect(el.querySelectorAll('.cds-calendar__controls button').length).toBe(3);
    expect(el.querySelector('.cds-calendar__title')).toBeTruthy();
  });
});
