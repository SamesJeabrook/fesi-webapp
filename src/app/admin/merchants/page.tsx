'use client';

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { MerchantOrderDashboard } from '@/components/templates/MerchantOrderDashboard/MerchantOrderDashboard.component';
import MerchantSelector from '@/components/admin/MerchantSelector';
import { Typography } from '@/components/atoms';

interface Merchant {
  id: string;
  business_name: string;
  name: string; // For MerchantOrderDashboard compatibility
  email: string;
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
  const { user } = useAuth0();
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  // Fetch user role from database
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;
      
      try {
        const token = localStorage.getItem('auth-token');
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
  }, [user]);

  // Check if user is admin
  const userRoles = user?.['https://fesi.app/roles'] || [];
  console.log('🔍 Full user object:', user);
  console.log('🔍 User roles from custom claim:', userRoles);
  console.log('🔍 User app_metadata:', user?.app_metadata);
  console.log('🔍 User role from database:', userRole);
  
  // Use database role as fallback if Auth0 custom claims aren't working
  const isAdmin = userRoles.includes('admin') || userRole === 'admin';

  const fetchMerchantOrders = async (merchantId: string) => {
    try {
      setOrdersLoading(true);
      const token = localStorage.getItem('auth-token');
      
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
        throw new Error('Failed to fetch orders');
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

  const handleMerchantSelect = (merchant: Merchant) => {
    // Ensure merchant has name property for MerchantOrderDashboard
    const merchantWithName = {
      ...merchant,
      name: merchant.business_name
    };
    setSelectedMerchant(merchantWithName);
    if (merchant) {
      fetchMerchantOrders(merchant.id);
    } else {
      setOrders([]);
    }
  };

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // Find the current order to get its version
      const currentOrder = orders.find(order => order.id === orderId);
      const currentVersion = currentOrder?.version || 0;
      
      const token = localStorage.getItem('auth-token');
      
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
    if (selectedMerchant) {
      fetchMerchantOrders(selectedMerchant.id);
    }
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

          {!isAdmin ? (
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
                  Managing: {selectedMerchant.business_name}
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
                merchant={selectedMerchant}
                orders={orders}
                isLoading={ordersLoading}
                onOrderStatusChange={handleOrderStatusChange}
                onRefresh={handleRefresh}
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