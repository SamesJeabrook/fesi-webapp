'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { EventManagementTemplate } from '@/components/templates/EventManagementTemplate';

export default function AdminEventsPage() {
  return (
    <ProtectedRoute requireRole={['admin']}>
      <EventManagementTemplate
        context="admin"
        pageTitle="Global Events Management"
      />
    </ProtectedRoute>
  );
}