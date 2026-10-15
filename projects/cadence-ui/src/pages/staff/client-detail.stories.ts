import type { Meta, StoryObj } from '@storybook/angular';
import { StaffClientDetailPage } from './client-detail.page';

const meta: Meta<StaffClientDetailPage> = {
  title: 'Pages/Staff/Client Detail',
  component: StaffClientDetailPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<StaffClientDetailPage> = {};
