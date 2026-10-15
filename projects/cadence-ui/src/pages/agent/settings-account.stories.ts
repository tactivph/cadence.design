import type { Meta, StoryObj } from '@storybook/angular';
import { AgentSettingsAccountPage } from './settings-account.page';

const meta: Meta<AgentSettingsAccountPage> = {
  title: 'Pages/Settings/Account',
  component: AgentSettingsAccountPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<AgentSettingsAccountPage>;

export const Page: Story = {};
