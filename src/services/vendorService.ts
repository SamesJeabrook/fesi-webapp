// API service for vendor-related operations
export interface Vendor {
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

export interface VendorWithMenu {
  vendor: Vendor;
  categories: MenuCategory[];
  menuItems: MenuItem[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export class VendorService {
  /**
   * Fetch a single vendor by ID or username
   */
  static async getVendorById(identifier: string): Promise<Vendor | null> {
    try {
      // Use the new endpoint that handles both UUID and username
      const response = await fetch(`${API_BASE_URL}/api/merchants/${identifier}`, {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch vendor: ${response.statusText}`);
      }
      
      const data = await response.json();
      // The API returns the response in { success: true, data: merchant } format
      const vendor = data.success ? data.data : data;
      
      return vendor;
    } catch (error) {
      console.error('Error fetching vendor:', error);
      throw error;
    }
  }

  /**
   * Fetch menu items for a specific vendor (returns organized by categories)
   */
  static async getMenuItems(vendorId: string): Promise<MenuItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/menu/merchant/${vendorId}`, {
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
   * Fetch menu categories for a specific vendor
   */
  static async getMenuCategories(vendorId: string): Promise<MenuCategory[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/menu/merchant/${vendorId}`, {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch menu categories: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const categories: MenuCategory[] = [];
      if (data.success && data.data) {
        data.data.forEach((category: any, index: number) => {
          categories.push({
            id: category.name, // Use category name as ID for now
            name: category.name,
            description: undefined,
            display_order: category.display_order || index
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
   * Fetch complete vendor data with menu
   */
  static async getVendorWithMenu(identifier: string): Promise<VendorWithMenu | null> {
    try {
      console.log('VendorService.getVendorWithMenu called with:', identifier);
      
      // Use the menu API which already handles both UUID and username, and includes vendor data
      const response = await fetch(`${API_BASE_URL}/api/menu/merchant/${identifier}`, {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      });
      
      console.log('Menu API response status:', response.status);
      
      if (!response.ok) {
        console.log('Menu API failed:', response.statusText);
        return null;
      }
      
      const data = await response.json();
      console.log('Menu API response:', data);
      
      if (!data.success || !data.data) {
        console.log('Menu API returned unsuccessful response');
        return null;
      }
      
      const { merchant: vendor, menu: menuData } = data.data;
      
      // Extract categories and items from menu data
      const categories = menuData.map((category: any, index: number) => ({
        id: category.name,
        name: category.name,
        description: undefined,
        display_order: category.display_order || index
      }));
      
      // Flatten menu items from all categories
      const menuItems = menuData.flatMap((category: any) => 
        category.items?.map((item: any) => ({
          ...item,
          category: {
            id: category.name,
            name: category.name,
            description: undefined,
            display_order: category.display_order
          }
        })) || []
      );
      
      // Sort categories by display order
      const sortedCategories = categories.sort((a: any, b: any) => a.display_order - b.display_order);
      
      // Sort menu items by display order and filter active items
      const sortedMenuItems = menuItems
        .filter((item: any) => item.is_active)
        .sort((a: any, b: any) => a.display_order - b.display_order);

      return {
        vendor,
        categories: sortedCategories,
        menuItems: sortedMenuItems,
      };
    } catch (error) {
      console.error('Error fetching vendor with menu:', error);
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
   * Fetch all vendors (for listing pages)
   */
  static async getAllVendors(): Promise<Vendor[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/merchants`, {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch vendors: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  }
}
