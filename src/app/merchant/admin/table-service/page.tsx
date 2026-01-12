'use client';

import { useMerchant } from '@/hooks/useMerchant';
import { TableServiceTemplate } from '@/components/templates';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function TableServicePage() {
  const { merchant } = useMerchant();

  if (!merchant) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div style={{ padding: 'var(--spacing-8)', textAlign: 'center' }}>
          Loading merchant data...
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <TableServiceTemplate merchantId={merchant.id} />
    </ProtectedRoute>
  );
}
