'use client';

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { EventManagementTemplate } from '@/components/templates/EventManagementTemplate';
import { getMerchantIdFromDevToken, getAuthToken } from '@/utils/devAuth';
import api from '@/utils/api';

export default function MerchantEventsPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [merchantId, setMerchantId] = useState<string | null>(null);

  // Get merchant ID from dev token or API
  useEffect(() => {
    const getMerchantId = async () => {
      // Check for dev token first
      const devMerchantId = getMerchantIdFromDevToken();
      if (devMerchantId) {
        setMerchantId(devMerchantId);
        return;
      }

      // Otherwise, get from /me endpoint
      try {
        const data = await api.get('/api/merchants/me');
        setMerchantId(data.id);
      } catch (error) {
        console.error('Error fetching merchant ID:', error);
      }
    };

    getMerchantId();
  }, [getAccessTokenSilently]);

  if (!merchantId) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div>Loading...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <EventManagementTemplate
        context="merchant"
        merchantId={merchantId}
        pageTitle="Event Management"
        backLink={{
          href: '/merchant/admin',
          label: 'Back to Dashboard'
        }}
      />
    </ProtectedRoute>
  );
}