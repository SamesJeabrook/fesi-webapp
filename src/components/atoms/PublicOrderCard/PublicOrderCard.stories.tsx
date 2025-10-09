import type { Meta, StoryObj } from '@storybook/react';
import { PublicOrderCard } from './PublicOrderCard.component';

const meta: Meta<typeof PublicOrderCard> = {
  title: 'Atoms/PublicOrderCard',
  component: PublicOrderCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'PublicOrderCard displays minimal order information for public order tracking.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof PublicOrderCard>;

export const Pending: Story = {
  args: {
    orderNumber: '001',
    status: 'pending',
  },
};

export const Confirmed: Story = {
  args: {
    orderNumber: '002',
    status: 'confirmed',
  },
};

export const Preparing: Story = {
  args: {
    orderNumber: '003',
    status: 'preparing',
    estimatedTime: '15 mins',
  },
};

export const Ready: Story = {
  args: {
    orderNumber: '004',
    status: 'ready',
  },
};

export const Delivered: Story = {
  args: {
    orderNumber: '005',
    status: 'delivered',
  },
};

export const Cancelled: Story = {
  args: {
    orderNumber: '006',
    status: 'cancelled',
  },
};