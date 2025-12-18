'use client';

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { SystemSettingsTemplate } from '@/components/templates/SystemSettingsTemplate/SystemSettingsTemplate';
import { getMerchantIdFromDevToken, getAuthToken } from '@/utils/devAuth';
import api from '@/utils/api';

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
  const { getAccessTokenSilently } = useAuth0();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState<Category[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);

  // Get merchant ID from dev token or API
  useEffect(() => {
    const getMerchantId = async () => {
      // Check for dev token first
      const devMerchantId = getMerchantIdFromDevToken();
      if (devMerchantId) {
        setMerchantId(devMerchantId);
        return;
      }

      // Otherwise, get from /me endpoint
      try {
        const data = await api.get('/api/merchants/me');
        setMerchantId(data.id);
      } catch (error) {
        console.error('Error fetching merchant ID:', error);
      }
    };

    getMerchantId();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    const fetchMerchantData = async () => {
      if (!merchantId) return;

      try {
        // Fetch merchant data by ID
        const merchantData = await api.get(`/api/merchants/${merchantId}`);
        setCompany(merchantData.data);
      } catch (error) {
        console.error('Failed to fetch merchant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchantData();
  }, [merchantId, getAccessTokenSilently]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingTags(true);
        const data = await api.get('/api/menu/merchant-categories', { skipAuth: true });
        setAvailableTags((data.data || []).map((cat: any) => ({ 
          id: cat.id, 
          name: cat.name, 
          description: cat.description, 
          icon_name: cat.icon_name 
        })));
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setAvailableTags([]);
      } finally {
        setLoadingTags(false);
      }
    };
    fetchCategories();
  }, []);

  if (!merchantId) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div>Loading...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <SystemSettingsTemplate
        company={company}
        loading={loading}
        availableTags={availableTags.map(cat => ({ id: cat.id, label: cat.name }))}
        backLink={{ label: 'Back to Dashboard', href: '/merchant/admin' }}
      />
      {loadingTags && <div>Loading categories...</div>}
    </ProtectedRoute>
  );
}
