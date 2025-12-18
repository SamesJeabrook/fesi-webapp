'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button, Grid } from '@/components/atoms';
import { FormInput } from '@/components/atoms';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import api from '@/utils/api';
import styles from './settings.module.scss';

interface CustomerProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  marketing_opt_out: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
}

export default function CustomerSettingsPage() {
  const router = useRouter();
  const { getAccessTokenSilently, logout } = useAuth0();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletionReason, setDeletionReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  });

  const [preferences, setPreferences] = useState({
    marketing_opt_out: false,
    email_notifications: true,
    sms_notifications: false,
    push_notifications: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await api.get('/api/customers/me');
      
      setProfile(data.data);
      setFormData({
        first_name: data.data.first_name || '',
        last_name: data.data.last_name || '',
        phone: data.data.phone || '',
      });
      setPreferences({
        marketing_opt_out: data.data.marketing_opt_out || false,
        email_notifications: data.data.email_notifications !== false,
        sms_notifications: data.data.sms_notifications || false,
        push_notifications: data.data.push_notifications || false,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsSaving(true);
      const data = await api.put('/api/customers/me', formData);
      
      setProfile(data.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePreferences = async () => {
    try {
      setIsSaving(true);
      await api.put('/api/customers/me/preferences', preferences);
      
      alert('Preferences updated successfully!');
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete('/api/customers/me', {
        body: JSON.stringify({ deletion_reason: deletionReason }),
      });
      
      alert('Your account has been deleted. You will be logged out.');
      logout({ logoutParams: { returnTo: window.location.origin } });
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute requireRole={['customer']}>
        <div className={styles.settings}>
          <Typography variant="heading-3">Loading...</Typography>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['customer']}>
      <div className={styles.settings}>
        <div className={styles.settings__header}>
          <div>
            <Typography variant="heading-2">Account Settings</Typography>
            <Typography variant="body-large" style={{ color: 'var(--color-text-secondary)' }}>
              Manage your profile, preferences, and account
            </Typography>
          </div>
          <Link href="/customer/dashboard">
            <Button variant="secondary">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Personal Information */}
        <div className={styles.settings__section}>
          <Typography variant="heading-4">Personal Information</Typography>
          <div className={styles.settings__card}>
            <Grid.Container gap="md">
              <Grid.Item sm={16} md={8}>
                <FormInput
                  label="First Name"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, first_name: e.target.value }))
                  }
                  placeholder="Enter your first name"
                />
              </Grid.Item>
              <Grid.Item sm={16} md={8}>
                <FormInput
                  label="Last Name"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, last_name: e.target.value }))
                  }
                  placeholder="Enter your last name"
                />
              </Grid.Item>
              <Grid.Item sm={16} md={8}>
                <FormInput
                  label="Email"
                  value={profile?.email || ''}
                  disabled
                  helpText="Email cannot be changed"
                />
              </Grid.Item>
              <Grid.Item sm={16} md={8}>
                <FormInput
                  label="Phone Number (Optional)"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="07xxx xxxxxx"
                />
              </Grid.Item>
              <Grid.Item sm={16}>
                <Button
                  variant="primary"
                  onClick={handleUpdateProfile}
                  isDisabled={isSaving}
                  isLoading={isSaving}
                >
                  Save Changes
                </Button>
              </Grid.Item>
            </Grid.Container>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className={styles.settings__section}>
          <Typography variant="heading-4">Communication Preferences</Typography>
          <div className={styles.settings__card}>
            <div className={styles.preference}>
              <div>
                <Typography variant="body-medium" style={{ fontWeight: 500 }}>
                  Marketing Communications
                </Typography>
                <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                  Receive promotional emails and special offers
                </Typography>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={!preferences.marketing_opt_out}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, marketing_opt_out: !e.target.checked }))
                  }
                />
                <span className={styles.switch__slider}></span>
              </label>
            </div>

            <div className={styles.preference}>
              <div>
                <Typography variant="body-medium" style={{ fontWeight: 500 }}>
                  Email Notifications
                </Typography>
                <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                  Receive order updates and confirmations via email
                </Typography>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={preferences.email_notifications}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, email_notifications: e.target.checked }))
                  }
                />
                <span className={styles.switch__slider}></span>
              </label>
            </div>

            <div className={styles.preference}>
              <div>
                <Typography variant="body-medium" style={{ fontWeight: 500 }}>
                  SMS Notifications
                </Typography>
                <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                  Receive order updates via text message
                </Typography>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={preferences.sms_notifications}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, sms_notifications: e.target.checked }))
                  }
                />
                <span className={styles.switch__slider}></span>
              </label>
            </div>

            <div className={styles.preference}>
              <div>
                <Typography variant="body-medium" style={{ fontWeight: 500 }}>
                  Push Notifications
                </Typography>
                <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                  Receive push notifications on your device
                </Typography>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={preferences.push_notifications}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, push_notifications: e.target.checked }))
                  }
                />
                <span className={styles.switch__slider}></span>
              </label>
            </div>

            <Button
              variant="primary"
              onClick={handleUpdatePreferences}
              isDisabled={isSaving}
              isLoading={isSaving}
            >
              Save Preferences
            </Button>
          </div>
        </div>

        {/* Delete Account */}
        <div className={styles.settings__section}>
          <Typography variant="heading-4">Delete Account</Typography>
          <div className={`${styles.settings__card} ${styles.settings__dangerZone}`}>
            <Typography variant="body-medium" style={{ marginBottom: '1rem' }}>
              Once you delete your account, there is no going back. Please be certain.
            </Typography>
            {!showDeleteConfirm ? (
              <Button
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete My Account
              </Button>
            ) : (
              <div className={styles.deleteConfirm}>
                <Typography variant="body-medium" style={{ marginBottom: '1rem' }}>
                  Are you sure you want to delete your account?
                </Typography>
                <textarea
                  className={styles.deleteConfirm__textarea}
                  placeholder="Please tell us why you're leaving (optional)"
                  value={deletionReason}
                  onChange={(e) => setDeletionReason(e.target.value)}
                  rows={3}
                />
                <div className={styles.deleteConfirm__actions}>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletionReason('');
                    }}
                    isDisabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDeleteAccount}
                    isDisabled={isDeleting}
                    isLoading={isDeleting}
                  >
                    Yes, Delete My Account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
