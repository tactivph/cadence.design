import type { Meta, StoryObj } from '@storybook/angular';
import { StaffLeadsListPage } from './leads-list.page';

const meta: Meta<StaffLeadsListPage> = {
  title: 'Pages/Staff/Leads List',
  component: StaffLeadsListPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<StaffLeadsListPage> = {};
