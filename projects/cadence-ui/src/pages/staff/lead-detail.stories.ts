import type { Meta, StoryObj } from '@storybook/angular';
import { StaffLeadDetailPage } from './lead-detail.page';

const meta: Meta<StaffLeadDetailPage> = {
  title: 'Pages/Staff/Lead Detail',
  component: StaffLeadDetailPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<StaffLeadDetailPage> = {};
