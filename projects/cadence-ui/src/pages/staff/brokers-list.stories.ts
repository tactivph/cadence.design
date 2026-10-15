import type { Meta, StoryObj } from '@storybook/angular';
import { StaffBrokersListPage } from './brokers-list.page';

const meta: Meta<StaffBrokersListPage> = {
  title: 'Pages/Staff/Brokers List',
  component: StaffBrokersListPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<StaffBrokersListPage> = {};
