import type { Meta, StoryObj } from '@storybook/angular';
import { CdsSpinnerComponent } from './spinner.component';

const meta: Meta<CdsSpinnerComponent> = {
  title: 'Feedback/Spinner',
  component: CdsSpinnerComponent,
  tags: ['autodocs'],
  args: { diameter: 24, thickness: 3 },
};
export default meta;
type Story = StoryObj<CdsSpinnerComponent>;

export const Default: Story = {};
export const Sizes: Story = {
  render: () => ({
    template: `<div style="display:flex;gap:16px;align-items:center">
      <cds-spinner [diameter]="16" [thickness]="2"></cds-spinner>
      <cds-spinner [diameter]="24" [thickness]="3"></cds-spinner>
      <cds-spinner [diameter]="40" [thickness]="4"></cds-spinner>
    </div>`,
  }),
};
