import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CdsOffcanvasComponent } from './offcanvas.component';
import { CdsButtonComponent } from '../button/button.component';

const meta: Meta<CdsOffcanvasComponent> = {
  title: 'Feedback/Off-canvas',
  component: CdsOffcanvasComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CdsButtonComponent] })],
  argTypes: { position: { control: 'inline-radio', options: ['start', 'end', 'top', 'bottom'] } },
  args: { title: 'Filters', position: 'end' },
};
export default meta;
type Story = StoryObj<CdsOffcanvasComponent>;

export const Default: Story = {
  render: (args) => ({
    props: { ...args, show: false },
    template: `
      <button cds-button variant="secondary" iconLeft="ph ph-funnel" (click)="show = true">Open filters</button>
      <cds-offcanvas [open]="show" [title]="title" [position]="position" (closed)="show = false">
        <p class="cds-body-sm">Panel content goes here — a filter form, an upload area, etc.</p>
        <div cds-offcanvas-footer>
          <button cds-button variant="ghost" (click)="show = false">Clear all</button>
          <button cds-button (click)="show = false">Apply filter</button>
        </div>
      </cds-offcanvas>`,
  }),
};
