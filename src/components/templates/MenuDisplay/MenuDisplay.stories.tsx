import type { Meta, StoryObj } from '@storybook/react';
import { MenuDisplay } from './MenuDisplay.component';
import type { MenuCategory, Merchant } from './MenuDisplay.types';
import type { MenuItem } from '@/types';

// Mock merchant data
const mockMerchant: Merchant = {
  id: '44cdb990-1044-48ae-bcbf-f91d0cedfe33',
  name: "Mario's Authentic Pizzeria",
  username: 'marios-pizzeria',
  description: 'Traditional Italian pizzas made with authentic ingredients and wood-fired ovens',
  imageUrl: '',
  currency: 'GBP',
  loyaltyEnabled: true,
  canAcceptOrders: true,
};

// Mock menu items
const pizzaItems: MenuItem[] = [
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
];

const sidesItems: MenuItem[] = [
  {
    id: 'a5ba9690-ff36-4a0e-b690-ea5961302cad',
    merchantId: '44cdb990-1044-48ae-bcbf-f91d0cedfe33',
    categoryId: '64db892b-22f7-4ffa-96ab-16548febcf4c',
    name: 'Garlic Bread',
    description: 'Fresh baked bread with garlic butter',
    price: '£4.50',
    basePrice: 450,
    imageUrl: 'https://images.unsplash.com/photo-1619740455993-9d4fb74019bd?w=400&h=300&fit=crop',
    isAvailable: true,
    displayOrder: 1,
    createdAt: '2025-09-08T09:22:44.250Z',
    updatedAt: '2025-09-08T09:22:44.250Z',
  },
  {
    id: '40e27681-9942-4078-881a-4a4a8fef9b18',
    merchantId: '44cdb990-1044-48ae-bcbf-f91d0cedfe33',
    categoryId: '64db892b-22f7-4ffa-96ab-16548febcf4c',
    name: 'Chicken Wings',
    description: '8 pieces with choice of sauce',
    price: '£7.50',
    basePrice: 750,
    imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop',
    isAvailable: true,
    displayOrder: 2,
    createdAt: '2025-09-08T09:22:44.250Z',
    updatedAt: '2025-09-08T09:22:44.250Z',
  },
];

const drinksItems: MenuItem[] = [
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

const dessertsItems: MenuItem[] = [
  {
    id: '37b6002f-b735-4859-abf8-bbf882785463',
    merchantId: '44cdb990-1044-48ae-bcbf-f91d0cedfe33',
    categoryId: '1abcccf8-9185-4a58-a66c-dfb0635043a1',
    name: 'Tiramisu',
    description: 'Classic Italian dessert',
    price: '£5.50',
    basePrice: 550,
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
    isAvailable: true,
    displayOrder: 1,
    createdAt: '2025-09-08T09:22:44.250Z',
    updatedAt: '2025-09-08T09:22:44.250Z',
  },
];

const mockCategories: MenuCategory[] = [
  {
    name: 'Pizza',
    displayOrder: 1,
    items: pizzaItems,
  },
  {
    name: 'Sides',
    displayOrder: 2,
    items: sidesItems,
  },
  {
    name: 'Drinks',
    displayOrder: 3,
    items: drinksItems,
  },
  {
    name: 'Desserts',
    displayOrder: 4,
    items: dessertsItems,
  },
];

const meta: Meta<typeof MenuDisplay> = {
  title: 'Templates/MenuDisplay',
  component: MenuDisplay,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'MenuDisplay is a template component that displays a complete restaurant menu. It combines merchant information with organized menu categories, each containing multiple menu items.',
      },
    },
  },
  argTypes: {
    merchant: {
      control: 'object',
      description: 'Merchant/restaurant information',
    },
    categories: {
      control: 'object',
      description: 'Array of menu categories with their items',
    },
    onItemClick: {
      action: 'item-clicked',
      description: 'Callback function when a menu item is clicked',
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows loading state',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
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
type Story = StoryObj<typeof MenuDisplay>;

export const Default: Story = {
  args: {
    merchant: mockMerchant,
    categories: mockCategories,
  },
};

export const Loading: Story = {
  args: {
    merchant: mockMerchant,
    categories: mockCategories,
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    merchant: mockMerchant,
    categories: [],
    error: 'Failed to load menu. Please try again later.',
  },
};

export const EmptyMenu: Story = {
  args: {
    merchant: mockMerchant,
    categories: [],
  },
};

export const SingleCategory: Story = {
  args: {
    merchant: mockMerchant,
    categories: [
      {
        name: 'Pizza',
        displayOrder: 1,
        items: pizzaItems,
      },
    ],
  },
};

export const WithMerchantImage: Story = {
  args: {
    merchant: {
      ...mockMerchant,
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop',
    },
    categories: mockCategories,
  },
};
