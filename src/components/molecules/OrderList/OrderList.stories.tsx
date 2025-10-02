import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import OrderList, { OrderListItem } from './OrderList';

const sampleOrders: OrderListItem[] = [
  {
    id: 'order1',
    status: 'accepted',
    items: [
      { menu_item_id: '1', menu_item_name: 'Burger', quantity: 2, item_total: 12.5, customizations: [] },
      { menu_item_id: '2', menu_item_name: 'Fries', quantity: 1, item_total: 3.5, customizations: [] },
    ],
    total: 16.0,
  },
  {
    id: 'order2',
    status: 'pending',
    items: [
      { menu_item_id: '3', menu_item_name: 'Salad', quantity: 1, item_total: 7.0, customizations: [] },
    ],
    total: 7.0,
  },
  {
    id: 'order3',
    status: 'rejected',
    items: [
      { menu_item_id: '4', menu_item_name: 'Pizza', quantity: 1, item_total: 10.0, customizations: [] },
    ],
    total: 10.0,
  },
];

const meta: Meta<typeof OrderList> = {
  title: 'Molecules/OrderList',
  component: OrderList,
};
export default meta;

type Story = StoryObj<typeof OrderList>;

export const Default: Story = {
  args: {
    orders: sampleOrders,
  },
};
