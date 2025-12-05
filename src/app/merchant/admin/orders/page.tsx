'use client';

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { MerchantOrderDashboard } from '@/components/templates';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAdmin } from '@/components/providers/AdminProvider';
import { getMerchantIdFromDevToken, getAuthToken } from '@/utils/devAuth';
import { useNewOrderNotification } from '@/hooks/useNewOrderNotification';

// Environment configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// Types for better TypeScript support
interface User {
  id: string;
  email?: string;
  name?: string;
  role: string;
  merchant_id?: string;
  merchant_data?: {
    id: string;
    name?: string;
    username?: string;
    email?: string;
  };
}

interface Merchant {
  id: string;
  name: string;
  email: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  items: Array<{
    menu_item_name: string;
    quantity: number;
    customizations?: Array<{
      sub_item_name: string;
      quantity: number;
    }>;
  }>;
  total_amount: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'complete';
  created_at: string;
  estimated_completion?: string;
  notes?: string;
}

// Custom hook to get merchant orders using Auth0
function useMerchantOrders(merchantId: string | null) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const fetchOrders = async () => {
    if (!merchantId) return;

    setIsLoading(true);
    try {
      // Get Auth0 token or dev token
      const token = await getAuthToken(getAccessTokenSilently);

      console.log('Fetching orders for merchant:', merchantId);
      
      const response = await fetch(`${API_BASE_URL}/api/merchants/${merchantId}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
      }

      const ordersData = await response.json();
      
      // Handle the new response format with orders array
      const apiOrders = ordersData.orders || ordersData;
      
        // Transform API data to match our interface
        const transformedOrders = (apiOrders.orders || apiOrders).map((order: any) => ({
          id: order.id,
          customerName: order.customer_name || order.guest_first_name + ' ' + order.guest_last_name || 'Anonymous',
          items: order.items?.map((item: any) => ({
            name: item.menu_item_title || item.menu_item_name || item.name,
            quantity: item.quantity,
            price: (item.unit_price || item.price) / 100, // Convert from cents
            menu_item_title: item.menu_item_title || item.menu_item_name || item.name, // For OrderCard component
            customizations: item.customizations?.map((custom: any) => ({
              sub_item_name: custom.sub_item_name || custom.name,
              quantity: custom.quantity || 1
            })) || []
          })) || [],
          total: (order.total_amount || order.total) / 100, // Convert from cents
          status: order.status,
          timestamp: new Date(order.created_at || order.timestamp).toISOString(),
          qrVerified: order.qr_verified || false,
          version: order.version || 1,
          // Additional fields for OrderCard
          order_number: order.order_number || `ORD-${order.id?.slice(-6) || '000000'}`,
          customer_name: order.customer_name || order.guest_first_name + ' ' + order.guest_last_name || 'Anonymous',
          customer_email: order.customer_email || order.guest_email || '',
          total_amount: order.total_amount || order.total || 0,
          created_at: order.created_at || order.timestamp || new Date().toISOString(),
          estimated_completion: order.estimated_completion,
          notes: order.notes
        }));      
        
        setOrders(transformedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]); // Set empty array instead of mock data
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [merchantId]);

  return { orders, isLoading, refetch: fetchOrders };
}

export default function MerchantAdminPage() {
  const { user, isLoading: authLoading, getAccessTokenSilently } = useAuth0();
  const { selectedMerchant, isImpersonating, isAdmin } = useAdmin();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  
  // Get merchant ID from dev token, impersonation, or user
  useEffect(() => {
    const getMerchantId = async () => {
      // Check for dev token first
      const devMerchantId = getMerchantIdFromDevToken();
      if (devMerchantId) {
        setMerchantId(devMerchantId);
        return;
      }

      // If admin is impersonating, use selectedMerchant
      if (isImpersonating && selectedMerchant) {
        setMerchantId(selectedMerchant.id);
        return;
      }

      // Otherwise, try Auth0 user's merchant_id
      const userMerchantId = user?.['https://fesi.app/merchant_id'];
      if (userMerchantId) {
        setMerchantId(userMerchantId);
        return;
      }

      // Finally, try fetching from /me endpoint
      try {
        const token = await getAuthToken(getAccessTokenSilently);
        const response = await fetch(`${API_BASE_URL}/api/merchants/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMerchantId(data.id);
        }
      } catch (error) {
        console.error('Error fetching merchant ID:', error);
      }
    };

    getMerchantId();
  }, [user, isImpersonating, selectedMerchant, getAccessTokenSilently]);
  
  const { orders, isLoading: ordersLoading, refetch } = useMerchantOrders(merchantId);

  // Setup new order notifications
  const { requestNotificationPermission } = useNewOrderNotification({ 
    orders, 
    enabled: true 
  });

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        // Auto-request permission after a short delay
        setTimeout(() => {
          requestNotificationPermission();
        }, 3000);
      }
    }
  }, []);

  // Create merchant object - use selectedMerchant if impersonating, otherwise use Auth0 user data
  const merchant: Merchant | null = merchantId
    ? {
        id: merchantId,
        name: isImpersonating && selectedMerchant 
          ? selectedMerchant.business_name 
          : user?.name || user?.nickname || 'Unknown Merchant',
        email: isImpersonating && selectedMerchant
          ? selectedMerchant.email
          : user?.email || 'unknown@merchant.com'
      }
    : null;

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const token = await getAuthToken(getAccessTokenSilently);
      
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          alert('Order was modified by another process. Refreshing orders...');
          refetch();
          return;
        }
        throw new Error(`Failed to update order status: ${response.status}`);
      }

      console.log('Order status updated successfully:', { orderId, newStatus });
      refetch();
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  if (!merchantId) {
    return (
      <ProtectedRoute requireRole={['merchant', 'admin']}>
        <div>Loading...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['merchant', 'admin']}>
      <MerchantOrderDashboard
        merchant={merchant!}
        orders={orders}
        isLoading={ordersLoading}
        onOrderStatusChange={handleOrderStatusChange}
        onRefresh={refetch}
        backLink={{
          href: '/merchant/admin',
          label: 'Back to Dashboard'
        }}
      />
    </ProtectedRoute>
  );
}