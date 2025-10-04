import type { Meta, StoryObj } from '@storybook/react';
import { StatusColumn } from './StatusColumn.component';
import { OrderCard } from '../OrderCard';

const meta: Meta<typeof StatusColumn> = {
  title: 'Atoms/StatusColumn',
  component: StatusColumn,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A column component for organizing orders by status with drag-and-drop support.',
      },
    },
  },
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['pending', 'accepted', 'preparing', 'ready', 'complete', 'cancelled'],
      description: 'The status this column represents',
    },
    acceptsDrops: {
      control: { type: 'boolean' },
      description: 'Whether this column accepts dropped items',
    },
    isDraggedOver: {
      control: { type: 'boolean' },
      description: 'Whether something is being dragged over this column',
    },
    count: {
      control: { type: 'number' },
      description: 'Number of orders in this column',
    },
    onDrop: {
      action: 'dropped',
      description: 'Handler for when an order is dropped',
    },
    onDragOver: {
      action: 'dragOver',
      description: 'Handler for drag over events',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleOrder = {
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
  ],
  total_amount: 2850,
  status: 'preparing' as const,
  created_at: new Date().toISOString(),
  estimated_completion: new Date(Date.now() + 15 * 60000).toISOString(),
  notes: 'Please make sure the pizza is well done.',
};

export const Empty: Story = {
  args: {
    title: 'Preparing',
    status: 'preparing',
    count: 0,
  },
};

export const WithOrders: Story = {
  args: {
    title: 'Preparing',
    status: 'preparing',
    count: 2,
    children: (
      <>
        <OrderCard order={sampleOrder} />
        <OrderCard order={{ ...sampleOrder, id: '2', order_number: '1002', customer_name: 'Jane Doe' }} />
      </>
    ),
  },
};

export const Pending: Story = {
  args: {
    title: 'New Orders',
    status: 'pending',
    count: 1,
    acceptsDrops: false,
    children: <OrderCard order={{ ...sampleOrder, status: 'pending' }} />,
  },
};

export const Accepted: Story = {
  args: {
    title: 'Accepted',
    status: 'accepted',
    count: 1,
    children: <OrderCard order={{ ...sampleOrder, status: 'accepted' }} />,
  },
};

export const Ready: Story = {
  args: {
    title: 'Ready',
    status: 'ready',
    count: 1,
    children: <OrderCard order={{ ...sampleOrder, status: 'ready' }} />,
  },
};

export const Complete: Story = {
  args: {
    title: 'Complete',
    status: 'complete',
    count: 1,
    children: <OrderCard order={{ ...sampleOrder, status: 'complete' }} />,
  },
};

export const Cancelled: Story = {
  args: {
    title: 'Cancelled',
    status: 'cancelled',
    count: 1,
    children: <OrderCard order={{ ...sampleOrder, status: 'cancelled' }} />,
  },
};

export const DraggedOver: Story = {
  args: {
    title: 'Preparing',
    status: 'preparing',
    count: 1,
    isDraggedOver: true,
    children: <OrderCard order={sampleOrder} />,
  },
};

export const NoDropsAllowed: Story = {
  args: {
    title: 'New Orders',
    status: 'pending',
    count: 1,
    acceptsDrops: false,
    children: <OrderCard order={{ ...sampleOrder, status: 'pending' }} />,
  },
};