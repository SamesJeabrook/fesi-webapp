import type { Meta, StoryObj } from '@storybook/react';
import { POSCategoryFilter } from './POSCategoryFilter';
import React from 'react';

const meta = {
  title: 'Molecules/POSCategoryFilter',
  component: POSCategoryFilter,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A category filter component for the POS system. Displays tabs for filtering menu items by category.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    categories: { control: 'object', description: 'Array of category names' },
    selectedCategory: { control: 'text', description: 'Currently selected category' },
    onCategoryChange: { action: 'category changed', description: 'Handler for category selection' },
    className: { control: 'text', description: 'Additional CSS class name' }
  }
} satisfies Meta<typeof POSCategoryFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

const restaurantCategories = ['all', 'appetizers', 'mains', 'desserts', 'drinks'];
const cafeCategories = ['all', 'coffee', 'tea', 'pastries', 'sandwiches'];
const pizzaCategories = ['all', 'pizza', 'pasta', 'salads', 'sides', 'beverages'];

export const Default: Story = {
  args: {
    categories: restaurantCategories,
    selectedCategory: 'all'
  }
};

export const WithSelection: Story = {
  args: {
    categories: restaurantCategories,
    selectedCategory: 'mains'
  },
  parameters: {
    docs: {
      description: {
        story: 'Category filter with an active selection highlighted.'
      }
    }
  }
};

export const CafeMenu: Story = {
  args: {
    categories: cafeCategories,
    selectedCategory: 'coffee'
  },
  parameters: {
    docs: {
      description: {
        story: 'Category filter for a cafe menu.'
      }
    }
  }
};

export const PizzaRestaurant: Story = {
  args: {
    categories: pizzaCategories,
    selectedCategory: 'pizza'
  },
  parameters: {
    docs: {
      description: {
        story: 'Category filter for a pizza restaurant with more categories.'
      }
    }
  }
};

export const FewCategories: Story = {
  args: {
    categories: ['all', 'food', 'drinks'],
    selectedCategory: 'all'
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter with minimal categories.'
      }
    }
  }
};

export const ManyCategories: Story = {
  args: {
    categories: [
      'all',
      'breakfast',
      'lunch',
      'dinner',
      'appetizers',
      'soups',
      'salads',
      'sandwiches',
      'burgers',
      'pizza',
      'pasta',
      'seafood',
      'steaks',
      'vegetarian',
      'desserts',
      'beverages'
    ],
    selectedCategory: 'breakfast'
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter with many categories becomes horizontally scrollable on smaller screens.'
      }
    }
  }
};

export const LongCategoryNames: Story = {
  args: {
    categories: [
      'all',
      'vegetarian options',
      'gluten-free dishes',
      'vegan specialties',
      'kids menu'
    ],
    selectedCategory: 'vegetarian options'
  }
};

export const InteractiveExample: Story = {
  render: function Component() {
    const [selectedCategory, setSelectedCategory] = React.useState('all');
    const [itemCount, setItemCount] = React.useState(42);

    const categories = ['all', 'appetizers', 'mains', 'desserts', 'drinks'];
    const itemCounts: Record<string, number> = {
      all: 42,
      appetizers: 8,
      mains: 15,
      desserts: 12,
      drinks: 7
    };

    const handleCategoryChange = (category: string) => {
      setSelectedCategory(category);
      setItemCount(itemCounts[category] || 0);
    };

    return (
      <div>
        <POSCategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: '#f5f5f5', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <strong>Category:</strong> {selectedCategory}<br />
          <strong>Items:</strong> {itemCount}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing category selection with item count updates.'
      }
    }
  }
};

export const WithMenuItems: Story = {
  render: function Component() {
    const [selectedCategory, setSelectedCategory] = React.useState('all');

    const categories = ['all', 'pizza', 'pasta', 'salads'];
    const menuItems: Record<string, string[]> = {
      all: ['Margherita Pizza', 'Carbonara Pasta', 'Caesar Salad', 'Pepperoni Pizza', 'Bolognese Pasta', 'Greek Salad'],
      pizza: ['Margherita Pizza', 'Pepperoni Pizza', 'Hawaiian Pizza', 'Veggie Pizza'],
      pasta: ['Carbonara Pasta', 'Bolognese Pasta', 'Alfredo Pasta', 'Pesto Pasta'],
      salads: ['Caesar Salad', 'Greek Salad', 'Garden Salad', 'Caprese Salad']
    };

    return (
      <div>
        <POSCategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <div style={{ 
          marginTop: '1rem', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '0.5rem'
        }}>
          {menuItems[selectedCategory].map(item => (
            <div 
              key={item}
              style={{ 
                padding: '1rem', 
                background: 'white', 
                border: '1px solid #ddd',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete example showing how the filter integrates with menu items.'
      }
    }
  }
};
