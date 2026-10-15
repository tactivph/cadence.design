import type { Meta, StoryObj } from '@storybook/angular';
import { CdsSkeletonComponent } from './skeleton.component';

const meta: Meta<CdsSkeletonComponent> = {
  title: 'Data display/Skeleton',
  component: CdsSkeletonComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<CdsSkeletonComponent>;

export const Line: Story = { args: { width: '240px', height: '12px' } };

export const CardPlaceholder: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;width:320px;padding:16px;border:1px solid var(--cds-border-subtle);border-radius:12px">
        <cds-skeleton variant="circle" width="40px" height="40px"></cds-skeleton>
        <div style="flex:1;display:flex;flex-direction:column;gap:8px">
          <cds-skeleton width="60%" height="12px"></cds-skeleton>
          <cds-skeleton width="90%" height="10px"></cds-skeleton>
          <cds-skeleton width="80%" height="10px"></cds-skeleton>
        </div>
      </div>`,
  }),
};
