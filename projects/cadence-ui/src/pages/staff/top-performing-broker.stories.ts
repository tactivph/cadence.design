import type { Meta, StoryObj } from '@storybook/angular';
import { StaffTopPerformingBrokerPage } from './top-performing-broker.page';

const meta: Meta<StaffTopPerformingBrokerPage> = {
  title: 'Pages/Staff/Top Performing Broker',
  component: StaffTopPerformingBrokerPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<StaffTopPerformingBrokerPage> = {};
