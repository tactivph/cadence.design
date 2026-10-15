import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CdsFormFieldComponent } from './form-field.component';
import { CdsInputDirective } from '../input/input.directive';

const meta: Meta<CdsFormFieldComponent> = {
  title: 'Forms/Form field',
  component: CdsFormFieldComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CdsInputDirective] })],
  args: { label: 'Email', hint: "We'll never share it.", required: true },
  render: (args) => ({
    props: args,
    template: `<cds-form-field [label]="label" [hint]="hint" [error]="error" [required]="required" style="width:320px">
      <input cdsInput type="email" placeholder="you@example.com" [invalid]="!!error" />
    </cds-form-field>`,
  }),
};
export default meta;
type Story = StoryObj<CdsFormFieldComponent>;

export const Default: Story = {};
export const Invalid: Story = { args: { error: 'Enter a valid email address.' } };

export const Controls: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:320px">
        <cds-form-field label="Text"><input cdsInput type="text" placeholder="Placeholder" /></cds-form-field>
        <cds-form-field label="Disabled"><input cdsInput type="text" value="Read only" disabled /></cds-form-field>
        <cds-form-field label="Select">
          <select cdsInput><option>Spot Cash</option><option>In-House</option><option>Bank Financing</option></select>
        </cds-form-field>
        <cds-form-field label="Notes"><textarea cdsInput rows="3" placeholder="Add a note…"></textarea></cds-form-field>
      </div>`,
  }),
};
