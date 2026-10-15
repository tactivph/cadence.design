import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CdsInputGroupComponent } from './input-group.component';
import { CdsInputDirective } from '../input/input.directive';

const meta: Meta<CdsInputGroupComponent> = {
  title: 'Forms/Input group',
  component: CdsInputGroupComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CdsInputDirective] })],
};
export default meta;
type Story = StoryObj<CdsInputGroupComponent>;

export const Examples: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:320px">
        <cds-input-group>
          <i cds-prefix class="ph ph-magnifying-glass"></i>
          <input cdsInput type="search" placeholder="Search lead, reference, unit…" />
        </cds-input-group>

        <cds-input-group>
          <span cds-prefix>+63</span>
          <input cdsInput type="tel" placeholder="9XX XXX XXXX" />
        </cds-input-group>

        <cds-input-group>
          <span cds-prefix>₱</span>
          <input cdsInput type="text" placeholder="0.00" />
          <span cds-suffix>.00</span>
        </cds-input-group>
      </div>`,
  }),
};
