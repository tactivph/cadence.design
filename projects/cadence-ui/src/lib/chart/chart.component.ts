import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { CdsEmptyStateComponent } from '../empty-state/empty-state.component';
import { CdsSkeletonComponent } from '../skeleton/skeleton.component';
import { chartOptionsFor, funnelStages } from './chart-options';
import { CdsChartTheme } from './chart-theme';
import type { CdsChartConfig, CdsChartSeries, CdsChartType } from './chart.types';

let nextId = 0;

/**
 * Presentational chart: funnel, line, area, bar (+ horizontal), donut, heatmap, treemap.
 * Takes typed data only; no fetching. Colours and font come from the Cadence theme tokens.
 *
 *   <cds-chart type="area" [categories]="months" [series]="series" ariaLabel="Leads per month"
 *       xTitle="Month" yTitle="Leads" />
 *
 * Page-level states stay in the card: `loading` shows a skeleton, `error` shows the
 * `[cdsChartError]` slot, and no data shows the `[cdsChartEmpty]` slot (default `cds-empty-state`).
 * A visually hidden data table (referenced by `aria-describedby`) is the text alternative.
 */
@Component({
  selector: 'cds-chart',
  standalone: true,
  imports: [ChartComponent, CdsEmptyStateComponent, CdsSkeletonComponent],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cds-chart' },
})
export class CdsChartComponent {
  readonly type = input.required<CdsChartType>();
  /** Column / stage / slice / tile labels, aligned to every series' `data`. */
  readonly categories = input<string[]>([]);
  readonly series = input<CdsChartSeries[]>([]);
  /** Accessible name for the chart (required for a11y). */
  readonly ariaLabel = input.required<string>();
  /** Optional one-line summary read before the data table. */
  readonly summary = input<string>();
  readonly xTitle = input<string>();
  readonly yTitle = input<string>();
  readonly horizontal = input(false);
  readonly stacked = input(false);
  readonly height = input(320);
  /** Override the theme palette with resolved CSS colours (e.g. from a token). */
  readonly colors = input<string[]>();
  readonly legend = input(true);
  readonly loading = input(false);
  readonly error = input(false);
  readonly emptyTitle = input('No data to display');
  readonly emptyMessage = input<string>();

  protected readonly id = `cds-chart-${nextId++}`;
  private readonly host = inject<ElementRef<Element>>(ElementRef);

  protected readonly hasData = computed(() => this.series().some((s) => s.data.some((v) => v > 0)));
  protected readonly state = computed<'loading' | 'error' | 'empty' | 'ready'>(() => {
    if (this.loading()) return 'loading';
    if (this.error()) return 'error';
    return this.hasData() ? 'ready' : 'empty';
  });

  protected readonly options = computed(() => {
    if (this.state() !== 'ready') return null;
    const theme = new CdsChartTheme(this.host.nativeElement);
    const series = this.series();
    const config: CdsChartConfig = {
      categories: this.categories(),
      series,
      colors: theme.palette(this.type() === 'donut' || this.type() === 'treemap' ? this.categories().length : series.length, this.colors()),
      horizontal: this.horizontal(),
      stacked: this.stacked(),
      height: this.height(),
      xTitle: this.xTitle(),
      yTitle: this.yTitle(),
      showLegend: this.legend(),
      fontFamily: theme.token('--cds-font-family-base'),
      textColor: theme.token('--cds-text-secondary'),
      gridColor: theme.token('--cds-border-subtle'),
    };
    return chartOptionsFor(this.type(), config);
  });

  /** Rows for the text alternative: funnel adds the % column, others list each series. */
  protected readonly table = computed(() => {
    const cats = this.categories();
    const series = this.series();
    if (this.type() === 'funnel') {
      const stages = funnelStages(cats, series[0]?.data ?? []);
      return { head: ['Stage', 'Count', '% of first stage'], rows: stages.map((s) => [s.label, `${s.count}`, `${s.percent}%`]) };
    }
    if (this.type() === 'donut' || this.type() === 'treemap') {
      return { head: ['Category', series[0]?.name ?? 'Value'], rows: cats.map((c, i) => [c, `${series[0]?.data[i] ?? 0}`]) };
    }
    return { head: ['Category', ...series.map((s) => s.name)], rows: cats.map((c, i) => [c, ...series.map((s) => `${s.data[i] ?? 0}`)]) };
  });
}
