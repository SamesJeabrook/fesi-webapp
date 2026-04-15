'use client';

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { PreOrderSettingsForm, PreOrderSettings } from '@/components/organisms';
import { Typography, Alert, BackLink } from '@/components/atoms';
import { getMerchantIdFromDevToken } from '@/utils/devAuth';
import api from '@/utils/api';
import styles from './pre-orders.module.scss';

export default function PreOrderSettingsPage() {
  const { user, getAccessTokenSilently } = useAuth0();
  const router = useRouter();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [settings, setSettings] = useState<PreOrderSettings | undefined>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get merchant ID
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

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (!merchantId) return;

      try {
        setLoading(true);
        const data = await api.get(`/api/pre-orders/merchants/${merchantId}/settings`);
        setSettings(data.settings);
      } catch (error) {
        console.error('Failed to fetch pre-order settings:', error);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [merchantId]);

  const handleSave = async (updatedSettings: PreOrderSettings) => {
    if (!merchantId) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      await api.put(`/api/pre-orders/merchants/${merchantId}/settings`, updatedSettings);
      
      setSettings(updatedSettings);
      setSuccessMessage('Pre-order settings saved successfully!');

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/merchant/admin/settings');
  };

  if (!merchantId || loading) {
    return (
      <ProtectedRoute requireRole={['merchant']}>
        <div className={styles.preOrderSettings}>
          <BackLink href="/merchant/admin/settings">Back to Settings</BackLink>
          <div className={styles.preOrderSettings__loading}>
            <Typography variant="body-medium">Loading settings...</Typography>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['merchant']}>
      <div className={styles.preOrderSettings}>
        <BackLink href="/merchant/admin/settings">Back to Settings</BackLink>

        <div className={styles.preOrderSettings__header}>
          <div>
            <Typography variant="heading-2">Pre-Order Settings</Typography>
            <Typography variant="body-medium" className={styles.preOrderSettings__subtitle}>
              Configure how customers can schedule orders for specific time slots
            </Typography>
          </div>
        </div>

        {successMessage && (
          <Alert type="success" className={styles.preOrderSettings__alert}>
            {successMessage}
          </Alert>
        )}

        {error && (
          <Alert type="error" className={styles.preOrderSettings__alert}>
            {error}
          </Alert>
        )}

        <div className={styles.preOrderSettings__content}>
          <div className={styles.preOrderSettings__infoBox}>
            <Typography variant="heading-5" className={styles.infoBox__title}>
              About Pre-Orders
            </Typography>
            <Typography variant="body-small" className={styles.infoBox__text}>
              Pre-orders allow customers to schedule their orders for specific pickup times. 
              This helps you manage capacity, reduce wait times, and plan your workflow more effectively.
            </Typography>
            <ul className={styles.infoBox__list}>
              <li>Set time slots (e.g., every 15 minutes)</li>
              <li>Control how many orders per slot</li>
              <li>Manage advance booking window</li>
              <li>Optionally suspend online orders when at capacity</li>
            </ul>
          </div>

          <PreOrderSettingsForm
            settings={settings}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={saving}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
