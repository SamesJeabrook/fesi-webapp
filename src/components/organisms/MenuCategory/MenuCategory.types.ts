import type { MenuItem } from '@/types';

export interface MenuCategoryProps {
  /** Category name (e.g., "Pizza", "Sides", "Drinks") */
  name: string;
  /** Array of menu items in this category */
  items: MenuItem[];
  /** Callback when a menu item is selected */
  onItemClick?: (menuItem: MenuItem) => void;
  /** Optional className for custom styling */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}
