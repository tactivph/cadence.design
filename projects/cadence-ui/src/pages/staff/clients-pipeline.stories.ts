import type { Meta, StoryObj } from '@storybook/angular';
import { StaffClientsPipelinePage } from './clients-pipeline.page';

const meta: Meta<StaffClientsPipelinePage> = {
  title: 'Pages/Staff/Clients Pipeline',
  component: StaffClientsPipelinePage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<StaffClientsPipelinePage> = {};
