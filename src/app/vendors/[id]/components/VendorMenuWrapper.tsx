'use client'

import React, { useState, useEffect } from 'react';
import Notification from '@/components/atoms/Notification/Notification';
import OrderList, { OrderListItem } from '@/components/molecules/OrderList/OrderList';
import { MenuDisplay } from '@/components/templates/MenuDisplay';
import type { Merchant, MenuCategory } from '@/components/templates/MenuDisplay/MenuDisplay.types';
import type { MenuItem, Event } from '@/types';
import { MenuItem as VendorServiceItem } from '@/services/vendorService';
import { MenuSubGroup, VendorService } from '@/services/vendorService';
import MenuItemDetails from '@/components/organisms/MenuItemDetails/MenuItemDetails';
import FullscreenTransition from '@/components/atoms/FullscreenTransition/FullscreenTransition';
import BasketSummary from '@/components/molecules/BasketSummary/BasketSummary';
import CheckoutButtonWrapper from '@/components/atoms/CheckoutButtonWrapper/CheckoutButtonWrapper';
import { Button } from '@/components';
import OrderSummary from '@/components/organisms/OrderSummary/OrderSummary';
import { paymentConfig } from '@/config/paymentConfig';
import Tabs, { Tab } from '@/components/molecules/Tabs/Tabs';
import api from '@/utils/api';

interface VendorMenuWrapperProps {
  activeEvent: Boolean;
  merchant: Merchant;
  categories: MenuCategory[];
  eventData: Event;
}

// Define types for order selections matching backend, using string for menu_item_id (UUID)
interface CustomizationSelection {
  sub_item_id: string;
  sub_item_name: string;
  price_modifier: number;
  quantity: number;
}

interface OrderSelection {
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  customizations?: CustomizationSelection[];
  item_total: number;
  item_base_price: number;
}

export function VendorMenuWrapper({ merchant, categories, activeEvent, eventData }: VendorMenuWrapperProps) {
  // Track all completed/accepted orders
  const [orders, setOrders] = useState<OrderListItem[]>(() => {
    // Restore from localStorage if available
    try {
      const saved = localStorage.getItem('acceptedOrders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  // Track all selections for each menu item as an array
  const [orderSelections, setOrderSelections] = useState<OrderSelection[]>([]);
  // Track option group selections for the currently selected menu item
  interface SelectedOptionDetail {
    id: string;
    name: string;
    price: number;
  }
  const [selectedOptions, setSelectedOptions] = useState<Record<string, SelectedOptionDetail[]>>({});
  const [checkoutDisplay, setCheckoutDisplay] = useState(false);
  const [activeCheckoutTab, setActiveCheckoutTab] = useState('summary');

  // Restore basket and cost breakdown from localStorage on mount
  useEffect(() => {
    const savedBasketItems = localStorage.getItem('basketItems');
    const savedCostBreakdown = localStorage.getItem('costBreakdown');
    const savedHolding = localStorage.getItem('holding');
    if (savedBasketItems && savedCostBreakdown && savedHolding === 'true') {
      try {
        const parsedBasket = JSON.parse(savedBasketItems);
        setOrderSelections(parsedBasket.map((item: any) => ({
          menu_item_id: item.menu_item_id,
          menu_item_name: item.menu_item_name,
          quantity: item.quantity,
          customizations: item.customizations,
          item_total: item.item_total,
          item_base_price: item.item_base_price,
        })));
      } catch (e) {
        // ignore parse errors
      }
      setCheckoutDisplay(true);
    }
  }, []);

  useEffect(() => {
    console.log(orderSelections)
  }, [orderSelections])

  // Poll for order updates (push notifications will handle real-time updates)
  useEffect(() => {
    if (orders.length === 0) return;

    const pollOrders = async () => {
      try {
        const orderIds = orders.map(order => order.id);
        const data = await api.post('/orders/batch', { orderIds }, { skipAuth: true });

        const updatedOrders = orders.map(order => {
          const serverOrder = data.orders.find((o: any) => o.id === order.id);
          return serverOrder ? { ...order, status: serverOrder.status } : order;
        });

        setOrders(updatedOrders);
        localStorage.setItem('acceptedOrders', JSON.stringify(updatedOrders));
      } catch (error) {
        console.error('Order polling failed:', error);
      }
    };

    // Initial poll
    pollOrders();

    // Poll every 30 seconds as fallback (push notifications are primary)
    const interval = setInterval(pollOrders, 30000);

    return () => clearInterval(interval);
  }, [orders.length]); // Only re-run if number of orders changes

  // Handle option group selection changes for the modal
  const handleOptionsChange = (groupId: string, selected: string[], menuItem?: MenuItem) => {
    // If menuItem is provided, map selected IDs to details
    let details: SelectedOptionDetail[] = [];
    if (menuItem && menuItem.option) {
      for (const sub_item_id of selected) {
        for (const group of menuItem.option) {
          const sub = group.choices.find((s: any) => s.id === sub_item_id);
          if (sub) {
            details.push({ id: sub.id, name: sub.name, price: sub.priceModifier });
          }
        }
      }
    } else {
      // fallback: just record id
      details = selected.map(id => ({ id, name: id, price: 0 }));
    }
    setSelectedOptions(prev => ({
      ...prev,
      [groupId]: details,
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

  // Transform service MenuItem to unified MenuItem type
  const transformMenuItem = (item: any): MenuItem => {
    console.log('transformMenuItem: item.option_groups', item.option_groups);
    const option = item.option_groups ? item.option_groups.map((group: any) => ({
      id: group.id,
      menuItemId: item.id,
      name: group.name,
      type: group.selection_type,
      required: group.is_required,
      maxSelections: group.max_selections,
      choices: group.sub_items.map((sub: any) => ({
        id: sub.id,
        optionId: group.id,
        name: sub.name,
        priceModifier: sub.additional_price,
        isDefault: false,
      }))
    })) : [];
    return {
      id: item.id,
      merchantId: item.merchant_id || item.merchantId,
      categoryId: item.category_id || item.categoryId,
      name: item.title || item.name,
      description: item.description,
      price: item.price || '',
      basePrice: typeof item.base_price === 'number' ? item.base_price : item.basePrice,
      imageUrl: item.image_url || item.imageUrl,
      isAvailable: item.is_active ?? item.isAvailable,
      isPopular: item.isPopular,
      preparationTime: item.preparationTime,
      calories: item.calories,
      allergens: item.allergens,
      dietaryInfo: item.dietaryInfo,
      option,
      displayOrder: item.display_order || item.displayOrder,
      createdAt: item.created_at || item.createdAt || '',
      updatedAt: item.updated_at || item.updatedAt || '',
    };
  };

  // Helper to get menu item by id
  const getMenuItemById = (id: string): MenuItem | undefined => {
    for (const cat of categories) {
      if (cat.items) {
        const found = cat.items.find((item: any) => item.id === id);
        if (found) return transformMenuItem(found);
      }
    }
    if (selectedMenuItem && selectedMenuItem.id === id) {
      return transformMenuItem(selectedMenuItem);
    }
    return undefined;
  };

  // Helper to get sub-item price
  const getSubItemPrice = (menuItem: MenuItem, sub_item_id: string): number => {
    if (!menuItem || !menuItem.option) return 0;
    for (const group of menuItem.option) {
      const sub = group.choices.find((s: any) => s.id === sub_item_id);
      if (sub && typeof sub.priceModifier === 'number') return sub.priceModifier;
    }
    return 0;
  };

  // Helper to get sub-item details
  const getSubItemDetails = (menuItem: MenuItem, sub_item_id: string) => {
    if (!menuItem || !menuItem.option) {
      console.warn('getSubItemDetails: menuItem or option missing', menuItem);
      return { name: sub_item_id, price: 0 };
    }
    for (const group of menuItem.option) {
      const sub = group.choices.find((s: any) => s.id === sub_item_id);
      if (sub) {
        console.log('getSubItemDetails: found sub-item', sub_item_id, sub.name, sub.priceModifier);
        return { name: sub.name, price: sub.priceModifier };
      }
    }
    console.warn('getSubItemDetails: sub-item not found', sub_item_id, menuItem.option);
    return { name: sub_item_id, price: 0 };
  };

  // Add item to order (increments quantity or adds new)
  const handleAddToOrder = (menuItemId: string, quantity: number = 1) => {
    const menuItem = getMenuItemById(menuItemId);
    if (!menuItem || typeof menuItem.basePrice !== 'number') return;
    // Build customizations with sub_item_name and price_modifier
    const customizations: CustomizationSelection[] = Object.values(selectedOptions).flat().map(opt => ({
      sub_item_id: opt.id,
      sub_item_name: opt.name,
      price_modifier: opt.price,
      quantity: 1,
    }));
    // Calculate total price for this item (base + all customizations * their quantity)
    let customizationsTotal = 0;
    for (const c of customizations) {
      customizationsTotal += (typeof c.price_modifier === 'number' ? c.price_modifier : 0) * c.quantity;
    }
    const item_total = (menuItem.basePrice + customizationsTotal) * quantity;

    setOrderSelections(prev => {
      // Find if an identical item (id + customizations) exists
      const idx = prev.findIndex(sel => sel.menu_item_id === menuItemId && areCustomizationsEqual(sel.customizations, customizations));
      if (idx !== -1) {
        // Set quantity and update item_total for this unique combination
        const updated = [...prev];
        updated[idx].quantity += quantity;
        updated[idx].item_total += item_total;
        // Merge customizations names and price modifiers if missing
        updated[idx].customizations = customizations;
        return updated;
      } else {
        // Add new item with specified quantity, customizations, and item_total
        return [...prev, {
          menu_item_id: menuItemId,
          menu_item_name: menuItem.name,
          quantity,
          customizations,
          item_total,
          item_base_price: menuItem.basePrice ?? 0,
        }];
      }
    });
    setSelectedMenuItem(null); // Close details after adding
    setSelectedOptions({}); // Reset modal selections
  };

  // Handler to remove item from basket
  const handleRemoveOrderItem = (menu_item_id: string) => {
    setOrderSelections(prev => prev.filter(item => item.menu_item_id !== menu_item_id));
  };

  // Basket summary calculation (useMemo for restoration)
  const basketTotal = React.useMemo(() => {
    return orderSelections.reduce((sum, item) => {
      // Ensure all values are numbers
      const basePrice = typeof item.item_total === 'number' ? item.item_total : 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
      const customizationsTotal = (item.customizations || []).reduce((acc, c) => {
        const price = typeof c.price_modifier === 'number' ? c.price_modifier : 0;
        const qty = typeof c.quantity === 'number' ? c.quantity : 0;
        return acc + price * qty;
      }, 0);
      const itemTotal = (basePrice + customizationsTotal) * quantity;
      return sum + itemTotal;
    }, 0);
  }, [orderSelections]);

  // Prepare basket items for BasketSummary and OrderSummary
  const basketItems = orderSelections.map(item => {
    return {
      menu_item_id: item.menu_item_id,
      menu_item_name: item.menu_item_name || 'Item',
      menu_item_title: item.menu_item_name || 'Item',
      title: item.menu_item_name || 'Item',
      quantity: item.quantity,
      item_total: item.item_total,
      customizations: (item.customizations || []).map(c => ({
        sub_item_id: c.sub_item_id,
        sub_item_name: c.sub_item_name,
        price_modifier: c.price_modifier,
        quantity: c.quantity,
      }))
    };
  });

  // Prepare basket items for OrderSummary
  // Use paymentConfig for cost breakdown
  const {
    platformFeePercentage,
    stripeFeePct,
    stripeFeeFixed,
    minimumPlatformProfit,
    minimumOrderValue,
    smallOrderThreshold,
    currency,
  } = paymentConfig;

  const subtotal = basketItems.reduce((sum, item) => sum + item.item_total, 0);
  // Calculate base platform fee
  const basePlatformFee = subtotal * platformFeePercentage;
  // Stripe fee estimate
  const stripeFeeEstimate = Math.round((subtotal * stripeFeePct) + stripeFeeFixed);
  // Required platform fee
  const requiredPlatformFee = stripeFeeEstimate + minimumPlatformProfit;
  // Small order fee logic
  let smallOrderFee = 0;
  if (basePlatformFee < requiredPlatformFee) {
    smallOrderFee = requiredPlatformFee - basePlatformFee;
    smallOrderFee = Math.round(smallOrderFee * 100) / 100; // round to nearest penny
  }
  const totalPlatformFee = basePlatformFee + smallOrderFee;
  const merchantAmount = subtotal;
  const totalOrderAmount = subtotal + totalPlatformFee;
  const smallOrderProtectionApplied = smallOrderFee > 0;

  const costBreakdown = {
    subtotal: Math.round(subtotal * 100) / 100,
    basePlatformFee: Math.round(basePlatformFee * 100) / 100,
    smallOrderFee: Math.round(smallOrderFee * 100) / 100,
    totalPlatformFee: Math.round(totalPlatformFee * 100) / 100,
    merchantAmount: Math.round(merchantAmount * 100) / 100,
    totalOrderAmount: Math.round(totalOrderAmount * 100) / 100,
    minimumOrderValue,
    smallOrderProtectionApplied
  };

  const orderTabs = [
    { key: 'summary', label: 'Summary'},
    { key: 'orders', label: 'Orders'},
  ]

  // Callback for when an order is accepted
  const handleOrderAccepted = (order: { id: string; status: string; order_number?: number; items: any[]; total: number; }) => {
    // Convert partial order to OrderListItem with required fields
    const fullOrder: OrderListItem = {
      id: order.id,
      status: order.status as 'pending' | 'accepted' | 'preparing' | 'ready' | 'complete' | 'cancelled',
      items: order.items,
      total: order.total,
      order_number: order.order_number || 0, // Will be populated by backend/polling
      longitude: 0,
      latitude: 0,
      merchant_name: merchant.name,
    };
    
    setOrders(prev => {
      const updated = [fullOrder, ...prev];
      localStorage.setItem('acceptedOrders', JSON.stringify(updated));
      return updated;
    });
    
    // Clear the basket for a new order
    setOrderSelections([]);
    setSelectedOptions({});
    
    // Clear any stored basket data from localStorage
    localStorage.removeItem('basketItems');
    localStorage.removeItem('costBreakdown');
    localStorage.removeItem('orderId');
    localStorage.removeItem('clientSecret');
    localStorage.removeItem('holding');
    
    setActiveCheckoutTab('orders'); 
  };

  const handleItemClick = async (menuItem: MenuItem) => {
    try {
      const itemData = await VendorService.getMenuSubGroups(menuItem.id);
      // Transform the service data to MenuItem type
      const transformedItem = transformMenuItem(itemData);
      setSelectedMenuItem(transformedItem as any);
    } catch (error) {
      console.error('Failed to fetch sub-groups:', error);
    }
  };

  return (
    <>
      {!activeEvent && (<Notification message={`${merchant.name} is not taking orders right now,`} subMessage=' but you can still view their menu.' type="warning" />)}
      <MenuDisplay
        merchant={merchant}
        categories={categories.map(cat => ({ ...cat, items: cat.items || [] }))}
        onItemClick={handleItemClick}
      />
      {activeEvent && (
        <>
          <BasketSummary items={basketItems} total={basketTotal} />
          <CheckoutButtonWrapper>
            <Button variant="primary" onClick={() => setCheckoutDisplay(true)}>Checkout</Button>
          </CheckoutButtonWrapper>
        </>
      )}
      <FullscreenTransition
        open={!!selectedMenuItem}
        onClose={() => { setSelectedMenuItem(null); setSelectedOptions({}); }}
      >
        {selectedMenuItem && (
          <MenuItemDetails
            item={selectedMenuItem}
            disabled={!activeEvent}
            selectedOptions={selectedOptions}
            onOptionsChange={(groupId, selected) => handleOptionsChange(groupId, selected.map(opt => opt.id), selectedMenuItem)}
            onAddToOrder={(qty: number) => handleAddToOrder(selectedMenuItem.id, qty)}
            onCancel={() => { setSelectedMenuItem(null); setSelectedOptions({}); }}
          />
        )}
      </FullscreenTransition>
      {activeEvent && (
        <FullscreenTransition
          open={checkoutDisplay}
          onClose={() => setCheckoutDisplay(false)}
        >
          <Tabs tabs={orderTabs} activeTab={activeCheckoutTab} onTabChange={setActiveCheckoutTab}>
            {/* Tab content passed as children, no tabKey prop */}
            <Tab tabKey='summary'>
              <OrderSummary
                items={basketItems}
                costBreakdown={costBreakdown}
                onRemoveItem={handleRemoveOrderItem}
                event={eventData}
                onOrderAccepted={handleOrderAccepted}
              />
            </Tab>
            <Tab tabKey='orders'>
              <OrderList orders={orders} />
            </Tab>
          </Tabs>
        </FullscreenTransition>
      )}
    </>
  );
}
