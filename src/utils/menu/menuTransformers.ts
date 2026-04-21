import type { MenuItem } from '@/types';
import type { MenuCategory, Merchant } from '@/components/templates';

/**
 * Raw API response structure for menu items
 */
export interface APIMenuItem {
  id: string;
  merchant_id: string;
  category_id: string;
  title: string;
  description: string;
  image_url: string;
  base_price: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name: string;
  category_order: number;
  has_options?: boolean;
  // Age & Legal Restrictions
  is_age_restricted?: boolean;
  minimum_age?: number;
  restriction_type?: string;
  restriction_warning?: string;
  requires_id_verification?: boolean;
  // Allergen & Dietary Info
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  is_dairy_free?: boolean;
  allergens?: string[];
  allergen_info_complete?: boolean;
}

/**
 * Raw API response structure for merchant
 */
export interface APIMerchant {
  id: string;
  name: string;
  username: string;
  description: string;
  image_url: string;
  currency: string;
  loyalty_enabled: boolean;
  can_accept_orders: boolean | null;
}

/**
 * Raw API response structure for menu category
 */
export interface APIMenuCategory {
  name: string;
  display_order: number;
  items: APIMenuItem[];
}

/**
 * Complete API response structure
 */
export interface APIMenuResponse {
  success: boolean;
  data: {
    merchant: APIMerchant;
    menu: APIMenuCategory[];
  };
}

/**
 * Format price from smallest currency unit to display string
 */
export const formatPrice = (basePrice: number, currency: string = 'GBP'): string => {
  const amount = basePrice / 100; // Convert from pence to pounds
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Transform API menu item to component MenuItem
 */
export const transformMenuItem = (apiItem: APIMenuItem, currency: string = 'GBP'): MenuItem => {
  // Build dietary info array from boolean flags
  const dietaryInfo: ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free')[] = [];
  if (apiItem.is_vegan) dietaryInfo.push('vegan');
  if (apiItem.is_vegetarian && !apiItem.is_vegan) dietaryInfo.push('vegetarian'); // Don't duplicate if vegan
  if (apiItem.is_gluten_free) dietaryInfo.push('gluten-free');
  if (apiItem.is_dairy_free) dietaryInfo.push('dairy-free');

  return {
    id: apiItem.id,
    merchantId: apiItem.merchant_id,
    categoryId: apiItem.category_id,
    name: apiItem.title,
    description: apiItem.description || undefined,
    price: formatPrice(apiItem.base_price, currency),
    basePrice: apiItem.base_price,
    imageUrl: apiItem.image_url || undefined,
    isAvailable: apiItem.is_active,
    displayOrder: apiItem.display_order,
    createdAt: apiItem.created_at,
    updatedAt: apiItem.updated_at,
    // Set defaults for optional fields
    isPopular: false,
    preparationTime: undefined,
    calories: undefined,
    allergens: apiItem.allergens && apiItem.allergens.length > 0 ? apiItem.allergens : undefined,
    dietaryInfo: dietaryInfo.length > 0 ? dietaryInfo : undefined,
    option: undefined,
    // Restriction fields
    isAgeRestricted: apiItem.is_age_restricted,
    minimumAge: apiItem.minimum_age,
    restrictionType: apiItem.restriction_type,
    restrictionWarning: apiItem.restriction_warning,
    requiresIdVerification: apiItem.requires_id_verification,
  };
};

/**
 * Transform API merchant to component Merchant
 */
export const transformMerchant = (apiMerchant: APIMerchant): Merchant => ({
  id: apiMerchant.id,
  name: apiMerchant.name,
  username: apiMerchant.username,
  description: apiMerchant.description || undefined,
  imageUrl: apiMerchant.image_url || undefined,
  currency: apiMerchant.currency,
  loyaltyEnabled: apiMerchant.loyalty_enabled,
  canAcceptOrders: apiMerchant.can_accept_orders ?? undefined,
});

/**
 * Transform API menu category to component MenuCategory
 */
export const transformMenuCategory = (
  apiCategory: APIMenuCategory, 
  currency: string = 'GBP'
): MenuCategory => ({
  name: apiCategory.name,
  displayOrder: apiCategory.display_order,
  items: apiCategory.items
    .filter(item => item.is_active) // Only include active items
    .map(item => transformMenuItem(item, currency))
    .sort((a, b) => a.displayOrder - b.displayOrder), // Sort by display order
});

/**
 * Transform complete API response to component props
 */
export const transformMenuResponse = (apiResponse: APIMenuResponse) => {
  if (!apiResponse.success || !apiResponse.data) {
    throw new Error('Invalid API response');
  }

  const { merchant: apiMerchant, menu: apiCategories } = apiResponse.data;
  
  const merchant = transformMerchant(apiMerchant);
  const categories = apiCategories
    .map(category => transformMenuCategory(category, apiMerchant.currency))
    .filter(category => category.items.length > 0) // Only include categories with items
    .sort((a, b) => a.displayOrder - b.displayOrder); // Sort by display order

  return {
    merchant,
    categories,
  };
};

/**
 * Create sample data for testing/development
 */
export const createSampleMenuData = (): { merchant: Merchant; categories: MenuCategory[] } => {
  const sampleApiResponse: APIMenuResponse = {
    success: true,
    data: {
      merchant: {
        id: '44cdb990-1044-48ae-bcbf-f91d0cedfe33',
        name: "Mario's Authentic Pizzeria",
        username: 'marios-pizzeria',
        description: 'Traditional Italian pizzas made with authentic ingredients and wood-fired ovens',
        image_url: '',
        currency: 'GBP',
        loyalty_enabled: true,
        can_accept_orders: true,
      },
      menu: [
        {
          name: 'Pizza',
          display_order: 1,
          items: [
            {
              id: '3ca836da-02f1-4ae5-a1a0-3e4db34d0457',
              merchant_id: '44cdb990-1044-48ae-bcbf-f91d0cedfe33',
              category_id: '6744e6b5-8e05-4e3e-bff7-eb6a40751352',
              title: 'Margherita',
              description: 'Fresh mozzarella, tomato sauce, basil',
              image_url: '',
              base_price: 1200,
              display_order: 1,
              is_active: true,
              created_at: '2025-09-08T09:22:44.250Z',
              updated_at: '2025-09-08T09:22:44.250Z',
              category_name: 'Pizza',
              category_order: 1,
              has_options: true,
            },
          ],
        },
      ],
    },
  };

  return transformMenuResponse(sampleApiResponse);
};
