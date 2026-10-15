import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CdsFieldGroupComponent } from './field-group.component';
import { CdsFormFieldComponent } from '../form-field/form-field.component';
import { CdsInputDirective } from '../input/input.directive';

const meta: Meta<CdsFieldGroupComponent> = {
  title: 'Forms/Field group',
  component: CdsFieldGroupComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CdsFormFieldComponent, CdsInputDirective] })],
  args: { legend: 'Personal details', hint: 'As shown on your valid ID', layout: 'stack' },
  argTypes: { layout: { control: 'inline-radio', options: ['stack', 'row'] } },
  render: (args) => ({
    props: args,
    template: `
      <cds-field-group [legend]="legend" [hint]="hint" [layout]="layout" style="max-width:520px">
        <cds-form-field label="First name"><input cdsInput type="text" /></cds-form-field>
        <cds-form-field label="Last name"><input cdsInput type="text" /></cds-form-field>
        <cds-form-field label="Email"><input cdsInput type="email" /></cds-form-field>
      </cds-field-group>`,
  }),
};
export default meta;
type Story = StoryObj<CdsFieldGroupComponent>;

export const Stacked: Story = {};
export const Row: Story = { args: { layout: 'row' } };
