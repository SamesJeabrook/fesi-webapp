'use client'

import { useState, useEffect } from 'react';
import Notification from '@/components/atoms/Notification/Notification';
import { MenuDisplay } from '@/components/templates/MenuDisplay';
import type { Merchant, MenuCategory } from '@/components/templates/MenuDisplay/MenuDisplay.types';
import type { MenuItem } from '@/types';
import { MenuItem as VendorServiceItem } from '@/services/vendorService';
import { MenuSubGroup, VendorService } from '@/services/vendorService';
import MenuItemDetails from '@/components/organisms/MenuItemDetails/MenuItemDetails';
import FullscreenTransition from '@/components/atoms/FullscreenTransition/FullscreenTransition';

interface VendorMenuWrapperProps {
  activeEvent: Boolean;
  merchant: Merchant;
  categories: MenuCategory[];
}

// Define types for order selections matching backend, using string for menu_item_id (UUID)
interface CustomizationSelection {
  sub_item_id: string;
  quantity: number;
}

interface OrderSelection {
  menu_item_id: string;
  quantity: number;
  customizations?: CustomizationSelection[];
}

export function VendorMenuWrapper({ merchant, categories, activeEvent }: VendorMenuWrapperProps) {
  const [selectedMenuItem, setSelectedMenuItem] = useState<VendorServiceItem | null>(null);
  // Track all selections for each menu item as an array
  const [orderSelections, setOrderSelections] = useState<OrderSelection[]>([]);
  // Track option group selections for the currently selected menu item
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});

  useEffect(() => {
    console.log(orderSelections)
  }, [orderSelections])

  // Handle option group selection changes for the modal
  const handleOptionsChange = (groupId: string, selected: string[]) => {
    setSelectedOptions(prev => ({
      ...prev,
      [groupId]: selected,
    }));
  };

  const areCustomizationsEqual = (a?: CustomizationSelection[], b?: CustomizationSelection[]) => {
    if (!a && !b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    // Compare arrays by sub_item_id and quantity
    const sortFn = (x: CustomizationSelection, y: CustomizationSelection) => x.sub_item_id.localeCompare(y.sub_item_id);
    const aSorted = [...a].sort(sortFn);
    const bSorted = [...b].sort(sortFn);
    return aSorted.every((c, i) => c.sub_item_id === bSorted[i].sub_item_id && c.quantity === bSorted[i].quantity);
  };

  // Add item to order (increments quantity or adds new)
  const handleAddToOrder = (menuItemId: string) => {
    const customizations: CustomizationSelection[] = Object.values(selectedOptions).flat().map(sub_item_id => ({ sub_item_id, quantity: 1 }));
    setOrderSelections(prev => {
      // Find if an identical item (id + customizations) exists
      const idx = prev.findIndex(sel => sel.menu_item_id === menuItemId && areCustomizationsEqual(sel.customizations, customizations));
      if (idx !== -1) {
        // Increment quantity for this unique combination
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      } else {
        // Add new item with quantity 1 and customizations
        return [...prev, { menu_item_id: menuItemId, quantity: 1, customizations }];
      }
    });
    setSelectedMenuItem(null); // Close details after adding
    setSelectedOptions({}); // Reset modal selections
  };

  const handleItemClick = async (menuItem: MenuItem) => {
    try {
      const itemData = await VendorService.getMenuSubGroups(menuItem.id);
      // Merge menuItem with itemData to ensure all MenuItem properties are present
      setSelectedMenuItem(itemData);
    } catch (error) {
      console.error('Failed to fetch sub-groups:', error);
    }
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
      <FullscreenTransition
        open={!!selectedMenuItem}
        onClose={() => { setSelectedMenuItem(null); setSelectedOptions({}); }}
      >
        {selectedMenuItem && (
          <MenuItemDetails
            item={selectedMenuItem}
            selectedOptions={selectedOptions}
            onOptionsChange={handleOptionsChange}
            onAddToOrder={() => handleAddToOrder(selectedMenuItem.id)}
            onCancel={() => { setSelectedMenuItem(null); setSelectedOptions({}); }}
          />
        )}
      </FullscreenTransition>
    </>
  );
}
