/**
 * Menu Types
 * Type definitions for menu management system
 */

export interface Menu {
  id: string;
  merchant_id: string;
  name: string;
  description?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  item_count?: number;
  items?: MenuItem[];
}

export interface MenuItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  base_price: number;
  category_id?: string;
  category_name?: string;
  display_order?: number;
}

export interface CreateMenuPayload {
  merchant_id: string;
  name: string;
  description?: string;
  items?: string[]; // Array of menu item IDs
}

export interface UpdateMenuPayload {
  name?: string;
  description?: string;
  items?: string[]; // Array of menu item IDs
  is_active?: boolean;
}
