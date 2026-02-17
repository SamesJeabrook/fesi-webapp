'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { EventManagementTemplate } from '@/components/templates/EventManagementTemplate';
import api from '@/utils/api';

interface Merchant {
  id: string;
  business_name: string;
  name: string;
}

export default function AdminMerchantEventsPage() {
  const params = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const merchantId = params?.merchantId as string;
  const [merchant, setMerchant] = useState<Merchant | null>(null);

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const merchantData = await api.get(`/api/merchants/${merchantId}`);
        setMerchant(merchantData.data);
      } catch (error) {
        console.error('Failed to fetch merchant:', error);
      }
    };

    if (merchantId) {
      fetchMerchant();
    }
  }, [merchantId, getAccessTokenSilently]);

  const backLink = {
    label: `Back to ${merchant?.business_name || 'Merchant'} Dashboard`,
    href: `/admin/merchants/${merchantId}`
  };

  return (
    <ProtectedRoute requireRole={['admin']}>
      <EventManagementTemplate
        context="admin"
        merchantId={merchantId}
        pageTitle={`Event Management - ${merchant?.business_name || 'Merchant'}`}
        backLink={backLink}
        adminContext={`Managing events for ${merchant?.business_name || 'merchant'}`}
      />
    </ProtectedRoute>
  );
}