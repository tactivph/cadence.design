import type { Meta, StoryObj } from '@storybook/angular';
import { CdsAvatarComponent } from './avatar.component';

const meta: Meta<CdsAvatarComponent> = {
  title: 'Data display/Avatar',
  component: CdsAvatarComponent,
  tags: ['autodocs'],
  argTypes: { size: { control: 'inline-radio', options: ['xxs', 'sm', 'md', 'lg'] } },
  args: { name: 'Hugo Calder', size: 'md' },
};
export default meta;
type Story = StoryObj<CdsAvatarComponent>;

export const Initials: Story = {};
export const WithImage: Story = { args: { src: 'https://i.pravatar.cc/80?img=12' } };
export const Sizes: Story = {
  render: () => ({
    template: `<div style="display:flex;gap:12px;align-items:center">
      <cds-avatar name="A B" size="xxs"></cds-avatar>
      <cds-avatar name="A B" size="sm"></cds-avatar>
      <cds-avatar name="A B" size="md"></cds-avatar>
      <cds-avatar name="A B" size="lg"></cds-avatar>
    </div>`,
  }),
};
