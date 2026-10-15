import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CdsTopNavComponent } from './top-nav.component';
import { CdsNavItemComponent } from './nav-item.component';
import { CdsButtonComponent } from '../../button/button.component';
import { CdsUserChipComponent } from '../user-chip/user-chip.component';

const meta: Meta = {
  title: 'Navigation/App header',
  decorators: [moduleMetadata({ imports: [CdsTopNavComponent, CdsNavItemComponent, CdsButtonComponent, CdsUserChipComponent] })],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const AgentHeader: Story = {
  render: () => ({
    template: `
      <cds-top-nav>
        <span cds-topnav-brand style="font-weight:800;font-size:1.5rem;letter-spacing:-1px">
          <span style="color:var(--cds-warning-400)">one</span><span style="color:var(--cds-color-primary)">PDO</span>
        </span>
        <a cds-nav-item>Dashboard</a>
        <a cds-nav-item>Leads</a>
        <a cds-nav-item [active]="true">Clients</a>
        <a cds-nav-item>Calendar</a>
        <a cds-nav-item>Calculator</a>
        <a cds-nav-item>Site Map</a>
        <div cds-topnav-actions style="display:flex;align-items:center;gap:12px">
          <button cds-button variant="ghost" size="md" iconOnly iconLeft="ph-bold ph-question" aria-label="Help"></button>
          <button cds-button variant="ghost" size="md" iconOnly iconLeft="ph-bold ph-bell" aria-label="Notifications"></button>
          <cds-user-chip name="Jude Calder" role="Agent"></cds-user-chip>
        </div>
      </cds-top-nav>`,
  }),
};

export const StaffHeaderWithDropdowns: Story = {
  render: () => ({
    template: `
      <cds-top-nav>
        <span cds-topnav-brand style="font-weight:800;font-size:1.5rem;letter-spacing:-1px">
          <span style="color:var(--cds-warning-400)">one</span><span style="color:var(--cds-color-primary)">PDO</span>
        </span>
        <a cds-nav-item [active]="true" [hasCaret]="true">Dashboard</a>
        <a cds-nav-item>Approval</a>
        <a cds-nav-item>Leads</a>
        <a cds-nav-item>Clients</a>
        <a cds-nav-item>Processor</a>
        <a cds-nav-item>Sales Network</a>
        <a cds-nav-item [hasCaret]="true">Admin</a>
        <div cds-topnav-actions><cds-user-chip name="Super Admin" role="Staff"></cds-user-chip></div>
      </cds-top-nav>`,
  }),
};
