import type { Meta, StoryObj } from '@storybook/angular';
import { CdsLeadTemperatureComponent } from './lead-temperature.component';

const meta: Meta<CdsLeadTemperatureComponent> = {
  title: 'Data display/Lead temperature',
  component: CdsLeadTemperatureComponent,
  tags: ['autodocs'],
  argTypes: { level: { control: 'inline-radio', options: ['hot','warm','cold','dormant'] }, info: { control: 'boolean' } },
  args: { level: 'hot', info: true },
};
export default meta;
export const Default: StoryObj<CdsLeadTemperatureComponent> = {};
export const All: StoryObj = {
  render: () => ({
    template: `<div style="display:flex;gap:8px">
      @for (l of ['hot','warm','cold','dormant']; track l) { <cds-lead-temperature [level]="l" [info]="true"></cds-lead-temperature> }</div>`,
  }),
};
