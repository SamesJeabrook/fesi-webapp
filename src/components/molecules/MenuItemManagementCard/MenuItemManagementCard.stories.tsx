import type { Meta, StoryObj } from '@storybook/react';
import { MenuItemManagementCard } from './MenuItemManagementCard';

const meta = {
  title: 'Molecules/MenuItemManagementCard',
  component: MenuItemManagementCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A card component for managing menu items in admin interfaces. Displays item details with status badges and action buttons for editing and toggling availability.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      description: 'Unique identifier for the menu item',
      control: 'text',
    },
    title: {
      description: 'Name of the menu item',
      control: 'text',
    },
    description: {
      description: 'Optional description of the menu item',
      control: 'text',
    },
    basePrice: {
      description: 'Price in cents (e.g., 599 = £5.99)',
      control: 'number',
    },
    categoryName: {
      description: 'Name of the category this item belongs to',
      control: 'text',
    },
    isActive: {
      description: 'Whether the item is currently available',
      control: 'boolean',
    },
    displayOrder: {
      description: 'Sort order for displaying items',
      control: 'number',
    },
    showOrder: {
      description: 'Whether to display the order number',
      control: 'boolean',
    },
    onToggleAvailability: {
      description: 'Callback when toggling item availability',
      action: 'toggleAvailability',
    },
    onEdit: {
      description: 'Callback when editing the item',
      action: 'edit',
    },
  },
} satisfies Meta<typeof MenuItemManagementCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Available: Story = {
  args: {
    id: '1',
    title: 'Margherita Pizza',
    description: 'Classic tomato sauce, mozzarella, and fresh basil',
    basePrice: 1299, // £12.99
    categoryName: 'Pizzas',
    isActive: true,
    displayOrder: 1,
    showOrder: true,
  },
};

export const Unavailable: Story = {
  args: {
    id: '2',
    title: 'Seafood Linguine',
    description: 'Fresh prawns, mussels, and clams in white wine sauce',
    basePrice: 1850, // £18.50
    categoryName: 'Pasta',
    isActive: false,
    displayOrder: 5,
    showOrder: true,
  },
};

export const WithoutDescription: Story = {
  args: {
    id: '3',
    title: 'Caesar Salad',
    basePrice: 895, // £8.95
    categoryName: 'Salads',
    isActive: true,
    displayOrder: 2,
    showOrder: true,
  },
};

export const WithoutOrderNumber: Story = {
  args: {
    id: '4',
    title: 'Tiramisu',
    description: 'Traditional Italian dessert with coffee and mascarpone',
    basePrice: 650, // £6.50
    categoryName: 'Desserts',
    isActive: true,
    displayOrder: 10,
    showOrder: false,
  },
};

export const LongTitle: Story = {
  args: {
    id: '5',
    title: 'Grilled Atlantic Salmon with Lemon Butter Sauce and Seasonal Vegetables',
    description: 'Fresh Atlantic salmon fillet, grilled to perfection and served with a zesty lemon butter sauce, accompanied by a medley of seasonal roasted vegetables',
    basePrice: 2495, // £24.95
    categoryName: 'Main Courses',
    isActive: true,
    displayOrder: 8,
    showOrder: true,
  },
};

export const NoActions: Story = {
  args: {
    id: '6',
    title: 'Chicken Burger',
    description: 'Crispy chicken breast with lettuce, tomato, and mayo',
    basePrice: 1099, // £10.99
    categoryName: 'Burgers',
    isActive: true,
    displayOrder: 3,
    showOrder: true,
    onToggleAvailability: undefined,
    onEdit: undefined,
  },
};

export const GridLayout: Story = {
  args: {
    id: '1',
    title: 'Margherita Pizza',
    basePrice: 1299,
    categoryName: 'Pizzas',
    isActive: true,
    displayOrder: 1,
    showOrder: true,
  },
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1rem',
      maxWidth: '1200px',
    }}>
      <MenuItemManagementCard
        {...args}
        id="1"
        title="Margherita Pizza"
        description="Classic tomato sauce, mozzarella, and fresh basil"
        basePrice={1299}
        categoryName="Pizzas"
        isActive={true}
        displayOrder={1}
      />
      <MenuItemManagementCard
        {...args}
        id="2"
        title="Pepperoni Pizza"
        description="Spicy pepperoni with mozzarella"
        basePrice={1399}
        categoryName="Pizzas"
        isActive={true}
        displayOrder={2}
      />
      <MenuItemManagementCard
        {...args}
        id="3"
        title="Hawaiian Pizza"
        description="Ham and pineapple (yes, really!)"
        basePrice={1399}
        categoryName="Pizzas"
        isActive={false}
        displayOrder={3}
      />
      <MenuItemManagementCard
        {...args}
        id="4"
        title="Vegetarian Supreme"
        description="Mixed peppers, mushrooms, onions, sweetcorn"
        basePrice={1299}
        categoryName="Pizzas"
        isActive={true}
        displayOrder={4}
      />
    </div>
  ),
};

export const AllStates: Story = {
  args: {
    id: '1',
    title: 'Margherita Pizza',
    basePrice: 1299,
    categoryName: 'Pizzas',
    isActive: true,
    displayOrder: 1,
    showOrder: true,
  },
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      maxWidth: '400px',
    }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-family-heading)' }}>Available</h3>
        <MenuItemManagementCard
          {...args}
          id="1"
          title="Margherita Pizza"
          description="Classic tomato sauce, mozzarella, and fresh basil"
          basePrice={1299}
          categoryName="Pizzas"
          isActive={true}
          displayOrder={1}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-family-heading)' }}>Unavailable</h3>
        <MenuItemManagementCard
          {...args}
          id="2"
          title="Seafood Linguine"
          description="Fresh prawns, mussels, and clams in white wine sauce"
          basePrice={1850}
          categoryName="Pasta"
          isActive={false}
          displayOrder={5}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-family-heading)' }}>No Description</h3>
        <MenuItemManagementCard
          {...args}
          id="3"
          title="Caesar Salad"
          basePrice={895}
          categoryName="Salads"
          isActive={true}
          displayOrder={2}
        />
      </div>
    </div>
  ),
};
