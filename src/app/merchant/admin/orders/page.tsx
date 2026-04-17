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
  first_name: string;
  last_name: string;
  customer_email?: string;
  items: Array<{
    menu_item_title: string;
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
function useMerchantOrders(merchantId: string | null, filterDate?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const fetchOrders = async () => {
    if (!merchantId) return;

    setIsLoading(true);
    try {
      // Get Auth0 token or dev token
      const token = await getAuthToken(getAccessTokenSilently);

      console.log('Fetching orders for merchant:', merchantId, 'date:', filterDate);
      
      // Build URL with optional date parameter
      let url = `${API_BASE_URL}/api/merchants/${merchantId}/orders`;
      if (filterDate) {
        url += `?date=${filterDate}`;
      }
      
      const response = await fetch(url, {
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
            id: item.id,
            menu_item_id: item.menu_item_id,
            name: item.menu_item_title || item.menu_item_name || item.name,
            quantity: item.quantity,
            price: (item.unit_price || item.total_price || item.price || 0) / 100, // Convert from cents
            menu_item_title: item.menu_item_title || item.menu_item_name || item.name, // For OrderCard component
            // Keep raw values for modal
            unit_price: item.unit_price,
            total_price: item.total_price,
            menu_item_name: item.menu_item_title || item.menu_item_name,
            customizations: item.customizations?.map((custom: any) => ({
              sub_item_id: custom.sub_item_id,
              sub_item_name: custom.sub_item_name || custom.name,
              quantity: custom.quantity || 1,
              unit_price: custom.unit_price,
              total_price: custom.total_price
            })) || []
          })) || [],
          total: (order.total_amount || order.total) / 100, // Convert from cents
          status: order.status,
          timestamp: new Date(order.created_at || order.timestamp).toISOString(),
          qrVerified: order.qr_verified || false,
          version: order.version || 1,
          // Additional fields for OrderCard and OrderDetailsModal
          order_number: order.order_number || `ORD-${order.id?.slice(-6) || '000000'}`,
          customer_name: order.customer_name || order.guest_first_name + ' ' + order.guest_last_name || 'Anonymous',
          customer_email: order.customer_email || order.guest_email || '',
          first_name: order.first_name || order.guest_first_name,
          last_name: order.last_name || order.guest_last_name,
          table_number: order.table_number, // Add table number for table service orders
          order_source: order.order_source, // Add order source (pos, table_service, online, etc.)
          total_amount: order.total_amount || order.total || 0, // Keep raw value in pence for modal
          subtotal_amount: order.subtotal_amount,
          delivery_fee: order.delivery_fee,
          platform_fee: order.platform_fee,
          payment_status: order.payment_status,
          order_type: order.order_type,
          notes: order.notes,
          special_instructions: order.special_instructions,
          created_at: order.created_at || order.timestamp || new Date().toISOString(),
          estimated_completion: order.estimated_completion,
          refired_at: order.refired_at,
          refired_item_ids: Array.isArray(order.refired_item_ids) 
            ? order.refired_item_ids 
            : (typeof order.refired_item_ids === 'string' 
              ? JSON.parse(order.refired_item_ids) 
              : []),
          is_pre_order: order.is_pre_order || false,
          scheduled_time: order.scheduled_time,
          order_priority: order.order_priority || 0,
        }));      
        
        console.log('Transformed orders sample:', transformedOrders[0]);
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
  }, [merchantId, filterDate]);

  return { orders, isLoading, refetch: fetchOrders };
}

export default function MerchantAdminPage() {
  const { user, isLoading: authLoading, getAccessTokenSilently } = useAuth0();
  const { selectedMerchant, isImpersonating, isAdmin } = useAdmin();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'all' | 'today' | 'preorders'>('all');
  
  // Handler for view changes from the dashboard
  const handleViewChange = (view: 'all' | 'today' | 'preorders') => {
    setCurrentView(view);
  };
  
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

      // Otherwise, try Auth0 user's merchant_ids
      const merchantIds = user?.['https://fesi.app/merchant_ids'];
      if (merchantIds && merchantIds.length > 0) {
        setMerchantId(merchantIds[0]);
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
  
  // Always fetch all orders (no date filter) so badge counts are accurate
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
    // This is called AFTER MerchantOrderDashboard has already made the API call
    // We just need to refetch to update the UI
    console.log('Order status changed:', { orderId, newStatus });
    refetch();
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
        onViewChange={handleViewChange}
        currentView={currentView}
        backLink={{
          href: '/merchant/admin',
          label: 'Back to Dashboard'
        }}
      />
    </ProtectedRoute>
  );
}