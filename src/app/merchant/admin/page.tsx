'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button } from '@/components/atoms';
import { Card } from '@/components/atoms/Card';
import { MerchantQrModal } from '@/components/molecules/MerchantQrModal/MerchantQrModal';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getMerchantIdFromDevToken, getAuthToken } from '@/utils/devAuth';
import styles from './dashboard.module.scss';

const dashboardItems = [
  {
    title: 'Orders Management',
    description: 'View and manage incoming orders',
    icon: '📋',
    href: '/merchant/admin/orders',
    color: 'primary'
  },
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
    title: 'Sub-Items & Options',
    description: 'Configure customizations and add-ons',
    icon: '🔧',
    href: '/merchant/admin/menu/sub-items',
    color: 'info'
  },
  {
    title: 'Events Management',
    description: 'Create and manage multi-day events',
    icon: '🎉',
    href: '/merchant/admin/events',
    color: 'secondary'
  },
  {
    title: 'Point of Sale',
    description: 'Take orders directly at the counter',
    icon: '💳',
    href: '/merchant/admin/pos',
    color: 'primary'
  },
  {
    title: 'System Settings',
    description: 'Configure your merchant settings and preferences',
    icon: '⚙️',
    href: '/merchant/admin/settings',
    color: 'warning'
  },
  // Future expansion items (commented for now)
  // {
  //   title: 'Analytics',
  //   description: 'View sales and performance metrics',
  //   icon: '📊',
  //   href: '/merchant/admin/analytics',
  //   color: 'secondary'
  // },
];

export default function MerchantAdminDashboard() {
  const { getAccessTokenSilently } = useAuth0();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [merchant, setMerchant] = useState<any>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
          const token = await getAuthToken(getAccessTokenSilently);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            id = data.id;
          } else {
            console.error('Failed to fetch merchant ID');
            return;
          }
        }

        setMerchantId(id);

        // Fetch full merchant details
        const token = await getAuthToken(getAccessTokenSilently);
        const merchantResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (merchantResponse.ok) {
          const merchantData = await merchantResponse.json();
          setMerchant(merchantData.data);
        }
      } catch (error) {
        console.error('Error fetching merchant data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchantData();
  }, [getAccessTokenSilently]);

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
            <div style={{ marginTop: '1.5rem' }}>
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

        <div className={styles.dashboard__grid}>
          {dashboardItems.map((item) => (
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