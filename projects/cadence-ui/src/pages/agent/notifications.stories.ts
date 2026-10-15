import type { Meta, StoryObj } from '@storybook/angular';
import { NotificationsPage } from './notifications.page';

const meta: Meta<NotificationsPage> = {
  title: 'Pages/Notifications',
  component: NotificationsPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<NotificationsPage> = {};
