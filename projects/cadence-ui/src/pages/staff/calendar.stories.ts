import type { Meta, StoryObj } from '@storybook/angular';
import { StaffCalendarPage } from './calendar.page';

const meta: Meta<StaffCalendarPage> = {
  title: 'Pages/Staff/Calendar',
  component: StaffCalendarPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<StaffCalendarPage> = {};
