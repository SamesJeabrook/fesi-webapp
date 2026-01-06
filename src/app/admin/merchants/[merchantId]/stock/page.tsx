'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { StockManagement } from '@/components/organisms';
import { Typography, Button } from '@/components/atoms';
import api from '@/utils/api';
import styles from '../merchantDashboard.module.scss';

interface Merchant {
  id: string;
  business_name: string;
  name: string;
}

export default function AdminStockManagementPage() {
  const params = useParams();
  const router = useRouter();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const merchantId = params?.merchantId as string;

  useEffect(() => {
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

    if (merchantId) {
      fetchMerchant();
    }
  }, [merchantId]);

  if (isLoading) {
    return (
      <ProtectedRoute requireRole={['admin']}>
        <div className={styles.dashboard}>
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!merchant) {
    return (
      <ProtectedRoute requireRole={['admin']}>
        <div className={styles.dashboard}>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">Unable to load merchant information. Please try again.</p>
            <Button 
              variant="primary" 
              size="md" 
              onClick={() => router.push(`/admin/merchants/${merchantId}`)}
              className="mt-4"
            >
              Back to Merchant Dashboard
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['admin']}>
      <div className={styles.dashboard}>
        {/* Header */}
        <div className={styles.dashboard__header}>
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="heading-2">
                Stock Management - {merchant.business_name}
              </Typography>
              <Typography variant="body-large" style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                Track inventory levels and manage stock for this merchant's menu items
              </Typography>
            </div>
            <Button 
              variant="secondary" 
              size="md" 
              onClick={() => router.push(`/admin/merchants/${merchantId}`)}
            >
              ← Back to Merchant Dashboard
            </Button>
          </div>
        </div>

        {/* Stock Management Component */}
        <div style={{ marginTop: '2rem' }}>
          <StockManagement merchantId={merchantId} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
