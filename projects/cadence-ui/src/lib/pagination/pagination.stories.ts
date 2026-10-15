import type { Meta, StoryObj } from '@storybook/angular';
import { CdsPaginationComponent } from './pagination.component';

const meta: Meta<CdsPaginationComponent> = {
  title: 'Navigation/Pagination',
  component: CdsPaginationComponent,
  tags: ['autodocs'],
  args: { page: 3, pageCount: 19, siblingCount: 1 },
  render: (args) => ({
    props: args,
    template: `<cds-pagination [page]="page" [pageCount]="pageCount" [siblingCount]="siblingCount"
                 (pageChange)="page = $event"></cds-pagination>`,
  }),
};
export default meta;
type Story = StoryObj<CdsPaginationComponent>;

export const Default: Story = {};
export const FewPages: Story = { args: { page: 1, pageCount: 3 } };
