import type { Meta, StoryObj } from '@storybook/angular';
import { ClientFinancingPage } from './financing.page';

const meta: Meta<ClientFinancingPage> = {
  title: 'Pages/Client/Financing',
  component: ClientFinancingPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<ClientFinancingPage>;

export const Page: Story = {};
