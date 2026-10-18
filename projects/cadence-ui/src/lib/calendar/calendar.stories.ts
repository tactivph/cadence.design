import type { Meta, StoryObj } from '@storybook/angular';
import { CdsCalendarComponent } from './calendar.component';

const TODAY = new Date(2026, 9, 18);

const meta: Meta<CdsCalendarComponent> = {
  title: 'Data display/Calendar',
  component: CdsCalendarComponent,
  tags: ['autodocs'],
  args: { month: TODAY, today: TODAY, loading: false },
  render: (args) => ({
    props: args,
    template: `<div style="max-width:560px">
      <cds-calendar [month]="month" [today]="today" [selectedDate]="selectedDate" [markers]="markers"
                    [loading]="loading" (monthChange)="month = $event" (selectedDateChange)="selectedDate = $event" />
    </div>`,
  }),
};
export default meta;
type Story = StoryObj<CdsCalendarComponent>;

export const Default: Story = {};

export const WithMarkers: Story = {
  args: {
    markers: {
      '2026-10-05': ['warning'],
      '2026-10-12': ['success'],
      '2026-10-18': ['warning', 'success'],
      '2026-10-27': ['danger'],
    },
  },
};

export const SelectedDay: Story = { args: { selectedDate: new Date(2026, 9, 21) } };

export const Loading: Story = { args: { loading: true } };
