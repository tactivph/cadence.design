import type { Meta, StoryObj } from '@storybook/angular';
import { CdsButtonComponent } from './button.component';

const meta: Meta<CdsButtonComponent> = {
  title: 'Actions/Button',
  component: CdsButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'secondary-neutral', 'tertiary', 'ghost', 'danger', 'danger-ghost'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    block: { control: 'boolean' },
    iconLeft: { control: 'text' },
    iconRight: { control: 'text' },
  },
  args: { variant: 'primary', size: 'md' },
  render: (args) => ({
    props: args,
    template: `<button cds-button
        [variant]="variant" [size]="size"
        [loading]="loading" [disabled]="disabled" [block]="block"
        [iconLeft]="iconLeft" [iconRight]="iconRight">Button</button>`,
  }),
};
export default meta;
type Story = StoryObj<CdsButtonComponent>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Tertiary: Story = { args: { variant: 'tertiary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Danger: Story = { args: { variant: 'danger' } };
export const WithIcon: Story = { args: { iconLeft: 'ph ph-plus' } };
export const Loading: Story = { args: { loading: true } };

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
        <button cds-button variant="primary">Primary</button>
        <button cds-button variant="secondary">Secondary</button>
        <button cds-button variant="secondary-neutral">Secondary neutral</button>
        <button cds-button variant="tertiary">Tertiary</button>
        <button cds-button variant="ghost">Ghost</button>
        <button cds-button variant="danger">Danger</button>
        <button cds-button variant="danger-ghost">Danger ghost</button>
      </div>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;align-items:center">
        <button cds-button size="sm">Small</button>
        <button cds-button size="md">Medium</button>
        <button cds-button size="lg">Large</button>
        <button cds-button iconOnly iconLeft="ph ph-plus" aria-label="Add"></button>
      </div>`,
  }),
};
