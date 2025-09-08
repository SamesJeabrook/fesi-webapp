// API service for eatery-related operations
export interface Eatery {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  currency: string;
  loyalty_enabled: boolean;
  stamps_required: number;
  loyalty_reward_description: string;
  offers_enabled: boolean;
  average_wait_time_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  display_order: number;
}

export interface MenuItem {
  id: string;
  merchant_id: string;
  category_id?: string;
  title: string;
  description?: string;
  image_url?: string;
  base_price: number; // Price in pence
  display_order: number;
  is_active: boolean;
  category?: MenuCategory;
}

export interface EateryWithMenu {
  eatery: Eatery;
  categories: MenuCategory[];
  menuItems: MenuItem[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export class EateryService {
  /**
   * Fetch a single eatery by ID
   */
  static async getEateryById(id: string): Promise<Eatery | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/merchants/${id}`, {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch eatery: ${response.statusText}`);
      }
      
      const data = await response.json();
      // The API returns the merchant object directly (not wrapped in a merchant property)
      return data;
    } catch (error) {
      console.error('Error fetching eatery:', error);
      throw error;
    }
  }

  /**
   * Fetch menu items for a specific eatery (returns organized by categories)
   */
  static async getMenuItems(eateryId: string): Promise<MenuItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/menu/merchant/${eateryId}`, {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch menu items: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // The API returns categories with items, we need to flatten to get all items
      const allItems: MenuItem[] = [];
      if (data.success && data.data) {
        data.data.forEach((category: any) => {
          if (category.items) {
            category.items.forEach((item: any) => {
              allItems.push({
                ...item,
                category: {
                  id: category.name, // Use category name as ID for now
                  name: category.name,
                  description: undefined,
                  display_order: category.display_order
                }
              });
            });
          }
        });
      }
      
      return allItems;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  }

  /**
   * Fetch menu categories for a specific eatery
   */
  static async getMenuCategories(eateryId: string): Promise<MenuCategory[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/menu/merchant/${eateryId}`, {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch menu categories: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Extract categories from the response
      const categories: MenuCategory[] = [];
      if (data.success && data.data) {
        data.data.forEach((category: any) => {
          categories.push({
            id: category.name, // Use category name as ID for now
            name: category.name,
            description: undefined,
            display_order: category.display_order
          });
        });
      }
      
      return categories;
    } catch (error) {
      console.error('Error fetching menu categories:', error);
      throw error;
    }
  }

  /**
   * Fetch complete eatery data with menu
   */
  static async getEateryWithMenu(id: string): Promise<EateryWithMenu | null> {
    try {
      const [eatery, categories, menuItems] = await Promise.all([
        this.getEateryById(id),
        this.getMenuCategories(id),
        this.getMenuItems(id),
      ]);

      if (!eatery) {
        return null;
      }

      // Sort categories by display order
      const sortedCategories = categories.sort((a, b) => a.display_order - b.display_order);
      
      // Sort menu items by display order and attach category info
      const sortedMenuItems = menuItems
        .filter(item => item.is_active)
        .sort((a, b) => a.display_order - b.display_order)
        .map(item => ({
          ...item,
          category: categories.find(cat => cat.id === item.category_id),
        }));

      return {
        eatery,
        categories: sortedCategories,
        menuItems: sortedMenuItems,
      };
    } catch (error) {
      console.error('Error fetching eatery with menu:', error);
      throw error;
    }
  }

  /**
   * Format price from pence to display format
   */
  static formatPrice(priceInPence: number, currency: string = 'GBP'): string {
    const price = priceInPence / 100;
    
    if (currency === 'GBP') {
      return `£${price.toFixed(2)}`;
    }
    
    // Add more currency formats as needed
    return `${price.toFixed(2)} ${currency}`;
  }

  /**
   * Get wait time display string
   */
  static getWaitTimeDisplay(waitTimeMinutes?: number): string {
    if (!waitTimeMinutes) {
      return 'Wait time varies';
    }
    
    if (waitTimeMinutes < 60) {
      return `${waitTimeMinutes} min`;
    }
    
    const hours = Math.floor(waitTimeMinutes / 60);
    const minutes = waitTimeMinutes % 60;
    
    if (minutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${minutes}m`;
  }
}
