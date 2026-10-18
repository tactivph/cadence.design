import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, computed, inject, signal,
} from '@angular/core';
import { CdsButtonComponent } from '../button/button.component';
import { CdsSkeletonComponent } from '../skeleton/skeleton.component';
import {
  CALENDAR_COLUMNS, CdsCalendarCell, addMonths, buildMonthGrid, isSameDay, startOfMonth, toDateKey,
} from './calendar-grid';

/** Status marker tone shown as a dot under the day numeral. */
export type CdsCalendarMarker = 'success' | 'warning' | 'danger' | 'neutral';

/** Per-day markers keyed by local `yyyy-MM-dd`. */
export type CdsCalendarMarkers = Record<string, readonly CdsCalendarMarker[]>;

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

/** Keyboard step (in days) per arrow key. */
const ARROW_STEP: Record<string, number> = {
  ArrowLeft: -1, ArrowRight: 1, ArrowUp: -CALENDAR_COLUMNS, ArrowDown: CALENDAR_COLUMNS,
};

/**
 * Month-grid calendar: month label, Previous / Today / Next controls, Sunday-first
 * weekday header and a fixed 6x7 day grid. Presentational — it emits what the user
 * chose; the page fetches data and feeds back `markers`.
 *
 *   <cds-calendar [month]="month" [selectedDate]="day" [markers]="markers"
 *                 (monthChange)="load($event)" (selectedDateChange)="day = $event" />
 */
@Component({
  selector: 'cds-calendar',
  standalone: true,
  imports: [CdsButtonComponent, CdsSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CdsCalendarComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly _month = signal(startOfMonth(new Date()));
  private readonly _selected = signal<Date | null>(null);
  private readonly _markers = signal<CdsCalendarMarkers>({});
  private readonly _today = signal(new Date());
  private readonly _focusKey = signal<string | null>(null);

  /** Any date inside the month to show. */
  @Input() set month(v: Date) { this._month.set(startOfMonth(v)); this._focusKey.set(null); }
  get month() { return this._month(); }
  @Input() set selectedDate(v: Date | null) { this._selected.set(v); }
  get selectedDate() { return this._selected(); }
  @Input() set markers(v: CdsCalendarMarkers | null | undefined) { this._markers.set(v ?? {}); }
  /** Override "today" (stories, tests); defaults to the current date. */
  @Input() set today(v: Date) { this._today.set(v); }
  /** Skeleton cells; the header and controls stay visible. */
  @Input() loading = false;

  @Output() selectedDateChange = new EventEmitter<Date>();
  /** Emits the first day of the month the user navigated to. */
  @Output() monthChange = new EventEmitter<Date>();

  readonly weekdays = WEEKDAYS;
  readonly skeletonCells = Array.from({ length: 42 }, (_, i) => i);

  readonly monthLabel = computed(() =>
    new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(this._month()));

  readonly cells = computed(() => {
    const markers = this._markers();
    const selected = this._selected();
    const today = this._today();
    const tabKey = this.tabbableKey();
    return buildMonthGrid(this._month()).map(cell => ({
      ...cell,
      markers: cell.inMonth ? markers[cell.key] ?? [] : [],
      today: isSameDay(cell.date, today),
      selected: cell.inMonth && isSameDay(cell.date, selected),
      tabbable: cell.key === tabKey,
      label: this.ariaLabel(cell, markers[cell.key]),
    }));
  });

  /** Roving tabindex: focused day, else selected, else today, else the 1st of the month. */
  private readonly tabbableKey = computed(() => {
    const inMonth = (d: Date | null) => !!d && startOfMonth(d).getTime() === this._month().getTime();
    const selected = this._selected();
    const today = this._today();
    const fallback = inMonth(selected) ? selected! : inMonth(today) ? today : this._month();
    return this._focusKey() ?? toDateKey(fallback);
  });

  previous() { this.monthChange.emit(addMonths(this._month(), -1)); }
  next() { this.monthChange.emit(addMonths(this._month(), 1)); }

  goToToday() {
    const today = this._today();
    this.monthChange.emit(startOfMonth(today));
    this.selectedDateChange.emit(today);
  }

  select(cell: CdsCalendarCell) {
    if (cell.inMonth) this.selectedDateChange.emit(cell.date);
  }

  onKeydown(event: KeyboardEvent, cell: CdsCalendarCell) {
    const step = ARROW_STEP[event.key];
    if (step !== undefined) {
      event.preventDefault();
      this.moveFocus(cell, step);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.select(cell);
    }
  }

  /** Move to the neighbouring in-month day; stops at the month edges. */
  private moveFocus(from: CdsCalendarCell, step: number) {
    const target = new Date(from.date.getFullYear(), from.date.getMonth(), from.date.getDate() + step);
    const key = toDateKey(target);
    const next = this.cells().find(c => c.key === key && c.inMonth);
    if (!next) return;
    this._focusKey.set(key);
    queueMicrotask(() =>
      this.host.nativeElement.querySelector<HTMLElement>(`[data-date="${key}"]`)?.focus());
  }

  private ariaLabel(cell: CdsCalendarCell, markers: readonly CdsCalendarMarker[] | undefined): string {
    const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(cell.date);
    return markers?.length && cell.inMonth ? `${date}, ${markers.length} marker${markers.length > 1 ? 's' : ''}` : date;
  }
}
