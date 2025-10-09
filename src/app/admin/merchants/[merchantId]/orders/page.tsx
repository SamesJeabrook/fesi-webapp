'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { MerchantOrderDashboard } from '@/components/templates/MerchantOrderDashboard/MerchantOrderDashboard.component';
import { Typography } from '@/components/atoms';
import Link from 'next/link';
import styles from './adminOrders.module.scss';

interface Merchant {
  id: string;
  business_name: string;
  name: string;
  email: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'complete' | 'cancelled';
  created_at: string;
  updated_at: string;
  version: number;
  items: Array<{
    menu_item_name: string;
    quantity: number;
    customizations?: Array<{
      sub_item_name: string;
      quantity: number;
    }>;
  }>;
  estimated_completion?: string;
  notes?: string;
}

export default function AdminMerchantOrdersPage() {
  const params = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const merchantId = params?.merchantId as string;

  const fetchMerchant = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const merchantData = data.data;
        setMerchant({
          id: merchantData.id,
          business_name: merchantData.business_name,
          name: merchantData.name || merchantData.business_name,
          email: merchantData.email,
        });
      }
    } catch (error) {
      console.error('Error fetching merchant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMerchantOrders = async () => {
    try {
      setOrdersLoading(true);
      console.log('🔄 Fetching orders for merchant:', merchantId);
      
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}/orders`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`Failed to fetch orders: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching merchant orders:', error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // Find the current order to get its version
      const currentOrder = orders.find(order => order.id === orderId);
      const currentVersion = currentOrder?.version || 0;
      
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status/merchant`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            status: newStatus,
            version: currentVersion 
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update order status');
      }

      // Refresh orders after status change
      await fetchMerchantOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const handleRefresh = () => {
    console.log('Refreshing orders for merchant:', merchantId);
    fetchMerchantOrders();
  };

  // Wrapper function to include audience in token requests
  const getApiToken = async () => {
    return await getAccessTokenSilently({
      authorizationParams: {
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
      },
    });
  };

  useEffect(() => {
    if (merchantId) {
      fetchMerchant();
      fetchMerchantOrders();
    }
  }, [merchantId]);

  if (isLoading) {
    return (
      <ProtectedRoute requireRole={['admin']}>
        <div className={styles.orders}>
          <div className={styles.orders__loading}>
            <Typography variant="body-medium">Loading merchant orders...</Typography>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['admin']}>
      <div className={styles.orders}>
        <div className={styles.orders__header}>
          <div className={styles.orders__headerContent}>
            <Link href={`/admin/merchants/${merchantId}`} className={styles.orders__backLink}>
              ← Back to {merchant?.business_name || 'Merchant'} Dashboard
            </Link>
            <div className={styles.orders__adminBadge}>
              <span className={styles.orders__badge}>🔧 ADMIN MODE</span>
              <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                Managing orders for {merchant?.business_name || 'merchant'}
              </Typography>
            </div>
            <Typography variant="heading-3">
              Orders Dashboard
            </Typography>
            <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
              View and manage orders for this merchant
            </Typography>
          </div>
        </div>

        {merchant && (
          <div className={styles.orders__dashboard}>
            <MerchantOrderDashboard
              merchant={merchant}
              orders={orders}
              isLoading={ordersLoading}
              onOrderStatusChange={handleOrderStatusChange}
              onRefresh={handleRefresh}
              getToken={getApiToken}
              pollingInterval={300000} // 5 minutes for admin context
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}