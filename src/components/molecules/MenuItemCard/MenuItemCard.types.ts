import type { MenuItem } from '@/types';

export interface MenuItemCardProps {
  menuItem: MenuItem;
  onViewDetails?: (menuItem: MenuItem) => void;
  className?: string;
  hasOptions?: boolean;
  'data-testid'?: string;
}
