import type { Meta, StoryObj } from '@storybook/angular';
import { StaffStaffFormPage } from './staff-form.page';

const meta: Meta<StaffStaffFormPage> = {
  title: 'Pages/Staff/Staff Form',
  component: StaffStaffFormPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<StaffStaffFormPage> = {};
