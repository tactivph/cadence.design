import type { ApexOptions } from 'ng-apexcharts';
import type { CdsChartConfig, CdsChartType, CdsFunnelStage } from './chart.types';

/** Funnel stages from inputs only: first stage = 100%, order is the order supplied. */
export function funnelStages(categories: string[], values: number[]): CdsFunnelStage[] {
  const first = values[0] ?? 0;
  return categories.map((label, i) => {
    const count = values[i] ?? 0;
    return { label, count, percent: first > 0 ? Math.round((count / first) * 1000) / 10 : 0 };
  });
}

/** Strategy: turns a `CdsChartConfig` into engine options for one chart type. */
export abstract class CdsChartOptionsBuilder {
  protected abstract readonly apexType: 'line' | 'area' | 'bar' | 'donut' | 'heatmap' | 'treemap';

  build(cfg: CdsChartConfig): ApexOptions {
    return {
      chart: {
        type: this.apexType,
        height: cfg.height,
        stacked: cfg.stacked,
        toolbar: { show: false },
        fontFamily: cfg.fontFamily,
        foreColor: cfg.textColor,
        animations: { enabled: false },
      },
      colors: cfg.colors,
      series: this.series(cfg) as ApexOptions['series'],
      legend: { show: cfg.showLegend, position: 'bottom', fontFamily: cfg.fontFamily },
      dataLabels: { enabled: false },
      grid: { borderColor: cfg.gridColor },
      xaxis: { categories: cfg.categories, title: { text: cfg.xTitle } },
      yaxis: { title: { text: cfg.yTitle } },
      ...this.specific(cfg),
    };
  }

  protected series(cfg: CdsChartConfig): unknown {
    return cfg.series.map((s) => ({ name: s.name, data: s.data }));
  }

  protected specific(_cfg: CdsChartConfig): ApexOptions {
    return {};
  }
}

class LineOptions extends CdsChartOptionsBuilder {
  protected readonly apexType = 'line';
  protected override specific(): ApexOptions {
    return { stroke: { curve: 'smooth', width: 2 } };
  }
}

class AreaOptions extends CdsChartOptionsBuilder {
  protected readonly apexType = 'area';
  protected override specific(): ApexOptions {
    return { stroke: { curve: 'smooth', width: 2 }, fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0.05 } } };
  }
}

class BarOptions extends CdsChartOptionsBuilder {
  protected readonly apexType = 'bar';
  protected override specific(cfg: CdsChartConfig): ApexOptions {
    return { plotOptions: { bar: { horizontal: cfg.horizontal, borderRadius: 4 } } };
  }
}

class DonutOptions extends CdsChartOptionsBuilder {
  protected readonly apexType = 'donut';
  protected override series(cfg: CdsChartConfig): unknown {
    return cfg.series[0]?.data ?? [];
  }
  protected override specific(cfg: CdsChartConfig): ApexOptions {
    return { labels: cfg.categories, plotOptions: { pie: { donut: { size: '65%' } } }, stroke: { width: 0 } };
  }
}

class HeatmapOptions extends CdsChartOptionsBuilder {
  protected readonly apexType = 'heatmap';
  protected override specific(cfg: CdsChartConfig): ApexOptions {
    return { colors: [cfg.colors[0]], plotOptions: { heatmap: { radius: 2, shadeIntensity: 0.6 } } };
  }
}

class TreemapOptions extends CdsChartOptionsBuilder {
  protected readonly apexType = 'treemap';
  protected override series(cfg: CdsChartConfig): unknown {
    const first = cfg.series[0];
    return [{ name: first?.name ?? '', data: cfg.categories.map((x, i) => ({ x, y: first?.data[i] ?? 0 })) }];
  }
  protected override specific(cfg: CdsChartConfig): ApexOptions {
    return {
      legend: { show: false },
      dataLabels: { enabled: true },
      plotOptions: { treemap: { distributed: true, enableShades: false } },
      colors: cfg.colors,
    };
  }
}

/** Funnel = centred horizontal bars; the label carries "count (% of first stage)". */
class FunnelOptions extends CdsChartOptionsBuilder {
  protected readonly apexType = 'bar';
  protected override series(cfg: CdsChartConfig): unknown {
    return [{ name: cfg.series[0]?.name ?? '', data: cfg.series[0]?.data ?? [] }];
  }
  protected override specific(cfg: CdsChartConfig): ApexOptions {
    const stages = funnelStages(cfg.categories, cfg.series[0]?.data ?? []);
    return {
      plotOptions: { bar: { horizontal: true, isFunnel: true, distributed: true, borderRadius: 4 } },
      legend: { show: false },
      dataLabels: {
        enabled: true,
        formatter: (_v, opts) => {
          const s = stages[opts.dataPointIndex];
          return `${s.label}: ${s.count} (${s.percent}%)`;
        },
      },
      xaxis: { categories: cfg.categories },
    };
  }
}

const BUILDERS: Readonly<Record<CdsChartType, CdsChartOptionsBuilder>> = {
  funnel: new FunnelOptions(),
  line: new LineOptions(),
  area: new AreaOptions(),
  bar: new BarOptions(),
  donut: new DonutOptions(),
  heatmap: new HeatmapOptions(),
  treemap: new TreemapOptions(),
};

export function chartOptionsFor(type: CdsChartType, cfg: CdsChartConfig): ApexOptions {
  return BUILDERS[type].build(cfg);
}
