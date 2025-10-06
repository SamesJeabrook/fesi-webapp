import type { Meta, StoryObj } from '@storybook/react';
import { MerchantCard } from './MerchantCard.component';

const meta: Meta<typeof MerchantCard> = {
  title: 'Atoms/MerchantCard',
  component: MerchantCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onSelect: { action: 'selected' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockMerchant = {
  id: '1',
  name: "Mario's Authentic Pizzeria",
  username: 'marios-pizzeria',
  phone: '+1 (555) 123-4567',
  status: 'active',
  created_at: '2024-01-15T10:30:00Z',
};

export const Default: Story = {
  args: {
    merchant: mockMerchant,
  },
};

export const Selected: Story = {
  args: {
    merchant: mockMerchant,
    isSelected: true,
  },
};

export const WithSelectHandler: Story = {
  args: {
    merchant: mockMerchant,
    onSelect: (merchant) => console.log('Selected:', merchant),
  },
};

export const InactiveStatus: Story = {
  args: {
    merchant: {
      ...mockMerchant,
      status: 'inactive',
    },
  },
};

export const SuspendedStatus: Story = {
  args: {
    merchant: {
      ...mockMerchant,
      status: 'suspended',
    },
  },
};

export const LongName: Story = {
  args: {
    merchant: {
      ...mockMerchant,
      name: "Giuseppe's Authentic Italian Ristorante & Pizzeria",
      username: 'giuseppes-italian-ristorante',
    },
  },
};