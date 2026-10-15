import type { Meta, StoryObj } from '@storybook/angular';
import { StaffRolesListPage } from './roles-list.page';

const meta: Meta<StaffRolesListPage> = {
  title: 'Pages/Staff/Roles List',
  component: StaffRolesListPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<StaffRolesListPage> = {};
