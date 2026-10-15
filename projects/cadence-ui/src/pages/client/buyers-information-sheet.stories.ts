import type { Meta, StoryObj } from '@storybook/angular';
import { ClientBuyersInformationSheetPage } from './buyers-information-sheet.page';
import { CONTRACT } from './buyers-information-sheet.contract';

const meta: Meta<ClientBuyersInformationSheetPage> = {
  title: "Pages/Client/Buyer's Information Sheet",
  component: ClientBuyersInformationSheetPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: CONTRACT } },
  },
};
export default meta;
type Story = StoryObj<ClientBuyersInformationSheetPage>;

export const Page: Story = {};
