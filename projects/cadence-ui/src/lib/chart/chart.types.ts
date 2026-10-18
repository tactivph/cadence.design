/** Chart kinds supported by `cds-chart`. `bar` becomes horizontal via the `horizontal` input. */
export type CdsChartType = 'funnel' | 'line' | 'area' | 'bar' | 'donut' | 'heatmap' | 'treemap';

/**
 * One named run of values aligned to `categories`.
 * - line / area / bar: one series per legend entry, one value per category.
 * - heatmap: one series per row, one value per column category.
 * - funnel / donut / treemap: only the first series is read, one value per category (stage / slice / tile).
 */
export interface CdsChartSeries {
  name: string;
  data: number[];
}

/** A funnel row derived from the inputs; `percent` is relative to the first stage (= 100). */
export interface CdsFunnelStage {
  label: string;
  count: number;
  percent: number;
}

/** Everything a builder needs to describe one chart. Colours are resolved CSS values, never literals. */
export interface CdsChartConfig {
  categories: string[];
  series: CdsChartSeries[];
  colors: string[];
  horizontal: boolean;
  stacked: boolean;
  height: number;
  xTitle?: string;
  yTitle?: string;
  showLegend: boolean;
  fontFamily: string;
  textColor: string;
  gridColor: string;
}
