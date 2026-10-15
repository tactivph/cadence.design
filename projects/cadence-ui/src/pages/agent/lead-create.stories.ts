import type { Meta, StoryObj } from '@storybook/angular';
import { AgentLeadCreatePage } from './lead-create.page';

const meta: Meta<AgentLeadCreatePage> = {
  title: 'Pages/Agent/Lead Create',
  component: AgentLeadCreatePage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<AgentLeadCreatePage> = {};
