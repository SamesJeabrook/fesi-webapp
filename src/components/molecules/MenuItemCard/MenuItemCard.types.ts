import type { MenuItem } from '@/types';

export interface MenuItemCardProps {
  menuItem: MenuItem;
  onAddToCart?: (menuItem: MenuItem, quantity: number) => void;
  onViewDetails?: (menuItem: MenuItem) => void;
  showAddButton?: boolean;
  showQuantityControls?: boolean;
  isLoading?: boolean;
  className?: string;
  'data-testid'?: string;
}
