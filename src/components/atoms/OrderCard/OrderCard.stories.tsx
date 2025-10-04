import type { Meta, StoryObj } from '@storybook/react';
import { OrderCard } from './OrderCard.component';

const meta: Meta<typeof OrderCard> = {
  title: 'Atoms/OrderCard',
  component: OrderCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A card component for displaying order information with drag-and-drop support.',
      },
    },
  },
  argTypes: {
    isDraggable: {
      control: { type: 'boolean' },
      description: 'Whether the card can be dragged',
    },
    isDragging: {
      control: { type: 'boolean' },
      description: 'Whether the card is currently being dragged',
    },
    onClick: {
      action: 'clicked',
      description: 'Handler for card clicks',
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
        { sub_item_name: 'Olives', quantity: 1 },
      ],
    },
    {
      menu_item_name: 'Caesar Salad',
      quantity: 1,
    },
    {
      menu_item_name: 'Garlic Bread',
      quantity: 3,
    },
  ],
  total_amount: 2850, // £28.50
  status: 'preparing' as const,
  created_at: new Date().toISOString(),
  estimated_completion: new Date(Date.now() + 15 * 60000).toISOString(), // 15 minutes from now
  notes: 'Please make sure the pizza is well done.',
};

export const Default: Story = {
  args: {
    order: sampleOrder,
  },
};

export const Pending: Story = {
  args: {
    order: {
      ...sampleOrder,
      status: 'pending',
      order_number: '1002',
    },
  },
};

export const Accepted: Story = {
  args: {
    order: {
      ...sampleOrder,
      status: 'accepted',
      order_number: '1003',
    },
  },
};

export const Ready: Story = {
  args: {
    order: {
      ...sampleOrder,
      status: 'ready',
      order_number: '1004',
    },
  },
};

export const Complete: Story = {
  args: {
    order: {
      ...sampleOrder,
      status: 'complete',
      order_number: '1005',
    },
  },
};

export const Cancelled: Story = {
  args: {
    order: {
      ...sampleOrder,
      status: 'cancelled',
      order_number: '1006',
    },
  },
};

export const Draggable: Story = {
  args: {
    order: sampleOrder,
    isDraggable: true,
  },
};

export const Dragging: Story = {
  args: {
    order: sampleOrder,
    isDraggable: true,
    isDragging: true,
  },
};

export const WithoutEmail: Story = {
  args: {
    order: {
      ...sampleOrder,
      customer_email: undefined,
    },
  },
};

export const WithoutNotes: Story = {
  args: {
    order: {
      ...sampleOrder,
      notes: undefined,
    },
  },
};

export const ManyItems: Story = {
  args: {
    order: {
      ...sampleOrder,
      items: [
        { menu_item_name: 'Margherita Pizza', quantity: 2 },
        { menu_item_name: 'Caesar Salad', quantity: 1 },
        { menu_item_name: 'Garlic Bread', quantity: 3 },
        { menu_item_name: 'Chocolate Cake', quantity: 2 },
        { menu_item_name: 'Soft Drink', quantity: 4 },
        { menu_item_name: 'Coffee', quantity: 2 },
      ],
    },
  },
};