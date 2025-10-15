'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { SubItemsPageTemplate } from '@/components/templates/SubItemsPageTemplate';
import { createSubItemsAPI } from '@/services/subItemsAPI';

export default function AdminMerchantSubItemsPage() {
  const params = useParams();
  const merchantId = params.merchantId as string;

  // Create admin API instance with merchant ID
  const api = createSubItemsAPI('admin', merchantId);

  const backLink = {
    label: 'Back to Merchant Menu',
    href: `/admin/merchants/${merchantId}/menu`
  };

  return (
    <SubItemsPageTemplate
      api={api}
      title="Sub-Items & Options Management"
      description="Manage customization options and add-ons for menu items"
      showMerchantName={true}
      backLink={backLink}
      requiredRoles={['admin']}
    />
  );
}