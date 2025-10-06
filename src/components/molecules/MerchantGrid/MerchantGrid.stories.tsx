import type { Meta, StoryObj } from '@storybook/react';
import { MerchantGrid } from './MerchantGrid.component';

const meta: Meta<typeof MerchantGrid> = {
  title: 'Molecules/MerchantGrid',
  component: MerchantGrid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onMerchantSelect: { action: 'merchant selected' },
    columns: {
      control: 'select',
      options: [1, 2, 3, 4],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockMerchants = [
  {
    id: '1',
    name: "Mario's Authentic Pizzeria",
    username: 'marios-pizzeria',
    phone: '+1 (555) 123-4567',
    status: 'active',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: "Joe's Coffee Shop",
    username: 'joes-coffee',
    phone: '+1 (555) 987-6543',
    status: 'active',
    created_at: '2024-02-20T14:15:00Z',
  },
  {
    id: '3',
    name: "Bella's Italian Kitchen",
    username: 'bellas-kitchen',
    phone: '+1 (555) 456-7890',
    status: 'inactive',
    created_at: '2024-03-10T09:00:00Z',
  },
  {
    id: '4',
    name: "Dragon Sushi House",
    username: 'dragon-sushi',
    phone: '+1 (555) 321-0987',
    status: 'suspended',
    created_at: '2024-01-05T16:45:00Z',
  },
];

export const Default: Story = {
  args: {
    merchants: mockMerchants,
  },
};

export const WithSelection: Story = {
  args: {
    merchants: mockMerchants,
    selectedMerchantId: '2',
    onMerchantSelect: (merchant) => console.log('Selected:', merchant),
  },
};

export const TwoColumns: Story = {
  args: {
    merchants: mockMerchants,
    columns: 2,
  },
};

export const OneColumn: Story = {
  args: {
    merchants: mockMerchants,
    columns: 1,
  },
};

export const Loading: Story = {
  args: {
    merchants: [],
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    merchants: [],
    error: 'Failed to load merchants. Please try again.',
  },
};

export const Empty: Story = {
  args: {
    merchants: [],
    emptyMessage: 'No merchants match your search criteria',
  },
};

export const SingleMerchant: Story = {
  args: {
    merchants: [mockMerchants[0]],
    selectedMerchantId: '1',
  },
};