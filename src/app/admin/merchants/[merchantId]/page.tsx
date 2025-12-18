"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button } from '@/components/atoms';
import { MerchantQrModal } from '@/components/molecules/MerchantQrModal/MerchantQrModal';
import { Card } from '@/components/atoms/Card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/utils/api';
import Link from 'next/link';
import styles from './merchantDashboard.module.scss';

interface Merchant {
  id: string;
  business_name: string;
  name: string;
  email: string;
  username: string;
  status: string;
}

const dashboardItems = [
  {
    title: 'Orders Management',
    description: 'View and manage merchant orders',
    icon: '📋',
    href: '/admin/merchants/[merchantId]/orders',
    color: 'primary'
  },
  {
    title: 'Menu Categories',
    description: 'Manage menu categories and organization',
    icon: '📁',
    href: '/admin/merchants/[merchantId]/menu/categories',
    color: 'success'
  },
  {
    title: 'Menu Items',
    description: 'Edit menu items and pricing',
    icon: '🍽️',
    href: '/admin/merchants/[merchantId]/menu/items',
    color: 'warning'
  },
  {
    title: 'Sub-Items & Options',
    description: 'Manage customizations and add-ons',
    icon: '⚙️',
    href: '/admin/merchants/[merchantId]/menu/sub-items',
    color: 'info'
  },
  {
    title: 'Events Management',
    description: 'Manage merchant events and schedules',
    icon: '🎉',
    href: '/admin/merchants/[merchantId]/events',
    color: 'secondary'
  },
  {
    title: 'Merchant Settings',
    description: 'Restaurant settings and configuration',
    icon: '🏪',
    href: '/admin/merchants/[merchantId]/settings',
    color: 'secondary'
  },
  {
    title: 'Analytics & Reports',
    description: 'View sales and performance metrics',
    icon: '📊',
    href: '/admin/merchants/[merchantId]/analytics',
    color: 'primary'
  },
];

export default function AdminMerchantDashboard() {
  const params = useParams();
  const router = useRouter();
  const { getAccessTokenSilently } = useAuth0();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qrOpen, setQrOpen] = useState(false);

  const merchantId = params?.merchantId as string;

  const fetchMerchant = async () => {
    try {
      setIsLoading(true);

      const data = await api.get(`/api/merchants/${merchantId}`);
      setMerchant(data.data);
    } catch (error) {
      console.error('Error fetching merchant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (merchantId) {
      fetchMerchant();
    }
  }, [merchantId]);

  if (isLoading) {
    return (
      <ProtectedRoute requireRole={['admin']}>
        <div className={styles.dashboard}>
          <div className={styles.dashboard__loading}>
            <Typography variant="body-medium">Loading merchant details...</Typography>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!merchant) {
    return (
      <ProtectedRoute requireRole={['admin']}>
        <div className={styles.dashboard}>
          <div className={styles.dashboard__error}>
            <Typography variant="heading-4" style={{ color: 'var(--color-error)' }}>
              Merchant Not Found
            </Typography>
            <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
              The merchant you're looking for doesn't exist or you don't have permission to access it.
            </Typography>
            <Button variant="primary" onClick={() => router.push('/admin/merchants')}>
              Back to Merchants
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['admin']}>
      <div className={styles.dashboard}>
        <div className={styles.dashboard__header}>
          <div className={styles.dashboard__headerContent}>
            <Link href="/admin/merchants" className={styles.dashboard__backLink}>
              ← Back to Merchants
            </Link>
            <Typography variant="heading-2">
              Managing: {merchant.business_name || merchant.name}
            </Typography>
            <div className={styles.dashboard__merchantInfo}>
              <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {merchant.email} • @{merchant.username}
              </Typography>
              <span className={`${styles.dashboard__status} ${styles[`dashboard__status--${merchant.status}`]}`}>
                {merchant.status}
              </span>
            </div>
            <div style={{ marginTop: 24 }}>
              <Button variant="primary" size="md" onClick={() => setQrOpen(true)}>
                <span style={{ fontSize: '1.2em', marginRight: '0.5rem' }}>📱</span>
                Show QR Code
              </Button>
            </div>
            <MerchantQrModal
              merchant={{
                ...merchant,
                phone: (merchant as any).phone || '',
                created_at: (merchant as any).created_at || ''
              }}
              open={qrOpen}
              onClose={() => setQrOpen(false)}
            />
          </div>
        </div>

        <div className={styles.dashboard__grid}>
          {dashboardItems.map((item) => {
            const href = item.href.replace('[merchantId]', merchantId);
            return (
              <Link key={item.href} href={href} className={styles.dashboard__link}>
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
            );
          })}
        </div>

        <div className={styles.dashboard__footer}>
          <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
            Admin Mode: You are managing this merchant's account
          </Typography>
        </div>
      </div>
    </ProtectedRoute>
  );
}