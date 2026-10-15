import type { Meta, StoryObj } from '@storybook/angular';
import { StaffStaffOverviewPage } from './staff-overview.page';

const meta: Meta<StaffStaffOverviewPage> = {
  title: 'Pages/Staff/Staff Overview',
  component: StaffStaffOverviewPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;
type Story = StoryObj<StaffStaffOverviewPage>;

export const Page: Story = {};
