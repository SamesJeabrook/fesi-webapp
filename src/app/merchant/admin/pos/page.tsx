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
  StaffPinLogin,
  type MenuItem as ModalMenuItem,
  type OptionGroup,
  type SubItem,
  type CartItem as OrderSummaryCartItem,
  type Event as OrderSummaryEvent
} from '@/components/organisms';
import { type StaffMember } from '@/components/organisms/StaffPinLogin/StaffPinLogin.component';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getAuthToken } from '@/utils/devAuth';
import styles from './pos.module.scss';

// Use imported types
type MenuItem = ModalMenuItem;
type CartItem = OrderSummaryCartItem;
type Event = OrderSummaryEvent & { is_open: boolean };

export default function POSPage() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [merchantData, setMerchantData] = useState<any>(null);
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
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
  const [noEventsError, setNoEventsError] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string>('');
  const [pendingOrderId, setPendingOrderId] = useState<string>('');

  // Check session storage for existing staff login
  useEffect(() => {
    const savedStaff = sessionStorage.getItem('currentStaff_pos');
    if (savedStaff) {
      setCurrentStaff(JSON.parse(savedStaff));
    }
  }, []);

  // Load merchant data to check if staff login is required
  useEffect(() => {
    const loadMerchant = async () => {
      try {
        const token = await getAuthToken(getAccessTokenSilently);
        let merchantId: string;
        if (token.startsWith('dev-merchant-')) {
          merchantId = token.replace('dev-merchant-', '');
        } else {
          // Try Auth0 user's merchant_ids
          const merchantIds = user?.['https://fesi.app/merchant_ids'];
          if (merchantIds && merchantIds.length > 0) {
            merchantId = merchantIds[0];
          } else {
            const merchantDataResponse = await api.get('/api/merchants/me');
            merchantId = merchantDataResponse.id;
          }
        }
        const response = await api.get(`/api/merchants/${merchantId}`);
        // Handle wrapped response (API returns { success, data })
        const merchant = response.data || response;
        setMerchantData(merchant);
      } catch (error) {
        console.error('Error loading merchant:', error);
      }
    };
    loadMerchant();
  }, [user]);

  const handleStaffLogin = (staff: StaffMember) => {
    setCurrentStaff(staff);
    sessionStorage.setItem('currentStaff_pos', JSON.stringify(staff));
  };

  const handleStaffLogout = () => {
    setCurrentStaff(null);
    sessionStorage.removeItem('currentStaff_pos');
  };

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
            // Try Auth0 user's merchant_ids
            const merchantIds = user?.['https://fesi.app/merchant_ids'];
            if (merchantIds && merchantIds.length > 0) {
              merchantId = merchantIds[0];
            } else {
              // For real Auth0 tokens, get merchant data from /me endpoint
              const merchantData = await api.get('/api/merchants/me');
              merchantId = merchantData.id;
            }
        }

        // Fetch only active events where this merchant is participating
        const eventsData = await api.get(`/api/events?merchant_id=${merchantId}&is_open=true`);
        
        if (!eventsData || eventsData.length === 0) {
          setNoEventsError(true);
          setLoadingError('No active events found. Please create an event to use the POS.');
          return;
        }
        
        setEvents(eventsData);
        // Auto-select first event
        if (eventsData.length > 0) {
          setSelectedEvent(eventsData[0].id);
        }

        const menuData = await api.get(`/api/menu/merchant/${merchantId}?includeOptionGroups=true`);
        
        console.log('Menu data received:', menuData);
        
        // Extract all items from all categories
        if (menuData.data?.menu && Array.isArray(menuData.data.menu)) {
            const allItems: MenuItem[] = [];
            
            // Flatten items from all categories with their option groups
            for (const category of menuData.data.menu) {
              if (category.items && Array.isArray(category.items)) {
                for (const item of category.items) {
                  console.log(`Item: ${item.title}, has_options: ${item.has_options}, option_groups:`, item.option_groups);
                  allItems.push({
                      id: item.id,
                      title: item.title,
                      base_price: item.base_price,
                      category_name: category.name,
                      description: item.description,
                      image_url: item.image_url,
                      option_groups: item.option_groups || [],
                  });
                }
              }
            }
          console.log('All items with options:', allItems.filter(i => i.option_groups && i.option_groups.length > 0));
          setMenuItems(allItems);
        } else {
          console.error('Unexpected menu data structure:', menuData);
          setMenuItems([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoadingError('Failed to load POS data. Please try again.');
      }
    };

    fetchData();
  }, [user, getAccessTokenSilently]);

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
    console.log('Menu item clicked:', item.title, 'option_groups:', item.option_groups);
    // Check if item has option groups
    if (item.option_groups && item.option_groups.length > 0) {
      // Item has options - show modal
      console.log('Opening modal for item with options');
      setSelectedMenuItem(item);
      setSelectedOptions({});
    } else {
      // No options - add directly to cart
      console.log('Adding item directly to cart (no options)');
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
        // Try Auth0 user's merchant_ids
        const merchantIds = user?.['https://fesi.app/merchant_ids'];
        if (merchantIds && merchantIds.length > 0) {
          merchantId = merchantIds[0];
        } else {
          const merchantData = await api.get('/api/merchants/me');
          merchantId = merchantData.id;
        }
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
        staff_id: currentStaff?.id || undefined,
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
        // Try Auth0 user's merchant_ids
        const merchantIds = user?.['https://fesi.app/merchant_ids'];
        if (merchantIds && merchantIds.length > 0) {
          merchantId = merchantIds[0];
        } else {
          const merchantData = await api.get('/api/merchants/me');
          merchantId = merchantData.id;
        }
      }
      
      // Create order with payment_status = 'pending'
      const result = await api.post(`/api/orders/merchant/${merchantId}/pos`, {
        guest_info: {
          email: customerEmail?.trim() || `walkin-${Date.now()}@pos.local`,
          first_name: customerName?.trim() || 'Walk-in',
          last_name: 'Customer',
          phone: customerPhone?.trim() || null,
        },
        staff_id: currentStaff?.id || undefined,
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
      try {
        const checkoutResult = await api.post('/api/pos-payments/create-checkout', {
          order_id: order.id,
          merchant_id: merchantId
        });
        
        setCheckoutUrl(checkoutResult.checkout_url);
        setShowPaymentQR(true);
      } catch (checkoutError) {
        // Stripe checkout failed - mark order as cancelled
        console.error('Stripe checkout failed, cancelling order:', checkoutError);
        try {
          await api.put(`/api/orders/${order.id}/status`, {
            status: 'cancelled',
            notes: 'Payment session creation failed'
          });
        } catch (cancelError) {
          console.error('Failed to cancel order after Stripe error:', cancelError);
        }
        throw new Error('Failed to create payment session. Please try again.');
      }
      
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

  // Show PIN login if staff login is required and no staff logged in
  if (merchantData && merchantData.require_staff_login && !currentStaff) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <StaffPinLogin
          merchantId={merchantData.id}
          onSuccess={handleStaffLogin}
          title="POS Login"
          subtitle="Enter your PIN to access point of sale"
        />
      </ProtectedRoute>
    );
  }

  // Show error state if there's a loading error
  if (loadingError) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div className={styles.pos}>
          <div className={styles.pos__header}>
            <Link href="/merchant/admin" className={styles.pos__backLink}>
              ← Back to Dashboard
            </Link>
            <Typography variant="heading-2">Point of Sale</Typography>
          </div>
          <div className={styles.pos__errorContainer}>
            <Typography variant="heading-3" style={{ marginBottom: '1rem' }}>
              Unable to Load POS
            </Typography>
            <Typography variant="body-medium" style={{ marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>
              {loadingError}
            </Typography>
            {noEventsError && (
              <Link href="/merchant/admin/events">
                <Button>Manage Events</Button>
              </Link>
            )}
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <div className={styles.pos}>
        <div className={styles.pos__header}>
          <div>
            <Link href="/merchant/admin" className={styles.pos__backLink}>
              ← Back to Dashboard
            </Link>
            <Typography variant="heading-2">Point of Sale</Typography>
            <Typography variant="body-large" style={{ color: 'var(--color-text-secondary)' }}>
              Take orders directly at the counter
            </Typography>
          </div>
          
          {currentStaff && (
            <div className={styles.pos__staffInfo}>
              <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                Logged in as: <strong>{currentStaff.name}</strong> ({currentStaff.role})
              </Typography>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStaffLogout}
              >
                Switch Staff
              </Button>
            </div>
          )}
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
