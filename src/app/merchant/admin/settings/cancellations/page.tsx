'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Typography } from '@/components/atoms';
import { CancellationSettings } from '@/components/organisms/CancellationSettings';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/utils/api';
import Link from 'next/link';
import styles from './cancellations.module.scss';

interface Merchant {
  id: string;
  business_name: string;
}

export default function MerchantCancellationsPage() {
  const params = useParams();
  const merchantId = params?.merchantId as string;
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const response = await api.get(`/api/merchants/${merchantId}`);
        setMerchant(response.data);
      } catch (error) {
        console.error('Failed to fetch merchant:', error);
      } finally {
        setLoading(false);
      }
    };

    if (merchantId) {
      fetchMerchant();
    }
  }, [merchantId]);

  if (loading) {
    return (
      <ProtectedRoute requireRole={['merchant', 'admin']}>
        <div className={styles.cancellations}>
          <Typography variant="body-medium">Loading...</Typography>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['merchant', 'admin']}>
      <div className={styles.cancellations}>
        <div className={styles.cancellations__header}>
          <Link href={`/merchant/admin/settings`} className={styles.cancellations__backLink}>
            ← Back to Settings
          </Link>
          <Typography variant="heading-2">
            Cancellation Policy
          </Typography>
          {merchant && (
            <Typography variant="body-medium" className={styles.cancellations__subtitle}>
              {merchant.business_name}
            </Typography>
          )}
        </div>

        <div className={styles.cancellations__content}>
          <CancellationSettings merchantId={merchantId} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
