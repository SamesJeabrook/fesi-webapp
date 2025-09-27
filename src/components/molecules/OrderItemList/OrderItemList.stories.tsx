import React from 'react';
import OrderItemList, { OrderItem } from './OrderItemList';

export default {
  title: 'Molecules/OrderItemList',
  component: OrderItemList,
};

const sampleItems: OrderItem[] = [
  {
    menu_item_id: '1',
    menu_item_name: 'Margherita Pizza',
    quantity: 2,
    item_total: 14.00,
    customizations: [
      { sub_item_id: 'a', sub_item_name: 'Extra Cheese', price_modifier: 1.00, quantity: 1 },
      { sub_item_id: 'b', sub_item_name: 'No Olives', price_modifier: -0.50, quantity: 1 },
    ]
  },
  {
    menu_item_id: '2',
    menu_item_name: 'Garlic Bread',
    quantity: 1,
    item_total: 4.00,
    customizations: []
  }
];

export const Default = () => (
  <OrderItemList items={sampleItems} />
);
