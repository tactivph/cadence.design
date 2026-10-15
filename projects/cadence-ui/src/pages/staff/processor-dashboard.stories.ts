import type { Meta, StoryObj } from '@storybook/angular';
import { StaffProcessorDashboardPage } from './processor-dashboard.page';

/**
 * High-fidelity target for the staff Processor analytics dashboard
 * (/staff/dashboard/processor), composed only from Cadence components.
 */
const meta: Meta<StaffProcessorDashboardPage> = {
  title: 'Pages/Staff/Processor Dashboard',
  component: StaffProcessorDashboardPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;
type Story = StoryObj<StaffProcessorDashboardPage>;

export const Page: Story = {};
