import type { Meta, StoryObj } from '@storybook/angular';
import { StaffUserManagementPage } from './user-management.page';

const meta: Meta<StaffUserManagementPage> = {
  title: 'Pages/Staff/User Management',
  component: StaffUserManagementPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<StaffUserManagementPage> = {};
