import type { Meta, StoryObj } from '@storybook/react';
import { AdminBadge } from './AdminBadge.component';

const meta: Meta<typeof AdminBadge> = {
  title: 'Atoms/AdminBadge',
  component: AdminBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['warning', 'info', 'success', 'danger'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Warning: Story = {
  args: {
    children: '🔧 ADMIN MODE',
    variant: 'warning',
  },
};

export const Info: Story = {
  args: {
    children: '👑 Admin Dashboard',
    variant: 'info',
  },
};

export const Success: Story = {
  args: {
    children: '✅ Connected',
    variant: 'success',
  },
};

export const Danger: Story = {
  args: {
    children: '⚠️ Unauthorized',
    variant: 'danger',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        🔧 ADMIN MODE: Viewing as Mario's Pizzeria
      </>
    ),
    variant: 'warning',
  },
};