import type { Meta, StoryObj } from '@storybook/react';
import { CustomerOrderTracker } from './CustomerOrderTracker.component';

const meta: Meta<typeof CustomerOrderTracker> = {
  title: 'Templates/CustomerOrderTracker',
  component: CustomerOrderTracker,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Customer-facing order tracking interface showing order status and queue position with real-time updates.',
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
    onRefresh: {
      action: 'refreshed',
      description: 'Handler for refreshing order status',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const createOrder = (overrides = {}) => ({
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
  status: 'preparing' as const,
  created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  estimated_completion: new Date(Date.now() + 10 * 60000).toISOString(),
  notes: 'Please make sure the pizza is well done.',
  ...overrides,
});

const generateQueueOrders = () => [
  {
    id: '2',
    order_number: '1002',
    customer_name: 'Sarah Johnson',
    customer_email: 'sarah.j@example.com',
    items: [{ menu_item_name: 'Pepperoni Pizza', quantity: 1 }],
    total_amount: 1950,
    status: 'accepted' as const,
    created_at: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: '3',
    order_number: '1003',
    customer_name: 'Mike Davis',
    customer_email: 'mike.davis@example.com',
    items: [{ menu_item_name: 'Hawaiian Pizza', quantity: 1 }],
    total_amount: 1650,
    status: 'preparing' as const,
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: '1',
    order_number: '1001',
    customer_name: 'John Smith',
    customer_email: 'john.smith@example.com',
    items: [{ menu_item_name: 'Margherita Pizza', quantity: 2 }],
    total_amount: 2850,
    status: 'preparing' as const,
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: '4',
    order_number: '1004',
    customer_name: 'Emma Wilson',
    customer_email: 'emma.w@example.com',
    items: [{ menu_item_name: 'Quattro Stagioni', quantity: 1 }],
    total_amount: 2250,
    status: 'ready' as const,
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
  },
];

export const OrderPending: Story = {
  args: {
    order: createOrder({ 
      status: 'pending',
      estimated_completion: undefined,
    }),
    queueOrders: generateQueueOrders(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Order that has just been placed and is pending acceptance.',
      },
    },
  },
};

export const OrderAccepted: Story = {
  args: {
    order: createOrder({ 
      status: 'accepted',
      estimated_completion: new Date(Date.now() + 20 * 60000).toISOString(),
    }),
    queueOrders: generateQueueOrders(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Order that has been accepted and will be prepared soon.',
      },
    },
  },
};

export const OrderPreparing: Story = {
  args: {
    order: createOrder({ status: 'preparing' }),
    queueOrders: generateQueueOrders(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Order currently being prepared with estimated completion time.',
      },
    },
  },
};

export const OrderReady: Story = {
  args: {
    order: createOrder({ 
      status: 'ready',
      estimated_completion: new Date(Date.now() - 2 * 60000).toISOString(), // 2 minutes ago
    }),
    queueOrders: generateQueueOrders(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Order that is ready for collection.',
      },
    },
  },
};

export const OrderComplete: Story = {
  args: {
    order: createOrder({ 
      status: 'complete',
      estimated_completion: undefined,
    }),
    queueOrders: generateQueueOrders(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Completed order.',
      },
    },
  },
};

export const OrderCancelled: Story = {
  args: {
    order: createOrder({ 
      status: 'cancelled',
      estimated_completion: undefined,
    }),
    queueOrders: generateQueueOrders(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Cancelled order.',
      },
    },
  },
};

export const WithoutQueue: Story = {
  args: {
    order: createOrder({ status: 'preparing' }),
    queueOrders: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Order tracking without queue visibility.',
      },
    },
  },
};

export const FirstInQueue: Story = {
  args: {
    order: createOrder({ 
      status: 'accepted',
      created_at: new Date(Date.now() - 30 * 60000).toISOString(), // Oldest order
    }),
    queueOrders: [
      ...generateQueueOrders(),
      createOrder({ 
        id: '5',
        order_number: '1005',
        status: 'accepted',
        created_at: new Date(Date.now() - 30 * 60000).toISOString(),
      }),
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Customer\'s order is first in the queue.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    order: createOrder({ status: 'preparing' }),
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    order: createOrder({ status: 'preparing' }),
    error: 'Failed to load order details. Please try again.',
  },
};

export const LargeOrder: Story = {
  args: {
    order: createOrder({
      items: [
        { menu_item_name: 'Margherita Pizza', quantity: 3 },
        { menu_item_name: 'Pepperoni Pizza', quantity: 2 },
        { menu_item_name: 'Caesar Salad', quantity: 4 },
        { menu_item_name: 'Garlic Bread', quantity: 6 },
        { menu_item_name: 'Tiramisu', quantity: 3 },
        { menu_item_name: 'Soft Drinks', quantity: 5 },
      ],
      total_amount: 8500,
      notes: 'Large order for office party. Please ensure everything is ready at the same time.',
    }),
    queueOrders: generateQueueOrders(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Large order with many items and special notes.',
      },
    },
  },
};

export const ExpressOrder: Story = {
  args: {
    order: createOrder({
      status: 'preparing',
      estimated_completion: new Date(Date.now() + 5 * 60000).toISOString(), // 5 minutes
      items: [
        { menu_item_name: 'Coffee', quantity: 2 },
        { menu_item_name: 'Sandwich', quantity: 1 },
      ],
      total_amount: 850,
    }),
    queueOrders: generateQueueOrders(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Quick order with short preparation time.',
      },
    },
  },
};