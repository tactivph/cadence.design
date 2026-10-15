import type { Meta, StoryObj } from '@storybook/angular';
import { CdsBreadcrumbComponent } from './breadcrumb.component';

const meta: Meta<CdsBreadcrumbComponent> = {
  title: 'Navigation/Breadcrumb',
  component: CdsBreadcrumbComponent,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Clients', href: '/clients' },
      { label: 'Evan Client', href: '/clients/572' },
      { label: 'Requirements' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<cds-breadcrumb [items]="items"></cds-breadcrumb>`,
  }),
};
export default meta;
type Story = StoryObj<CdsBreadcrumbComponent>;

export const Default: Story = {};
