'use client';

import React from 'react';
import { SubItemsPageTemplate } from '@/components/templates/SubItemsPageTemplate';
import { createSubItemsAPI } from '@/services/subItemsAPI';

export default function MerchantSubItemsPage() {
  // Create merchant API instance (automatically scoped to merchant)
  const api = createSubItemsAPI('merchant');

  const backLink = {
    label: 'Back to Menu',
    href: '/merchant/admin/menu'
  };

  return (
    <SubItemsPageTemplate
      api={api}
      title="Sub-Items & Options Management"
      description="Manage customization options and add-ons for your menu items"
      showMerchantName={false}
      backLink={backLink}
      requiredRoles={['merchant']}
    />
  );
}