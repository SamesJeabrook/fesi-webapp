'use client';

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { SystemSettingsTemplate } from '@/components/templates/SystemSettingsTemplate/SystemSettingsTemplate';

interface Category {
  id: string;
  name: string;
  description: string;
  icon_name: string;
}

interface Company {
  id: string;
  name: string;
  description: string;
  username: string;
  categories?: Category[];
  currency?: string;
  created_at?: string;
  updated_at?: string;
}

export default function MerchantSettingsPage() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState<Category[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);

  useEffect(() => {
    const fetchMerchantData = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
          },
        });

        // Get the merchant's own data - the API will determine the merchant from the JWT token
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const merchantData = await response.json();
          setCompany(merchantData.data);
        } else {
          console.error('Failed to fetch merchant data:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch merchant:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMerchantData();
    }
  }, [user, getAccessTokenSilently]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingTags(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/merchant-categories`);
        if (response.ok) {
          const data = await response.json();
          setAvailableTags((data.data || []).map((cat: any) => ({ 
            id: cat.id, 
            name: cat.name, 
            description: cat.description, 
            icon_name: cat.icon_name 
          })));
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setAvailableTags([]);
      } finally {
        setLoadingTags(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <SystemSettingsTemplate
        company={company}
        loading={loading}
        availableTags={availableTags.map(cat => ({ id: cat.id, label: cat.name }))}
        backLink={{ label: 'Back to Dashboard', href: '/merchant/admin' }}
        adminContext="My Settings"
      />
      {loadingTags && <div>Loading categories...</div>}
    </ProtectedRoute>
  );
}
