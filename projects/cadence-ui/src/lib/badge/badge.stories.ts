import type { Meta, StoryObj } from '@storybook/angular';
import { CdsBadgeComponent } from './badge.component';

const TONES = ['neutral','muted','success','primary','info','danger','warning','seasoning','homeowner','takeout','forfeited'];

const meta: Meta<CdsBadgeComponent> = {
  title: 'Data display/Badge',
  component: CdsBadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: TONES },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    dot: { control: 'boolean' },
    icon: { control: 'text' },
  },
  args: { tone: 'success', size: 'md' },
  render: (args) => ({
    props: args,
    template: `<cds-badge [tone]="tone" [size]="size" [dot]="dot" [icon]="icon">Label</cds-badge>`,
  }),
};
export default meta;
type Story = StoryObj<CdsBadgeComponent>;

export const Default: Story = {};

export const AllTones: Story = {
  render: () => ({
    props: { tones: TONES },
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        @for (t of tones; track t) { <cds-badge [tone]="t" size="lg">{{ t }}</cds-badge> }
      </div>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:8px;align-items:center">
        <cds-badge tone="success" size="sm">sm</cds-badge>
        <cds-badge tone="success" size="md">md</cds-badge>
        <cds-badge tone="success" size="lg">lg</cds-badge>
      </div>`,
  }),
};
