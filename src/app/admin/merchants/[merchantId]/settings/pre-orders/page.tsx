'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { PreOrderSettingsForm, PreOrderSettings } from '@/components/organisms';
import { Typography, Alert, Button } from '@/components/atoms';
import api from '@/utils/api';
import styles from './pre-orders.module.scss';

export default function AdminPreOrderSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const merchantId = params?.merchantId as string;
  const [settings, setSettings] = useState<PreOrderSettings | undefined>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    router.push(`/admin/merchants/${merchantId}/settings`);
  };

  if (!merchantId || loading) {
    return (
      <ProtectedRoute requireRole={['admin']}>
        <div className={styles.container}>
          <Typography variant="body-medium">Loading...</Typography>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['admin']}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/merchants/${merchantId}/settings`)}
          >
            ← Back to Settings
          </Button>
        </div>

        {error && (
          <Alert variant="error" className={styles.alert}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert variant="success" className={styles.alert}>
            {successMessage}
          </Alert>
        )}

        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <Typography variant="heading-3">Pre-Order Settings</Typography>
            <Typography variant="body-medium" className={styles.description}>
              Configure scheduled orders and time slot settings for this merchant
            </Typography>
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
