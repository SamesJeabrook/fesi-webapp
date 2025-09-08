// Mock data for MSW handlers

import type { Merchant, MenuCategory, MenuItem } from '@/types';

export const mockMerchants: Merchant[] = [
  {
    id: 'merchant_1',
    userId: 'user_merchant_1',
    businessName: 'Bella Vista Italian',
    description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes',
    businessType: 'restaurant',
    email: 'info@bellavista.co.uk',
    phone: '+44 20 7946 0958',
    addressLine1: '123 High Street',
    addressLine2: '',
    city: 'London',
    postcode: 'SW1A 1AA',
    cuisine: ['Italian', 'Pizza', 'Pasta'],
    openingHours: {
      monday: { open: '12:00', close: '22:00' },
      tuesday: { open: '12:00', close: '22:00' },
      wednesday: { open: '12:00', close: '22:00' },
      thursday: { open: '12:00', close: '22:00' },
      friday: { open: '12:00', close: '23:00' },
      saturday: { open: '12:00', close: '23:00' },
      sunday: { open: '12:00', close: '21:00' }
    },
    status: 'active',
    rating: 4.5,
    totalReviews: 127,
    minimumOrder: 15,
    deliveryFee: 2.99,
    deliveryRadius: 5,
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: 'merchant_2',
    userId: 'user_merchant_2',
    businessName: 'Dragon Palace',
    description: 'Traditional Chinese restaurant serving authentic dishes from various regions',
    businessType: 'restaurant',
    email: 'orders@dragonpalace.co.uk',
    phone: '+44 20 7946 1234',
    addressLine1: '456 China Town',
    addressLine2: 'Unit 2',
    city: 'London',
    postcode: 'WC2H 7AX',
    cuisine: ['Chinese', 'Asian', 'Dim Sum'],
    openingHours: {
      monday: { open: '17:00', close: '23:00' },
      tuesday: { open: '17:00', close: '23:00' },
      wednesday: { open: '17:00', close: '23:00' },
      thursday: { open: '17:00', close: '23:00' },
      friday: { open: '17:00', close: '00:00' },
      saturday: { open: '17:00', close: '00:00' },
      sunday: { open: '17:00', close: '22:00' }
    },
    status: 'active',
    rating: 4.2,
    totalReviews: 89,
    minimumOrder: 20,
    deliveryFee: 3.50,
    deliveryRadius: 3,
    logoUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z'
  },
  {
    id: 'merchant_3',
    userId: 'user_merchant_3',
    businessName: 'The Burger Joint',
    description: 'Gourmet burgers made with premium beef and fresh local ingredients',
    businessType: 'restaurant',
    email: 'hello@burgerjoint.co.uk',
    phone: '+44 161 234 5678',
    addressLine1: '789 Food Street',
    addressLine2: '',
    city: 'Manchester',
    postcode: 'M1 2AB',
    cuisine: ['American', 'Burgers', 'Fast Food'],
    openingHours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '11:00', close: '23:00' },
      sunday: { open: '12:00', close: '21:00' }
    },
    status: 'active',
    rating: 4.7,
    totalReviews: 203,
    minimumOrder: 12,
    deliveryFee: 2.50,
    deliveryRadius: 4,
    logoUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-22T09:45:00Z'
  }
];

export const mockCategories: MenuCategory[] = [
  // Bella Vista Italian categories
  {
    id: 'cat_1',
    merchantId: 'merchant_1',
    name: 'Starters',
    description: 'Traditional Italian appetizers',
    displayOrder: 1,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'cat_2',
    merchantId: 'merchant_1',
    name: 'Pizza',
    description: 'Wood-fired pizzas with fresh toppings',
    displayOrder: 2,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'cat_3',
    merchantId: 'merchant_1',
    name: 'Pasta',
    description: 'Fresh pasta dishes made daily',
    displayOrder: 3,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'cat_4',
    merchantId: 'merchant_1',
    name: 'Desserts',
    description: 'Traditional Italian sweets',
    displayOrder: 4,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  
  // Dragon Palace categories
  {
    id: 'cat_5',
    merchantId: 'merchant_2',
    name: 'Dim Sum',
    description: 'Traditional steamed and fried dumplings',
    displayOrder: 1,
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z'
  },
  {
    id: 'cat_6',
    merchantId: 'merchant_2',
    name: 'Mains',
    description: 'Main course dishes from various Chinese regions',
    displayOrder: 2,
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z'
  },
  {
    id: 'cat_7',
    merchantId: 'merchant_2',
    name: 'Noodles & Rice',
    description: 'Fried rice and noodle dishes',
    displayOrder: 3,
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z'
  },
  
  // Burger Joint categories
  {
    id: 'cat_8',
    merchantId: 'merchant_3',
    name: 'Burgers',
    description: 'Gourmet burgers with premium ingredients',
    displayOrder: 1,
    isActive: true,
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-05T14:00:00Z'
  },
  {
    id: 'cat_9',
    merchantId: 'merchant_3',
    name: 'Sides',
    description: 'Fries, onion rings, and more',
    displayOrder: 2,
    isActive: true,
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-05T14:00:00Z'
  },
  {
    id: 'cat_10',
    merchantId: 'merchant_3',
    name: 'Drinks',
    description: 'Soft drinks, shakes, and beverages',
    displayOrder: 3,
    isActive: true,
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-05T14:00:00Z'
  }
];

export const mockMenuItems: MenuItem[] = [
  // Bella Vista Italian items
  {
    id: 'item_1',
    merchantId: 'merchant_1',
    categoryId: 'cat_1',
    name: 'Bruschetta Classica',
    description: 'Toasted bread topped with fresh tomatoes, basil, and garlic',
    price: '£7.50',
    imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isAvailable: true,
    preparationTime: 8,
    calories: 180,
    allergens: ['gluten'],
    dietaryInfo: ['vegetarian'],
    displayOrder: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'item_2',
    merchantId: 'merchant_1',
    categoryId: 'cat_2',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil',
    price: '£14.99',
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isAvailable: true,
    preparationTime: 15,
    calories: 850,
    allergens: ['gluten', 'dairy'],
    dietaryInfo: ['vegetarian'],
    displayOrder: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'item_3',
    merchantId: 'merchant_1',
    categoryId: 'cat_3',
    name: 'Spaghetti Carbonara',
    description: 'Fresh spaghetti with eggs, pancetta, parmesan, and black pepper',
    price: '£16.50',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc6d2c5f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isAvailable: true,
    preparationTime: 12,
    calories: 780,
    allergens: ['gluten', 'dairy', 'eggs'],
    dietaryInfo: [],
    displayOrder: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },

  // Dragon Palace items
  {
    id: 'item_4',
    merchantId: 'merchant_2',
    categoryId: 'cat_5',
    name: 'Pork Dumplings',
    description: 'Steamed dumplings filled with seasoned pork and vegetables',
    price: '£8.99',
    imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isAvailable: true,
    preparationTime: 10,
    calories: 320,
    allergens: ['gluten', 'soy'],
    dietaryInfo: [],
    displayOrder: 1,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z'
  },
  {
    id: 'item_5',
    merchantId: 'merchant_2',
    categoryId: 'cat_6',
    name: 'Sweet & Sour Chicken',
    description: 'Crispy chicken pieces in a tangy sweet and sour sauce with peppers',
    price: '£15.99',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isAvailable: true,
    preparationTime: 18,
    calories: 650,
    allergens: ['gluten', 'soy'],
    dietaryInfo: [],
    displayOrder: 1,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z'
  },

  // Burger Joint items
  {
    id: 'item_6',
    merchantId: 'merchant_3',
    categoryId: 'cat_8',
    name: 'Classic Beef Burger',
    description: '8oz premium beef patty with lettuce, tomato, onion, and special sauce',
    price: '£12.99',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isAvailable: true,
    preparationTime: 12,
    calories: 720,
    allergens: ['gluten', 'dairy', 'eggs'],
    dietaryInfo: [],
    displayOrder: 1,
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-05T14:00:00Z'
  },
  {
    id: 'item_7',
    merchantId: 'merchant_3',
    categoryId: 'cat_9',
    name: 'Sweet Potato Fries',
    description: 'Crispy sweet potato fries seasoned with sea salt',
    price: '£5.99',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isAvailable: true,
    preparationTime: 8,
    calories: 280,
    allergens: [],
    dietaryInfo: ['vegetarian', 'vegan', 'gluten-free'],
    displayOrder: 1,
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-05T14:00:00Z'
  },
  {
    id: 'item_8',
    merchantId: 'merchant_3',
    categoryId: 'cat_10',
    name: 'Chocolate Milkshake',
    description: 'Rich chocolate milkshake made with premium ice cream',
    price: '£4.99',
    imageUrl: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    isAvailable: true,
    preparationTime: 3,
    calories: 420,
    allergens: ['dairy'],
    dietaryInfo: ['vegetarian'],
    displayOrder: 1,
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-05T14:00:00Z'
  }
];
