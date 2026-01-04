'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button, Input } from '@/components/atoms';
import api from '@/utils/api';
import {
  POSMenuItemCard,
  POSCategoryFilter,
  POSPaymentQR,
  type CartItemCustomization
} from '@/components/molecules';
import {
  MenuItemOptionsModal,
  POSOrderSummary,
  type MenuItem as ModalMenuItem,
  type OptionGroup,
  type SubItem,
  type CartItem as OrderSummaryCartItem,
  type Event as OrderSummaryEvent
} from '@/components/organisms';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getAuthToken } from '@/utils/devAuth';
import styles from './pos.module.scss';

// Use imported types
type MenuItem = ModalMenuItem;
type CartItem = OrderSummaryCartItem;
type Event = OrderSummaryEvent & { is_open: boolean };

export default function POSPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string>('');
  const [pendingOrderId, setPendingOrderId] = useState<string>('');

  // Get token with dev token override support
  const getToken = async () => {
    // Check for dev token override
    const devToken = localStorage.getItem('dev_token');
    if (devToken) {
      return devToken;
    }
    
    // Otherwise get Auth0 token
    return await getAccessTokenSilently({
      authorizationParams: {
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
      },
    });
  };

  // Fetch events and menu items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAuthToken(getAccessTokenSilently);
        
        // Get merchant ID first
        let merchantId: string;
        if (token.startsWith('dev-merchant-')) {
            merchantId = token.replace('dev-merchant-', '');
        } else {
            // For real Auth0 tokens, get merchant data from /me endpoint
            const merchantData = await api.get('/api/merchants/me');
            merchantId = merchantData.id;
        }

        // Fetch only active events where this merchant is participating
        const eventsData = await api.get(`/api/events?merchant_id=${merchantId}&is_open=true`);
        setEvents(eventsData);
        // Auto-select first event
        if (eventsData.length > 0) {
          setSelectedEvent(eventsData[0].id);
        }

        const menuData = await api.get(`/api/menu/merchant/${merchantId}`);
        
        // Extract all items from all categories
        if (menuData.data?.menu && Array.isArray(menuData.data.menu)) {
            const allItems: MenuItem[] = [];
            
            // Flatten items from all categories
            for (const category of menuData.data.menu) {
              if (category.items && Array.isArray(category.items)) {
                for (const item of category.items) {
                  // Fetch full item details with options
                  try {
                    const itemDetail = await api.get(`/api/menu/${item.id}`);
                    allItems.push({
                        id: itemDetail.id,
                        title: itemDetail.title,
                        base_price: itemDetail.base_price,
                        category_name: category.name,
                        description: itemDetail.description,
                        image_url: itemDetail.image_url,
                        option_groups: itemDetail.option_groups || [],
                    });
                  } catch (err) {
                    console.error(`Failed to fetch details for item ${item.id}:`, err);
                  }
                }
              }
            }
          setMenuItems(allItems);
        } else {
          console.error('Unexpected menu data structure:', menuData);
          setMenuItems([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [getAccessTokenSilently]);

  // Prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category_name).filter((cat): cat is string => Boolean(cat))))];

  const filteredItems = menuItems.filter(item => {
    if (!item || !item.title) return false;
    const matchesCategory = selectedCategory === 'all' || item.category_name === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleMenuItemClick = async (item: MenuItem) => {
    // Check if item has option groups
    if (item.option_groups && item.option_groups.length > 0) {
      // Item has options - show modal
      setSelectedMenuItem(item);
      setSelectedOptions({});
    } else {
      // No options - add directly to cart
      addDirectlyToCart(item);
    }
  };

  const addDirectlyToCart = (item: MenuItem) => {
    const cartItem: CartItem = {
      id: Date.now().toString(), // Unique cart item ID
      menu_item_id: item.id,
      menu_item_name: item.title,
      quantity: 1,
      item_base_price: item.base_price,
      customizations: [],
      item_total: item.base_price,
    };
    setCart([...cart, cartItem]);
  };

  const addToCartWithOptions = () => {
    if (!selectedMenuItem) return;

    // Validate required options
    for (const group of selectedMenuItem.option_groups || []) {
      if (group.is_required && (!selectedOptions[group.id] || selectedOptions[group.id].length === 0)) {
        alert(`Please select ${group.name}`);
        return;
      }
    }

    // Build customizations array
    const customizations: CartItemCustomization[] = [];
    let totalModifier = 0;

    Object.entries(selectedOptions).forEach(([groupId, subItemIds]) => {
      const group = selectedMenuItem.option_groups?.find(g => g.id === groupId);
      if (!group) return;

      subItemIds.forEach(subItemId => {
        const subItem = group.sub_items.find(si => si.id === subItemId);
        if (subItem) {
          customizations.push({
            sub_item_id: subItem.id,
            sub_item_name: subItem.name,
            price_modifier: subItem.additional_price,
            quantity: 1,
          });
          totalModifier += subItem.additional_price;
        }
      });
    });

    const cartItem: CartItem = {
      id: Date.now().toString(),
      menu_item_id: selectedMenuItem.id,
      menu_item_name: selectedMenuItem.title,
      quantity: 1,
      item_base_price: selectedMenuItem.base_price,
      customizations,
      item_total: selectedMenuItem.base_price + totalModifier,
    };

    setCart([...cart, cartItem]);
    setSelectedMenuItem(null);
    setSelectedOptions({});
  };

  const handleOptionSelect = (groupId: string, subItemId: string, selectionType: 'single' | 'multiple', maxSelections: number | null) => {
    setSelectedOptions(prev => {
      const current = prev[groupId] || [];
      
      if (selectionType === 'single') {
        // Single selection - replace
        return { ...prev, [groupId]: [subItemId] };
      } else {
        // Multiple selection
        if (current.includes(subItemId)) {
          // Remove if already selected
          return { ...prev, [groupId]: current.filter(id => id !== subItemId) };
        } else {
          // Add if not at max
          if (maxSelections && current.length >= maxSelections) {
            alert(`You can only select ${maxSelections} option(s)`);
            return prev;
          }
          return { ...prev, [groupId]: [...current, subItemId] };
        }
      }
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      setCart(cart.map(item => {
        if (item.id === itemId) {
          // Recalculate item_total based on base price + customizations
          const customizationsTotal = item.customizations.reduce(
            (sum, custom) => sum + custom.price_modifier,
            0
          );
          const itemTotalForOne = item.item_base_price + customizationsTotal;
          
          return {
            ...item,
            quantity: newQuantity,
            item_total: itemTotalForOne * newQuantity
          };
        }
        return item;
      }));
    }
  };

  const updateNotes = (itemId: string, notes: string) => {
    setCart(cart.map(item =>
      item.id === itemId ? { ...item, notes } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerEmail('');
    setCustomerName('');
    setCustomerPhone('');
    setOrderNumber(null);
  };

  const calculateTotal = () => {
    // item_total already includes quantity, so just sum all item_total values
    return cart.reduce((total, item) => total + item.item_total, 0);
  };

  const submitOrder = async () => {
    if (cart.length === 0) {
      alert('Please add items to the cart');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getAuthToken(getAccessTokenSilently);
      
      // Get merchant ID
      let merchantId: string;
      if (token.startsWith('dev-merchant-')) {
        merchantId = token.replace('dev-merchant-', '');
      } else {
        const merchantData = await api.get('/api/merchants/me');
        merchantId = merchantData.id;
      }
      
      // Use POS-specific endpoint with lenient validation
      const result = await api.post(`/api/orders/merchant/${merchantId}/pos`, {
        guest_info: {
          // Database constraint requires guest_email for anonymous orders
          // Use placeholder for walk-in customers who don't provide email
          email: customerEmail?.trim() || `walkin-${Date.now()}@pos.local`,
          first_name: customerName?.trim() || 'Walk-in',
          last_name: 'Customer',
          phone: customerPhone?.trim() || null,
        },
        items: cart.map(item => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          customizations: item.customizations,
        })),
        notes: cart
          .filter(item => item.notes)
          .map(item => `${item.menu_item_name}: ${item.notes}`)
          .join('; ') || undefined,
      });

      const data = result.data || result;
      setOrderNumber(data.order_number || data.id);
      // Don't clear cart immediately - show success message first
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitOrderWithCard = async () => {
    if (cart.length === 0) {
      alert('Please add items to the cart');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getAuthToken(getAccessTokenSilently);
      
      // Get merchant ID
      let merchantId: string;
      if (token.startsWith('dev-merchant-')) {
        merchantId = token.replace('dev-merchant-', '');
      } else {
        const merchantData = await api.get('/api/merchants/me');
        merchantId = merchantData.id;
      }
      
      // Create order with payment_status = 'pending'
      const result = await api.post(`/api/orders/merchant/${merchantId}/pos`, {
        guest_info: {
          email: customerEmail?.trim() || `walkin-${Date.now()}@pos.local`,
          first_name: customerName?.trim() || 'Walk-in',
          last_name: 'Customer',
          phone: customerPhone?.trim() || null,
        },
        items: cart.map(item => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          customizations: item.customizations,
        })),
        notes: cart
          .filter(item => item.notes)
          .map(item => `${item.menu_item_name}: ${item.notes}`)
          .join('; ') || undefined,
        payment_method: 'card',
        payment_status: 'pending', // Override the default 'completed'
      });

      const order = result.data || result;
      setPendingOrderId(order.id);
      
      // Create Stripe Checkout Session
      const checkoutResult = await api.post('/api/pos-payments/create-checkout', {
        order_id: order.id,
        merchant_id: merchantId
      });
      
      setCheckoutUrl(checkoutResult.checkout_url);
      setShowPaymentQR(true);
      
    } catch (error) {
      console.error('Error creating card payment:', error);
      alert('Error creating payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent hydration mismatch by only rendering after client mount
  if (!isMounted) {
    return null;
  }

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <div className={styles.pos}>
        <div className={styles.pos__header}>
          <Link href="/merchant/admin" className={styles.pos__backLink}>
            ← Back to Dashboard
          </Link>
          <Typography variant="heading-2">Point of Sale</Typography>
          <Typography variant="body-large" style={{ color: 'var(--color-text-secondary)' }}>
            Take orders directly at the counter
          </Typography>
        </div>

        {/* Success Screen */}
        {orderNumber ? (
          <div className={styles.pos__success}>
            <div className={styles.pos__successCard}>
              <Typography variant="heading-1" className={styles.pos__orderNumber}>
                #{orderNumber}
              </Typography>
              <Typography variant="heading-4">Order Created Successfully!</Typography>
              <Typography variant="body-large" style={{ marginTop: '1rem' }}>
                Give this order number to the customer
              </Typography>
              <div className={styles.pos__newOrderBtn}>
                <Button
                  onClick={clearCart}
                  variant="primary"
                >
                  New Order
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.pos__content}>
            {/* Menu Section */}
            <div className={styles.pos__menu}>
              <div className={styles.pos__menuHeader}>
                <Input
                  id="search"
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.pos__search}
                />
              </div>

              <POSCategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />

              <div className={styles.pos__items}>
                {filteredItems.length === 0 ? (
                  <Typography variant="body-medium" style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem' }}>
                    No items found
                  </Typography>
                ) : (
                  filteredItems.map(item => (
                    <POSMenuItemCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      basePrice={item.base_price}
                      hasOptions={!!(item.option_groups && item.option_groups.length > 0)}
                      imageUrl={item.image_url}
                      onClick={() => handleMenuItemClick(item)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Cart Section */}
            {/* Cart/Order Summary */}
            <POSOrderSummary
              cart={cart}
              customerEmail={customerEmail}
              customerName={customerName}
              customerPhone={customerPhone}
              events={events}
              selectedEvent={selectedEvent}
              isSubmitting={isSubmitting}
              onCustomerEmailChange={setCustomerEmail}
              onCustomerNameChange={setCustomerName}
              onCustomerPhoneChange={setCustomerPhone}
              onEventChange={setSelectedEvent}
              onQuantityChange={updateQuantity}
              onNotesChange={updateNotes}
              onClearCart={clearCart}
              onSubmitOrder={submitOrder}
              onSubmitOrderWithCard={submitOrderWithCard}
            />
          </div>
        )}

        {/* Options Modal */}
        <MenuItemOptionsModal
          menuItem={selectedMenuItem}
          selectedOptions={selectedOptions}
          isOpen={!!selectedMenuItem}
          onClose={() => setSelectedMenuItem(null)}
          onOptionSelect={handleOptionSelect}
          onAddToCart={addToCartWithOptions}
        />

        {/* Payment QR Modal */}
        {showPaymentQR && checkoutUrl && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <POSPaymentQR
              checkoutUrl={checkoutUrl}
              orderTotal={calculateTotal()}
              onPaymentComplete={() => {
                setShowPaymentQR(false);
                setOrderNumber(pendingOrderId);
                clearCart();
              }}
              onCancel={() => {
                setShowPaymentQR(false);
                setCheckoutUrl('');
                setPendingOrderId('');
              }}
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
