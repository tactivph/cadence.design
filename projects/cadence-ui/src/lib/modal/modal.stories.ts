import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CdsModalComponent } from './modal.component';
import { CdsButtonComponent } from '../button/button.component';

const meta: Meta<CdsModalComponent> = {
  title: 'Feedback/Modal',
  component: CdsModalComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CdsButtonComponent] })],
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'] } },
  args: { title: 'Cancel reservation', size: 'md', dismissible: true },
};
export default meta;
type Story = StoryObj<CdsModalComponent>;

export const Default: Story = {
  render: (args) => ({
    props: { ...args, show: false },
    template: `
      <button cds-button (click)="show = true">Open modal</button>
      <cds-modal [open]="show" [title]="title" [size]="size" [dismissible]="dismissible" (closed)="show = false">
        <p class="cds-body-md">This reservation will be released and the unit returned to the inventory. This cannot be undone.</p>
        <div cds-modal-footer>
          <button cds-button variant="secondary" (click)="show = false">Keep reservation</button>
          <button cds-button variant="danger" (click)="show = false">Cancel reservation</button>
        </div>
      </cds-modal>`,
  }),
};
