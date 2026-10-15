import type { Meta, StoryObj } from '@storybook/angular';
import { CdsNotifBellComponent } from './notif-bell.component';

const meta: Meta<CdsNotifBellComponent> = {
  title: 'Navigation/Notification bell',
  component: CdsNotifBellComponent,
  tags: ['autodocs'],
  args: { count: 19 },
};
export default meta;
export const Default: StoryObj<CdsNotifBellComponent> = {};
