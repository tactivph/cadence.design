import type { Meta, StoryObj } from '@storybook/angular';
import { AgentEligibilityCalculatorPage } from './eligibility-calculator.page';

const meta: Meta<AgentEligibilityCalculatorPage> = {
  title: 'Pages/Agent/Eligibility Calculator',
  component: AgentEligibilityCalculatorPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<AgentEligibilityCalculatorPage>;

export const Page: Story = {};
