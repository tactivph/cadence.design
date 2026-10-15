import type { Meta, StoryObj } from '@storybook/angular';
import { CdsRadioComponent } from './radio.component';

const meta: Meta<CdsRadioComponent> = {
  title: 'Forms/Radio',
  component: CdsRadioComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<CdsRadioComponent>;

export const FinancingScheme: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:10px">
        <cds-radio name="scheme" value="spot" [checked]="true">Spot Cash</cds-radio>
        <cds-radio name="scheme" value="inhouse">In-House Financing</cds-radio>
        <cds-radio name="scheme" value="bank">Bank Financing</cds-radio>
        <cds-radio name="scheme" value="hdmf" [disabled]="true">HDMF / Pag-IBIG (unavailable)</cds-radio>
      </div>`,
  }),
};
