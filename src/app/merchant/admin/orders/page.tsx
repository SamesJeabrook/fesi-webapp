'use client';

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { MerchantOrderDashboard } from '@/components/templates';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

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
      // Get Auth0 token
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

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
            menu_item_name: item.menu_item_title || item.menu_item_name || item.name, // For OrderCard component
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
  
  // Extract merchant_id from Auth0 user
  const merchantId = user?.['https://fesi.app/merchant_id'] || null;
  
  const { orders, isLoading: ordersLoading, refetch } = useMerchantOrders(merchantId);

  // Create merchant object from Auth0 user data
  const merchant: Merchant | null = user ? {
    id: merchantId || user.sub,
    name: user.name || user.nickname || 'Unknown Merchant',
    email: user.email || 'unknown@merchant.com'
  } : null;

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });
      
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

  return (
    <ProtectedRoute requireRole={['merchant', 'admin']}>
      <MerchantOrderDashboard
        merchant={merchant!}
        orders={orders}
        isLoading={ordersLoading}
        onOrderStatusChange={handleOrderStatusChange}
        onRefresh={refetch}
      />
    </ProtectedRoute>
  );
}