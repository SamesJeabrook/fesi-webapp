'use client'

import Notification from '@/components/atoms/Notification/Notification';
import { MenuDisplay } from '@/components/templates/MenuDisplay';
import type { Merchant, MenuCategory } from '@/components/templates/MenuDisplay/MenuDisplay.types';
import type { MenuItem } from '@/types';

interface VendorMenuWrapperProps {
  activeEvent: Boolean;
  merchant: Merchant;
  categories: MenuCategory[];
}

export function VendorMenuWrapper({ merchant, categories, activeEvent }: VendorMenuWrapperProps) {
  // Handle click events for menu items
  const handleItemClick = (menuItem: MenuItem) => {
    console.log('Item clicked:', menuItem.id);
    // TODO: Navigate to item detail page or open modal
  };

  return (
    <>
      {!activeEvent && (<Notification message={`${merchant.name} is not taking orders right now,`} subMessage=' but you can still view their menu.' type="warning" />)}
      <MenuDisplay
        merchant={merchant}
        categories={categories}
        onItemClick={handleItemClick}
      />
    </>
  );
}
