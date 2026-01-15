'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNotification } from '@/contexts/NotificationContext';
import { api } from '@/utils/api';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { MenuItemOptionsModal, type MenuItem as ModalMenuItem, type OptionGroup } from '@/components/organisms';
import type {
  TableServiceTemplateProps,
  TableSession,
  CartItem,
  CartItemCustomization
} from './TableServiceTemplate.types';
import styles from './TableServiceTemplate.module.scss';

// Extend MenuItem to include fields needed for filtering
interface ExtendedMenuItem extends ModalMenuItem {
  is_active: boolean;
  has_options?: boolean;
}

export function TableServiceTemplate({
  merchantId,
  currentStaff,
  onStaffLogout,
  showBackLink = true,
  backLinkUrl = '/merchant/admin'
}: TableServiceTemplateProps) {
  const { showSuccess, showError, showWarning, confirm } = useNotification();
  const [loading, setLoading] = useState(true);
  const [activeTables, setActiveTables] = useState<TableSession[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableSession | null>(null);
  const [menuItems, setMenuItems] = useState<ExtendedMenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMenuItem, setSelectedMenuItem] = useState<ExtendedMenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [itemNotes, setItemNotes] = useState<string>('');
  const [showPayBillModal, setShowPayBillModal] = useState(false);
  const [tableOrders, setTableOrders] = useState<any[]>([]);
  const [customerEmail, setCustomerEmail] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [merchant, setMerchant] = useState<any>(null);

  useEffect(() => {
    if (merchantId) {
      loadMerchantData();
      loadActiveTables();
      loadMenuItems();
    }
  }, [merchantId]);

  const loadMerchantData = async () => {
    try {
      const response = await api.get(`/api/merchants/${merchantId}`);
      setMerchant(response.data);
    } catch (error) {
      console.error('Error loading merchant data:', error);
    }
  };

  const loadActiveTables = async () => {
    if (!merchantId) return;
    
    try {
      const response = await api.get(`/api/tables/merchant/${merchantId}/sessions?status=active`);
      setActiveTables(response.sessions || []);
    } catch (error) {
      console.error('Error loading active tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMenuItems = async () => {
    if (!merchantId) return;
    
    try {
      const response = await api.get(`/api/menu/merchant/${merchantId}/admin`);
      
      const allItems: ExtendedMenuItem[] = [];
      if (response.data?.menu) {
        for (const category of response.data.menu) {
          if (category.items && Array.isArray(category.items)) {
            for (const item of category.items) {
              try {
                const itemDetail = await api.get(`/api/menu/${item.id}`);
                allItems.push({
                  id: itemDetail.id,
                  title: itemDetail.title,
                  base_price: itemDetail.base_price,
                  category_name: category.name,
                  description: itemDetail.description,
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

  const addToCart = (item: ExtendedMenuItem) => {
    if (item.has_options && item.option_groups && item.option_groups.length > 0) {
      setSelectedMenuItem(item);
      setSelectedOptions({});
      setItemNotes('');
    } else {
      addDirectlyToCart(item);
    }
  };

  const addDirectlyToCart = (item: ExtendedMenuItem, notes?: string) => {
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

    for (const group of selectedMenuItem.option_groups || []) {
      if (group.is_required && (!selectedOptions[group.id] || selectedOptions[group.id].length === 0)) {
        showWarning(`Please select ${group.name}`);
        return;
      }
    }

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
    if (!selectedTable || cart.length === 0 || !merchantId) return;

    try {
      setLoading(true);

      const orderData = {
        merchant_id: merchantId,
        event_id: merchant?.permanent_event_id,
        order_source: 'pos',
        payment_timing: 'postpaid',
        payment_status: 'pending',
        table_session_id: selectedTable.id,
        table_number: selectedTable.table_number,
        staff_id: currentStaff?.id || undefined,
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

      setCart([]);
      setSelectedTable(null);
      await loadActiveTables();
      
      showSuccess('Order submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting order:', error);
      showError(error.response?.data?.error || 'Failed to submit order');
    } finally {
      setLoading(false);
    }
  };

  const fetchTableOrders = async (tableSessionId: string) => {
    if (!merchantId) return;
    
    try {
      const response = await api.get(`/api/orders/merchant/${merchantId}/active`);
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
      for (const order of tableOrders) {
        await api.patch(`/api/orders/${order.id}`, {
          payment_status: 'paid'
        });
      }
      
      await api.patch(`/api/tables/${selectedTable.table_id}/sessions/${selectedTable.id}`, {
        payment_status: 'paid'
      });
      
      if (customerEmail) {
        await api.post('/api/receipts/send', {
          email: customerEmail,
          order_ids: tableOrders.map(o => o.id),
          table_number: selectedTable.table_number
        });
      }
      
      showSuccess('Payment processed successfully!');
      setShowPayBillModal(false);
      setCustomerEmail('');
      setSelectedTable(null);
      await loadActiveTables();
    } catch (error: any) {
      console.error('Error processing payment:', error);
      showError(error.response?.data?.error || 'Failed to process payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleEndSession = async () => {
    if (!selectedTable) return;
    
    const confirmed = await confirm({
      title: 'End Table Session',
      message: `Are you sure you want to end the session for Table ${selectedTable.table_number}? This will close the table and mark it as available.`,
      confirmText: 'End Session',
      variant: 'warning'
    });
    
    if (!confirmed) return;
    
    setLoading(true);
    try {
      await api.post(`/api/tables/${selectedTable.table_id}/sessions/${selectedTable.id}/end`);
      
      showSuccess(`Session ended for Table ${selectedTable.table_number}`);
      setSelectedTable(null);
      setCart([]);
      await loadActiveTables();
    } catch (error: any) {
      console.error('Error ending session:', error);
      showError(error.response?.data?.error || 'Failed to end session');
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.total_price, 0);
  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category_name).filter((name): name is string => !!name)))];
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category_name === selectedCategory;
    return matchesSearch && matchesCategory && item.is_active;
  });

  if (merchant && merchant.operating_mode !== 'static') {
    return (
      <div className={styles.tableService__disabled}>
        <Typography variant="heading-2">Table Service Not Available</Typography>
        <Typography variant="body-large">
          Table service is only available for static (restaurant) locations.
        </Typography>
      </div>
    );
  }

  return (
    <div className={styles.tableService}>
      <div className={styles.tableService__header}>
        <div>
          {showBackLink && (
            <Link href={backLinkUrl} className={styles.backLink}>
              ← Back to Dashboard
            </Link>
          )}
          <Typography variant="heading-2">Table Service</Typography>
          <Typography variant="body-medium" className={styles.tableService__subtitle}>
            Take orders for dine-in customers
          </Typography>
        </div>
        
        {currentStaff && onStaffLogout && (
          <div className={styles.staffInfo}>
            <Typography variant="body-small">
              Logged in as: <strong>{currentStaff.name}</strong> ({currentStaff.role})
            </Typography>
            <Button
              variant="outline"
              size="sm"
              onClick={onStaffLogout}
            >
              Switch Staff
            </Button>
          </div>
        )}
      </div>

      <div className={styles.tableService__content}>
        {/* Table Selection */}
        <div className={styles.tableService__section}>
          <Typography variant="heading-4">Select Table</Typography>
          
          {activeTables.length === 0 ? (
            <div className={styles.emptyState}>
              <Typography variant="body-medium">
                No active tables. Seat customers from the Table Management page.
              </Typography>
            </div>
          ) : (
            <div className={styles.tableGrid}>
              {activeTables.map((table) => (
                <button
                  key={table.id}
                  className={`${styles.tableCard} ${selectedTable?.id === table.id ? styles.selected : ''}`}
                  onClick={() => setSelectedTable(table)}
                >
                  <div className={styles.tableCard__number}>Table {table.table_number}</div>
                  <div className={styles.tableCard__info}>
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
            <div className={styles.tableService__section}>
              <div className={styles.actionButtons}>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handlePayBill}
                >
                  💳 Pay Bill
                </Button>
                <Button
                  variant="danger"
                  size="lg"
                  onClick={handleEndSession}
                >
                  ✕ End Session
                </Button>
              </div>
            </div>

            {/* Menu Items */}
            <div className={styles.tableService__section}>
              <Typography variant="heading-4">Add Items</Typography>
              
              <div className={styles.menuFilters}>
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                
                <div className={styles.categoryFilters}>
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`${styles.categoryBtn} ${selectedCategory === category ? styles.active : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === 'all' ? 'All' : category}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.menuItemsGrid}>
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    className={styles.menuItemCard}
                    onClick={() => addToCart(item)}
                  >
                    <div className={styles.menuItemCard__name}>{item.title}</div>
                    <div className={styles.menuItemCard__price}>£{(item.base_price / 100).toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cart */}
            <div className={styles.tableService__section}>
              <Typography variant="heading-4">Current Order - Table {selectedTable.table_number}</Typography>
              
              {cart.length === 0 ? (
                <div className={styles.emptyState}>
                  <Typography variant="body-medium">No items added yet</Typography>
                </div>
              ) : (
                <>
                  <div className={styles.cartItems}>
                    {cart.map((item, index) => (
                      <div key={`${item.menu_item_id}-${index}`} className={styles.cartItem}>
                        <div className={styles.cartItem__info}>
                          <span className={styles.cartItem__name}>{item.title}</span>
                          {item.customizations && item.customizations.length > 0 && (
                            <div className={styles.cartItem__customizations}>
                              {item.customizations.map((custom, idx) => (
                                <span key={idx} className={styles.customization}>
                                  + {custom.sub_item_name}
                                  {custom.price_modifier > 0 && ` (£${(custom.price_modifier / 100).toFixed(2)})`}
                                </span>
                              ))}
                            </div>
                          )}
                          {item.notes && (
                            <div className={styles.cartItem__notes}>
                              Note: {item.notes}
                            </div>
                          )}
                          <span className={styles.cartItem__price}>£{(item.unit_price / 100).toFixed(2)}</span>
                        </div>
                        <div className={styles.cartItem__controls}>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                          >
                            −
                          </button>
                          <span className={styles.qtyDisplay}>{item.quantity}</span>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                          >
                            +
                          </button>
                          <span className={styles.cartItem__total}>£{(item.total_price / 100).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.cartSummary}>
                    <div className={styles.cartTotal}>
                      <Typography variant="heading-5">Total</Typography>
                      <Typography variant="heading-4">£{(cartTotal / 100).toFixed(2)}</Typography>
                    </div>
                    
                    <div className={styles.cartActions}>
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
        <div className={styles.modalOverlay} onClick={() => setShowPayBillModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <Typography variant="heading-4">Table {selectedTable.table_number} - Bill</Typography>
              <button className={styles.modalClose} onClick={() => setShowPayBillModal(false)}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              {tableOrders.length === 0 ? (
                <Typography variant="body-medium">No orders found for this table.</Typography>
              ) : (
                <>
                  <div className={styles.billOrders}>
                    {tableOrders.map((order) => (
                      <div key={order.id} className={styles.billOrder}>
                        <Typography variant="body-small" className={styles.billOrder__header}>
                          Order #{order.order_number} - {new Date(order.created_at).toLocaleTimeString()}
                        </Typography>
                        {order.items.map((item: any) => (
                          <div key={item.id} className={styles.billItem}>
                            <span>{item.quantity}x {item.menu_item_title}</span>
                            <span>£{(item.total_price / 100).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  
                  <div className={styles.billTotal}>
                    <Typography variant="heading-4">Total</Typography>
                    <Typography variant="heading-4">
                      £{(tableOrders.reduce((sum, order) => sum + order.total_amount, 0) / 100).toFixed(2)}
                    </Typography>
                  </div>
                  
                  <div className={styles.billEmail}>
                    <Typography variant="body-medium" className={styles.billEmail__label}>
                      Email for receipt (optional)
                    </Typography>
                    <input
                      type="email"
                      placeholder="customer@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className={styles.emailInput}
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className={styles.modalFooter}>
              <Button
                variant="secondary"
                onClick={() => setShowPayBillModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
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
  );
}
