import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CdsAlertComponent } from './alert.component';
import { CdsButtonComponent } from '../button/button.component';

const meta: Meta<CdsAlertComponent> = {
  title: 'Feedback/Alert',
  component: CdsAlertComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CdsButtonComponent] })],
  argTypes: {
    variant: { control: 'select', options: ['success', 'warning', 'danger', 'info', 'neutral', 'primary'] },
    dismissible: { control: 'boolean' },
  },
  args: { variant: 'info', title: 'Heads up', dismissible: false },
  render: (args) => ({
    props: args,
    template: `<cds-alert [variant]="variant" [title]="title" [dismissible]="dismissible" style="max-width:520px">
      This is an inline alert message with supporting detail.
    </cds-alert>`,
  }),
};
export default meta;
type Story = StoryObj<CdsAlertComponent>;

export const Info: Story = {};
export const Success: Story = { args: { variant: 'success', title: 'Saved' } };
export const Warning: Story = { args: { variant: 'warning', title: 'Almost there' } };

export const CasExpired: Story = {
  args: { variant: 'danger', title: 'CAS expired · Action needed', dismissible: false },
  render: (args) => ({
    props: args,
    template: `<cds-alert [variant]="variant" [title]="title" style="max-width:640px">
      Expired on September 13, 2026. Upload a signed CAS or send a new online CAS to continue.
      <div cds-alert-actions>
        <button cds-button variant="secondary" size="sm">Resend email</button>
        <button cds-button variant="danger" size="sm" iconLeft="ph ph-upload-simple">Upload CAS</button>
      </div>
    </cds-alert>`,
  }),
};
