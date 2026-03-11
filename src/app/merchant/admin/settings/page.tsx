'use client';

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { SystemSettingsTemplate } from '@/components/templates/SystemSettingsTemplate/SystemSettingsTemplate';
import { Typography, Button } from '@/components/atoms';
import { getMerchantIdFromDevToken, getAuthToken } from '@/utils/devAuth';
import api from '@/utils/api';
import styles from './settings.module.scss';

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
  require_staff_login?: boolean;
  created_at?: string;
  updated_at?: string;
  version?: number;
}

export default function MerchantSettingsPage() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState<Category[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);

  // Get merchant ID from dev token, Auth0 token, or API
  useEffect(() => {
    const getMerchantId = async () => {
      // Check for dev token first
      const devMerchantId = getMerchantIdFromDevToken();
      if (devMerchantId) {
        setMerchantId(devMerchantId);
        return;
      }

      // Try Auth0 user's merchant_ids
      const merchantIds = user?.['https://fesi.app/merchant_ids'];
      if (merchantIds && merchantIds.length > 0) {
        setMerchantId(merchantIds[0]);
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
  }, [user, getAccessTokenSilently]);

  useEffect(() => {
    const fetchMerchantData = async () => {
      if (!merchantId) return;

      try {
        console.log('🔄 Fetching merchant data for:', merchantId);
        // Fetch merchant data by ID
        const merchantData = await api.get(`/api/merchants/${merchantId}`);
        console.log('🔍 Fetched merchant data:', merchantData);
        console.log('🔢 Merchant version from API:', merchantData.data?.version);
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
      <div className={styles.settingsContainer}>
        <div className={styles.settingsNav}>
          <Typography variant="heading-5" className={styles.navTitle}>Settings</Typography>
          <Link href="/merchant/admin/settings/operating-mode" className={styles.navLink}>
            <div className={styles.navItem}>
              <span className={styles.navIcon}>🏪</span>
              <div>
                <Typography variant="body-medium">Operating Mode</Typography>
                <Typography variant="body-small" className={styles.navDescription}>
                  Switch between event-based and static restaurant mode
                </Typography>
              </div>
            </div>
          </Link>
          <Link href="/merchant/admin/settings/reservations" className={styles.navLink}>
            <div className={styles.navItem}>
              <span className={styles.navIcon}>📅</span>
              <div>
                <Typography variant="body-medium">Reservations</Typography>
                <Typography variant="body-small" className={styles.navDescription}>
                  Configure table booking and reservation settings
                </Typography>
              </div>
            </div>
          </Link>
          <div className={styles.navItem + ' ' + styles.navItemActive}>
            <span className={styles.navIcon}>⚙️</span>
            <div>
              <Typography variant="body-medium">General Settings</Typography>
              <Typography variant="body-small" className={styles.navDescription}>
                Business info, categories, and compliance
              </Typography>
            </div>
          </div>
        </div>
        <div className={styles.settingsContent}>
          <SystemSettingsTemplate
            company={company}
            loading={loading}
            availableTags={availableTags.map(cat => ({ id: cat.id, label: cat.name }))}
            backLink={{ label: 'Back to Dashboard', href: '/merchant/admin' }}
          />
          {loadingTags && <div>Loading categories...</div>}
        </div>
      </div>
    </ProtectedRoute>
  );
}
