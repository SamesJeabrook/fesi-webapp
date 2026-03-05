'use client';

import React from 'react';
import Link from 'next/link';
import { Typography, Button } from '@/components/atoms';
import { MyInvitations } from '@/components/molecules';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import styles from './invitations.module.scss';

export default function MerchantInvitationsPage() {
  return (
    <ProtectedRoute requireRole={['merchant', 'admin']}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <Link href="/merchant/admin" className={styles.backLink}>
              ← Back to Dashboard
            </Link>
            <Typography variant="heading-2">My Invitations</Typography>
            <Typography variant="body-medium" className={styles.subtitle}>
              Manage invitations to participate in group events organized by partners
            </Typography>
          </div>
        </div>

        <div className={styles.content}>
          <MyInvitations showAll={true} />
        </div>

        <div className={styles.infoSection}>
          <Typography variant="heading-4">About Group Events</Typography>
          <Typography variant="body-medium">
            When an organization invites you to participate in a group event, you'll receive an email 
            with details about the event. By accepting an invitation, you agree to:
          </Typography>
          <ul>
            <li>Participate in the organized event at the specified location and dates</li>
            <li>Have your orders linked to the group event for coordinated management</li>
            <li>Contribute a small revenue share (typically 20% of the platform fee) to support the organization's event coordination efforts</li>
            <li>Follow any specific guidelines or requirements set by the organizing partner</li>
          </ul>
          <Typography variant="body-small" className={styles.note}>
            Note: Revenue sharing only applies to orders placed during the event. Your standard Fesi service continues as normal for all other orders.
          </Typography>
        </div>
      </div>
    </ProtectedRoute>
  );
}
