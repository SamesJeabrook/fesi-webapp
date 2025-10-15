'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { EventManagementTemplate } from '@/components/templates/EventManagementTemplate';

export default function AdminMerchantEventsPage() {
  const params = useParams();
  const merchantId = params.merchantId as string;

  return (
    <ProtectedRoute requireRole={['admin']}>
      <EventManagementTemplate
        context="admin"
        merchantId={merchantId}
        pageTitle={`Event Management - Merchant ${merchantId}`}
      />
    </ProtectedRoute>
  );
}