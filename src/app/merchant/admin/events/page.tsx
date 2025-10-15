'use client';

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { EventManagementTemplate } from '@/components/templates/EventManagementTemplate';

export default function MerchantEventsPage() {
  const { user } = useAuth0();

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <EventManagementTemplate
        context="merchant"
        merchantId={user?.sub}
        pageTitle="Event Management"
      />
    </ProtectedRoute>
  );
}