import type { Meta, StoryObj } from '@storybook/angular';
import { StaffSiteMapPage } from './site-map.page';

const meta: Meta<StaffSiteMapPage> = {
  title: 'Pages/Staff/Site Map',
  component: StaffSiteMapPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<StaffSiteMapPage> = {};
