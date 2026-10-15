import type { Meta, StoryObj } from '@storybook/angular';
import { AgentClientDetailPage } from './client-detail.page';

const meta: Meta<AgentClientDetailPage> = {
  title: 'Pages/Agent/Client Detail',
  component: AgentClientDetailPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'MOCK page — Agent · Client detail. Faithful reproduction of the PDO ' +
          '/agent/clients/:id screen composed purely from Cadence components ' +
          '(AGENT nav chrome, breadcrumb + client header, a tabbed activity panel ' +
          'and a tabbed profile rail). Presentational only; values are placeholders.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<AgentClientDetailPage>;

export const Page: Story = {};
