'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { SubItemsPageTemplate } from '@/components/templates/SubItemsPageTemplate';
import { createSubItemsAPI } from '@/services/subItemsAPI';

interface Merchant {
  id: string;
  business_name: string;
  name: string;
}

export default function AdminMerchantSubItemsPage() {
  const params = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const merchantId = params.merchantId as string;
  const [merchant, setMerchant] = useState<Merchant | null>(null);

  // Create admin API instance with merchant ID
  const api = createSubItemsAPI('admin', merchantId);

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
          },
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/merchants/${merchantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const merchantData = await response.json();
          setMerchant(merchantData.data);
        }
      } catch (error) {
        console.error('Failed to fetch merchant:', error);
      }
    };

    if (merchantId) {
      fetchMerchant();
    }
  }, [merchantId, getAccessTokenSilently]);

  const backLink = {
    label: `Back to ${merchant?.business_name || 'Merchant'} Dashboard`,
    href: `/admin/merchants/${merchantId}`
  };

  return (
    <SubItemsPageTemplate
      api={api}
      title="Sub-Items & Options Management"
      description="Manage customization options and add-ons for menu items"
      showMerchantName={true}
      backLink={backLink}
      adminContext={`Managing sub-items for ${merchant?.business_name || 'merchant'}`}
      requiredRoles={['admin']}
    />
  );
}