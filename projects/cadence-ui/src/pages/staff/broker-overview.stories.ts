import type { Meta, StoryObj } from '@storybook/angular';
import { StaffBrokerOverviewPage } from './broker-overview.page';

/**
 * High-fidelity target for the staff Broker overview analytics dashboard.
 * Composed only from Cadence components; presentational, static fixtures.
 */
const meta: Meta<StaffBrokerOverviewPage> = {
  title: 'Pages/Staff/Broker Overview',
  component: StaffBrokerOverviewPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;
type Story = StoryObj<StaffBrokerOverviewPage>;

export const Page: Story = {};
