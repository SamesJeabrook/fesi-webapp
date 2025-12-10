import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MenuItemDetails from './MenuItemDetails';
import type { MenuItem, SelectedOptionDetail } from './MenuItemDetails.types';

const sampleItem: MenuItem = {
  id: '3ca836da-02f1-4ae5-a1a0-3e4db34d0457',
  merchantId: '44cdb990-1044-48ae-bcbf-f91d0cedfe33',
  categoryId: '6744e6b5-8e05-4e3e-bff7-eb6a40751352',
  name: 'Margherita',
  description: 'Fresh mozzarella, tomato sauce, basil',
  imageUrl: '',
  basePrice: 1200,
  displayOrder: 1,
  isAvailable: true,
  createdAt: '2025-09-08T09:22:44.250Z',
  updatedAt: '2025-09-08T09:22:44.250Z',
  price: '£12.00',
  option: [
    {
      id: '68a09d2b-f2fa-455b-ad86-54dcf5f0a01c',
      menuItemId: '3ca836da-02f1-4ae5-a1a0-3e4db34d0457',
      name: 'Pizza Size',
      type: 'single',
      required: true,
      maxSelections: 1,
      createdAt: '2025-09-08T09:22:44.250Z',
      updatedAt: '2025-09-08T09:22:44.250Z',
      choices: [
        { id: '8159e6e5-1be4-4137-bf0e-4290dd70701c', optionId: '68a09d2b-f2fa-455b-ad86-54dcf5f0a01c', name: 'Small (9")', priceModifier: -200, createdAt: '2025-09-08T09:22:44.250Z', updatedAt: '2025-09-08T09:22:44.250Z' },
        { id: '943d85a4-6f5d-47fc-95bc-f5a9d74c326b', optionId: '68a09d2b-f2fa-455b-ad86-54dcf5f0a01c', name: 'Medium (12")', priceModifier: 0, createdAt: '2025-09-08T09:22:44.250Z', updatedAt: '2025-09-08T09:22:44.250Z' },
        { id: '040ea81c-06e8-4e7e-bb0f-8dbd663fb22e', optionId: '68a09d2b-f2fa-455b-ad86-54dcf5f0a01c', name: 'Large (15")', priceModifier: 300, createdAt: '2025-09-08T09:22:44.250Z', updatedAt: '2025-09-08T09:22:44.250Z' },
        { id: '78ed083f-c28b-43dc-8d68-6f15470e27d9', optionId: '68a09d2b-f2fa-455b-ad86-54dcf5f0a01c', name: 'Extra Large (18")', priceModifier: 500, createdAt: '2025-09-08T09:22:44.250Z', updatedAt: '2025-09-08T09:22:44.250Z' }
      ]
    },
    {
      id: 'ed1ed4a3-2117-4d39-9ba2-167e069c4162',
      menuItemId: '3ca836da-02f1-4ae5-a1a0-3e4db34d0457',
      name: 'Extra Toppings',
      type: 'multiple',
      required: false,
      maxSelections: 7,
      createdAt: '2025-09-08T09:22:44.250Z',
      updatedAt: '2025-09-08T09:22:44.250Z',
      choices: [
        { id: '2be721a4-4f37-48f9-88b7-98c0ada0cabb', optionId: 'ed1ed4a3-2117-4d39-9ba2-167e069c4162', name: 'Extra Cheese', priceModifier: 150, createdAt: '2025-09-08T09:22:44.250Z', updatedAt: '2025-09-08T09:22:44.250Z' },
        { id: 'f84ac9ca-257a-4ba3-94e1-2ee3988fb455', optionId: 'ed1ed4a3-2117-4d39-9ba2-167e069c4162', name: 'Extra Pepperoni', priceModifier: 200, createdAt: '2025-09-08T09:22:44.250Z', updatedAt: '2025-09-08T09:22:44.250Z' },
        { id: '1a3e12c1-120d-4002-97de-fe42d7e9e4d3', optionId: 'ed1ed4a3-2117-4d39-9ba2-167e069c4162', name: 'Mushrooms', priceModifier: 100, createdAt: '2025-09-08T09:22:44.250Z', updatedAt: '2025-09-08T09:22:44.250Z' },
        { id: '8ced6cb7-7210-43db-86a1-c3030aae1289', optionId: 'ed1ed4a3-2117-4d39-9ba2-167e069c4162', name: 'Green Peppers', priceModifier: 100, createdAt: '2025-09-08T09:22:44.250Z', updatedAt: '2025-09-08T09:22:44.250Z' },
        { id: 'f417b49e-1e0c-40dc-94e7-82b824240a78', optionId: 'ed1ed4a3-2117-4d39-9ba2-167e069c4162', name: 'Onions', priceModifier: 100, createdAt: '2025-09-08T09:22:44.250Z', updatedAt: '2025-09-08T09:22:44.250Z' },
        { id: '08c61952-76b6-478b-8359-32556f87da51', optionId: 'ed1ed4a3-2117-4d39-9ba2-167e069c4162', name: 'Olives', priceModifier: 120, createdAt: '2025-09-08T09:22:44.250Z', updatedAt: '2025-09-08T09:22:44.250Z' },
        { id: 'e4424a9c-c8cc-44ac-848e-4f145293c131', optionId: 'ed1ed4a3-2117-4d39-9ba2-167e069c4162', name: 'Jalapeños', priceModifier: 100, createdAt: '2025-09-08T09:22:44.250Z', updatedAt: '2025-09-08T09:22:44.250Z' }
      ]
    }
  ]
};

const meta: Meta<typeof MenuItemDetails> = {
  title: 'Organisms/MenuItemDetails',
  component: MenuItemDetails,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof MenuItemDetails>;

export const Default: Story = {
  render: (args) => {
    const [selectedOptions, setSelectedOptions] = useState<Record<string, SelectedOptionDetail[]>>({});
  return (
      <MenuItemDetails
        {...args}
        selectedOptions={selectedOptions}
        onOptionsChange={(groupId, selected) => {
          setSelectedOptions(prev => ({ ...prev, [groupId]: selected }));
        }}
      />
    );
  },
  args: {
    item: sampleItem,
    disabled: false,
  },
};
