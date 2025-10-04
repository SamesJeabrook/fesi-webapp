import type { Meta, StoryObj } from '@storybook/react';
import { MerchantOrderDashboard } from './MerchantOrderDashboard.component';

const meta: Meta<typeof MerchantOrderDashboard> = {
  title: 'Templates/MerchantOrderDashboard',
  component: MerchantOrderDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete merchant dashboard for managing orders with real-time updates and drag-and-drop functionality.',
      },
    },
  },
  argTypes: {
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message to display',
    },
    onOrderStatusChange: {
      action: 'statusChanged',
      description: 'Handler for when an order status is updated',
    },
    onRefresh: {
      action: 'refreshed',
      description: 'Handler for refreshing orders',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

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

export const Default: Story = {
  args: {
    merchant: mockMerchant,
    orders: generateMockOrders(),
  },
};

export const Empty: Story = {
  args: {
    merchant: mockMerchant,
    orders: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard with no orders - shows empty state.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    merchant: mockMerchant,
    orders: [],
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    merchant: mockMerchant,
    orders: [],
    error: 'Failed to load orders. Please check your connection.',
  },
};

export const BusyRestaurant: Story = {
  args: {
    merchant: {
      ...mockMerchant,
      name: 'Busy Burger Joint',
    },
    orders: [
      ...generateMockOrders(),
      {
        id: '6',
        order_number: '1006',
        customer_name: 'Alex Thompson',
        customer_email: 'alex.t@example.com',
        items: [
          { menu_item_name: 'Double Cheeseburger', quantity: 2 },
          { menu_item_name: 'French Fries', quantity: 2 },
        ],
        total_amount: 1800,
        status: 'pending' as const,
        created_at: new Date(Date.now() - 2 * 60000).toISOString(),
      },
      {
        id: '7',
        order_number: '1007',
        customer_name: 'Maria Rodriguez',
        customer_email: 'maria.r@example.com',
        items: [
          { menu_item_name: 'Chicken Wings', quantity: 12 },
        ],
        total_amount: 1200,
        status: 'accepted' as const,
        created_at: new Date(Date.now() - 8 * 60000).toISOString(),
      },
      {
        id: '8',
        order_number: '1008',
        customer_name: 'Tom Wilson',
        customer_email: 'tom.w@example.com',
        items: [
          { menu_item_name: 'Fish & Chips', quantity: 1 },
          { menu_item_name: 'Mushy Peas', quantity: 1 },
        ],
        total_amount: 1650,
        status: 'preparing' as const,
        created_at: new Date(Date.now() - 12 * 60000).toISOString(),
      },
      {
        id: '9',
        order_number: '1009',
        customer_name: 'Lisa Garcia',
        customer_email: 'lisa.g@example.com',
        items: [
          { menu_item_name: 'Veggie Burger', quantity: 1 },
        ],
        total_amount: 950,
        status: 'ready' as const,
        created_at: new Date(Date.now() - 18 * 60000).toISOString(),
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'A busy restaurant with many orders across all stages.',
      },
    },
  },
};

export const QuietPeriod: Story = {
  args: {
    merchant: mockMerchant,
    orders: [
      {
        id: '1',
        order_number: '1001',
        customer_name: 'Regular Customer',
        customer_email: 'regular@example.com',
        items: [
          { menu_item_name: 'Coffee', quantity: 1 },
          { menu_item_name: 'Croissant', quantity: 1 },
        ],
        total_amount: 650,
        status: 'preparing' as const,
        created_at: new Date(Date.now() - 5 * 60000).toISOString(),
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Quiet period with minimal orders.',
      },
    },
  },
};