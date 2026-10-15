import type { Meta, StoryObj } from '@storybook/angular';
import { StaffRoleFormPage } from './role-form.page';

const meta: Meta<StaffRoleFormPage> = {
  title: 'Pages/Staff/Role Form',
  component: StaffRoleFormPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<StaffRoleFormPage> = {};
