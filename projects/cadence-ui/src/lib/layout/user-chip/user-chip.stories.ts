import type { Meta, StoryObj } from '@storybook/angular';
import { CdsUserChipComponent } from './user-chip.component';

const meta: Meta<CdsUserChipComponent> = {
  title: 'Navigation/User chip',
  component: CdsUserChipComponent,
  tags: ['autodocs'],
  args: { name: 'Jude Calder', role: 'Agent', caret: true },
};
export default meta;
export const Default: StoryObj<CdsUserChipComponent> = {};
