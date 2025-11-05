import type { Meta, StoryObj } from '@storybook/react';
import { MenuItemOptionsModal } from './MenuItemOptionsModal';
import React from 'react';

const meta = {
  title: 'Organisms/MenuItemOptionsModal',
  component: MenuItemOptionsModal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modal for customizing menu items with option groups. Used in the POS system when items have customizable options like sizes, toppings, or add-ons.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    menuItem: { control: 'object', description: 'The menu item being customized' },
    selectedOptions: { control: 'object', description: 'Currently selected options' },
    isOpen: { control: 'boolean', description: 'Whether the modal is open' },
    onClose: { action: 'closed', description: 'Handler for closing the modal' },
    onOptionSelect: { action: 'option selected', description: 'Handler for selecting/deselecting options' },
    onAddToCart: { action: 'added to cart', description: 'Handler for adding item to cart' }
  }
} satisfies Meta<typeof MenuItemOptionsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const pizzaItem = {
  id: '1',
  title: 'Custom Pizza',
  base_price: 1200,
  description: 'Build your perfect pizza with our selection of fresh toppings',
  option_groups: [
    {
      id: 'size',
      name: 'Size',
      selection_type: 'single' as const,
      is_required: true,
      max_selections: 1,
      sub_items: [
        { id: 'small', name: 'Small (10")', additional_price: 0, display_order: 1 },
        { id: 'medium', name: 'Medium (12")', additional_price: 200, display_order: 2 },
        { id: 'large', name: 'Large (14")', additional_price: 400, display_order: 3 }
      ]
    },
    {
      id: 'toppings',
      name: 'Toppings',
      selection_type: 'multiple' as const,
      is_required: false,
      max_selections: 5,
      sub_items: [
        { id: 'pepperoni', name: 'Pepperoni', additional_price: 100, display_order: 1 },
        { id: 'mushrooms', name: 'Mushrooms', additional_price: 80, display_order: 2 },
        { id: 'olives', name: 'Olives', additional_price: 80, display_order: 3 },
        { id: 'bacon', name: 'Bacon', additional_price: 150, display_order: 4 },
        { id: 'extra-cheese', name: 'Extra Cheese', additional_price: 100, display_order: 5 }
      ]
    }
  ]
};

const burgerItem = {
  id: '2',
  title: 'Gourmet Burger',
  base_price: 950,
  description: 'Premium beef patty with your choice of toppings',
  option_groups: [
    {
      id: 'patty',
      name: 'Patty Type',
      selection_type: 'single' as const,
      is_required: true,
      max_selections: 1,
      sub_items: [
        { id: 'beef', name: 'Beef', additional_price: 0, display_order: 1 },
        { id: 'chicken', name: 'Grilled Chicken', additional_price: 50, display_order: 2 },
        { id: 'veggie', name: 'Veggie Patty', additional_price: 0, display_order: 3 }
      ]
    },
    {
      id: 'cheese',
      name: 'Cheese',
      selection_type: 'single' as const,
      is_required: false,
      max_selections: 1,
      sub_items: [
        { id: 'cheddar', name: 'Cheddar', additional_price: 50, display_order: 1 },
        { id: 'swiss', name: 'Swiss', additional_price: 70, display_order: 2 },
        { id: 'blue', name: 'Blue Cheese', additional_price: 100, display_order: 3 }
      ]
    },
    {
      id: 'extras',
      name: 'Extras',
      selection_type: 'multiple' as const,
      is_required: false,
      max_selections: null,
      sub_items: [
        { id: 'bacon', name: 'Bacon', additional_price: 150, display_order: 1 },
        { id: 'avocado', name: 'Avocado', additional_price: 100, display_order: 2 },
        { id: 'fried-egg', name: 'Fried Egg', additional_price: 80, display_order: 3 }
      ]
    }
  ]
};

export const Closed: Story = {
  args: {
    menuItem: pizzaItem,
    selectedOptions: {},
    isOpen: false
  }
};

export const SimplePizza: Story = {
  args: {
    menuItem: pizzaItem,
    selectedOptions: {},
    isOpen: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Pizza customization with required size selection and optional toppings.'
      }
    }
  }
};

export const PizzaWithSelections: Story = {
  args: {
    menuItem: pizzaItem,
    selectedOptions: {
      size: ['medium'],
      toppings: ['pepperoni', 'mushrooms', 'extra-cheese']
    },
    isOpen: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Pizza with some options already selected. Total price updates based on selections.'
      }
    }
  }
};

export const BurgerCustomization: Story = {
  args: {
    menuItem: burgerItem,
    selectedOptions: {},
    isOpen: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Burger customization with multiple option groups including required and optional selections.'
      }
    }
  }
};

export const BurgerWithSelections: Story = {
  args: {
    menuItem: burgerItem,
    selectedOptions: {
      patty: ['beef'],
      cheese: ['swiss'],
      extras: ['bacon', 'avocado']
    },
    isOpen: true
  }
};

const saladItem = {
  id: '3',
  title: 'Build Your Own Salad',
  base_price: 750,
  description: 'Fresh greens with your choice of toppings and dressing',
  option_groups: [
    {
      id: 'base',
      name: 'Base',
      selection_type: 'single' as const,
      is_required: true,
      max_selections: 1,
      sub_items: [
        { id: 'romaine', name: 'Romaine Lettuce', additional_price: 0, display_order: 1 },
        { id: 'spinach', name: 'Baby Spinach', additional_price: 50, display_order: 2 },
        { id: 'mixed', name: 'Mixed Greens', additional_price: 50, display_order: 3 }
      ]
    },
    {
      id: 'protein',
      name: 'Protein',
      selection_type: 'single' as const,
      is_required: true,
      max_selections: 1,
      sub_items: [
        { id: 'chicken', name: 'Grilled Chicken', additional_price: 300, display_order: 1 },
        { id: 'salmon', name: 'Grilled Salmon', additional_price: 450, display_order: 2 },
        { id: 'tofu', name: 'Marinated Tofu', additional_price: 200, display_order: 3 }
      ]
    },
    {
      id: 'toppings',
      name: 'Toppings',
      selection_type: 'multiple' as const,
      is_required: false,
      max_selections: 3,
      sub_items: [
        { id: 'tomatoes', name: 'Cherry Tomatoes', additional_price: 50, display_order: 1 },
        { id: 'cucumbers', name: 'Cucumbers', additional_price: 50, display_order: 2 },
        { id: 'croutons', name: 'Garlic Croutons', additional_price: 50, display_order: 3 },
        { id: 'parmesan', name: 'Shaved Parmesan', additional_price: 80, display_order: 4 }
      ]
    },
    {
      id: 'dressing',
      name: 'Dressing',
      selection_type: 'single' as const,
      is_required: true,
      max_selections: 1,
      sub_items: [
        { id: 'caesar', name: 'Caesar', additional_price: 0, display_order: 1 },
        { id: 'ranch', name: 'Ranch', additional_price: 0, display_order: 2 },
        { id: 'balsamic', name: 'Balsamic Vinaigrette', additional_price: 0, display_order: 3 },
        { id: 'lemon', name: 'Lemon Herb', additional_price: 0, display_order: 4 }
      ]
    }
  ]
};

export const ComplexSalad: Story = {
  args: {
    menuItem: saladItem,
    selectedOptions: {},
    isOpen: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Complex customization with multiple required groups. Add to Cart is disabled until all required selections are made.'
      }
    }
  }
};

export const InteractiveExample: Story = {
  render: function Component() {
    const [isOpen, setIsOpen] = React.useState(true);
    const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string[]>>({});

    const handleOptionSelect = (
      groupId: string,
      subItemId: string,
      selectionType: 'single' | 'multiple',
      maxSelections: number | null
    ) => {
      setSelectedOptions(prev => {
        const currentSelections = prev[groupId] || [];
        
        if (selectionType === 'single') {
          return { ...prev, [groupId]: [subItemId] };
        } else {
          if (currentSelections.includes(subItemId)) {
            return {
              ...prev,
              [groupId]: currentSelections.filter(id => id !== subItemId)
            };
          } else {
            if (maxSelections && currentSelections.length >= maxSelections) {
              return prev;
            }
            return {
              ...prev,
              [groupId]: [...currentSelections, subItemId]
            };
          }
        }
      });
    };

    const handleAddToCart = () => {
      setIsOpen(false);
      setTimeout(() => {
        setIsOpen(true);
        setSelectedOptions({});
      }, 1000);
    };

    return (
      <div>
        <MenuItemOptionsModal
          menuItem={pizzaItem}
          selectedOptions={selectedOptions}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onOptionSelect={handleOptionSelect}
          onAddToCart={handleAddToCart}
        />
        {!isOpen && (
          <button 
            onClick={() => setIsOpen(true)}
            style={{ 
              padding: '12px 24px', 
              background: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Reopen Modal
          </button>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive example with state management. Try selecting different options and adding to cart.'
      }
    }
  }
};
