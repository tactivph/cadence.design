import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CdsEmptyStateComponent } from './empty-state.component';
import { CdsButtonComponent } from '../button/button.component';

const meta: Meta<CdsEmptyStateComponent> = {
  title: 'Feedback/Empty state',
  component: CdsEmptyStateComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CdsButtonComponent] })],
  args: {
    icon: 'ph ph-file',
    title: 'No pending requirements',
    message: 'This page clears as you complete processing requirements. Stay on top of tasks to keep it empty!',
  },
};
export default meta;
type Story = StoryObj<CdsEmptyStateComponent>;

export const Default: Story = {};
export const WithAction: Story = {
  render: (args) => ({
    props: args,
    template: `<cds-empty-state [icon]="icon" [title]="title" [message]="message">
      <button cds-button iconLeft="ph ph-plus">Enroll a lead</button>
    </cds-empty-state>`,
  }),
};
