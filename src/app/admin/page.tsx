'use client';

import React from 'react';
import Link from 'next/link';
import { Typography } from '@/components/atoms';
import { Card } from '@/components/atoms/Card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import styles from './dashboard.module.scss';

interface DashboardItem {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

interface DashboardSection {
  title: string;
  description: string;
  items: DashboardItem[];
}

const dashboardSections: DashboardSection[] = [
  {
    title: 'Merchant Management',
    description: 'Manage merchants, assist with issues, and configure settings',
    items: [
      {
        title: 'All Merchants',
        description: 'View and manage all registered merchants',
        icon: '🏪',
        href: '/admin/merchants',
        color: 'primary'
      },
      {
        title: 'Merchant Support',
        description: 'Access merchant dashboards to assist with service calls',
        icon: '🛠️',
        href: '/admin/merchant-support',
        color: 'info'
      },
      {
        title: 'Merchant Settings',
        description: 'Configure merchant settings and resolve issues',
        icon: '⚙️',
        href: '/admin/merchant-settings',
        color: 'warning'
      },
    ]
  },
  {
    title: 'Platform Operations',
    description: 'Platform-wide operations and analytics',
    items: [
      {
        title: 'Group Events',
        description: 'Organize collaborative events with multiple merchants',
        icon: '🤝',
        href: '/admin/group-events',
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
        title: 'Platform Analytics',
        description: 'Platform-wide analytics and reporting',
        icon: '📊',
        href: '/admin/analytics',
        color: 'success'
      },
      {
        title: 'Orders Overview',
        description: 'Monitor all orders across the platform',
        icon: '📋',
        href: '/admin/orders',
        color: 'primary'
      },
    ]
  },
  {
    title: 'System Administration',
    description: 'Platform configuration and advanced settings',
    items: [
      {
        title: 'System Settings',
        description: 'Platform configuration and global settings',
        icon: '⚙️',
        href: '/admin/settings',
        color: 'warning'
      },
      {
        title: 'User Management',
        description: 'Manage admin users and permissions',
        icon: '👥',
        href: '/admin/users',
        color: 'info'
      },
      {
        title: 'Logs & Monitoring',
        description: 'View system logs and monitor platform health',
        icon: '📝',
        href: '/admin/logs',
        color: 'secondary'
      },
    ]
  }
];

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireRole={['admin', 'organization']}>
      <div className={styles.dashboard}>
        <div className={styles.dashboard__header}>
          <Typography variant="heading-2">
            Organization Dashboard
          </Typography>
          <Typography variant="body-large" style={{ color: 'var(--color-text-secondary)' }}>
            Organize group events and collaborate with merchants
          </Typography>
        </div>

        {dashboardSections.map((section) => (
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
              {section.items.map((item) => (
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
        ))}

        <div className={styles.dashboard__footer}>
          <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
            Platform administration and merchant support tools
          </Typography>
        </div>
      </div>
    </ProtectedRoute>
  );
}