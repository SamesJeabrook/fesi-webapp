'use client';

import { Typography, Grid } from '@/components/atoms';
import { CustomerNavigationWrapper } from '@/components/molecules/CustomerNavigation';
import { VendorsMap } from '@/components/organisms/VendorsMap';
import styles from './vendors.module.scss';

// This page shows all available vendors on an interactive map
export default function VendorsPage() {
  return (
    <>
      <CustomerNavigationWrapper />
      <div className={styles.vendorsPage}>
      <div className={styles.vendorsPage__header}>
        <Typography as="h1" variant="heading-2">
          Find Food Vendors Near You
        </Typography>
        
        <Typography variant="body-large" style={{ color: 'var(--color-text-secondary)' }}>
          Discover delicious food from local mobile stalls and food trucks. Click on any marker to view their menu and place an order.
        </Typography>
      </div>

      <VendorsMap />
      </div>
    </>
  );
}
