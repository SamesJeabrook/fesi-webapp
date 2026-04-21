"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Button } from '@/components/atoms';
import { CustomerNavigationWrapper } from '@/components/molecules/CustomerNavigation';
import { useAuth0 } from '@auth0/auth0-react';
import { getAuthToken } from '@/utils/devAuth';
import styles from './OrderConfirmationTemplate.module.scss';

export interface OrderConfirmationTemplateProps {
  orderId: string;
}

interface OrderDetails {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  is_pre_order?: boolean;
  scheduled_time?: string;
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
  guest_email?: string;
  guest_first_name?: string;
  guest_last_name?: string;
  merchant?: {
    id: string;
    name: string;
    username?: string;
  };
  event?: {
    merchant_id: string;
  };
}

export function OrderConfirmationTemplate({ orderId }: OrderConfirmationTemplateProps) {
  const router = useRouter();
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      
      // Try to get auth token if logged in
      let headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (isAuthenticated) {
        try {
          const token = await getAuthToken(getAccessTokenSilently);
          headers['Authorization'] = `Bearer ${token}`;
        } catch (e) {
          // Continue without auth if token fails
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to load order details');
      }

      const data = await response.json();
      setOrder(data);
    } catch (err) {
      console.error('Error loading order:', err);
      setError('Unable to load order details');
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEstimatedTime = () => {
    // For pre-orders, show the scheduled pickup time
    if (order?.is_pre_order && order?.scheduled_time) {
      const pickupTime = new Date(order.scheduled_time);
      return pickupTime.toLocaleString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // For regular orders, estimate 15-30 minutes for food preparation
    return '15-30 minutes';
  };

  if (loading) {
    return (
      <div className={styles.confirmation}>
        <CustomerNavigationWrapper />
        <div className={styles.confirmation__container}>
          <Typography variant="body-medium">Loading order details...</Typography>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.confirmation}>
        <CustomerNavigationWrapper />
        <div className={styles.confirmation__container}>
          <div className={styles.confirmation__error}>
            <Typography variant="heading-3">⚠️ Order Not Found</Typography>
            <Typography variant="body-medium">{error || 'This order could not be found.'}</Typography>
            <Button variant="primary" onClick={() => router.push('/vendors')}>
              Back to Vendors
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.confirmation}>
      <CustomerNavigationWrapper />
      
      <div className={styles.confirmation__container}>
        {/* Success Header */}
        <div className={styles.confirmation__header}>
          <div className={styles.confirmation__icon}>✅</div>
          <Typography variant="heading-2">Order Confirmed!</Typography>
          <Typography variant="body-large">
            Your order has been placed successfully
          </Typography>
        </div>

        {/* Order Number */}
        <div className={styles.confirmation__orderNumber}>
          <Typography variant="heading-6">Order Number</Typography>
          <Typography variant="heading-3">#{order.order_number}</Typography>
        </div>

        {/* Merchant & Time Info */}
        <div className={styles.confirmation__info}>
          <div className={styles.confirmation__infoCard}>
            <Typography variant="heading-6">Merchant</Typography>
            <Typography variant="body-large">{order.merchant_name}</Typography>
          </div>
          
          <div className={styles.confirmation__infoCard}>
            <Typography variant="heading-6">{order.is_pre_order ? 'Pickup Time' : 'Estimated Time'}</Typography>
            <Typography variant="body-large">{getEstimatedTime()}</Typography>
          </div>
          
          <div className={styles.confirmation__infoCard}>
            <Typography variant="heading-6">Ordered At</Typography>
            <Typography variant="body-medium">{formatDate(order.created_at)}</Typography>
          </div>
        </div>

        {/* Order Items */}
        <div className={styles.confirmation__section}>
          <Typography variant="heading-5">Order Details</Typography>
          <div className={styles.confirmation__items}>
            {order.items.map((item, index) => (
              <div key={index} className={styles.confirmation__item}>
                <div className={styles.confirmation__itemHeader}>
                  <Typography variant="body-medium">
                    {item.quantity}x {item.menu_item_title}
                  </Typography>
                  <Typography variant="body-medium">
                    {formatPrice(item.total_price)}
                  </Typography>
                </div>
                {item.customizations && item.customizations.length > 0 && (
                  <div className={styles.confirmation__customizations}>
                    {item.customizations.map((custom, idx) => (
                      <Typography key={idx} variant="body-small" className={styles.confirmation__customization}>
                        + {custom.sub_item_name} {custom.quantity > 1 && `(x${custom.quantity})`}
                      </Typography>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className={styles.confirmation__total}>
          <Typography variant="heading-5">Total</Typography>
          <Typography variant="heading-4">{formatPrice(order.total_amount)}</Typography>
        </div>

        {/* Contact Info (for guests) */}
        {!isAuthenticated && (order.guest_email || order.guest_first_name) && (
          <div className={styles.confirmation__contact}>
            <Typography variant="body-small">
              Order confirmation sent to: {order.guest_email}
            </Typography>
          </div>
        )}

        {/* Actions */}
        <div className={styles.confirmation__actions}>
          {isAuthenticated ? (
            <>
              <Button variant="primary" onClick={() => router.push('/vendors/orders')}>
                View All Orders
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => {
                  const merchantUsername = order.merchant?.username;
                  if (merchantUsername) {
                    router.push(`/vendors/${merchantUsername}`);
                  } else {
                    router.push('/vendors');
                  }
                }}
              >
                Order More
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="primary" 
                onClick={() => {
                  const merchantId = order.merchant?.id || order.event?.merchant_id;
                  if (merchantId) {
                    router.push(`/orders/${merchantId}`);
                  }
                }}
              >
                View Order Status
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => {
                  const merchantUsername = order.merchant?.username;
                  if (merchantUsername) {
                    router.push(`/vendors/${merchantUsername}`);
                  } else {
                    router.push('/vendors');
                  }
                }}
              >
                Order More
              </Button>
            </>
          )}
        </div>

        {/* Helpful Info */}
        <div className={styles.confirmation__footer}>
          <Typography variant="body-small">
            💡 You'll receive a notification when your order is ready for collection
          </Typography>
        </div>
      </div>
    </div>
  );
}
