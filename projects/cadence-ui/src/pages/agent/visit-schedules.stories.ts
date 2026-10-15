import type { Meta, StoryObj } from '@storybook/angular';
import { AgentVisitSchedulesPage } from './visit-schedules.page';

const meta: Meta<AgentVisitSchedulesPage> = {
  title: 'Pages/Agent/Visit Schedules',
  component: AgentVisitSchedulesPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<AgentVisitSchedulesPage> = {};
