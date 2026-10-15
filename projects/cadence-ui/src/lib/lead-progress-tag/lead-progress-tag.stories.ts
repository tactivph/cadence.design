import type { Meta, StoryObj } from '@storybook/angular';
import { CdsLeadProgressTagComponent } from './lead-progress-tag.component';

const meta: Meta<CdsLeadProgressTagComponent> = {
  title: 'Data display/Lead progress tag',
  component: CdsLeadProgressTagComponent,
  tags: ['autodocs'],
  args: { code: 'site_visit_completed' },
};
export default meta;
export const Default: StoryObj<CdsLeadProgressTagComponent> = {};
export const All: StoryObj = {
  render: () => ({
    template: `<div style="display:flex;gap:8px;flex-wrap:wrap">
      @for (c of ['new_lead','engaged_qualified','site_visit_scheduled','site_visit_completed','unit_computation_finalized','reserved']; track c) {
        <cds-lead-progress-tag [code]="c"></cds-lead-progress-tag>
      }</div>`,
  }),
};
