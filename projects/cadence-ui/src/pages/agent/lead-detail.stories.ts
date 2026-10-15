import type { Meta, StoryObj } from '@storybook/angular';
import { AgentLeadDetailPage } from './lead-detail.page';
import { CONTRACT } from './lead-detail.contract';

const meta: Meta<AgentLeadDetailPage> = {
  title: 'Pages/Agent/Lead Detail',
  component: AgentLeadDetailPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: CONTRACT } },
  },
};
export default meta;
type Story = StoryObj<AgentLeadDetailPage>;

export const Page: Story = {};
