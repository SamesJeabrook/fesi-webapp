import type { Meta, StoryObj } from '@storybook/react';
import { POSMenuItemCard } from './POSMenuItemCard';

const meta = {
  title: 'Molecules/POSMenuItemCard',
  component: POSMenuItemCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A card component for displaying menu items in the POS system. Shows item name, price, and an indicator for customizable options.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text', description: 'Unique identifier for the menu item' },
    title: { control: 'text', description: 'Name of the menu item' },
    basePrice: { control: 'number', description: 'Price in cents (e.g., 1250 = £12.50)' },
    hasOptions: { control: 'boolean', description: 'Whether the item has customizable options' },
    imageUrl: { control: 'text', description: 'Optional image URL for the item' },
    onClick: { action: 'clicked', description: 'Handler called when the card is clicked' },
    className: { control: 'text', description: 'Additional CSS class name' }
  }
} satisfies Meta<typeof POSMenuItemCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: '1',
    title: 'Margherita Pizza',
    basePrice: 1250
  }
};

export const WithOptions: Story = {
  args: {
    id: '2',
    title: 'Custom Burger',
    basePrice: 950,
    hasOptions: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Items with customizable options display a settings icon to indicate they can be customized before adding to cart.'
      }
    }
  }
};

export const WithImage: Story = {
  args: {
    id: '3',
    title: 'Truffle Pasta',
    basePrice: 1850,
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop'
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu items can display an optional image above the title and price.'
      }
    }
  }
};

export const WithImageAndOptions: Story = {
  args: {
    id: '4',
    title: 'Build Your Own Salad',
    basePrice: 750,
    hasOptions: true,
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop'
  }
};

export const ExpensiveItem: Story = {
  args: {
    id: '5',
    title: 'Wagyu Steak',
    basePrice: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&h=300&fit=crop'
  },
  parameters: {
    docs: {
      description: {
        story: 'Higher priced items display correctly formatted prices.'
      }
    }
  }
};

export const LowPriceItem: Story = {
  args: {
    id: '6',
    title: 'Side Salad',
    basePrice: 350
  }
};

export const LongTitle: Story = {
  args: {
    id: '7',
    title: 'Artisanal Hand-Crafted Sourdough Bread with Herb-Infused Olive Oil',
    basePrice: 650,
    hasOptions: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Cards handle long item names gracefully.'
      }
    }
  }
};

export const GridLayout: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
      <POSMenuItemCard
        id="1"
        title="Margherita Pizza"
        basePrice={1250}
      />
      <POSMenuItemCard
        id="2"
        title="Custom Burger"
        basePrice={950}
        hasOptions
      />
      <POSMenuItemCard
        id="3"
        title="Caesar Salad"
        basePrice={750}
        imageUrl="https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop"
      />
      <POSMenuItemCard
        id="4"
        title="Truffle Fries"
        basePrice={650}
        hasOptions
        imageUrl="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop"
      />
      <POSMenuItemCard
        id="5"
        title="Chocolate Cake"
        basePrice={550}
        imageUrl="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop"
      />
      <POSMenuItemCard
        id="6"
        title="Craft Beer"
        basePrice={450}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of multiple cards in a responsive grid layout as used in the POS system.'
      }
    }
  }
};

export const InteractiveExample: Story = {
  render: function Component() {
    const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

    const items = [
      { id: '1', title: 'Margherita Pizza', basePrice: 1250 },
      { id: '2', title: 'Custom Burger', basePrice: 950, hasOptions: true },
      { id: '3', title: 'Caesar Salad', basePrice: 750 },
      { id: '4', title: 'Truffle Fries', basePrice: 650, hasOptions: true }
    ];

    const handleClick = (id: string) => {
      setSelectedItems(prev => 
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      );
    };

    return (
      <div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          {items.map(item => (
            <POSMenuItemCard
              key={item.id}
              {...item}
              onClick={() => handleClick(item.id)}
              className={selectedItems.includes(item.id) ? 'selected' : ''}
            />
          ))}
        </div>
        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <strong>Selected items:</strong> {selectedItems.length > 0 ? selectedItems.join(', ') : 'None'}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing click handlers and state management.'
      }
    }
  }
};
