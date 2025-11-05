import type { Meta, StoryObj } from '@storybook/react';
import { POSCartItem } from './POSCartItem';

const meta = {
  title: 'Molecules/POSCartItem',
  component: POSCartItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A cart item component for the POS system. Displays item details, quantity controls, customizations, and notes input.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text', description: 'Unique identifier for this cart item instance' },
    menuItemName: { control: 'text', description: 'Name of the menu item' },
    quantity: { control: 'number', description: 'Quantity of this item' },
    itemTotal: { control: 'number', description: 'Total price in cents (includes all customizations × quantity)' },
    customizations: { control: 'object', description: 'Array of selected customizations' },
    notes: { control: 'text', description: 'Special instructions or notes' },
    onQuantityChange: { action: 'quantity changed', description: 'Handler for quantity changes' },
    onNotesChange: { action: 'notes changed', description: 'Handler for notes changes' },
    onRemove: { action: 'removed', description: 'Handler for removing the item' }
  }
} satisfies Meta<typeof POSCartItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: '1',
    menuItemName: 'Margherita Pizza',
    quantity: 1,
    itemTotal: 1250
  }
};

export const WithCustomizations: Story = {
  args: {
    id: '2',
    menuItemName: 'Custom Burger',
    quantity: 1,
    itemTotal: 1150,
    customizations: [
      { sub_item_id: '1', sub_item_name: 'Extra Cheese', price_modifier: 100, quantity: 1 },
      { sub_item_id: '2', sub_item_name: 'Bacon', price_modifier: 150, quantity: 1 }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Cart items with customizations display the selected options below the item name.'
      }
    }
  }
};

export const WithNotes: Story = {
  args: {
    id: '3',
    menuItemName: 'Caesar Salad',
    quantity: 1,
    itemTotal: 750,
    notes: 'No croutons, extra dressing on the side'
  },
  parameters: {
    docs: {
      description: {
        story: 'Cart items can have special instructions or notes.'
      }
    }
  }
};

export const MultipleQuantity: Story = {
  args: {
    id: '4',
    menuItemName: 'Truffle Fries',
    quantity: 3,
    itemTotal: 1950,
    customizations: [
      { sub_item_id: '3', sub_item_name: 'Extra Truffle Oil', price_modifier: 100, quantity: 1 }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'The item total reflects the quantity × (base price + customizations).'
      }
    }
  }
};

export const ComplexItem: Story = {
  args: {
    id: '5',
    menuItemName: 'Build Your Own Pasta',
    quantity: 2,
    itemTotal: 3400,
    customizations: [
      { sub_item_id: '4', sub_item_name: 'Penne', price_modifier: 0, quantity: 1 },
      { sub_item_id: '5', sub_item_name: 'Carbonara Sauce', price_modifier: 200, quantity: 1 },
      { sub_item_id: '6', sub_item_name: 'Chicken', price_modifier: 300, quantity: 1 },
      { sub_item_id: '7', sub_item_name: 'Parmesan', price_modifier: 50, quantity: 1 }
    ],
    notes: 'Well done, please'
  }
};

export const InteractiveExample: Story = {
  render: function Component() {
    const [items, setItems] = React.useState([
      {
        id: '1',
        menuItemName: 'Margherita Pizza',
        quantity: 1,
        itemTotal: 1250,
        customizations: [],
        notes: ''
      },
      {
        id: '2',
        menuItemName: 'Custom Burger',
        quantity: 2,
        itemTotal: 2300,
        customizations: [
          { sub_item_id: '1', sub_item_name: 'Extra Cheese', price_modifier: 100, quantity: 1 },
          { sub_item_id: '2', sub_item_name: 'Bacon', price_modifier: 150, quantity: 1 }
        ],
        notes: ''
      }
    ]);

    const handleQuantityChange = (id: string, newQuantity: number) => {
      if (newQuantity === 0) {
        setItems(prev => prev.filter(item => item.id !== id));
      } else {
        setItems(prev => prev.map(item => {
          if (item.id === id) {
            const basePrice = item.itemTotal / item.quantity;
            return { ...item, quantity: newQuantity, itemTotal: basePrice * newQuantity };
          }
          return item;
        }));
      }
    };

    const handleNotesChange = (id: string, notes: string) => {
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, notes } : item
      ));
    };

    const handleRemove = (id: string) => {
      setItems(prev => prev.filter(item => item.id !== id));
    };

    const total = items.reduce((sum, item) => sum + item.itemTotal, 0);

    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              Cart is empty
            </div>
          ) : (
            items.map(item => (
              <POSCartItem
                key={item.id}
                {...item}
                onQuantityChange={handleQuantityChange}
                onNotesChange={handleNotesChange}
                onRemove={handleRemove}
              />
            ))
          )}
        </div>
        <div style={{ 
          padding: '1rem', 
          background: '#f5f5f5', 
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold'
        }}>
          <span>Total:</span>
          <span>£{(total / 100).toFixed(2)}</span>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing quantity controls, notes editing, and item removal with total calculation.'
      }
    }
  }
};

export const CartList: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <POSCartItem
        id="1"
        menuItemName="Margherita Pizza"
        quantity={1}
        itemTotal={1250}
      />
      <POSCartItem
        id="2"
        menuItemName="Caesar Salad"
        quantity={2}
        itemTotal={1500}
        notes="No croutons"
      />
      <POSCartItem
        id="3"
        menuItemName="Custom Burger"
        quantity={1}
        itemTotal={1150}
        customizations={[
          { sub_item_id: '1', sub_item_name: 'Extra Cheese', price_modifier: 100, quantity: 1 },
          { sub_item_id: '2', sub_item_name: 'Bacon', price_modifier: 150, quantity: 1 }
        ]}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of multiple cart items as they would appear in a cart list.'
      }
    }
  }
};
