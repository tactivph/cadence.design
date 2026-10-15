import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CdsTabsComponent } from './tabs.component';
import { CdsTabComponent } from './tab.component';

const meta: Meta<CdsTabsComponent> = {
  title: 'Navigation/Tabs',
  component: CdsTabsComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CdsTabComponent] })],
};
export default meta;
type Story = StoryObj<CdsTabsComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <cds-tabs style="max-width:560px;display:block">
        <cds-tab label="Profile" icon="ph ph-user">
          <p class="cds-body-md">Account details, contact and personal information.</p>
        </cds-tab>
        <cds-tab label="Notes" icon="ph ph-note">
          <p class="cds-body-md">Notes added by the broker.</p>
        </cds-tab>
      </cds-tabs>`,
  }),
};

export const WithCounts: Story = {
  render: () => ({
    template: `
      <cds-tabs style="max-width:560px;display:block">
        <cds-tab label="Calculations" [count]="2"><p class="cds-body-md">Broker-submitted calculations awaiting review.</p></cds-tab>
        <cds-tab label="Endorsements" [count]="3"><p class="cds-body-md">Reservations to confirm.</p></cds-tab>
      </cds-tabs>`,
  }),
};
