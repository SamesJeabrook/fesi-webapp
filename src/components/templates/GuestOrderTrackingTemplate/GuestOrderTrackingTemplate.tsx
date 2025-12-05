"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Typography, Button, Input } from '@/components/atoms';
import { CustomerNavigationWrapper } from '@/components/molecules/CustomerNavigation';
import styles from './GuestOrderTrackingTemplate.module.scss';

interface OrderDetails {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  accepted_at?: string;
  preparing_at?: string;
  ready_at?: string;
  completed_at?: string;
  items: Array<{
    menu_item_title: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    customizations?: Array<{
      sub_item_name: string;
      quantity: number;
    }>;
  }>;
  merchant_name: string;
  event_start: string;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: '📋' },
  { key: 'accepted', label: 'Accepted', icon: '✅' },
  { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
  { key: 'ready', label: 'Ready', icon: '🔔' },
  { key: 'complete', label: 'Completed', icon: '✔️' },
];

export function GuestOrderTrackingTemplate() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams?.get('number') || '');
  const [email, setEmail] = useState(searchParams?.get('email') || '');
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Auto-search if both params are present
    if (searchParams?.get('number') && searchParams?.get('email')) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    if (!orderNumber || !email) {
      setError('Please enter both order number and email');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setOrder(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/lookup/${orderNumber}/${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found. Please check your order number and email.');
        }
        throw new Error('Failed to load order');
      }

      const data = await response.json();
      setOrder(data);
    } catch (err: any) {
      console.error('Error loading order:', err);
      setError(err.message || 'Unable to load order');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return `£${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    const statusIndex = statusSteps.findIndex(step => step.key === order.status);
    return statusIndex;
  };

  return (
    <div className={styles.tracking}>
      <CustomerNavigationWrapper />
      
      <div className={styles.tracking__container}>
        <div className={styles.tracking__header}>
          <Typography variant="heading-2">Track Your Order</Typography>
          <Typography variant="body-medium">
            Enter your order details to check the status
          </Typography>
        </div>

        {/* Search Form */}
        <div className={styles.tracking__form}>
          <div className={styles.tracking__field}>
            <label>
              <Typography variant="body-medium">Order Number</Typography>
            </label>
            <Input
              id="orderNumber"
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g., 1234"
            />
          </div>

          <div className={styles.tracking__field}>
            <label>
              <Typography variant="body-medium">Email Address</Typography>
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <Button 
            variant="primary" 
            onClick={handleSearch}
            isDisabled={loading || !orderNumber || !email}
          >
            {loading ? 'Searching...' : 'Track Order'}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.tracking__error}>
            <Typography variant="body-medium">⚠️ {error}</Typography>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className={styles.tracking__results}>
            {/* Order Header */}
            <div className={styles.tracking__orderHeader}>
              <div>
                <Typography variant="body-small">Order Number</Typography>
                <Typography variant="heading-4">#{order.order_number}</Typography>
              </div>
              <div>
                <Typography variant="body-small">Merchant</Typography>
                <Typography variant="heading-6">{order.merchant_name}</Typography>
              </div>
            </div>

            {/* Status Timeline */}
            <div className={styles.tracking__timeline}>
              <Typography variant="heading-5">Order Status</Typography>
              <div className={styles.tracking__steps}>
                {statusSteps.map((step, index) => {
                  const currentIndex = getCurrentStepIndex();
                  const isActive = index <= currentIndex;
                  const isCurrent = index === currentIndex;
                  const isCancelled = order.status === 'cancelled' || order.status === 'rejected';

                  return (
                    <div 
                      key={step.key}
                      className={`${styles.tracking__step} ${
                        isActive ? styles['tracking__step--active'] : ''
                      } ${
                        isCurrent ? styles['tracking__step--current'] : ''
                      }`}
                    >
                      <div className={styles.tracking__stepIcon}>
                        {step.icon}
                      </div>
                      <Typography variant="body-small" className={styles.tracking__stepLabel}>
                        {step.label}
                      </Typography>
                      {index < statusSteps.length - 1 && (
                        <div className={styles.tracking__stepLine} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Cancelled/Rejected Status */}
              {(order.status === 'cancelled' || order.status === 'rejected') && (
                <div className={styles.tracking__cancelled}>
                  <Typography variant="body-large">
                    ❌ Order {order.status === 'cancelled' ? 'Cancelled' : 'Rejected'}
                  </Typography>
                  <Typography variant="body-small">
                    This order is no longer active. If you were charged, a refund will be processed.
                  </Typography>
                </div>
              )}

              {/* Ready for Pickup */}
              {order.status === 'ready' && (
                <div className={styles.tracking__ready}>
                  <Typography variant="body-large">
                    🔔 Your order is ready for collection!
                  </Typography>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className={styles.tracking__items}>
              <Typography variant="heading-6">Order Details</Typography>
              {order.items.map((item, index) => (
                <div key={index} className={styles.tracking__item}>
                  <div className={styles.tracking__itemHeader}>
                    <Typography variant="body-medium">
                      {item.quantity}x {item.menu_item_title}
                    </Typography>
                    <Typography variant="body-medium">
                      {formatPrice(item.total_price)}
                    </Typography>
                  </div>
                  {item.customizations && item.customizations.length > 0 && (
                    <div className={styles.tracking__customizations}>
                      {item.customizations.map((custom, idx) => (
                        <Typography key={idx} variant="body-small">
                          + {custom.sub_item_name} {custom.quantity > 1 && `(x${custom.quantity})`}
                        </Typography>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className={styles.tracking__total}>
                <Typography variant="heading-6">Total</Typography>
                <Typography variant="heading-6">{formatPrice(order.total_amount)}</Typography>
              </div>
            </div>

            {/* Order Time */}
            <div className={styles.tracking__time}>
              <Typography variant="body-small">
                Ordered: {formatDate(order.created_at)}
              </Typography>
            </div>
          </div>
        )}

        {/* Help Text */}
        {!order && !error && (
          <div className={styles.tracking__help}>
            <Typography variant="body-small">
              💡 Your order number and email were sent to you when you placed the order
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
