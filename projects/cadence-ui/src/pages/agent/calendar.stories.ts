import type { Meta, StoryObj } from '@storybook/angular';
import { AgentCalendarPage } from './calendar.page';

const meta: Meta<AgentCalendarPage> = {
  title: 'Pages/Agent/Calendar',
  component: AgentCalendarPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<AgentCalendarPage> = {};
