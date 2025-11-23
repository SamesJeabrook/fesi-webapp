'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button, Grid } from '@/components/atoms';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import styles from './dashboard.module.scss';

interface CustomerProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  total_orders: number;
  loyalty_cards_count: number;
}

interface OrderStats {
  total_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  total_spent: number;
  average_order_value: number;
  last_order_date: string | null;
  unique_merchants: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  merchant_name: string;
}

interface LoyaltyCard {
  id: string;
  merchant_id: string;
  merchant_name: string;
  current_stamps: number;
  total_stamps_earned: number;
  loyalty_reward_description: string;
}

export default function CustomerDashboard() {
  const router = useRouter();
  const { getAccessTokenSilently, user } = useAuth0();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loyaltyCards, setLoyaltyCards] = useState<LoyaltyCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      // Fetch all dashboard data in parallel
      const [profileRes, statsRes, ordersRes, loyaltyRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/me/stats`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/me/orders?limit=5`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/me/loyalty-cards`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile(data.data);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.data);
      }

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setRecentOrders(data.data || []);
      }

      if (loyaltyRes.ok) {
        const data = await loyaltyRes.json();
        setLoyaltyCards(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  if (isLoading) {
    return (
      <ProtectedRoute requireRole={['customer']}>
        <div className={styles.dashboard}>
          <Typography variant="heading-3">Loading...</Typography>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['customer']}>
      <div className={styles.dashboard}>
        {/* Welcome Section */}
        <div className={styles.dashboard__header}>
          <Typography variant="heading-2">
            Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}!
          </Typography>
          <Typography variant="body-large" style={{ color: 'var(--color-text-secondary)' }}>
            Manage your orders, view your loyalty cards, and update your preferences.
          </Typography>
        </div>

        {/* Quick Stats */}
        <Grid.Container gap="lg" className={styles.dashboard__stats}>
          <Grid.Item sm={16} md={8} lg={4}>
            <div className={styles.statCard}>
              <Typography variant="heading-6" style={{ color: 'var(--color-text-secondary)' }}>
                Total Orders
              </Typography>
              <Typography variant="heading-2">{stats?.total_orders || 0}</Typography>
            </div>
          </Grid.Item>
          <Grid.Item sm={16} md={8} lg={4}>
            <div className={styles.statCard}>
              <Typography variant="heading-6" style={{ color: 'var(--color-text-secondary)' }}>
                Total Spent
              </Typography>
              <Typography variant="heading-2">{formatPrice(stats?.total_spent || 0)}</Typography>
            </div>
          </Grid.Item>
          <Grid.Item sm={16} md={8} lg={4}>
            <div className={styles.statCard}>
              <Typography variant="heading-6" style={{ color: 'var(--color-text-secondary)' }}>
                Loyalty Cards
              </Typography>
              <Typography variant="heading-2">{loyaltyCards.length}</Typography>
            </div>
          </Grid.Item>
          <Grid.Item sm={16} md={8} lg={4}>
            <div className={styles.statCard}>
              <Typography variant="heading-6" style={{ color: 'var(--color-text-secondary)' }}>
                Avg Order Value
              </Typography>
              <Typography variant="heading-2">
                {formatPrice(stats?.average_order_value || 0)}
              </Typography>
            </div>
          </Grid.Item>
        </Grid.Container>

        {/* Recent Orders */}
        <div className={styles.dashboard__section}>
          <div className={styles.dashboard__sectionHeader}>
            <Typography variant="heading-4">Recent Orders</Typography>
            <Link href="/customer/orders">
              <Button variant="secondary" size="sm">View All</Button>
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className={styles.dashboard__empty}>
              <Typography variant="body-large">No orders yet</Typography>
              <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Start exploring vendors to place your first order!
              </Typography>
              <Link href="/vendors">
                <Button variant="primary">Browse Vendors</Button>
              </Link>
            </div>
          ) : (
            <div className={styles.dashboard__ordersList}>
              {recentOrders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderCard__header}>
                    <div>
                      <Typography variant="heading-6">{order.merchant_name}</Typography>
                      <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                        Order #{order.order_number}
                      </Typography>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Typography variant="heading-6">{formatPrice(order.total_amount)}</Typography>
                      <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                        {formatDate(order.created_at)}
                      </Typography>
                    </div>
                  </div>
                  <div className={styles.orderCard__status}>
                    <span
                      className={styles.orderCard__badge}
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Loyalty Cards */}
        {loyaltyCards.length > 0 && (
          <div className={styles.dashboard__section}>
            <Typography variant="heading-4">Your Loyalty Cards</Typography>
            <Grid.Container gap="md" className={styles.dashboard__loyaltyCards}>
              {loyaltyCards.map((card) => (
                <Grid.Item sm={16} md={8} lg={5} key={card.id}>
                  <div className={styles.loyaltyCard}>
                    <Typography variant="heading-6">{card.merchant_name}</Typography>
                    <div className={styles.loyaltyCard__stamps}>
                      <Typography variant="heading-3">{card.current_stamps}</Typography>
                      <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                        stamps
                      </Typography>
                    </div>
                    <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                      Reward: {card.loyalty_reward_description}
                    </Typography>
                  </div>
                </Grid.Item>
              ))}
            </Grid.Container>
          </div>
        )}

        {/* Quick Actions */}
        <div className={styles.dashboard__section}>
          <Typography variant="heading-4">Quick Actions</Typography>
          <Grid.Container gap="md">
            <Grid.Item sm={16} md={8} lg={4}>
              <Link href="/vendors" style={{ textDecoration: 'none' }}>
                <div className={styles.actionCard}>
                  <Typography variant="heading-6">Browse Vendors</Typography>
                  <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                    Discover food vendors near you
                  </Typography>
                </div>
              </Link>
            </Grid.Item>
            <Grid.Item sm={16} md={8} lg={4}>
              <Link href="/customer/orders" style={{ textDecoration: 'none' }}>
                <div className={styles.actionCard}>
                  <Typography variant="heading-6">Order History</Typography>
                  <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                    View all your past orders
                  </Typography>
                </div>
              </Link>
            </Grid.Item>
            <Grid.Item sm={16} md={8} lg={4}>
              <Link href="/customer/settings" style={{ textDecoration: 'none' }}>
                <div className={styles.actionCard}>
                  <Typography variant="heading-6">Account Settings</Typography>
                  <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                    Update your profile and preferences
                  </Typography>
                </div>
              </Link>
            </Grid.Item>
          </Grid.Container>
        </div>
      </div>
    </ProtectedRoute>
  );
}
