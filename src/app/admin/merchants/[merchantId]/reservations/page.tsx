'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ReservationsTemplate } from '@/components/templates';
import api from '@/utils/api';

export default function AdminMerchantReservationsPage() {
  const params = useParams();
  const merchantId = params?.merchantId as string;
  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const data = await api.get(`/api/merchants/${merchantId}`);
        setMerchant(data.data);
      } catch (error) {
        console.error('Error fetching merchant:', error);
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
      <ProtectedRoute requireRole={['admin']}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          Loading merchant data...
        </div>
      </ProtectedRoute>
    );
  }

  if (!merchant) {
    return (
      <ProtectedRoute requireRole={['admin']}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Merchant Not Found</h2>
          <p>Unable to load merchant information.</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['admin']}>
      <ReservationsTemplate
        merchantId={merchantId}
        reservationsEnabled={merchant.reservation_enabled ?? false}
        showBackLink={true}
        backLinkUrl={`/admin/merchants/${merchantId}`}
        tablesPageUrl={`/admin/merchants/${merchantId}/table-service`}
      />
    </ProtectedRoute>
  );
}
