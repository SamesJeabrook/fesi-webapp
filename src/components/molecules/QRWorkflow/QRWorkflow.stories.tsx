import type { Meta, StoryObj } from '@storybook/react';
import QRWorkflow from './QRWorkflow.component';
import { QRWorkflowProps } from './QRWorkflow.types';

const meta: Meta<typeof QRWorkflow> = {
  title: 'Molecules/QRWorkflow',
  component: QRWorkflow,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete QR workflow for merchant order verification. Provides a dashboard for viewing ready orders and scanning QR codes to complete pickup verification.'
      }
    }
  },
  argTypes: {
    merchantId: {
      control: 'text',
      description: 'Current merchant identifier'
    },
    readyOrders: {
      control: 'object',
      description: 'Array of orders ready for pickup'
    },
    startWithScanner: {
      control: 'boolean',
      description: 'Whether to open the scanner immediately'
    },
    onOrderCompleted: {
      description: 'Handler for successful order completion'
    },
    onError: {
      description: 'Handler for workflow errors'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<QRWorkflowProps>;

const mockReadyOrders = [
  {
    id: 'order_1',
    orderNumber: 'ORD-2025-001',
    customerId: 'customer_123',
    customerName: 'John Smith',
    estimatedReadyTime: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  },
  {
    id: 'order_2',
    orderNumber: 'ORD-2025-002',
    customerId: 'customer_456',
    customerName: 'Sarah Johnson',
    estimatedReadyTime: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    id: 'order_3',
    orderNumber: 'ORD-2025-003',
    customerId: 'customer_789',
    customerName: 'Mike Davis',
    estimatedReadyTime: new Date(Date.now() + 15 * 60 * 1000).toISOString()
  }
];

// Default workflow
export const Default: Story = {
  args: {
    merchantId: 'merchant_123',
    readyOrders: mockReadyOrders,
    startWithScanner: false,
    onOrderCompleted: (orderId) => console.log('Order completed:', orderId),
    onError: (error) => console.log('Workflow error:', error)
  }
};

// No ready orders
export const NoReadyOrders: Story = {
  args: {
    ...Default.args,
    readyOrders: []
  }
};

// Many ready orders
export const ManyReadyOrders: Story = {
  args: {
    ...Default.args,
    readyOrders: [
      ...mockReadyOrders,
      {
        id: 'order_4',
        orderNumber: 'ORD-2025-004',
        customerId: 'customer_101',
        customerName: 'Alice Brown',
        estimatedReadyTime: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      },
      {
        id: 'order_5',
        orderNumber: 'ORD-2025-005',
        customerId: 'customer_102',
        customerName: 'Bob Wilson',
        estimatedReadyTime: new Date(Date.now() + 20 * 60 * 1000).toISOString()
      },
      {
        id: 'order_6',
        orderNumber: 'ORD-2025-006',
        customerId: 'customer_103',
        customerName: 'Carol Lee',
        estimatedReadyTime: new Date(Date.now() + 25 * 60 * 1000).toISOString()
      },
      {
        id: 'order_7',
        orderNumber: 'ORD-2025-007',
        customerId: 'customer_104',
        customerName: 'David Chen',
        estimatedReadyTime: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      }
    ]
  }
};

// Start with scanner open
export const StartWithScanner: Story = {
  args: {
    ...Default.args,
    startWithScanner: true
  }
};