'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMerchant } from '@/hooks/useMerchant';
import { api } from '@/utils/api';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { MenuItemOptionsModal, type OptionGroup, type SubItem } from '@/components/organisms';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import './table-service.scss';

interface TableSession {
  id: string;
  table_id: string;
  table_number: string;
  guest_count: number;
  seated_at: string;
  status: string;
  total_amount: number;
  payment_status: string;
}

interface MenuItem {
  id: string;
  title: string;
  base_price: number;
  category_name: string;
  is_active: boolean;
  description?: string;
  has_options?: boolean;
  option_groups?: OptionGroup[];
}

interface CartItemCustomization {
  sub_item_id: string;
  sub_item_name: string;
  price_modifier: number;
  quantity: number;
}

interface CartItem {
  menu_item_id: string;
  title: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  customizations: CartItemCustomization[];
  notes?: string;
}

export default function TableServicePage() {
  const { merchant } = useMerchant();
  const [loading, setLoading] = useState(true);
  const [activeTables, setActiveTables] = useState<TableSession[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableSession | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [itemNotes, setItemNotes] = useState<string>('');
  const [showPayBillModal, setShowPayBillModal] = useState(false);
  const [tableOrders, setTableOrders] = useState<any[]>([]);
  const [customerEmail, setCustomerEmail] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (merchant?.id) {
      loadActiveTables();
      loadMenuItems();
    }
  }, [merchant?.id]);

  const loadActiveTables = async () => {
    if (!merchant?.id) return;
    
    try {
      const response = await api.get(`/api/tables/merchant/${merchant.id}/sessions?status=active`);
      setActiveTables(response.sessions || []);
    } catch (error) {
      console.error('Error loading active tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMenuItems = async () => {
    if (!merchant?.id) return;
    
    try {
      const response = await api.get(`/api/menu/merchant/${merchant.id}/admin`);
      
      // Flatten the nested category structure and fetch full details for each item
      const allItems: MenuItem[] = [];
      if (response.data?.menu) {
        for (const category of response.data.menu) {
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
                  is_active: itemDetail.is_active,
                  has_options: !!(itemDetail.option_groups && itemDetail.option_groups.length > 0),
                  option_groups: itemDetail.option_groups || [],
                });
              } catch (err) {
                console.error(`Failed to fetch details for item ${item.id}:`, err);
              }
            }
          }
        }
      }
      
      setMenuItems(allItems);
    } catch (error) {
      console.error('Error loading menu items:', error);
    }
  };

  const addToCart = (item: MenuItem) => {
    // Check if item has options/customizations
    if (item.has_options && item.option_groups && item.option_groups.length > 0) {
      // Show modal for customization
      setSelectedMenuItem(item);
      setSelectedOptions({});
      setItemNotes('');
    } else {
      // No options - add directly to cart
      addDirectlyToCart(item);
    }
  };

  const addDirectlyToCart = (item: MenuItem, notes?: string) => {
    const existingItem = cart.find(
      cartItem => 
        cartItem.menu_item_id === item.id && 
        cartItem.customizations.length === 0 &&
        cartItem.notes === notes
    );
    
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem === existingItem
          ? {
              ...cartItem,
              quantity: cartItem.quantity + 1,
              total_price: (cartItem.quantity + 1) * cartItem.unit_price
            }
          : cartItem
      ));
    } else {
      setCart([...cart, {
        menu_item_id: item.id,
        title: item.title,
        quantity: 1,
        unit_price: item.base_price,
        total_price: item.base_price,
        customizations: [],
        notes
      }]);
    }
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

    const itemTotal = selectedMenuItem.base_price + totalModifier;

    setCart([...cart, {
      menu_item_id: selectedMenuItem.id,
      title: selectedMenuItem.title,
      quantity: 1,
      unit_price: itemTotal,
      total_price: itemTotal,
      customizations,
      notes: itemNotes || undefined
    }]);

    setSelectedMenuItem(null);
    setSelectedOptions({});
    setItemNotes('');
  };

  const handleOptionSelect = (groupId: string, subItemId: string, selectionType: 'single' | 'multiple', maxSelections: number | null) => {
    setSelectedOptions(prev => {
      const currentSelections = prev[groupId] || [];

      if (selectionType === 'single') {
        return { ...prev, [groupId]: [subItemId] };
      } else {
        // Multiple selection
        if (currentSelections.includes(subItemId)) {
          return { ...prev, [groupId]: currentSelections.filter(id => id !== subItemId) };
        } else {
          if (maxSelections && currentSelections.length >= maxSelections) {
            return prev;
          }
          return { ...prev, [groupId]: [...currentSelections, subItemId] };
        }
      }
    });
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((_, i) => i !== index));
    } else {
      setCart(cart.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity,
              total_price: quantity * item.unit_price
            }
          : item
      ));
    }
  };

  const submitOrder = async () => {
    if (!selectedTable || cart.length === 0 || !merchant?.id) return;

    try {
      setLoading(true);

      // Create the order with postpaid payment timing
      const orderData = {
        merchant_id: merchant.id,
        event_id: merchant.permanent_event_id, // Use permanent event for static merchants
        order_source: 'pos', // Use 'pos' as it's the closest match for in-person ordering
        payment_timing: 'postpaid',
        payment_status: 'pending',
        table_session_id: selectedTable.id,
        table_number: selectedTable.table_number,
        guest_info: {
          email: `table${selectedTable.table_number}-${Date.now()}@dine-in.local`,
          first_name: 'Dine-In',
          last_name: 'Guest',
        },
        items: cart.map(item => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          customizations: item.customizations
        }))
      };

      await api.post('/api/orders', orderData);

      // Clear cart and reload tables
      setCart([]);
      setSelectedTable(null);
      await loadActiveTables();
      
      alert('Order submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting order:', error);
      alert(error.response?.data?.error || 'Failed to submit order');
    } finally {
      setLoading(false);
    }
  };

  const fetchTableOrders = async (tableSessionId: string) => {
    if (!merchant?.id) return;
    
    try {
      const response = await api.get(`/api/orders/merchant/${merchant.id}/active`);
      // Filter orders by table_session_id on client side
      const allOrders = response.data || [];
      const filteredOrders = allOrders.filter((order: any) => order.table_session_id === tableSessionId);
      setTableOrders(filteredOrders);
    } catch (error) {
      console.error('Error fetching table orders:', error);
    }
  };

  const handlePayBill = async () => {
    if (!selectedTable) return;
    
    await fetchTableOrders(selectedTable.id);
    setShowPayBillModal(true);
  };

  const processBillPayment = async () => {
    if (!selectedTable || tableOrders.length === 0) return;
    
    setProcessingPayment(true);
    try {
      // Mark all orders as paid
      for (const order of tableOrders) {
        await api.patch(`/api/orders/${order.id}`, {
          payment_status: 'paid'
        });
      }
      
      // Update table session to paid
      await api.patch(`/api/tables/${selectedTable.table_id}/sessions/${selectedTable.id}`, {
        payment_status: 'paid'
      });
      
      // Send receipt if email provided
      if (customerEmail) {
        await api.post('/api/receipts/send', {
          email: customerEmail,
          order_ids: tableOrders.map(o => o.id),
          table_number: selectedTable.table_number
        });
      }
      
      alert('Payment processed successfully!');
      setShowPayBillModal(false);
      setCustomerEmail('');
      setSelectedTable(null);
      await loadActiveTables();
    } catch (error: any) {
      console.error('Error processing payment:', error);
      alert(error.response?.data?.error || 'Failed to process payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.total_price, 0);

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category_name)))];
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category_name === selectedCategory;
    return matchesSearch && matchesCategory && item.is_active;
  });

  if (!merchant) {
    return <div className="loading">Loading merchant data...</div>;
  }

  if (merchant.operating_mode !== 'static') {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div className="table-service-disabled">
          <Typography variant="heading-2">Table Service Not Available</Typography>
          <Typography variant="body-large">
            Table service is only available for static (restaurant) locations.
          </Typography>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <div className="table-service">
        <div className="table-service__header">
          <div>
            <Link href="/merchant/admin" className="back-link">
              ← Back to Dashboard
            </Link>
            <Typography variant="heading-2">Table Service</Typography>
            <Typography variant="body-medium" style={{ color: 'var(--color-neutral-600)', marginTop: '0.5rem' }}>
              Take orders for dine-in customers
            </Typography>
          </div>
        </div>

        <div className="table-service__content">
          {/* Table Selection */}
          <div className="table-service__section">
            <Typography variant="heading-4">Select Table</Typography>
            
            {activeTables.length === 0 ? (
              <div className="empty-state">
                <Typography variant="body-medium">
                  No active tables. Seat customers from the <Link href="/merchant/admin/tables">Table Management</Link> page.
                </Typography>
              </div>
            ) : (
              <div className="table-grid">
                {activeTables.map((table) => (
                  <button
                    key={table.id}
                    className={`table-card ${selectedTable?.id === table.id ? 'selected' : ''}`}
                    onClick={() => setSelectedTable(table)}
                  >
                    <div className="table-card__number">Table {table.table_number}</div>
                    <div className="table-card__info">
                      <span>👥 {table.guest_count} guests</span>
                      <span>{table.payment_status === 'paid' ? '✓ Paid' : '⏳ Pending'}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedTable && (
            <>
              {/* Action Buttons */}
              <div className="table-service__section">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <Button
                    variant="success"
                    size="lg"
                    onClick={handlePayBill}
                  >
                    💳 Pay Bill
                  </Button>
                </div>
              </div>

              {/* Menu Items */}
              <div className="table-service__section">
                <Typography variant="heading-4">Add Items</Typography>
                
                <div className="menu-filters">
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  
                  <div className="category-filters">
                    {categories.map(category => (
                      <button
                        key={category}
                        className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category === 'all' ? 'All' : category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="menu-items-grid">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      className="menu-item-card"
                      onClick={() => addToCart(item)}
                    >
                      <div className="menu-item-card__name">{item.title}</div>
                      <div className="menu-item-card__price">£{(item.base_price / 100).toFixed(2)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cart */}
              <div className="table-service__section">
                <Typography variant="heading-4">Current Order - Table {selectedTable.table_number}</Typography>
                
                {cart.length === 0 ? (
                  <div className="empty-state">
                    <Typography variant="body-medium">No items added yet</Typography>
                  </div>
                ) : (
                  <>
                    <div className="cart-items">
                      {cart.map((item, index) => (
                        <div key={`${item.menu_item_id}-${index}`} className="cart-item">
                          <div className="cart-item__info">
                            <span className="cart-item__name">{item.title}</span>
                            {item.customizations && item.customizations.length > 0 && (
                              <div className="cart-item__customizations">
                                {item.customizations.map((custom, idx) => (
                                  <span key={idx} className="customization">
                                    + {custom.sub_item_name}
                                    {custom.price_modifier > 0 && ` (£${(custom.price_modifier / 100).toFixed(2)})`}
                                  </span>
                                ))}
                              </div>
                            )}
                            {item.notes && (
                              <div className="cart-item__notes">
                                Note: {item.notes}
                              </div>
                            )}
                            <span className="cart-item__price">£{(item.unit_price / 100).toFixed(2)}</span>
                          </div>
                          <div className="cart-item__controls">
                            <button
                              className="qty-btn"
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                            >
                              −
                            </button>
                            <span className="qty-display">{item.quantity}</span>
                            <button
                              className="qty-btn"
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                            >
                              +
                            </button>
                            <span className="cart-item__total">£{(item.total_price / 100).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="cart-summary">
                      <div className="cart-total">
                        <Typography variant="heading-5">Total</Typography>
                        <Typography variant="heading-4">£{(cartTotal / 100).toFixed(2)}</Typography>
                      </div>
                      
                      <div className="cart-actions">
                        <Button
                          variant="secondary"
                          size="lg"
                          onClick={() => setCart([])}
                        >
                          Clear Order
                        </Button>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={submitOrder}
                          isDisabled={loading}
                        >
                          {loading ? 'Submitting...' : 'Send to Kitchen'}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Customization Modal */}
        {selectedMenuItem && (
          <MenuItemOptionsModal
            isOpen={!!selectedMenuItem}
            onClose={() => {
              setSelectedMenuItem(null);
              setSelectedOptions({});
              setItemNotes('');
            }}
            menuItem={selectedMenuItem}
            selectedOptions={selectedOptions}
            onOptionSelect={handleOptionSelect}
            onAddToCart={addToCartWithOptions}
            notes={itemNotes}
            onNotesChange={setItemNotes}
          />
        )}

        {/* Pay Bill Modal */}
        {showPayBillModal && selectedTable && (
          <div className="modal-overlay" onClick={() => setShowPayBillModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <Typography variant="heading-4">Table {selectedTable.table_number} - Bill</Typography>
                <button className="modal-close" onClick={() => setShowPayBillModal(false)}>×</button>
              </div>
              
              <div className="modal-body">
                {tableOrders.length === 0 ? (
                  <Typography variant="body-medium">No orders found for this table.</Typography>
                ) : (
                  <>
                    <div className="bill-orders">
                      {tableOrders.map((order) => (
                        <div key={order.id} className="bill-order">
                          <Typography variant="body-small" style={{ color: 'var(--color-neutral-600)' }}>
                            Order #{order.order_number} - {new Date(order.created_at).toLocaleTimeString()}
                          </Typography>
                          {order.items.map((item: any) => (
                            <div key={item.id} className="bill-item">
                              <span>{item.quantity}x {item.menu_item_title}</span>
                              <span>£{(item.total_price / 100).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    
                    <div className="bill-total">
                      <Typography variant="heading-4">Total</Typography>
                      <Typography variant="heading-4">
                        £{(tableOrders.reduce((sum, order) => sum + order.total_amount, 0) / 100).toFixed(2)}
                      </Typography>
                    </div>
                    
                    <div className="bill-email">
                      <Typography variant="body-medium" style={{ marginBottom: '0.5rem' }}>
                        Email for receipt (optional)
                      </Typography>
                      <input
                        type="email"
                        placeholder="customer@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="email-input"
                      />
                    </div>
                  </>
                )}
              </div>
              
              <div className="modal-footer">
                <Button
                  variant="secondary"
                  onClick={() => setShowPayBillModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="success"
                  onClick={processBillPayment}
                  isDisabled={processingPayment || tableOrders.length === 0}
                >
                  {processingPayment ? 'Processing...' : 'Complete Payment'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
