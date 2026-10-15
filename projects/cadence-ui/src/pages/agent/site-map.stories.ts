import type { Meta, StoryObj } from '@storybook/angular';
import { AgentSiteMapPage } from './site-map.page';

const meta: Meta<AgentSiteMapPage> = {
  title: 'Pages/Agent/Site Map',
  component: AgentSiteMapPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<AgentSiteMapPage> = {};
