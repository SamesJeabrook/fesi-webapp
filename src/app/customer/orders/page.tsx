'use client';

import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button, Grid } from '@/components/atoms';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import styles from './orders.module.scss';

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  merchant_name: string;
  event_start: string;
  notes?: string;
}

export default function CustomerOrdersPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      const params = new URLSearchParams({ limit: '50' });
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customers/me/orders?${params}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return `£${(priceInCents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      preparing: '#8b5cf6',
      ready: '#10b981',
      completed: '#059669',
      cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <ProtectedRoute requireRole={['customer']}>
      <div className={styles.orders}>
        <div className={styles.orders__header}>
          <div>
            <Typography variant="heading-2">Order History</Typography>
            <Typography variant="body-large" style={{ color: 'var(--color-text-secondary)' }}>
              View and track all your orders
            </Typography>
          </div>
          <Link href="/customer/dashboard">
            <Button variant="secondary">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Filters */}
        <div className={styles.orders__filters}>
          <Typography variant="body-medium" style={{ fontWeight: 500 }}>
            Filter by status:
          </Typography>
          <div className={styles.orders__filterButtons}>
            {['all', 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                className={`${styles.filterButton} ${
                  statusFilter === status ? styles['filterButton--active'] : ''
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status === 'all' ? 'All Orders' : getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className={styles.orders__loading}>
            <Typography variant="body-large">Loading orders...</Typography>
          </div>
        ) : orders.length === 0 ? (
          <div className={styles.orders__empty}>
            <Typography variant="heading-5">No orders found</Typography>
            <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {statusFilter === 'all'
                ? "You haven't placed any orders yet"
                : `No orders with status "${getStatusLabel(statusFilter)}"`}
            </Typography>
            {statusFilter === 'all' && (
              <Link href="/vendors">
                <Button variant="primary">Browse Vendors</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.orders__list}>
            {orders.map((order) => (
              <div
                key={order.id}
                className={styles.orderCard}
                onClick={() => setSelectedOrder(order)}
              >
                <div className={styles.orderCard__main}>
                  <div className={styles.orderCard__info}>
                    <Typography variant="heading-5">{order.merchant_name}</Typography>
                    <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                      Order #{order.order_number}
                    </Typography>
                    <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                      Placed: {formatDate(order.created_at)}
                    </Typography>
                    {order.notes && (
                      <Typography
                        variant="body-small"
                        style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}
                      >
                        Note: {order.notes}
                      </Typography>
                    )}
                  </div>
                  <div className={styles.orderCard__right}>
                    <Typography variant="heading-4">{formatPrice(order.total_amount)}</Typography>
                    <span
                      className={styles.orderCard__badge}
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Detail Modal - Simple for now */}
        {selectedOrder && (
          <div className={styles.modal} onClick={() => setSelectedOrder(null)}>
            <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modal__header}>
                <Typography variant="heading-4">Order Details</Typography>
                <button
                  className={styles.modal__close}
                  onClick={() => setSelectedOrder(null)}
                >
                  ×
                </button>
              </div>
              <div className={styles.modal__body}>
                <div className={styles.modal__row}>
                  <Typography variant="body-medium" style={{ fontWeight: 500 }}>
                    Order Number:
                  </Typography>
                  <Typography variant="body-medium">{selectedOrder.order_number}</Typography>
                </div>
                <div className={styles.modal__row}>
                  <Typography variant="body-medium" style={{ fontWeight: 500 }}>
                    Merchant:
                  </Typography>
                  <Typography variant="body-medium">{selectedOrder.merchant_name}</Typography>
                </div>
                <div className={styles.modal__row}>
                  <Typography variant="body-medium" style={{ fontWeight: 500 }}>
                    Total:
                  </Typography>
                  <Typography variant="heading-5">{formatPrice(selectedOrder.total_amount)}</Typography>
                </div>
                <div className={styles.modal__row}>
                  <Typography variant="body-medium" style={{ fontWeight: 500 }}>
                    Status:
                  </Typography>
                  <span
                    className={styles.orderCard__badge}
                    style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                  >
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
                <div className={styles.modal__row}>
                  <Typography variant="body-medium" style={{ fontWeight: 500 }}>
                    Placed:
                  </Typography>
                  <Typography variant="body-medium">{formatDate(selectedOrder.created_at)}</Typography>
                </div>
                {selectedOrder.notes && (
                  <div className={styles.modal__row}>
                    <Typography variant="body-medium" style={{ fontWeight: 500 }}>
                      Notes:
                    </Typography>
                    <Typography variant="body-medium">{selectedOrder.notes}</Typography>
                  </div>
                )}
              </div>
              <div className={styles.modal__footer}>
                <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
