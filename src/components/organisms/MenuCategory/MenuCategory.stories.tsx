import type { Meta, StoryObj } from '@storybook/react';
import { MenuCategory } from './MenuCategory.component';
import type { MenuItem } from '@/types';

// Mock data based on your JSON structure
const mockPizzaItems: MenuItem[] = [
  {
    id: '3ca836da-02f1-4ae5-a1a0-3e4db34d0457',
    merchantId: '44cdb990-1044-48ae-bcbf-f91d0cedfe33',
    categoryId: '6744e6b5-8e05-4e3e-bff7-eb6a40751352',
    name: 'Margherita',
    description: 'Fresh mozzarella, tomato sauce, basil',
    price: '£12.00',
    basePrice: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop',
    isAvailable: true,
    isPopular: true,
    displayOrder: 1,
    createdAt: '2025-09-08T09:22:44.250Z',
    updatedAt: '2025-09-08T09:22:44.250Z',
  },
  {
    id: '517852c1-ec68-4ea0-81d0-4c0e6f80a3e2',
    merchantId: '44cdb990-1044-48ae-bcbf-f91d0cedfe33',
    categoryId: '6744e6b5-8e05-4e3e-bff7-eb6a40751352',
    name: 'Pepperoni',
    description: 'Pepperoni, mozzarella, tomato sauce',
    price: '£14.00',
    basePrice: 1400,
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
    isAvailable: true,
    displayOrder: 2,
    createdAt: '2025-09-08T09:22:44.250Z',
    updatedAt: '2025-09-08T09:22:44.250Z',
  },
  {
    id: 'b2b7461e-90e8-4a6e-a287-7892be6f21d3',
    merchantId: '44cdb990-1044-48ae-bcbf-f91d0cedfe33',
    categoryId: '6744e6b5-8e05-4e3e-bff7-eb6a40751352',
    name: 'Four Seasons',
    description: 'Ham, mushrooms, artichokes, olives',
    price: '£16.00',
    basePrice: 1600,
    imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop',
    isAvailable: true,
    displayOrder: 3,
    createdAt: '2025-09-08T09:22:44.250Z',
    updatedAt: '2025-09-08T09:22:44.250Z',
  },
  {
    id: 'ba5520f7-3d70-4cc6-a49b-2be27df899fe',
    merchantId: '44cdb990-1044-48ae-bcbf-f91d0cedfe33',
    categoryId: '6744e6b5-8e05-4e3e-bff7-eb6a40751352',
    name: 'Meat Lovers',
    description: 'Pepperoni, sausage, ham, bacon',
    price: '£18.00',
    basePrice: 1800,
    imageUrl: '',
    isAvailable: true,
    displayOrder: 4,
    createdAt: '2025-09-08T09:22:44.250Z',
    updatedAt: '2025-09-08T09:22:44.250Z',
  },
  {
    id: 'ba429913-1857-4e93-8f6c-af9edb6fe413',
    merchantId: '44cdb990-1044-48ae-bcbf-f91d0cedfe33',
    categoryId: '6744e6b5-8e05-4e3e-bff7-eb6a40751352',
    name: 'Vegetarian Supreme',
    description: 'Peppers, mushrooms, onions, olives, tomatoes',
    price: '£15.00',
    basePrice: 1500,
    imageUrl: '',
    isAvailable: true,
    displayOrder: 5,
    createdAt: '2025-09-08T09:22:44.250Z',
    updatedAt: '2025-09-08T09:22:44.250Z',
  },
];

const mockDrinkItems: MenuItem[] = [
  {
    id: '323000aa-e587-4d4e-ae80-d6a09a87c15b',
    merchantId: '44cdb990-1044-48ae-bcbf-f91d0cedfe33',
    categoryId: '73734045-48bd-44f4-9fef-59f3e71a18cf',
    name: 'Coca Cola',
    description: '330ml can',
    price: '£1.50',
    basePrice: 150,
    imageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=300&fit=crop',
    isAvailable: true,
    displayOrder: 1,
    createdAt: '2025-09-08T09:22:44.250Z',
    updatedAt: '2025-09-08T09:22:44.250Z',
  },
  {
    id: '6da32bb1-de62-4adb-b0bf-fe47ccff2fa0',
    merchantId: '44cdb990-1044-48ae-bcbf-f91d0cedfe33',
    categoryId: '73734045-48bd-44f4-9fef-59f3e71a18cf',
    name: 'Orange Juice',
    description: 'Fresh squeezed 250ml',
    price: '£2.00',
    basePrice: 200,
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop',
    isAvailable: true,
    displayOrder: 2,
    createdAt: '2025-09-08T09:22:44.250Z',
    updatedAt: '2025-09-08T09:22:44.250Z',
  },
];

const meta: Meta<typeof MenuCategory> = {
  title: 'Organisms/MenuCategory',
  component: MenuCategory,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'MenuCategory is an organism component that groups multiple MenuItemCard components under a category heading. It represents a section of a restaurant menu (e.g., Pizza, Drinks, Desserts).',
      },
    },
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'The name of the menu category',
    },
    items: {
      control: 'object',
      description: 'Array of menu items in this category',
    },
    onItemClick: {
      action: 'item-clicked',
      description: 'Callback function when a menu item is clicked',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    onItemClick: (item) => console.log('Clicked item:', item),
  },
};

export default meta;
type Story = StoryObj<typeof MenuCategory>;

export const Default: Story = {
  args: {
    name: 'Pizza',
    items: mockPizzaItems,
  },
};

export const FewItems: Story = {
  args: {
    name: 'Drinks',
    items: mockDrinkItems,
  },
};

export const EmptyCategory: Story = {
  args: {
    name: 'Specials',
    items: [],
  },
};

export const SingleItem: Story = {
  args: {
    name: 'Today\'s Special',
    items: [mockPizzaItems[0]],
  },
};

export const WithUnavailableItems: Story = {
  args: {
    name: 'Limited Menu',
    items: mockPizzaItems.map((item, index) => ({
      ...item,
      isAvailable: index !== 2, // Make third item unavailable
    })),
  },
};
