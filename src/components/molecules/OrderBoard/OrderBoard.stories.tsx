import type { Meta, StoryObj } from '@storybook/react';
import { OrderBoard } from './OrderBoard.component';

const meta: Meta<typeof OrderBoard> = {
  title: 'Molecules/OrderBoard',
  component: OrderBoard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A kanban-style board for managing orders with drag-and-drop functionality between status columns.',
      },
    },
  },
  argTypes: {
    isReadOnly: {
      control: { type: 'boolean' },
      description: 'Whether the board is in read-only mode (customer view)',
    },
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
    onOrderClick: {
      action: 'orderClicked',
      description: 'Handler for when an order is clicked',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

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
  {
    id: '6',
    order_number: '1006',
    customer_name: 'Lisa Garcia',
    customer_email: 'lisa.garcia@example.com',
    items: [
      {
        menu_item_name: 'Meat Lovers Pizza',
        quantity: 1,
      },
    ],
    total_amount: 1850,
    status: 'cancelled' as const,
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
  },
];

export const Default: Story = {
  args: {
    orders: generateMockOrders(),
  },
};

export const Empty: Story = {
  args: {
    orders: [],
  },
};

export const ReadOnly: Story = {
  args: {
    orders: generateMockOrders(),
    isReadOnly: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Read-only version for customer view - no drag and drop functionality.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    orders: [],
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    orders: [],
    error: 'Failed to load orders. Please try again.',
  },
};

export const PendingOnly: Story = {
  args: {
    orders: generateMockOrders().filter(order => order.status === 'pending'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Board showing only pending orders.',
      },
    },
  },
};

export const BusyKitchen: Story = {
  args: {
    orders: [
      ...generateMockOrders(),
      {
        id: '7',
        order_number: '1007',
        customer_name: 'Alex Thompson',
        items: [{ menu_item_name: 'Buffalo Wings', quantity: 2 }],
        total_amount: 1200,
        status: 'preparing' as const,
        created_at: new Date(Date.now() - 8 * 60000).toISOString(),
      },
      {
        id: '8',
        order_number: '1008',
        customer_name: 'Maria Rodriguez',
        items: [{ menu_item_name: 'Fish & Chips', quantity: 1 }],
        total_amount: 1450,
        status: 'accepted' as const,
        created_at: new Date(Date.now() - 12 * 60000).toISOString(),
      },
      {
        id: '9',
        order_number: '1009',
        customer_name: 'Tom Wilson',
        items: [{ menu_item_name: 'Burger Combo', quantity: 3 }],
        total_amount: 2100,
        status: 'ready' as const,
        created_at: new Date(Date.now() - 20 * 60000).toISOString(),
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'A busy kitchen scenario with multiple orders in different stages.',
      },
    },
  },
};