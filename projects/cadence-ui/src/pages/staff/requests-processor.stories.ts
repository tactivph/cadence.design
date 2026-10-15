import type { Meta, StoryObj } from '@storybook/angular';
import { StaffRequestsProcessorPage } from './requests-processor.page';

const meta: Meta<StaffRequestsProcessorPage> = {
  title: 'Pages/Staff/Requests Processor',
  component: StaffRequestsProcessorPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

export const Page: StoryObj<StaffRequestsProcessorPage> = {};
