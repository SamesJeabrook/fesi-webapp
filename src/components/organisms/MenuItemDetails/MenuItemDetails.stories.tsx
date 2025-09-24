import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MenuItemDetails from './MenuItemDetails';
import type { MenuItem } from './MenuItemDetails.types';

const sampleItem: MenuItem = {
  id: '3ca836da-02f1-4ae5-a1a0-3e4db34d0457',
  merchant_id: '44cdb990-1044-48ae-bcbf-f91d0cedfe33',
  category_id: '6744e6b5-8e05-4e3e-bff7-eb6a40751352',
  title: 'Margherita',
  description: 'Fresh mozzarella, tomato sauce, basil',
  image_url: '',
  base_price: 1200,
  display_order: 1,
  is_active: true,
  created_at: '2025-09-08T09:22:44.250Z',
  updated_at: '2025-09-08T09:22:44.250Z',
  category_name: 'Pizza',
  option_groups: [
    {
      id: '68a09d2b-f2fa-455b-ad86-54dcf5f0a01c',
      name: 'Pizza Size',
      selection_type: 'single',
      is_required: true,
      max_selections: 1,
      sub_items: [
        { id: '8159e6e5-1be4-4137-bf0e-4290dd70701c', name: 'Small (9")', additional_price: -200, display_order: 1 },
        { id: '943d85a4-6f5d-47fc-95bc-f5a9d74c326b', name: 'Medium (12")', additional_price: 0, display_order: 2 },
        { id: '040ea81c-06e8-4e7e-bb0f-8dbd663fb22e', name: 'Large (15")', additional_price: 300, display_order: 3 },
        { id: '78ed083f-c28b-43dc-8d68-6f15470e27d9', name: 'Extra Large (18")', additional_price: 500, display_order: 4 }
      ]
    },
    {
      id: 'ed1ed4a3-2117-4d39-9ba2-167e069c4162',
      name: 'Extra Toppings',
      selection_type: 'multiple',
      is_required: false,
      max_selections: null,
      sub_items: [
        { id: '2be721a4-4f37-48f9-88b7-98c0ada0cabb', name: 'Extra Cheese', additional_price: 150, display_order: 1 },
        { id: 'f84ac9ca-257a-4ba3-94e1-2ee3988fb455', name: 'Extra Pepperoni', additional_price: 200, display_order: 2 },
        { id: '1a3e12c1-120d-4002-97de-fe42d7e9e4d3', name: 'Mushrooms', additional_price: 100, display_order: 3 },
        { id: '8ced6cb7-7210-43db-86a1-c3030aae1289', name: 'Green Peppers', additional_price: 100, display_order: 4 },
        { id: 'f417b49e-1e0c-40dc-94e7-82b824240a78', name: 'Onions', additional_price: 100, display_order: 5 },
        { id: '08c61952-76b6-478b-8359-32556f87da51', name: 'Olives', additional_price: 120, display_order: 6 },
        { id: 'e4424a9c-c8cc-44ac-848e-4f145293c131', name: 'Jalapeños', additional_price: 100, display_order: 7 }
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
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
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
