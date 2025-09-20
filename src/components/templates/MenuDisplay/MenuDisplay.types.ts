import type { MenuItem } from '@/types';

export interface MenuCategory {
  name: string;
  displayOrder: number;
  items: MenuItem[];
}

export interface Merchant {
  id: string;
  name: string;
  username: string;
  description?: string;
  imageUrl?: string;
  currency: string;
  loyaltyEnabled?: boolean;
  canAcceptOrders?: boolean;
}

export interface MenuDisplayProps {
  /** Merchant information */
  merchant: Merchant;
  /** Array of menu categories with their items */
  categories: MenuCategory[];
  /** Callback when a menu item is selected */
  onItemClick?: (menuItem: MenuItem) => void;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
  /** Optional className for custom styling */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}
