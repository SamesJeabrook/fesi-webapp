/**
 * Type definitions for EditMenuItemModal component
 */

import { SubItemGroup } from '../OptionGroupSelector';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id: string;
  category_name?: string;
  is_available: boolean;
  display_order: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  option_groups?: SubItemGroup[];
  is_age_restricted?: boolean;
  minimum_age?: number;
  restriction_type?: string;
  restriction_warning?: string;
  requires_id_verification?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
}

export interface EditMenuItemModalProps {
  /** The menu item to edit */
  item: MenuItem;
  
  /** Available categories for the menu item */
  categories: MenuCategory[];
  
  /** Whether the modal is open */
  isOpen: boolean;
  
  /** Callback when modal is closed */
  onClose: () => void;
  
  /** Callback when item is saved with updated data */
  onSave: (updatedItem: Partial<MenuItem>) => Promise<void>;
  
  /** Merchant ID for the item */
  merchantId: string;
  
  /** Authentication token for API requests (deprecated - api utility handles auth) */
  authToken?: string;
}
