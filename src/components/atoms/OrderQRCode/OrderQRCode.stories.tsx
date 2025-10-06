import type { Meta, StoryObj } from '@storybook/react';
import { OrderQRCode } from './OrderQRCode.component';
import { OrderQRCodeProps } from './OrderQRCode.types';

const meta: Meta<typeof OrderQRCode> = {
  title: 'Atoms/OrderQRCode',
  component: OrderQRCode,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'QR code generator for customer orders. Creates a QR code containing order verification data that merchants can scan to confirm order pickup.'
      }
    }
  },
  argTypes: {
    orderId: {
      control: 'text',
      description: 'Unique order identifier'
    },
    orderNumber: {
      control: 'text',
      description: 'Human-readable order number'
    },
    orderItems: {
      control: 'object',
      description: 'List of items in the order'
    },
    merchantId: {
      control: 'text',
      description: 'Optional merchant identifier'
    },
    size: {
      control: { type: 'range', min: 100, max: 400, step: 10 },
      description: 'Size of the QR code in pixels'
    },
    showOrderInfo: {
      control: 'boolean',
      description: 'Whether to show order information below the QR code'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<OrderQRCodeProps>;

// Default QR code
export const Default: Story = {
  args: {
    orderId: 'order_123456789',
    orderNumber: 'ORD-2025-001',
    orderItems: [
      { name: 'Margherita Pizza', quantity: 1 },
      { name: 'Caesar Salad', quantity: 2 },
      { name: 'Coca Cola', quantity: 3 }
    ],
    merchantId: 'merchant_456',
    size: 200,
    showOrderInfo: true
  }
};

// Large QR code
export const Large: Story = {
  args: {
    ...Default.args,
    size: 300
  }
};

// Small QR code
export const Small: Story = {
  args: {
    ...Default.args,
    size: 150
  }
};

// Without order info
export const WithoutOrderInfo: Story = {
  args: {
    ...Default.args,
    showOrderInfo: false
  }
};

// Different order data
export const DifferentOrder: Story = {
  args: {
    orderId: 'order_987654321',
    orderNumber: 'ORD-2025-042',
    orderItems: [
      { name: 'Fish & Chips', quantity: 1 },
      { name: 'Mushy Peas', quantity: 1 }
    ],
    merchantId: 'merchant_abc',
    size: 200,
    showOrderInfo: true
  }
};

// Without merchant ID
export const WithoutMerchantId: Story = {
  args: {
    orderId: 'order_111222333',
    orderNumber: 'ORD-2025-099',
    orderItems: [
      { name: 'Burger', quantity: 1 },
      { name: 'Fries', quantity: 1 },
      { name: 'Milkshake', quantity: 1 }
    ],
    size: 200,
    showOrderInfo: true
  }
};