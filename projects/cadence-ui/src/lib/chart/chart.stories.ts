import type { Meta, StoryObj } from '@storybook/angular';
import { CdsChartComponent } from './chart.component';
import type { CdsChartSeries } from './chart.types';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const lines: CdsChartSeries[] = [
  { name: 'Leads', data: [32, 41, 38, 55, 62, 70] },
  { name: 'Reservations', data: [8, 12, 11, 18, 21, 25] },
];
const manySeries: CdsChartSeries[] = Array.from({ length: 10 }, (_, i) => ({
  name: `Series ${i + 1}`,
  data: months.map((_m, j) => 10 + ((i * 7 + j * 5) % 40)),
}));
const funnel: CdsChartSeries[] = [{ name: 'Leads', data: [200, 140, 90, 45, 20] }];
const funnelStagesLabels = ['Lead', 'Contacted', 'Visited', 'Reserved', 'Closed'];
const hours = ['9am', '11am', '1pm', '3pm', '5pm'];
const heat: CdsChartSeries[] = ['Mon', 'Tue', 'Wed', 'Thu'].map((d, i) => ({
  name: d,
  data: hours.map((_h, j) => (i * 3 + j * 2) % 9 + 1),
}));

const meta: Meta<CdsChartComponent> = {
  title: 'Data display/Chart',
  component: CdsChartComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    categories: months,
    series: lines,
    ariaLabel: 'Leads and reservations per month',
    summary: 'Leads grow from 32 to 70 over six months.',
    height: 320,
    loading: false,
    error: false,
    legend: true,
    horizontal: false,
    stacked: false,
  },
  argTypes: {
    type: { control: 'select', options: ['funnel', 'line', 'area', 'bar', 'donut', 'heatmap', 'treemap'] },
  },
};
export default meta;
type Story = StoryObj<CdsChartComponent>;

export const Line: Story = { args: { type: 'line', xTitle: 'Month', yTitle: 'Count' } };
export const Area: Story = { args: { type: 'area', yTitle: 'Count' } };
export const Bar: Story = { args: { type: 'bar' } };
export const HorizontalBar: Story = { args: { type: 'bar', horizontal: true } };
export const Donut: Story = {
  args: { type: 'donut', categories: ['Hot', 'Warm', 'Cold'], series: [{ name: 'Leads', data: [30, 45, 25] }], ariaLabel: 'Leads by temperature' },
};
export const Funnel: Story = {
  args: { type: 'funnel', categories: funnelStagesLabels, series: funnel, ariaLabel: 'Lead conversion funnel' },
};
export const Heatmap: Story = {
  args: { type: 'heatmap', categories: hours, series: heat, ariaLabel: 'Visits by day and time', legend: false },
};
export const Treemap: Story = {
  args: { type: 'treemap', categories: ['Luzon', 'Visayas', 'Mindanao'], series: [{ name: 'Sales', data: [60, 25, 15] }], ariaLabel: 'Sales by region' },
};
export const ManySeries: Story = { args: { type: 'line', series: manySeries, ariaLabel: 'Ten series over six months' } };
export const Loading: Story = { args: { type: 'bar', loading: true } };
export const Empty: Story = { args: { type: 'bar', series: [], emptyMessage: 'Nothing recorded for this period.' } };
export const ErrorState: Story = {
  args: { type: 'bar', error: true },
  render: (args) => ({
    props: args,
    template: `<cds-chart [type]="type" [series]="series" [categories]="categories" [error]="error" [ariaLabel]="ariaLabel">
      <p cdsChartError class="cds-body-sm">Could not load this chart. Try again.</p>
    </cds-chart>`,
  }),
};
