import type { Meta, StoryObj } from '@storybook/angular';
import { AgentTeamListPage } from './team-list.page';

const meta: Meta<AgentTeamListPage> = {
  title: 'Pages/Agent/Team List',
  component: AgentTeamListPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<AgentTeamListPage> = {};
