import type { Meta, StoryObj } from '@storybook/angular';
import { CdsStatusBadgeComponent } from './status-badge.component';

const meta: Meta<CdsStatusBadgeComponent> = {
  title: 'Data display/Status badge',
  component: CdsStatusBadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    kind: { control: 'inline-radio', options: ['client-category', 'lead-progress', 'contract', 'requirement', 'review', 'temperature'] },
    code: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    showIcon: { control: 'boolean' },
  },
  args: { kind: 'client-category', code: 'reserved_buyer', size: 'lg' },
  render: (args) => ({
    props: args,
    template: `<cds-status-badge [kind]="kind" [code]="code" [size]="size" [showIcon]="showIcon"></cds-status-badge>`,
  }),
};
export default meta;
type Story = StoryObj<CdsStatusBadgeComponent>;

export const Default: Story = {};

export const ClientCategory: Story = {
  render: () => ({
    template: `<div style="display:flex;gap:8px;flex-wrap:wrap">
      @for (c of ['available','expired','unavailable','signed_cas','endorsed','reserved_buyer','seasoning_buyer','takeout_buyer','homeowner','active','inactive']; track c) {
        <cds-status-badge kind="client-category" [code]="c" size="lg"></cds-status-badge>
      }</div>`,
  }),
};

export const Requirement: Story = {
  render: () => ({
    template: `<div style="display:flex;gap:8px;flex-wrap:wrap">
      @for (c of ['draft','submission','for_review','approved','rejected']; track c) {
        <cds-status-badge kind="requirement" [code]="c" size="lg"></cds-status-badge>
      }</div>`,
  }),
};

export const Review: Story = {
  render: () => ({
    template: `<div style="display:flex;gap:8px;flex-wrap:wrap">
      @for (c of ['for_review','approved','declined','verified']; track c) {
        <cds-status-badge kind="review" [code]="c" [showIcon]="true"></cds-status-badge>
      }</div>`,
  }),
};
