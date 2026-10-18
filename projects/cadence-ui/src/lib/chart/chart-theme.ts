/** Theme tokens a chart reads from the document, in series order. Re-theming = overriding these variables. */
export const CDS_CHART_PALETTE_TOKENS: readonly string[] = [
  '--cds-primary-600',
  '--cds-info-600',
  '--cds-warning-500',
  '--cds-accent-orange-500',
  '--cds-success-500',
  '--cds-danger-500',
  '--cds-accent-violet-800',
  '--cds-accent-slate-700',
];

/** Last-resort values when tokens are not loaded (e.g. unit tests); mirror the token defaults. */
const FALLBACKS: Readonly<Record<string, string>> = {
  '--cds-primary-600': '#099250',
  '--cds-info-600': '#1570ef',
  '--cds-warning-500': '#f79009',
  '--cds-accent-orange-500': '#ef6820',
  '--cds-success-500': '#12b76a',
  '--cds-danger-500': '#f04438',
  '--cds-accent-violet-800': '#5720b7',
  '--cds-accent-slate-700': '#3d4a5c',
  '--cds-text-secondary': '#344054',
  '--cds-border-subtle': '#eaecf0',
  '--cds-font-family-base': 'Inter, sans-serif',
};

/** Resolves design tokens to concrete values for the chart engine (which cannot read `var()`). */
export class CdsChartTheme {
  constructor(private readonly host: Element | null = null) {}

  token(name: string): string {
    const root = this.host ?? (typeof document !== 'undefined' ? document.documentElement : null);
    const live = root ? getComputedStyle(root).getPropertyValue(name).trim() : '';
    return live || FALLBACKS[name] || '';
  }

  /** Palette for `count` series; cycles when there are more series than tokens. */
  palette(count: number, override?: readonly string[]): string[] {
    const source = override?.length ? [...override] : CDS_CHART_PALETTE_TOKENS.map((t) => this.token(t));
    return Array.from({ length: Math.max(count, 1) }, (_, i) => source[i % source.length]);
  }
}
