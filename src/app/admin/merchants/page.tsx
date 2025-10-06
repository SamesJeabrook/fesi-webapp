'use client';

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { MerchantOrderDashboard } from '@/components/templates/MerchantOrderDashboard/MerchantOrderDashboard.component';
import MerchantSelector from '@/components/admin/MerchantSelector';
import { useAdmin } from '@/components/providers/AdminProvider';
import { Typography } from '@/components/atoms';

interface AdminMerchant {
  id: string;
  business_name: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  status: string;
  created_at: string;
}

// Interface for MerchantSelector component
interface Merchant {
  id: string;
  name: string;
  username: string;
  phone: string;
  status: string;
  created_at: string;
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

export default function AdminMerchantDashboard() {
  const { user, getAccessTokenSilently } = useAuth0();
  const { selectedMerchant: adminSelectedMerchant, setSelectedMerchant: setAdminSelectedMerchant, isAdmin } = useAdmin();
  const [selectedMerchant, setSelectedMerchant] = useState<AdminMerchant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Fetch user role from database
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;
      
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
          },
        });
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUserRole(userData.user?.role || 'customer');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user, getAccessTokenSilently]);

  // Check if user is admin
  const userRoles = user?.['https://fesi.app/roles'] || [];
  console.log('🔍 Full user object:', user);
  console.log('🔍 User roles from custom claim:', userRoles);
  console.log('🔍 User app_metadata:', user?.app_metadata);
  console.log('🔍 User role from database:', userRole);
  
  // Use database role as fallback if Auth0 custom claims aren't working
  const isAdminFromToken = userRoles.includes('admin') || userRole === 'admin';
  const finalIsAdmin = isAdmin || isAdminFromToken;

  const fetchMerchantOrders = async (merchantId: string) => {
    try {
      setOrdersLoading(true);
      console.log('🔄 Fetching orders for merchant:', merchantId);
      
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });
      
      console.log('🎫 Got token for API call (first 50 chars):', token.substring(0, 50) + '...');
      console.log('🎫 Token length:', token.length);
      console.log('🎯 API URL:', `${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}/orders`);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}/orders`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response headers:', Object.fromEntries(response.headers.entries()));

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

  const handleMerchantSelect = async (merchant: Merchant) => {
    try {
      // Fetch full merchant details from the API
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/merchants/${merchant.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch merchant details');
      }

      const merchantDetails = await response.json();
      
      // Create AdminMerchant from the API response
      const adminMerchant: AdminMerchant = {
        id: merchantDetails.data.id,
        business_name: merchantDetails.data.business_name || merchant.name,
        name: merchantDetails.data.name || merchant.name, // For MerchantOrderDashboard compatibility
        email: merchantDetails.data.email || '',
        username: merchantDetails.data.username || '',
        phone: merchantDetails.data.phone || merchant.phone,
        status: merchantDetails.data.status || merchant.status,
        created_at: merchantDetails.data.created_at || merchant.created_at,
      };

      setSelectedMerchant(adminMerchant);
      setAdminSelectedMerchant(adminMerchant);
      console.log('Selected merchant set:', adminMerchant);
      fetchMerchantOrders(merchant.id);
    } catch (error) {
      console.error('Error selecting merchant:', error);
      // Fallback - create AdminMerchant from available data
      const fallbackMerchant: AdminMerchant = {
        id: merchant.id,
        business_name: merchant.name,
        name: merchant.name,
        email: '',
        username: merchant.username,
        phone: merchant.phone,
        status: merchant.status,
        created_at: merchant.created_at,
      };
      setSelectedMerchant(fallbackMerchant);
      setAdminSelectedMerchant(fallbackMerchant);
      fetchMerchantOrders(merchant.id);
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
      if (selectedMerchant) {
        await fetchMerchantOrders(selectedMerchant.id);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const handleRefresh = () => {
    if (selectedMerchant?.id) {
      console.log('Refreshing orders for merchant:', selectedMerchant.id);
      fetchMerchantOrders(selectedMerchant.id);
    } else {
      console.warn('handleRefresh called but selectedMerchant or selectedMerchant.id is undefined:', selectedMerchant);
    }
  };

  // Wrapper function to include audience in token requests
  const getApiToken = async () => {
    return await getAccessTokenSilently({
      authorizationParams: {
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
      },
    });
  };

  return (
    <ProtectedRoute requireRole={['admin']}>
      {roleLoading ? (
        <div className="admin-merchant-dashboard">
          <div className="admin-merchant-dashboard__header">
            <Typography variant="heading-2">Loading...</Typography>
            <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Checking permissions...
            </Typography>
          </div>
        </div>
      ) : (
        <div className="admin-merchant-dashboard">
          <div className="admin-merchant-dashboard__header">
            <Typography variant="heading-2">Admin Dashboard</Typography>
            <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Manage merchant orders and provide support
            </Typography>
          </div>

          {!finalIsAdmin ? (
            <div className="admin-merchant-dashboard__error">
              <Typography variant="heading-4" style={{ color: 'var(--color-error)' }}>
                Access Denied
              </Typography>
              <Typography variant="body-medium">
                You need admin privileges to access this page.
              </Typography>
              <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                Current role: {userRole || 'unknown'}
              </Typography>
            </div>
          ) : !selectedMerchant ? (
            <MerchantSelector
              onMerchantSelect={handleMerchantSelect}
              selectedMerchant={selectedMerchant}
            />
          ) : (
            <div className="admin-merchant-dashboard__content">
              <div className="admin-merchant-dashboard__merchant-info">
                <Typography variant="heading-3">
                  Managing: {selectedMerchant.name}
                </Typography>
                <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  {selectedMerchant.email} • {selectedMerchant.phone}
                </Typography>
                <button
                  onClick={() => setSelectedMerchant(null)}
                  className="admin-merchant-dashboard__back-button"
                >
                  ← Back to Merchant Selection
                </button>
              </div>

              <MerchantOrderDashboard
                merchant={{
                  id: selectedMerchant.id,
                  name: selectedMerchant.name,
                  email: selectedMerchant.email
                }}
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
      )}

      <style jsx>{`
        .admin-merchant-dashboard {
          min-height: 100vh;
          background: var(--color-background);
          padding: 2rem;
        }

        .admin-merchant-dashboard__header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .admin-merchant-dashboard__error {
          text-align: center;
          padding: 3rem;
          background: var(--color-background-secondary);
          border-radius: 8px;
          max-width: 600px;
          margin: 0 auto;
        }

        .admin-merchant-dashboard__content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .admin-merchant-dashboard__merchant-info {
          background: var(--color-primary-light);
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          position: relative;
        }

        .admin-merchant-dashboard__back-button {
          background: var(--color-secondary);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 1rem;
          font-size: 0.9rem;
          transition: background-color 0.2s ease;
        }

        .admin-merchant-dashboard__back-button:hover {
          background: var(--color-secondary-dark);
        }
      `}</style>
    </ProtectedRoute>
  );
}