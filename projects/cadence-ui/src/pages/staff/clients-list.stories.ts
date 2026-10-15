import type { Meta, StoryObj } from '@storybook/angular';
import { StaffClientsListPage } from './clients-list.page';
import { CONTRACT } from './clients-list.contract';

const meta: Meta<StaffClientsListPage> = {
  title: 'Pages/Staff/Clients List',
  component: StaffClientsListPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: CONTRACT } },
  },
};
export default meta;
type Story = StoryObj<StaffClientsListPage>;

export const Page: Story = {};
