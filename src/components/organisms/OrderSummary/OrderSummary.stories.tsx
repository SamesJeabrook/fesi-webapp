import React from 'react';
import OrderSummary from './OrderSummary';
import { OrderItem } from '@/components/molecules/OrderItemList/OrderItemList';
import { OrderCostBreakdownProps } from '@/components/molecules/OrderCostBreakdown/OrderCostBreakdown';

export default {
  title: 'Organisms/OrderSummary',
  component: OrderSummary,
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

const sampleCostBreakdown: OrderCostBreakdownProps = {
  subtotal: 18.00,
  basePlatformFee: 1.80,
  smallOrderFee: 0.20,
  totalPlatformFee: 2.00,
  merchantAmount: 18.00,
  totalOrderAmount: 20.00,
  minimumOrderValue: 3.00,
  smallOrderProtectionApplied: true,
};

export const Default = () => (
  <OrderSummary items={sampleItems} costBreakdown={sampleCostBreakdown} />
);
