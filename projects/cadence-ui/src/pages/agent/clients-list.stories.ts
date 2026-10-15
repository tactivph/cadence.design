import type { Meta, StoryObj } from '@storybook/angular';
import { AgentClientsListPage } from './clients-list.page';

const meta: Meta<AgentClientsListPage> = {
  title: 'Pages/Agent/Clients List',
  component: AgentClientsListPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<AgentClientsListPage> = {};
