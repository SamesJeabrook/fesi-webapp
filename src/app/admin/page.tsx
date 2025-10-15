'use client';

import React from 'react';
import Link from 'next/link';
import { Typography } from '@/components/atoms';
import { Card } from '@/components/atoms/Card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import styles from './dashboard.module.scss';

const dashboardItems = [
  {
    title: 'Merchants Management',
    description: 'View and manage all registered merchants',
    icon: '🏪',
    href: '/admin/merchants',
    color: 'primary'
  },
  {
    title: 'Global Events',
    description: 'View and manage events across all merchants',
    icon: '🎉',
    href: '/admin/events',
    color: 'secondary'
  },
  {
    title: 'Analytics',
    description: 'Platform-wide analytics and reporting',
    icon: '📊',
    href: '/admin/analytics',
    color: 'success'
  },
  {
    title: 'System Settings',
    description: 'Platform configuration and settings',
    icon: '⚙️',
    href: '/admin/settings',
    color: 'warning'
  },
];

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireRole={['admin']}>
      <div className={styles.dashboard}>
        <div className={styles.dashboard__header}>
          <Typography variant="heading-1">Admin Dashboard</Typography>
          <Typography variant="body-large">
            Manage your platform and merchants
          </Typography>
        </div>

        <div className={styles.dashboard__grid}>
          {dashboardItems.map((item, index) => (
            <Link key={index} href={item.href} className={styles.dashboard__link}>
              <Card className={`${styles.dashboard__card} ${styles[`dashboard__card--${item.color}`]}`}>
                <div className={styles.dashboard__cardIcon}>
                  {item.icon}
                </div>
                <Typography variant="heading-4" className={styles.dashboard__cardTitle}>
                  {item.title}
                </Typography>
                <Typography variant="body-medium">
                  {item.description}
                </Typography>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}