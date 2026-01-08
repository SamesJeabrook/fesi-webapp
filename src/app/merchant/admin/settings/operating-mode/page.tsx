'use client';

import React from 'react';
import { Typography, Button } from '@/components/atoms';
import { OperatingModeSettings } from '@/components/organisms';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useMerchant } from '@/hooks/useMerchant';
import { useRouter } from 'next/navigation';
import styles from './operating-mode.module.scss';

export default function OperatingModeSettingsPage() {
  const router = useRouter();
  const { merchant, merchantId, isLoading, refetchMerchant } = useMerchant();

  const handleModeChange = () => {
    // Refetch merchant data to get updated mode
    refetchMerchant();
  };

  if (isLoading) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div className={styles.loading}>
          <Typography variant="body-medium">Loading...</Typography>
        </div>
      </ProtectedRoute>
    );
  }

  if (!merchant || !merchantId) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div className={styles.error}>
          <Typography variant="heading-4">Merchant Not Found</Typography>
          <Typography variant="body-medium">Unable to load merchant information.</Typography>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <div className={styles.operatingModePage}>
        <div className={styles.header}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/merchant/admin/settings')}
          >
            ← Back to Settings
          </Button>
        </div>

        <div className={styles.content}>
          <OperatingModeSettings
            merchantId={merchantId}
            currentMode={merchant.operating_mode}
            isCurrentlyOpen={merchant.is_currently_open}
            onModeChange={handleModeChange}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
