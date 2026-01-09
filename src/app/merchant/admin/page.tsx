'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button } from '@/components/atoms';
import { Card } from '@/components/atoms/Card';
import { MerchantQrModal } from '@/components/molecules/MerchantQrModal/MerchantQrModal';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getMerchantIdFromDevToken, getAuthToken } from '@/utils/devAuth';
import api from '@/utils/api';
import styles from './dashboard.module.scss';

interface DashboardItem {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  showWhen?: (merchant: any) => boolean;
}

interface DashboardSection {
  title: string;
  description: string;
  items: DashboardItem[];
}

const dashboardSections: DashboardSection[] = [
  {
    title: 'Daily Operations',
    description: 'Day-to-day business management',
    items: [
      {
        title: 'Point of Sale',
        description: 'Take orders directly at the counter',
        icon: '💳',
        href: '/merchant/admin/pos',
        color: 'primary'
      },
      {
        title: 'Table Service',
        description: 'Waitstaff order taking for dine-in customers',
        icon: '🍽️',
        href: '/merchant/admin/table-service',
        color: 'primary',
        showWhen: (merchant: any) => merchant?.operating_mode === 'static'
      },
      {
        title: 'Orders Management',
        description: 'View and manage incoming orders',
        icon: '📋',
        href: '/merchant/admin/orders',
        color: 'primary'
      },
      {
        title: 'Table Management',
        description: 'Manage restaurant tables and dining sessions',
        icon: '🪑',
        href: '/merchant/admin/tables',
        color: 'info',
        showWhen: (merchant: any) => merchant?.operating_mode === 'static'
      },
      {
        title: 'Reservations',
        description: 'Manage table reservations and bookings',
        icon: '📅',
        href: '/merchant/admin/reservations',
        color: 'success',
        showWhen: (merchant: any) => merchant?.operating_mode === 'static'
      },
      {
        title: 'Events Management',
        description: 'Create and manage multi-day events',
        icon: '🎉',
        href: '/merchant/admin/events',
        color: 'secondary',
        showWhen: (merchant: any) => merchant?.operating_mode !== 'static'
      },
    ]
  },
  {
    title: 'Insights & Inventory',
    description: 'Analytics and stock tracking',
    items: [
      {
        title: 'Analytics & Reports',
        description: 'View sales and performance metrics',
        icon: '📊',
        href: '/merchant/admin/analytics',
        color: 'secondary'
      },
      {
        title: 'Stock Management',
        description: 'Track inventory and manage stock levels',
        icon: '📦',
        href: '/merchant/admin/stock',
        color: 'success'
      },
    ]
  },
  {
    title: 'Menu & Configuration',
    description: 'Menu setup and system settings',
    items: [
      {
        title: 'Menu Categories',
        description: 'Add, edit and organize menu categories',
        icon: '📁',
        href: '/merchant/admin/menu/categories',
        color: 'success'
      },
      {
        title: 'Menu Items',
        description: 'Manage your menu items and pricing',
        icon: '🍽️',
        href: '/merchant/admin/menu/items',
        color: 'warning'
      },
      {
        title: 'Menus',
        description: 'Create and manage menus for your events',
        icon: '📋',
        href: '/merchant/admin/menu/menus',
        color: 'primary'
      },
      {
        title: 'Sub-Items & Options',
        description: 'Configure customizations and add-ons',
        icon: '🔧',
        href: '/merchant/admin/menu/sub-items',
        color: 'info'
      },
      {
        title: 'System Settings',
        description: 'Configure your merchant settings and preferences',
        icon: '⚙️',
        href: '/merchant/admin/settings',
        color: 'warning'
      },
    ]
  }
];

export default function MerchantAdminDashboard() {
  const { getAccessTokenSilently } = useAuth0();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [merchant, setMerchant] = useState<any>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingOpen, setIsTogglingOpen] = useState(false);

  // Get merchant ID and data
  useEffect(() => {
    const fetchMerchantData = async () => {
      try {
        setIsLoading(true);
        
        // Check for dev token first
        const devMerchantId = getMerchantIdFromDevToken();
        let id: string;
        
        if (devMerchantId) {
          id = devMerchantId;
        } else {
          // Get from /me endpoint
          const data = await api.get('/api/merchants/me');
          id = data.id;
        }

        setMerchantId(id);

        // Fetch full merchant details
        const merchantData = await api.get(`/api/merchants/${id}`);
        setMerchant(merchantData.data);
        console.log('Merchant data loaded:', merchantData.data);
        console.log('Operating mode:', merchantData.data?.operating_mode);
        console.log('Reservation enabled:', merchantData.data?.reservation_enabled);
      } catch (error) {
        console.error('Error fetching merchant data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchantData();
  }, [getAccessTokenSilently]);

  const toggleOpenStatus = async () => {
    if (!merchantId) return;
    
    setIsTogglingOpen(true);
    try {
      const newStatus = !merchant?.is_currently_open;
      
      await api.put(`/api/merchants/${merchantId}`, {
        is_currently_open: newStatus,
        version: merchant?.version || 1
      });
      
      // Update local state
      setMerchant({
        ...merchant,
        is_currently_open: newStatus,
        version: (merchant?.version || 1) + 1
      });
    } catch (error) {
      console.error('Error toggling open status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsTogglingOpen(false);
    }
  };

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <div className={styles.dashboard}>
        <div className={styles.dashboard__header}>
          <Typography variant="heading-2">
            Merchant Dashboard
          </Typography>
          <Typography variant="body-large" style={{ color: 'var(--color-text-secondary)' }}>
            Manage your restaurant operations and menu
          </Typography>
          {merchant && (
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {merchant.operating_mode === 'static' && (
                <Button 
                  variant={merchant.is_currently_open ? 'success' : 'secondary'}
                  size="lg"
                  onClick={toggleOpenStatus}
                  isDisabled={isTogglingOpen}
                >
                  <span style={{ fontSize: '1.2em', marginRight: '0.5rem' }}>
                    {merchant.is_currently_open ? '🟢' : '🔴'}
                  </span>
                  {isTogglingOpen 
                    ? 'Updating...' 
                    : merchant.is_currently_open 
                      ? 'Open for Business' 
                      : 'Currently Closed'}
                </Button>
              )}
              <Button 
                variant="primary" 
                size="md" 
                onClick={() => setQrOpen(true)}
              >
                <span style={{ fontSize: '1.2em', marginRight: '0.5rem' }}>📱</span>
                Show QR Code
              </Button>
            </div>
          )}
        </div>

        {dashboardSections.map((section) => {
          const visibleItems = section.items.filter((item) => {
            if (item.showWhen && merchant) {
              return item.showWhen(merchant);
            }
            return true;
          });

          // Don't render section if no items are visible
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className={styles.dashboard__section}>
              <div className={styles.dashboard__sectionHeader}>
                <Typography variant="heading-4" className={styles.dashboard__sectionTitle}>
                  {section.title}
                </Typography>
                <Typography variant="body-medium" className={styles.dashboard__sectionDescription}>
                  {section.description}
                </Typography>
              </div>

              <div className={styles.dashboard__grid}>
                {visibleItems.map((item) => (
                  <Link key={item.href} href={item.href} className={styles.dashboard__link}>
                    <Card className={`${styles.dashboard__card} ${styles[`dashboard__card--${item.color}`]}`}>
                      <div className={styles.dashboard__cardIcon}>
                        {item.icon}
                      </div>
                      <div className={styles.dashboard__cardContent}>
                        <Typography variant="heading-5" className={styles.dashboard__cardTitle}>
                          {item.title}
                        </Typography>
                        <Typography variant="body-medium" className={styles.dashboard__cardDescription}>
                          {item.description}
                        </Typography>
                      </div>
                      <div className={styles.dashboard__cardArrow}>
                        →
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        <div className={styles.dashboard__footer}>
          <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
            More features coming soon...
          </Typography>
        </div>

        {merchant && (
          <MerchantQrModal
            merchant={merchant}
            open={qrOpen}
            onClose={() => setQrOpen(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}