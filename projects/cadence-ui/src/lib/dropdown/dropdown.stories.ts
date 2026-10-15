import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CdsDropdownComponent } from './dropdown.component';
import { CdsMenuItemComponent } from './menu-item.component';
import { CdsButtonComponent } from '../button/button.component';

const meta: Meta<CdsDropdownComponent> = {
  title: 'Actions/Dropdown',
  component: CdsDropdownComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CdsMenuItemComponent, CdsButtonComponent] })],
  argTypes: { align: { control: 'inline-radio', options: ['start', 'end'] } },
  args: { align: 'start' },
};
export default meta;
type Story = StoryObj<CdsDropdownComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="padding:0 0 180px">
        <cds-dropdown [align]="align">
          <button cds-dropdown-trigger cds-button variant="secondary" iconRight="ph ph-caret-down">Actions</button>
          <button cds-menu-item icon="ph ph-pencil-simple">Edit</button>
          <button cds-menu-item icon="ph ph-paper-plane-tilt">Resend invite</button>
          <button cds-menu-item icon="ph ph-trash" [danger]="true">Delete</button>
        </cds-dropdown>
      </div>`,
  }),
};
