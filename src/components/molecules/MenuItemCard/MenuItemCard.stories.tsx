import type { Meta, StoryObj } from '@storybook/react';
import { MenuItemCard } from './MenuItemCard.component';
import { mockMenuItems } from '@/mocks';
import type { MenuItem } from '@/types';

// Sample menu items for different scenarios
const pizzaItem: MenuItem = mockMenuItems.find(item => item.name === 'Margherita Pizza') || mockMenuItems[0];
const veganItem: MenuItem = {
  ...mockMenuItems[0],
  id: 'vegan-item',
  name: 'Vegan Buddha Bowl',
  description: 'Quinoa, roasted vegetables, avocado, and tahini dressing',
  price: '£12.99',
  imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  dietaryInfo: ['vegan', 'gluten-free'],
  allergens: ['sesame'],
  isPopular: true,
  calories: 450,
  preparationTime: 15,
};

const unavailableItem: MenuItem = {
  ...mockMenuItems[0],
  id: 'unavailable-item',
  name: 'Seasonal Special',
  description: 'Currently out of season ingredients',
  isAvailable: false,
};

const meta: Meta<typeof MenuItemCard> = {
  title: 'Molecules/MenuItemCard',
  component: MenuItemCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive card component for displaying menu items with images, details, dietary information, and action buttons.',
      },
    },
  },
  argTypes: {
    menuItem: {
      description: 'Menu item data',
      control: false,
    },
    showAddButton: {
      description: 'Show add to cart button',
      control: 'boolean',
    },
    showQuantityControls: {
      description: 'Show quantity increment/decrement controls',
      control: 'boolean',
    },
    isLoading: {
      description: 'Show loading state on add button',
      control: 'boolean',
    },
    onAddToCart: {
      description: 'Add to cart handler',
      action: 'added to cart',
    },
    onViewDetails: {
      description: 'View details handler',
      action: 'view details',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic examples
export const Default: Story = {
  args: {
    menuItem: pizzaItem,
  },
};

export const WithQuantityControls: Story = {
  args: {
    menuItem: pizzaItem,
    showQuantityControls: true,
  },
};

export const Loading: Story = {
  args: {
    menuItem: pizzaItem,
    isLoading: true,
  },
};

export const WithoutAddButton: Story = {
  args: {
    menuItem: pizzaItem,
    showAddButton: false,
  },
};

export const WithViewDetails: Story = {
  args: {
    menuItem: pizzaItem,
    onViewDetails: undefined, // Will be set by argTypes action
  },
};

// Different menu item types
export const VeganItem: Story = {
  args: {
    menuItem: veganItem,
    showQuantityControls: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu item with dietary information badges and popularity indicator.',
      },
    },
  },
};

export const UnavailableItem: Story = {
  args: {
    menuItem: unavailableItem,
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu item that is currently unavailable - add button is disabled and overlay shown.',
      },
    },
  },
};

export const WithAllergens: Story = {
  args: {
    menuItem: {
      ...pizzaItem,
      allergens: ['gluten', 'dairy', 'eggs'],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu item displaying allergen information prominently.',
      },
    },
  },
};

export const SimpleItem: Story = {
  args: {
    menuItem: {
      ...mockMenuItems[0],
      id: 'simple-item',
      name: 'House Salad',
      description: 'Fresh mixed greens with vinaigrette',
      price: '£8.99',
      imageUrl: undefined, // No image
      dietaryInfo: ['vegetarian'],
      preparationTime: 5,
      calories: 180,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Simple menu item without image, showing how the card adapts.',
      },
    },
  },
};

// Layout examples
export const GridLayout: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
      gap: '1rem',
      maxWidth: '1200px',
      width: '100%'
    }}>
      <MenuItemCard menuItem={pizzaItem} />
      <MenuItemCard menuItem={veganItem} showQuantityControls />
      <MenuItemCard 
        menuItem={{
          ...mockMenuItems[2],
          name: 'Classic Burger',
          description: 'Beef patty with cheese, lettuce, tomato',
          price: '£13.99',
          imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          dietaryInfo: [],
          allergens: ['gluten', 'dairy'],
        }} 
      />
      <MenuItemCard menuItem={unavailableItem} />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Multiple menu item cards displayed in a responsive grid layout.',
      },
    },
  },
};

// Interactive example with state
export const InteractiveExample: Story = {
  render: () => {
    const handleAddToCart = (menuItem: MenuItem, quantity: number) => {
      alert(`Added ${quantity}x ${menuItem.name} to cart`);
    };

    const handleViewDetails = (menuItem: MenuItem) => {
      alert(`Viewing details for ${menuItem.name}`);
    };

    return (
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <MenuItemCard
          menuItem={pizzaItem}
          onAddToCart={handleAddToCart}
          onViewDetails={handleViewDetails}
          showQuantityControls
        />
        <MenuItemCard
          menuItem={veganItem}
          onAddToCart={handleAddToCart}
          onViewDetails={handleViewDetails}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example with working add to cart and view details functionality.',
      },
    },
  },
};

// Food ordering context
export const RestaurantMenu: Story = {
  render: () => (
    <div style={{ maxWidth: '800px', width: '100%' }}>
      <h2 style={{ marginBottom: '1rem', color: '#333' }}>Bella Vista Italian - Menu</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '1.5rem'
      }}>
        {mockMenuItems.slice(0, 4).map((item) => (
          <MenuItemCard
            key={item.id}
            menuItem={item}
            onAddToCart={(menuItem, quantity) => 
              console.log(`Added ${quantity}x ${menuItem.name}`)
            }
            showQuantityControls
          />
        ))}
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Example of how menu item cards would appear in a restaurant menu interface.',
      },
    },
  },
};
