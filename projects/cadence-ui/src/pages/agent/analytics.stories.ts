import type { Meta, StoryObj } from '@storybook/angular';
import { AgentAnalyticsPage } from './analytics.page';

const meta: Meta<AgentAnalyticsPage> = {
  title: 'Pages/Agent/Analytics',
  component: AgentAnalyticsPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;
type Story = StoryObj<AgentAnalyticsPage>;

export const Page: Story = {};
