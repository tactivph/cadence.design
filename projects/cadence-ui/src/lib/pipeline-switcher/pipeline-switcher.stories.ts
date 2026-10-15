import type { Meta, StoryObj } from '@storybook/angular';
import { CdsPipelineSwitcherComponent, CdsPipelineItem } from './pipeline-switcher.component';

const items: CdsPipelineItem[] = [
  { icon: 'ph-fill ph-funnel',        title: 'Leads pipeline',        subtitle: 'Lead → Reservation',           count: 143 },
  { icon: 'ph ph-clipboard-text',     title: 'Requirements pipeline', subtitle: 'Pre-reservation → Turnover',    count: 0 },
];

const meta: Meta<CdsPipelineSwitcherComponent> = {
  title: 'Navigation/Pipeline switcher',
  component: CdsPipelineSwitcherComponent,
  tags: ['autodocs'],
  argTypes: { activeIndex: { control: 'inline-radio', options: [0, 1] } },
  args: { items, activeIndex: 0 },
};
export default meta;

export const Default: StoryObj<CdsPipelineSwitcherComponent> = {};
export const RequirementsActive: StoryObj<CdsPipelineSwitcherComponent> = { args: { activeIndex: 1 } };
