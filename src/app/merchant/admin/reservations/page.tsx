'use client';

import { useMerchant } from '@/hooks/useMerchant';
import { ReservationsTemplate } from '@/components/templates';

export default function ReservationsPage() {
  const { merchant } = useMerchant();

  if (!merchant) {
    return (
      <div className="loading">
        Loading merchant data...
      </div>
    );
  }

  return (
    <ReservationsTemplate
      merchantId={merchant.id}
      reservationsEnabled={merchant.reservation_enabled ?? false}
      showBackLink={true}
      backLinkUrl="/merchant/admin"
      tablesPageUrl="/merchant/admin/table-service"
    />
  );
}
