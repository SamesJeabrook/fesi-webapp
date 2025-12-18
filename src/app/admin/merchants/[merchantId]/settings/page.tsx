

'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { SystemSettingsTemplate } from '@/components/templates/SystemSettingsTemplate/SystemSettingsTemplate';
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

export default function AdminSystemSettingsPage() {
  const params = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const merchantId = params?.merchantId as string;
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState<Category[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const companyData = await api.get(`/api/merchants/${merchantId}`);
        setCompany(companyData.data);
      } catch (error) {
        console.error('Failed to fetch company:', error);
      } finally {
        setLoading(false);
      }
    };
    if (merchantId) {
      fetchCompany();
    }
  }, [merchantId, getAccessTokenSilently]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingTags(true);
        const data = await api.get('/api/menu/merchant-categories', { skipAuth: true });
        setAvailableTags((data.data || []).map((cat: any) => ({ id: cat.id, name: cat.name, description: cat.description, icon_name: cat.icon_name })));
      } catch (error) {
        setAvailableTags([]);
      } finally {
        setLoadingTags(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <ProtectedRoute requireRole={['admin']}>
      <SystemSettingsTemplate
        company={company}
        loading={loading}
        availableTags={availableTags.map(cat => ({ id: cat.id, label: cat.name }))}
        backLink={{ label: 'Back to Merchant', href: `/admin/merchants/${merchantId}` }}
        adminContext="Merchant Settings"
      />
      {loadingTags && <div>Loading categories...</div>}
    </ProtectedRoute>
  );
}
