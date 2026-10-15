import type { Meta, StoryObj } from '@storybook/angular';
import { ClientRequirementsHubPage } from './requirements-hub.page';
import { CONTRACT } from './requirements-hub.contract';

const meta: Meta<ClientRequirementsHubPage> = {
  title: 'Pages/Client/Requirements Hub',
  component: ClientRequirementsHubPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: CONTRACT } },
  },
};
export default meta;
type Story = StoryObj<ClientRequirementsHubPage>;

export const Page: Story = {};
