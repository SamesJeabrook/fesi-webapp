import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RatingForm } from './RatingForm.component';

const meta: Meta<typeof RatingForm> = {
  title: 'Molecules/RatingForm',
  component: RatingForm,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onSubmit: { action: 'submitted' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockMenuItems = [
  { id: '1', title: 'Beef Burger', price: 1299 },
  { id: '2', title: 'Crispy Fries', price: 599 },
  { id: '3', title: 'Chocolate Milkshake', price: 799 },
];

export const Default: Story = {
  args: {
    orderId: 'order-123',
    customerId: 'customer-456',
    onSubmit: async (data) => {
      console.log('Rating submitted:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  },
};

export const WithMenuItems: Story = {
  args: {
    orderId: 'order-123',
    customerId: 'customer-456',
    menuItems: mockMenuItems,
    onSubmit: async (data) => {
      console.log('Rating with menu items submitted:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  },
};

export const GuestUser: Story = {
  args: {
    orderId: 'order-789',
    guestEmail: 'guest@example.com',
    guestName: 'John Doe',
    menuItems: mockMenuItems.slice(0, 2),
    onSubmit: async (data) => {
      console.log('Guest rating submitted:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  },
};

export const Loading: Story = {
  args: {
    orderId: 'order-123',
    customerId: 'customer-456',
    menuItems: mockMenuItems,
    isSubmitting: true,
    onSubmit: async (data) => {
      console.log('Rating submitted:', data);
    },
  },
};
