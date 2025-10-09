import type { Meta, StoryObj } from '@storybook/react';
import { PublicOrderBoard } from './PublicOrderBoard.component';
import { Order } from '@/types';

// Mock orders for different states
const mockOrders: Order[] = [
  {
    id: '1',
    customerId: 'cust1',
    merchantId: 'merch1', 
    orderNumber: '001',
    status: 'pending',
    items: [],
    subtotal: 1250,
    deliveryFee: 300,
    platformFee: 50,
    total: 1600,
    currency: 'USD',
    paymentStatus: 'pending',
    orderType: 'pickup',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    customerId: 'cust2',
    merchantId: 'merch1',
    orderNumber: '002',
    status: 'confirmed',
    items: [],
    subtotal: 950,
    deliveryFee: 300,
    platformFee: 50,
    total: 1300,
    currency: 'USD',
    paymentStatus: 'succeeded',
    orderType: 'pickup',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    customerId: 'cust3',
    merchantId: 'merch1',
    orderNumber: '003',
    status: 'preparing',
    items: [],
    subtotal: 1750,
    deliveryFee: 300,
    platformFee: 50,
    total: 2100,
    currency: 'USD',
    paymentStatus: 'succeeded',
    orderType: 'pickup',
    estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 mins from now
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    customerId: 'cust4',
    merchantId: 'merch1',
    orderNumber: '004',
    status: 'preparing',
    items: [],
    subtotal: 850,
    deliveryFee: 300,
    platformFee: 50,
    total: 1200,
    currency: 'USD',
    paymentStatus: 'succeeded',
    orderType: 'pickup',
    estimatedDeliveryTime: new Date(Date.now() + 25 * 60 * 1000).toISOString(), // 25 mins from now
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    customerId: 'cust5',
    merchantId: 'merch1',
    orderNumber: '005',
    status: 'ready',
    items: [],
    subtotal: 1150,
    deliveryFee: 300,
    platformFee: 50,
    total: 1500,
    currency: 'USD',
    paymentStatus: 'succeeded',
    orderType: 'pickup',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const meta: Meta<typeof PublicOrderBoard> = {
  title: 'Molecules/PublicOrderBoard',
  component: PublicOrderBoard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'PublicOrderBoard displays active orders in a public-facing view for customer order tracking.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PublicOrderBoard>;

export const WithActiveOrders: Story = {
  args: {
    orders: mockOrders,
    merchantName: 'Test Restaurant',
  },
};

export const Loading: Story = {
  args: {
    orders: [],
    merchantName: 'Test Restaurant',
    isLoading: true,
  },
};

export const NoActiveOrders: Story = {
  args: {
    orders: [],
    merchantName: 'Test Restaurant',
    isLoading: false,
  },
};

export const WithoutMerchantName: Story = {
  args: {
    orders: mockOrders,
  },
};

export const SingleColumn: Story = {
  args: {
    orders: [
      {
        ...mockOrders[2],
        orderNumber: '101',
      },
      {
        ...mockOrders[2],
        id: '6',
        orderNumber: '102',
      },
    ],
    merchantName: 'Busy Kitchen',
  },
};