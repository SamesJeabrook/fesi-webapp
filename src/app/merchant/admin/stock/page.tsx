'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { StockManagement } from '@/components/organisms';
import { Typography, Button } from '@/components/atoms';
import { getMerchantIdFromDevToken } from '@/utils/devAuth';
import api from '@/utils/api';
import styles from '../dashboard.module.scss';

export default function StockManagementPage() {
  const { user } = useAuth0();
  const router = useRouter();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMerchantId = async () => {
      try {
        setIsLoading(true);
        
        // Check for dev token first
        const devMerchantId = getMerchantIdFromDevToken();
        
        if (devMerchantId) {
          setMerchantId(devMerchantId);
        } else {
          // Try Auth0 user's merchant_ids
          const merchantIds = user?.['https://fesi.app/merchant_ids'];
          if (merchantIds && merchantIds.length > 0) {
            setMerchantId(merchantIds[0]);
          } else {
            // Get from /me endpoint
            const data = await api.get('/api/merchants/me');
            setMerchantId(data.id);
          }
        }
      } catch (error) {
        console.error('Error fetching merchant ID:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchantId();
  }, [user]);

  if (isLoading) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
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

  if (!merchantId) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div className={styles.dashboard}>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">Unable to load merchant information. Please try again.</p>
            <Button 
              variant="primary" 
              size="md" 
              onClick={() => router.push('/merchant/admin')}
              className="mt-4"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <div className={styles.dashboard}>
        {/* Header */}
        <div className={styles.dashboard__header}>
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="heading-2">
                Stock Management
              </Typography>
              <Typography variant="body-large" style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                Track inventory levels and manage stock for your menu items
              </Typography>
            </div>
            <Button 
              variant="secondary" 
              size="md" 
              onClick={() => router.push('/merchant/admin')}
            >
              ← Back to Dashboard
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
