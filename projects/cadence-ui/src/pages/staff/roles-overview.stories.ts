import type { Meta, StoryObj } from '@storybook/angular';
import { StaffRolesOverviewPage } from './roles-overview.page';

/**
 * High-fidelity target for the staff Roles overview analytics dashboard,
 * composed only from Cadence components.
 */
const meta: Meta<StaffRolesOverviewPage> = {
  title: 'Pages/Staff/Roles Overview',
  component: StaffRolesOverviewPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;
type Story = StoryObj<StaffRolesOverviewPage>;

export const Page: Story = {};
