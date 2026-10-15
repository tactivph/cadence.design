import type { Meta, StoryObj } from '@storybook/angular';
import { StaffEligibilityCalculatorPage } from './eligibility-calculator.page';

const meta: Meta<StaffEligibilityCalculatorPage> = {
  title: 'Pages/Staff/Eligibility Calculator',
  component: StaffEligibilityCalculatorPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<StaffEligibilityCalculatorPage> = {};
