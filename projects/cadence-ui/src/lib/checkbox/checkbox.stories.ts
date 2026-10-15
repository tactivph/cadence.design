import type { Meta, StoryObj } from '@storybook/angular';
import { CdsCheckboxComponent } from './checkbox.component';

const meta: Meta<CdsCheckboxComponent> = {
  title: 'Forms/Checkbox',
  component: CdsCheckboxComponent,
  tags: ['autodocs'],
  args: { checked: false, disabled: false, indeterminate: false },
  render: (args) => ({
    props: args,
    template: `<cds-checkbox [checked]="checked" [disabled]="disabled" [indeterminate]="indeterminate">I agree to the terms</cds-checkbox>`,
  }),
};
export default meta;
type Story = StoryObj<CdsCheckboxComponent>;

export const Unchecked: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Indeterminate: Story = { args: { indeterminate: true } };
export const Disabled: Story = { args: { disabled: true, checked: true } };
