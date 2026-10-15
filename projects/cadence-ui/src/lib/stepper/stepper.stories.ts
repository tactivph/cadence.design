import type { Meta, StoryObj } from '@storybook/angular';
import { CdsStepperComponent } from './stepper.component';

const meta: Meta<CdsStepperComponent> = {
  title: 'Navigation/Stepper',
  component: CdsStepperComponent,
  tags: ['autodocs'],
  args: {
    activeIndex: 2,
    steps: [
      { label: 'Set schedule', description: 'Request a tripping' },
      { label: 'Complete site visit', description: 'Log the assessment' },
      { label: 'Update profile', description: 'Details for reservation' },
      { label: 'Endorse', description: 'Submit to PDO' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<div style="max-width:720px"><cds-stepper [steps]="steps" [activeIndex]="activeIndex"></cds-stepper></div>`,
  }),
};
export default meta;
type Story = StoryObj<CdsStepperComponent>;

export const LeadFlow: Story = {};
