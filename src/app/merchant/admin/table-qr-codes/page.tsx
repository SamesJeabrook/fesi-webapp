'use client';

import { useMerchant } from '@/hooks/useMerchant';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { TableQrCodes } from '@/components/molecules/TableQrCodes/TableQrCodes';
import Link from 'next/link';
import styles from './tableQrCodes.module.scss';

export default function TableQrCodesPage() {
  const { merchant } = useMerchant();

  if (!merchant) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div className={styles.loading}>
          Loading merchant data...
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <div className={styles.page}>
        <Link href="/merchant/admin" className={styles.backLink}>
          ← Back to Dashboard
        </Link>
        <TableQrCodes 
          merchantId={merchant.id} 
          merchantUsername={merchant.username}
        />
      </div>
    </ProtectedRoute>
  );
}
