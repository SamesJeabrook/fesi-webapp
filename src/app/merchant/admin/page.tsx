'use client';

import React, { useState, useEffect } from 'react';
import { MerchantOrderDashboard } from '@/components/templates';

// Mock data for demonstration
const mockMerchant = {
  id: 'merchant-1',
  name: 'Giuseppe\'s Pizzeria',
  email: 'giuseppe@pizzeria.com',
};

const generateMockOrders = () => [
  {
    id: '1',
    order_number: '1001',
    customer_name: 'John Smith',
    customer_email: 'john.smith@example.com',
    items: [
      {
        menu_item_name: 'Margherita Pizza',
        quantity: 2,
        customizations: [
          { sub_item_name: 'Extra Cheese', quantity: 1 },
        ],
      },
      {
        menu_item_name: 'Caesar Salad',
        quantity: 1,
      },
    ],
    total_amount: 2850,
    status: 'pending' as const,
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    estimated_completion: new Date(Date.now() + 20 * 60000).toISOString(),
    notes: 'Please make sure the pizza is well done.',
  },
  {
    id: '2',
    order_number: '1002',
    customer_name: 'Sarah Johnson',
    customer_email: 'sarah.j@example.com',
    items: [
      {
        menu_item_name: 'Pepperoni Pizza',
        quantity: 1,
      },
      {
        menu_item_name: 'Garlic Bread',
        quantity: 2,
      },
    ],
    total_amount: 1950,
    status: 'accepted' as const,
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
    estimated_completion: new Date(Date.now() + 15 * 60000).toISOString(),
  },
  {
    id: '3',
    order_number: '1003',
    customer_name: 'Mike Davis',
    customer_email: 'mike.davis@example.com',
    items: [
      {
        menu_item_name: 'Hawaiian Pizza',
        quantity: 1,
      },
    ],
    total_amount: 1650,
    status: 'preparing' as const,
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    estimated_completion: new Date(Date.now() + 10 * 60000).toISOString(),
  },
  {
    id: '4',
    order_number: '1004',
    customer_name: 'Emma Wilson',
    customer_email: 'emma.w@example.com',
    items: [
      {
        menu_item_name: 'Quattro Stagioni',
        quantity: 1,
      },
      {
        menu_item_name: 'Tiramisu',
        quantity: 2,
      },
    ],
    total_amount: 2250,
    status: 'ready' as const,
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: '5',
    order_number: '1005',
    customer_name: 'David Brown',
    customer_email: 'david.brown@example.com',
    items: [
      {
        menu_item_name: 'Vegetarian Pizza',
        quantity: 1,
      },
    ],
    total_amount: 1550,
    status: 'complete' as const,
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
  },
];

export default function MerchantAdminPage() {
  const [orders, setOrders] = useState(generateMockOrders());
  const [isLoading, setIsLoading] = useState(false);

  const handleOrderStatusChange = (orderId: string, newStatus: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus as any }
          : order
      )
    );
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOrders(generateMockOrders());
      setIsLoading(false);
    }, 1000);
  };

  return (
    <MerchantOrderDashboard
      merchant={mockMerchant}
      orders={orders}
      isLoading={isLoading}
      onOrderStatusChange={handleOrderStatusChange}
      onRefresh={handleRefresh}
    />
  );
}