import type { Meta, StoryObj } from '@storybook/angular';
import { AgentLeadsListPage } from './leads-list.page';

const meta: Meta<AgentLeadsListPage> = {
  title: 'Pages/Agent/Leads List',
  component: AgentLeadsListPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<AgentLeadsListPage> = {};
