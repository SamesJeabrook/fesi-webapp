'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SubItemsPageTemplate } from '@/components/templates/SubItemsPageTemplate';
import { createSubItemsAPI } from '@/services/subItemsAPI';
import api from '@/utils/api';

interface Merchant {
  id: string;
  business_name: string;
  name: string;
}

export default function AdminMerchantSubItemsPage() {
  const params = useParams();
  const merchantId = params.merchantId as string;
  const [merchant, setMerchant] = useState<Merchant | null>(null);

  // Create admin API instance with merchant ID
  const subItemsAPI = createSubItemsAPI('admin', merchantId);

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
  }, [merchantId]);

  const backLink = {
    label: `Back to ${merchant?.business_name || 'Merchant'} Dashboard`,
    href: `/admin/merchants/${merchantId}`
  };

  return (
    <SubItemsPageTemplate
      api={subItemsAPI}
      title="Sub-Items & Options Management"
      description="Manage customization options and add-ons for menu items"
      showMerchantName={true}
      backLink={backLink}
      adminContext={`Managing sub-items for ${merchant?.business_name || 'merchant'}`}
      requiredRoles={['admin']}
    />
  );
}