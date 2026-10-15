import type { Meta, StoryObj } from '@storybook/angular';
import { ClientPreReservationPage } from './pre-reservation.page';

const meta: Meta<ClientPreReservationPage> = {
  title: 'Pages/Client/Pre Reservation',
  component: ClientPreReservationPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const Page: StoryObj<ClientPreReservationPage> = {};
