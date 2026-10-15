import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CdsTableDirective } from './table.directive';
import { CdsBadgeComponent } from '../badge/badge.component';

const meta: Meta = {
  title: 'Data display/Table',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CdsTableDirective, CdsBadgeComponent] })],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `
      <table cdsTable [hover]="true" style="min-width:520px">
        <thead><tr><th>Lead</th><th>Property</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Nico Ashby</td><td>Townscapes Malvar · Blk 5, Lot 11</td><td><cds-badge variant="success">Approved</cds-badge></td></tr>
          <tr><td>Evan Client</td><td>Residences · Blk 6, Lot 17</td><td><cds-badge variant="warning">For review</cds-badge></td></tr>
          <tr><td>Luca Ashby</td><td>Emerald Heights Residences</td><td><cds-badge variant="neutral">Pending</cds-badge></td></tr>
        </tbody>
      </table>`,
  }),
};

export const CompactStriped: Story = {
  render: () => ({
    template: `
      <table cdsTable [compact]="true" [striped]="true" [bordered]="true" style="min-width:420px">
        <thead><tr><th>Unit</th><th>Price</th></tr></thead>
        <tbody>
          <tr><td>Blk 1, Lot 5</td><td>₱ 4,800,000</td></tr>
          <tr><td>Blk 1, Lot 6</td><td>₱ 5,001,035</td></tr>
          <tr><td>Blk 2, Lot 2</td><td>₱ 3,950,000</td></tr>
        </tbody>
      </table>`,
  }),
};
