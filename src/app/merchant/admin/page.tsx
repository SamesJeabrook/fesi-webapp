'use client';

import React from 'react';
import Link from 'next/link';
import { Typography } from '@/components/atoms';
import { Card } from '@/components/atoms/Card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
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
    icon: '⚙️',
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
  // Future expansion items (commented for now)
  // {
  //   title: 'Analytics',
  //   description: 'View sales and performance metrics',
  //   icon: '📊',
  //   href: '/merchant/admin/analytics',
  //   color: 'secondary'
  // },
  // {
  //   title: 'Settings',
  //   description: 'Restaurant settings and preferences',
  //   icon: '⚙️',
  //   href: '/merchant/admin/settings',
  //   color: 'primary'
  // },
];

export default function MerchantAdminDashboard() {
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
      </div>
    </ProtectedRoute>
  );
}