'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/utils/api';
import styles from './beta.module.scss';

interface BetaSettings {
  is_beta_user: boolean;
  beta_granted_at: string | null;
  beta_notes: string | null;
  max_outlets_override: number | null;
}

interface MerchantInfo {
  id: string;
  name: string;
  subscription_tier: string;
}

export default function BetaManagementPage() {
  const params = useParams();
  const router = useRouter();
  const merchantId = params?.merchantId as string;
  
  const [merchant, setMerchant] = useState<MerchantInfo | null>(null);
  const [settings, setSettings] = useState<BetaSettings>({
    is_beta_user: false,
    beta_granted_at: null,
    beta_notes: null,
    max_outlets_override: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    fetchMerchantBetaSettings();
  }, [merchantId]);

  const fetchMerchantBetaSettings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get(`/api/merchants/${merchantId}/beta-settings`);
      
      setMerchant(response.merchant);
      setSettings(response.settings);
    } catch (err: any) {
      setError(err.message || 'Failed to load beta settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await api.put(`/api/merchants/${merchantId}/beta-settings`, settings);
      
      setSuccess('Beta settings updated successfully!');
      await fetchMerchantBetaSettings();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save beta settings');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleBeta = () => {
    setSettings({
      ...settings,
      is_beta_user: !settings.is_beta_user,
      beta_granted_at: !settings.is_beta_user ? new Date().toISOString() : null
    });
  };

  if (loading) {
    return (
      <ProtectedRoute requireRole={['admin']}>
        <div className={styles.container}>
          <Typography variant="body">Loading beta settings...</Typography>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['admin']}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href={`/admin/merchants/${merchantId}/settings`} className={styles.backLink}>
            ← Back to Settings
          </Link>
          <Typography variant="heading-2">Beta User Management</Typography>
          <Typography variant="body" className={styles.subtitle}>
            Configure beta access and outlet limits for {merchant?.name}
          </Typography>
        </div>

        {error && (
          <div className={styles.errorBanner}>
            <Typography variant="body">⚠️ {error}</Typography>
          </div>
        )}

        {success && (
          <div className={styles.successBanner}>
            <Typography variant="body">✅ {success}</Typography>
          </div>
        )}

        <Card className={styles.card}>
          <div className={styles.section}>
            <Typography variant="heading-4">Beta Status</Typography>
            <Typography variant="body" className={styles.description}>
              Beta users get unlimited outlets at no cost
            </Typography>
            
            <div className={styles.field}>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={settings.is_beta_user}
                  onChange={handleToggleBeta}
                  className={styles.toggle}
                />
                <span className={styles.toggleText}>
                  {settings.is_beta_user ? '✅ Beta User' : '❌ Not a Beta User'}
                </span>
              </label>
              
              {settings.is_beta_user && settings.beta_granted_at && (
                <Typography variant="body-small" className={styles.metadata}>
                  Beta access granted: {new Date(settings.beta_granted_at).toLocaleDateString()}
                </Typography>
              )}
            </div>
          </div>

          {settings.is_beta_user && (
            <div className={styles.section}>
              <Typography variant="heading-4">Beta Notes</Typography>
              <Typography variant="body" className={styles.description}>
                Internal notes about this beta user (not visible to merchant)
              </Typography>
              
              <textarea
                value={settings.beta_notes || ''}
                onChange={(e) => setSettings({ ...settings, beta_notes: e.target.value })}
                placeholder="e.g., Early adopter, testing multi-outlet features..."
                className={styles.textarea}
                rows={3}
              />
            </div>
          )}

          <div className={styles.section}>
            <Typography variant="heading-4">Outlet Limit Override</Typography>
            <Typography variant="body" className={styles.description}>
              {settings.is_beta_user 
                ? 'Beta users have unlimited outlets by default. Set a specific limit if needed.'
                : 'Override the subscription plan\'s outlet limit. Leave empty to use plan default.'}
            </Typography>
            
            <div className={styles.field}>
              <label>
                <Typography variant="body-small">Maximum Outlets</Typography>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={settings.max_outlets_override || ''}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    max_outlets_override: e.target.value ? parseInt(e.target.value) : null 
                  })}
                  placeholder={settings.is_beta_user ? 'Unlimited (default)' : 'Use plan default'}
                  className={styles.input}
                />
              </label>
              <Typography variant="body-small" className={styles.hint}>
                Current plan ({merchant?.subscription_tier}) default: Check subscription_plans table
              </Typography>
            </div>
          </div>

          <div className={styles.actions}>
            <Button
              onClick={handleSave}
              variant="primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Beta Settings'}
            </Button>
            <Button
              onClick={() => router.push(`/admin/merchants/${merchantId}/settings`)}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </Card>

        <Card className={styles.infoCard}>
          <Typography variant="heading-5">ℹ️ How Beta Access Works</Typography>
          <ul className={styles.infoList}>
            <li>
              <Typography variant="body">
                <strong>Beta users</strong> can add unlimited outlets at no additional cost
              </Typography>
            </li>
            <li>
              <Typography variant="body">
                <strong>No charges</strong> are applied when beta users add or remove outlets
              </Typography>
            </li>
            <li>
              <Typography variant="body">
                <strong>Outlet limit override</strong> applies to both beta and regular users
              </Typography>
            </li>
            <li>
              <Typography variant="body">
                Beta status can be revoked at any time - standard subscription limits will then apply
              </Typography>
            </li>
          </ul>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
