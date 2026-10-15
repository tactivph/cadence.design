import type { Meta, StoryObj } from '@storybook/angular';
import { SettingsUpdateAddressPage } from './settings-update-address.page';

const meta: Meta<SettingsUpdateAddressPage> = {
  title: 'Pages/Settings/Update Address',
  component: SettingsUpdateAddressPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<SettingsUpdateAddressPage> = {};
