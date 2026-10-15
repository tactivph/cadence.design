import type { Meta, StoryObj } from '@storybook/angular';
import { CdsTablePaginationComponent } from './table-pagination.component';

const meta: Meta<CdsTablePaginationComponent> = {
  title: 'Data display/Table pagination',
  component: CdsTablePaginationComponent,
  tags: ['autodocs'],
  args: { itemName: 'client', page: 1, pageSize: 10, collectionSize: 128 },
  parameters: { layout: 'padded' },
};
export default meta;
export const Default: StoryObj<CdsTablePaginationComponent> = {};
