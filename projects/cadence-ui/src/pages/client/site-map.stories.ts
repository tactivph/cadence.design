import type { Meta, StoryObj } from '@storybook/angular';
import { ClientSiteMapPage } from './site-map.page';

const meta: Meta<ClientSiteMapPage> = {
  title: 'Pages/Client/Site Map',
  component: ClientSiteMapPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;
type Story = StoryObj<ClientSiteMapPage>;

export const Page: Story = {};
