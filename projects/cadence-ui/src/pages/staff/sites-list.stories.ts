import type { Meta, StoryObj } from '@storybook/angular';
import { StaffSitesListPage } from './sites-list.page';

const meta: Meta<StaffSitesListPage> = {
  title: 'Pages/Staff/Sites List',
  component: StaffSitesListPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<StaffSitesListPage> = {};
