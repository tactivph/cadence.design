import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { chartOptionsFor, funnelStages } from './chart-options';
import { CdsChartTheme } from './chart-theme';
import { CdsChartComponent } from './chart.component';
import type { CdsChartConfig } from './chart.types';

const cfg = (over: Partial<CdsChartConfig> = {}): CdsChartConfig => ({
  categories: ['A', 'B', 'C'],
  series: [{ name: 'S', data: [10, 5, 1] }],
  colors: ['#111', '#222', '#333'],
  horizontal: false,
  stacked: false,
  height: 200,
  showLegend: true,
  fontFamily: 'Inter',
  textColor: '#000',
  gridColor: '#eee',
  ...over,
});

describe('funnelStages', () => {
  it('treats the first stage as 100% and computes the rest from inputs', () => {
    expect(funnelStages(['a', 'b', 'c'], [200, 50, 1]).map((s) => s.percent)).toEqual([100, 25, 0.5]);
  });
  it('is 0% everywhere when the first stage is empty', () => {
    expect(funnelStages(['a', 'b'], [0, 4]).map((s) => s.percent)).toEqual([0, 0]);
  });
});

describe('chartOptionsFor', () => {
  it.each([
    ['line', 'line'],
    ['area', 'area'],
    ['bar', 'bar'],
    ['donut', 'donut'],
    ['heatmap', 'heatmap'],
    ['treemap', 'treemap'],
    ['funnel', 'bar'],
  ] as const)('%s maps to engine type %s', (type, engine) => {
    expect(chartOptionsFor(type, cfg()).chart?.type).toBe(engine);
  });

  it('makes bars horizontal on request', () => {
    expect(chartOptionsFor('bar', cfg({ horizontal: true })).plotOptions?.bar?.horizontal).toBe(true);
  });
  it('donut reads plain values and labels', () => {
    const o = chartOptionsFor('donut', cfg());
    expect(o.series).toEqual([10, 5, 1]);
    expect(o.labels).toEqual(['A', 'B', 'C']);
  });
  it('treemap builds x/y tiles', () => {
    expect(chartOptionsFor('treemap', cfg()).series).toEqual([{ name: 'S', data: [{ x: 'A', y: 10 }, { x: 'B', y: 5 }, { x: 'C', y: 1 }] }]);
  });
  it('funnel is a funnel bar', () => {
    expect(chartOptionsFor('funnel', cfg()).plotOptions?.bar?.isFunnel).toBe(true);
  });
});

describe('CdsChartTheme', () => {
  it('cycles the palette past the token count', () => {
    const p = new CdsChartTheme().palette(10);
    expect(p).toHaveLength(10);
    expect(p[8]).toBe(p[0]);
  });
  it('honours an explicit colour override', () => {
    expect(new CdsChartTheme().palette(3, ['#abc'])).toEqual(['#abc', '#abc', '#abc']);
  });
});

describe('CdsChartComponent states', () => {
  const render = (inputs: Record<string, unknown>) => {
    const fixture = TestBed.createComponent(CdsChartComponent);
    fixture.componentRef.setInput('ariaLabel', 'Test chart');
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('shows a skeleton while loading', () => {
    const el = render({ type: 'bar', loading: true, series: [{ name: 'S', data: [1] }] });
    expect(el.querySelector('cds-skeleton')).toBeTruthy();
    expect(el.querySelector('apx-chart')).toBeNull();
  });
  it('shows the empty state when there is no data', () => {
    const el = render({ type: 'bar', series: [], emptyTitle: 'Nothing here' });
    expect(el.querySelector('cds-empty-state')?.textContent).toContain('Nothing here');
  });
  it('hides the chart in the error state', () => {
    const el = render({ type: 'bar', error: true, series: [{ name: 'S', data: [1] }] });
    expect(el.querySelector('[role="alert"]')).toBeTruthy();
    expect(el.querySelector('apx-chart')).toBeNull();
  });
  it('renders the chart with a described data table fallback', () => {
    const el = render({ type: 'funnel', categories: ['Lead', 'Won'], series: [{ name: 'N', data: [4, 1] }] });
    expect(el.querySelector('apx-chart')).toBeTruthy();
    const canvas = el.querySelector('[role="img"]')!;
    expect(canvas.getAttribute('aria-label')).toBe('Test chart');
    const table = el.querySelector(`#${canvas.getAttribute('aria-describedby')} table`)!;
    expect(table.textContent).toContain('25%');
  });
});
