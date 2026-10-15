import type { Meta, StoryObj } from '@storybook/angular';
import { AgentSettingsEditProfilePage } from './settings-edit-profile.page';

const meta: Meta<AgentSettingsEditProfilePage> = {
  title: 'Pages/Settings/Edit Profile',
  component: AgentSettingsEditProfilePage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<AgentSettingsEditProfilePage> = {};
