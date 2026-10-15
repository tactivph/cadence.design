import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CdsCardComponent } from './card.component';
import { CdsButtonComponent } from '../button/button.component';

const meta: Meta<CdsCardComponent> = {
  title: 'Data display/Card',
  component: CdsCardComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CdsButtonComponent] })],
  args: { interactive: false, flush: false },
};
export default meta;
type Story = StoryObj<CdsCardComponent>;

export const Basic: Story = {
  render: (args) => ({
    props: args,
    template: `
      <cds-card [interactive]="interactive" [flush]="flush" style="width:340px">
        <div cds-card-header>Townscapes Malvar</div>
        <p class="cds-body-sm" style="margin:0 0 8px">Block 6, Lot 17 · Single-attached</p>
        <div class="cds-h5">₱ 5,001,035.00</div>
        <div cds-card-footer style="display:flex;gap:8px;justify-content:flex-end">
          <button cds-button variant="ghost" size="sm">View</button>
          <button cds-button size="sm">Reserve</button>
        </div>
      </cds-card>`,
  }),
};

export const Interactive: Story = { args: { interactive: true }, render: Basic.render };
