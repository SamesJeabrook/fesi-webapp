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
    ]
  },
  {
    title: 'User & Access Management',
    description: 'Manage test access, trials, and beta users',
    items: [
      {
        title: 'Test Access Management',
        description: 'Grant trial or beta access to merchants for testing',
        icon: '🎟️',
        href: '/admin/test-access',
        color: 'info'
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
            Admin Dashboard
          </Typography>
          <Typography variant="body-large" style={{ color: 'var(--color-text-secondary)' }}>
            Manage merchants and test access
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
            Admin tools for merchant management and test access
          </Typography>
        </div>
      </div>
    </ProtectedRoute>
  );
}