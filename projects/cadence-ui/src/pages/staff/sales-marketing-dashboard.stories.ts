import type { Meta, StoryObj } from '@storybook/angular';
import { StaffSalesMarketingDashboardPage } from './sales-marketing-dashboard.page';
import { CONTRACT } from './sales-marketing-dashboard.contract';

/**
 * High-fidelity target + implementation contract for the staff
 * Sales & Marketing dashboard. The Docs tab renders the full contract.
 */
const meta: Meta<StaffSalesMarketingDashboardPage> = {
  title: 'Pages/Staff/Sales & Marketing Dashboard',
  component: StaffSalesMarketingDashboardPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: CONTRACT } },
  },
};
export default meta;
type Story = StoryObj<StaffSalesMarketingDashboardPage>;

export const Page: Story = {};
