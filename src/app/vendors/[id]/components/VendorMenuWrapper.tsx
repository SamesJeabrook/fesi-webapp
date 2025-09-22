'use client'

import { MenuDisplay } from '@/components/templates/MenuDisplay';
import type { Merchant, MenuCategory } from '@/components/templates/MenuDisplay/MenuDisplay.types';
import type { MenuItem } from '@/types';

interface VendorMenuWrapperProps {
  merchant: Merchant;
  categories: MenuCategory[];
}

export function VendorMenuWrapper({ merchant, categories }: VendorMenuWrapperProps) {
  // Handle click events for menu items
  const handleItemClick = (menuItem: MenuItem) => {
    console.log('Item clicked:', menuItem.id);
    // TODO: Navigate to item detail page or open modal
  };

  return (
    <MenuDisplay
      merchant={merchant}
      categories={categories}
      onItemClick={handleItemClick}
    />
  );
}
