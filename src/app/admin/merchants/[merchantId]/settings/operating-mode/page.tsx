'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Typography, Button } from '@/components/atoms';
import { OperatingModeSettings } from '@/components/organisms';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/utils/api';
import styles from './operating-mode.module.scss';

interface Merchant {
  id: string;
  operating_mode?: 'event_based' | 'static';
  is_currently_open?: boolean;
}

export default function AdminOperatingModeSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const merchantId = params?.merchantId as string;
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMerchant = async () => {
      if (!merchantId) return;
      
      try {
        setIsLoading(true);
        const merchantData = await api.get(`/api/merchants/${merchantId}`);
        setMerchant(merchantData.data);
      } catch (error) {
        console.error('Failed to fetch merchant:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchant();
  }, [merchantId]);

  const handleModeChange = async () => {
    // Refetch merchant data to get updated mode
    if (!merchantId) return;
    
    try {
      const merchantData = await api.get(`/api/merchants/${merchantId}`);
      setMerchant(merchantData.data);
    } catch (error) {
      console.error('Failed to refetch merchant:', error);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute requireRole={['admin']}>
        <div className={styles.loading}>
          <Typography variant="body-medium">Loading...</Typography>
        </div>
      </ProtectedRoute>
    );
  }

  if (!merchant || !merchantId) {
    return (
      <ProtectedRoute requireRole={['admin']}>
        <div className={styles.error}>
          <Typography variant="heading-4">Merchant Not Found</Typography>
          <Typography variant="body-medium">Unable to load merchant information.</Typography>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['admin']}>
      <div className={styles.operatingModePage}>
        <div className={styles.header}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/merchants/${merchantId}/settings`)}
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
