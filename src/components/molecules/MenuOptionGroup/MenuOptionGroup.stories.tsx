import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MenuOptionGroup from './MenuOptionGroup';
import type { MenuOptionGroup as MenuOptionGroupType } from './MenuOptionGroup.types';

const sampleGroupSingle: MenuOptionGroupType = {
  id: 'size',
  name: 'Pizza Size',
  selection_type: 'single',
  is_required: true,
  max_selections: 1,
  sub_items: [
    { id: 'small', name: 'Small (9")', additional_price: -200, display_order: 1 },
    { id: 'medium', name: 'Medium (12")', additional_price: 0, display_order: 2 },
    { id: 'large', name: 'Large (15")', additional_price: 300, display_order: 3 },
    { id: 'xlarge', name: 'Extra Large (18")', additional_price: 500, display_order: 4 }
  ]
};

const sampleGroupMultiple: MenuOptionGroupType = {
  id: 'toppings',
  name: 'Extra Toppings',
  selection_type: 'multiple',
  is_required: false,
  max_selections: null,
  sub_items: [
    { id: 'cheese', name: 'Extra Cheese', additional_price: 150, display_order: 1 },
    { id: 'pepperoni', name: 'Extra Pepperoni', additional_price: 200, display_order: 2 },
    { id: 'mushrooms', name: 'Mushrooms', additional_price: 100, display_order: 3 },
    { id: 'peppers', name: 'Green Peppers', additional_price: 100, display_order: 4 },
    { id: 'onions', name: 'Onions', additional_price: 100, display_order: 5 },
    { id: 'olives', name: 'Olives', additional_price: 120, display_order: 6 },
    { id: 'jalapenos', name: 'Jalapeños', additional_price: 100, display_order: 7 }
  ]
};

const meta: Meta<typeof MenuOptionGroup> = {
  title: 'Molecules/MenuOptionGroup',
  component: MenuOptionGroup,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof MenuOptionGroup>;

export const SingleSelect: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <MenuOptionGroup
        {...args}
        selected={selected}
        onChange={setSelected}
      />
    );
  },
  args: {
    group: sampleGroupSingle,
    disabled: false,
  },
};

export const MultipleSelect: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <MenuOptionGroup
        {...args}
        selected={selected}
        onChange={setSelected}
      />
    );
  },
  args: {
    group: sampleGroupMultiple,
    disabled: false,
  },
};
