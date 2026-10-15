import type { Meta, StoryObj } from '@storybook/angular';
import { AgentSettingsUpdatePasswordPage } from './settings-update-password.page';

const meta: Meta<AgentSettingsUpdatePasswordPage> = {
  title: 'Pages/Settings/Update Password',
  component: AgentSettingsUpdatePasswordPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<AgentSettingsUpdatePasswordPage> = {};
