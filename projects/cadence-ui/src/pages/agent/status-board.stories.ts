import type { Meta, StoryObj } from '@storybook/angular';
import { AgentStatusBoardPage } from './status-board.page';
import { CONTRACT } from './status-board.contract';

const meta: Meta<AgentStatusBoardPage> = {
  title: 'Pages/Agent/Status Board',
  component: AgentStatusBoardPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: CONTRACT } },
  },
};
export default meta;
type Story = StoryObj<AgentStatusBoardPage>;

export const Page: Story = {};
