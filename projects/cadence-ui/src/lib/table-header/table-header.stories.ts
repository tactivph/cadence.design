import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CdsTableHeaderComponent } from './table-header.component';
import { CdsTableDirective } from '../table/table.directive';
import { CdsTablePaginationComponent } from '../table-pagination/table-pagination.component';
import { CdsStatusBadgeComponent } from '../status-badge/status-badge.component';

const meta: Meta = {
  title: 'Data display/Table',
  decorators: [moduleMetadata({ imports: [CdsTableHeaderComponent, CdsTableDirective, CdsTablePaginationComponent, CdsStatusBadgeComponent] })],
};
export default meta;
type Story = StoryObj;

export const ListTable: Story = {
  render: () => ({
    props: {
      columns: [
        { label: '' }, { label: 'ID', field: 'id' }, { label: 'Name', field: 'name' },
        { label: 'Category' }, { label: 'Email' }, { label: 'Last Updated', field: 'updated' },
      ],
      rows: [
        { id: '340', name: 'Beau Ashby', cat: 'expired', email: 'andrea@example.com', updated: 'Apr 21, 2026' },
        { id: '337', name: 'Mara Calder', cat: 'reserved_buyer', email: 'marco@example.com', updated: 'Apr 18, 2026' },
        { id: '331', name: 'Leo Calder', cat: 'seasoning_buyer', email: 'divina@example.com', updated: 'Apr 15, 2026' },
      ],
    },
    template: `
      <div class="cds-table-wrap">
        <table cdsTable>
          <thead><tr><cds-table-header [columns]="columns"></cds-table-header></tr></thead>
          <tbody>
            @for (r of rows; track r.id) {
              <tr>
                <td class="cds-col-favorite"><i class="ph ph-star"></i></td>
                <td class="cds-col-id">{{ r.id }}</td>
                <td>{{ r.name }}</td>
                <td><cds-status-badge kind="client-category" [code]="r.cat"></cds-status-badge></td>
                <td class="cds-col-email">{{ r.email }}</td>
                <td>{{ r.updated }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <cds-table-pagination itemName="client" [page]="1" [pageSize]="10" [collectionSize]="3"></cds-table-pagination>`,
  }),
};
