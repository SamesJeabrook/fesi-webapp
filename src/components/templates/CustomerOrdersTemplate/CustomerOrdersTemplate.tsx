"use client";

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button } from '@/components/atoms';
import { CustomerNavigation } from '@/components/molecules/CustomerNavigation';
import { getAuthToken } from '@/utils/devAuth';
import {
  CustomerOrdersTemplateProps,
  Order,
  OrderStatus,
  OrderStatusConfig
} from './CustomerOrdersTemplate.types';
import styles from './CustomerOrdersTemplate.module.scss';

const statusConfig: Record<OrderStatus, OrderStatusConfig> = {
  pending: { label: 'Pending', color: '#e65100', icon: '⏳' },
  accepted: { label: 'Accepted', color: '#1565c0', icon: '✅' },
  preparing: { label: 'Preparing', color: '#6a1b9a', icon: '👨‍🍳' },
  ready: { label: 'Ready', color: '#00695c', icon: '🔔' },
  complete: { label: 'Complete', color: '#2e7d32', icon: '✔️' },
  cancelled: { label: 'Cancelled', color: '#c62828', icon: '❌' },
  rejected: { label: 'Rejected', color: '#c62828', icon: '🚫' }
};

const filterOptions: Array<{ value: OrderStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'complete', label: 'Complete' },
];

export function CustomerOrdersTemplate({
  customerId,
  pageTitle = 'My Orders',
  showNavigation = true
}: CustomerOrdersTemplateProps) {
  const { getAccessTokenSilently, user, loginWithRedirect, logout } = useAuth0();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    ensureCustomerProfileExists();
  }, [user]);

  const ensureCustomerProfileExists = async () => {
    try {
      const token = await getAuthToken(getAccessTokenSilently);
      
      console.log('👤 Ensuring customer profile exists for:', user?.sub);
      
      // Call GET /me which auto-creates profile if it doesn't exist
      const profileResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customers/me`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('✅ Customer profile ready:', profileData.data?.id);
        
        // Now load orders
        await loadOrders();
      } else {
        const errorText = await profileResponse.text();
        console.error('❌ Failed to get/create customer profile:', errorText);
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Error ensuring customer profile:', error);
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const token = await getAuthToken(getAccessTokenSilently);

      console.log('📦 Loading orders for user:', user?.sub);

      // Use /me/orders endpoint which gets orders for the logged-in user
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customers/me/orders`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Orders response:', data);
        
        // API returns { success: true, data: [...] }
        const orderData = data.success ? data.data : data;
        setOrders(Array.isArray(orderData) ? orderData : []);
        console.log('Loaded orders:', orderData?.length || 0);
      } else {
        const errorText = await response.text();
        console.error('Failed to load orders:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    loginWithRedirect({
      appState: { returnTo: '/vendors/orders' }
    });
  };

  const handleLogoutClick = () => {
    sessionStorage.setItem('postLogoutRedirect', '/customer/login');
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const filteredOrders = selectedFilter === 'all'
    ? orders
    : orders.filter(order => order.status === selectedFilter);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.customerOrders}>
      {showNavigation && (
        <CustomerNavigation
          user={user ? { id: user.sub || '', name: user.name, email: user.email || '' } : null}
          onLoginClick={handleLoginClick}
          onLogoutClick={handleLogoutClick}
        />
      )}

      <div className={styles.customerOrders__container}>
        {/* Header */}
        <div className={styles.customerOrders__header}>
          <Typography variant="heading-2" as="h1" className={styles.customerOrders__title}>
            {pageTitle}
          </Typography>
          <Typography variant="body-medium" className={styles.customerOrders__description}>
            Track and manage your orders
          </Typography>
        </div>

        {/* Filters */}
        <div className={styles.customerOrders__filters}>
          {filterOptions.map((option) => (
            <button
              key={option.value}
              className={`${styles.customerOrders__filterButton} ${
                selectedFilter === option.value ? styles['customerOrders__filterButton--active'] : ''
              }`}
              onClick={() => setSelectedFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={styles.customerOrders__content}>
          {loading ? (
            <div className={styles.customerOrders__loading}>
              <Typography variant="body-medium">Loading your orders...</Typography>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className={styles.customerOrders__empty}>
              <div className={styles.customerOrders__emptyIcon}>📦</div>
              <Typography variant="heading-4" className={styles.customerOrders__emptyTitle}>
                No orders found
              </Typography>
              <Typography variant="body-medium" className={styles.customerOrders__emptyDescription}>
                {selectedFilter === 'all'
                  ? "You haven't placed any orders yet. Start exploring events!"
                  : `No ${selectedFilter} orders found.`}
              </Typography>
              <Button variant="primary" onClick={() => window.location.href = '/vendors'}>
                Browse Events
              </Button>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                {/* Header */}
                <div className={styles.orderCard__header}>
                  <div className={styles.orderCard__info}>
                    <div className={styles.orderCard__number}>
                      Order #{order.order_number}
                    </div>
                    <div className={styles.orderCard__meta}>
                      <span>📅 {formatDate(order.created_at)}</span>
                      {order.event_name && <span>🎪 {order.event_name}</span>}
                      {order.merchant_name && <span>🏪 {order.merchant_name}</span>}
                    </div>
                  </div>
                  <div
                    className={`${styles.orderCard__status} ${
                      styles[`orderCard__status--${order.status}`]
                    }`}
                  >
                    <span>{statusConfig[order.status].icon}</span>
                    <span>{statusConfig[order.status].label}</span>
                  </div>
                </div>

                {/* Items */}
                <div className={styles.orderCard__items}>
                  {order.items.map((item) => (
                    <div key={item.id} className={styles.orderCard__item}>
                      <div className={styles.orderCard__itemDetails}>
                        <div className={styles.orderCard__itemName}>
                          {item.menu_item_name}
                        </div>
                        <div className={styles.orderCard__itemQuantity}>
                          Quantity: {item.quantity}
                        </div>
                        {item.options && item.options.length > 0 && (
                          <div className={styles.orderCard__itemOptions}>
                            {item.options.map((option, idx) => (
                              <span key={idx} className={styles.orderCard__itemOption}>
                                + {option.option_name}
                                {option.price_adjustment > 0 && ` (+${formatCurrency(option.price_adjustment)})`}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className={styles.orderCard__itemPrice}>
                        {formatCurrency(item.total_price)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className={styles.orderCard__footer}>
                  <div className={styles.orderCard__total}>
                    <span className={styles.orderCard__totalLabel}>Total</span>
                    <span className={styles.orderCard__totalAmount}>
                      {formatCurrency(order.total_amount)}
                    </span>
                  </div>
                  <div className={styles.orderCard__actions}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {order.status === 'complete' && (
                      <Button variant="primary" size="sm">
                        Reorder
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
