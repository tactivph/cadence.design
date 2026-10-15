import type { Meta, StoryObj } from '@storybook/angular';
import { StaffApprovalsListPage } from './approvals-list.page';

const meta: Meta<StaffApprovalsListPage> = {
  title: 'Pages/Staff/Approvals List',
  component: StaffApprovalsListPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<StaffApprovalsListPage> = {};
