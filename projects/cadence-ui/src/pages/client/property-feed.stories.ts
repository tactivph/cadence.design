import type { Meta, StoryObj } from '@storybook/angular';
import { ClientPropertyFeedPage } from './property-feed.page';

const meta: Meta<ClientPropertyFeedPage> = {
  title: 'Pages/Client/Property Feed',
  component: ClientPropertyFeedPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<ClientPropertyFeedPage> = {};
