import type { Meta, StoryObj } from '@storybook/react';
import { MerchantSelector } from './MerchantSelector.component';

const meta: Meta<typeof MerchantSelector> = {
  title: 'Molecules/MerchantSelector',
  component: MerchantSelector,
  parameters: {
    layout: 'fullscreen',
    padded: true,
  },
  tags: ['autodocs'],
  argTypes: {
    onMerchantSelect: { action: 'merchant selected' },
    viewMode: {
      control: 'select',
      options: ['grid', 'table'],
    },
    gridColumns: {
      control: 'select',
      options: [1, 2, 3, 4],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockSelectedMerchant = {
  id: '1',
  name: "Mario's Authentic Pizzeria",
  username: 'marios-pizzeria',
  phone: '+1 (555) 123-4567',
  status: 'active',
  created_at: '2024-01-15T10:30:00Z',
};

export const Default: Story = {
  args: {
    onMerchantSelect: (merchant) => console.log('Selected merchant:', merchant),
  },
};

export const WithSelection: Story = {
  args: {
    selectedMerchant: mockSelectedMerchant,
    onMerchantSelect: (merchant) => console.log('Selected merchant:', merchant),
  },
};

export const TwoColumns: Story = {
  args: {
    gridColumns: 2,
    onMerchantSelect: (merchant) => console.log('Selected merchant:', merchant),
  },
};

export const OneColumn: Story = {
  args: {
    gridColumns: 1,
    onMerchantSelect: (merchant) => console.log('Selected merchant:', merchant),
  },
};

// Note: Loading and error states are handled automatically by the component
// based on API responses, so they don't need separate stories