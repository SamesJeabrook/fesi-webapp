"use client";

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { Typography, Button } from '@/components/atoms';
import { CustomerNavigationWrapper } from '@/components/molecules/CustomerNavigation';
import api from '@/utils/api';
import { getAuthToken } from '@/utils/devAuth';
import styles from './page.module.scss';

interface CustomerProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at: string;
  total_orders?: number;
  marketing_opt_out?: boolean;
  email_notifications?: boolean;
  sms_notifications?: boolean;
  push_notifications?: boolean;
}

export default function CustomerProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading, getAccessTokenSilently } = useAuth0();
  const router = useRouter();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletionReason, setDeletionReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/vendors');
    } else if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated, authLoading]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken(getAccessTokenSilently);
      const data = await api.get('/api/customers/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(data.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setSaving(true);
      const token = await getAuthToken(getAccessTokenSilently);
      await api.patch(`/api/customers/${profile.id}`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const token = await getAuthToken(getAccessTokenSilently);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customers/me/export-data`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fesi-my-data-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert('Your data has been downloaded successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletionReason.trim()) {
      alert('Please provide a reason for deletion');
      return;
    }

    if (!confirm('Are you absolutely sure? This action cannot be undone. Your data will be anonymized and you will be logged out.')) {
      return;
    }

    try {
      setIsDeleting(true);
      const token = await getAuthToken(getAccessTokenSilently);
      
      await api.post('/api/customers/me/request-deletion', {
        deletion_reason: deletionReason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Your account has been deleted. You will now be logged out.');
      // Logout and redirect
      window.location.href = '/vendors';
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className={styles.profile}>
        <CustomerNavigationWrapper />
        <div className={styles.profile__container}>
          <Typography variant="body-medium">Loading...</Typography>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.profile}>
        <CustomerNavigationWrapper />
        <div className={styles.profile__container}>
          <Typography variant="body-medium">Profile not found</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      <CustomerNavigationWrapper />
      
      <div className={styles.profile__container}>
        <Typography variant="heading-2" className={styles.profile__title}>
          My Account
        </Typography>

        {/* Profile Information */}
        <div className={styles.profile__section}>
          <Typography variant="heading-4">Personal Information</Typography>
          <form onSubmit={handleUpdateProfile} className={styles.profile__form}>
            <div className={styles.profile__field}>
              <label>First Name</label>
              <input
                type="text"
                value={profile.first_name || ''}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                required
              />
            </div>
            
            <div className={styles.profile__field}>
              <label>Last Name</label>
              <input
                type="text"
                value={profile.last_name || ''}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
              />
            </div>

            <div className={styles.profile__field}>
              <label>Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className={styles.profile__fieldDisabled}
              />
              <Typography variant="body-small" className={styles.profile__fieldHint}>
                Contact support to change your email
              </Typography>
            </div>

            <div className={styles.profile__field}>
              <label>Phone</label>
              <input
                type="tel"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>

            <Button type="submit" variant="primary" isLoading={saving}>
              Save Changes
            </Button>
          </form>
        </div>

        {/* Privacy & Notifications */}
        <div className={styles.profile__section}>
          <Typography variant="heading-4">Privacy & Notifications</Typography>
          
          <div className={styles.profile__toggles}>
            <label className={styles.profile__toggle}>
              <input
                type="checkbox"
                checked={profile.email_notifications !== false}
                onChange={(e) => setProfile({ ...profile, email_notifications: e.target.checked })}
              />
              <span>Email notifications</span>
            </label>

            <label className={styles.profile__toggle}>
              <input
                type="checkbox"
                checked={profile.sms_notifications === true}
                onChange={(e) => setProfile({ ...profile, sms_notifications: e.target.checked })}
              />
              <span>SMS notifications</span>
            </label>

            <label className={styles.profile__toggle}>
              <input
                type="checkbox"
                checked={profile.marketing_opt_out !== true}
                onChange={(e) => setProfile({ ...profile, marketing_opt_out: !e.target.checked })}
              />
              <span>Marketing communications</span>
            </label>
          </div>
        </div>

        {/* GDPR Data Export */}
        <div className={styles.profile__section}>
          <Typography variant="heading-4">Your Data</Typography>
          <Typography variant="body-medium" className={styles.profile__sectionDesc}>
            Download all your data in JSON format (GDPR compliant)
          </Typography>
          <Button 
            variant="secondary" 
            onClick={handleExportData}
            isLoading={isExporting}
          >
            📥 Download My Data
          </Button>
        </div>

        {/* Delete Account */}
        <div className={`${styles.profile__section} ${styles.profile__sectionDanger}`}>
          <Typography variant="heading-4">Delete Account</Typography>
          <Typography variant="body-medium" className={styles.profile__sectionDesc}>
            Permanently delete your account and anonymize all your data. This action cannot be undone.
          </Typography>

          {!showDeleteConfirm ? (
            <Button 
              variant="danger" 
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete My Account
            </Button>
          ) : (
            <div className={styles.profile__deleteConfirm}>
              <Typography variant="body-medium" className={styles.profile__deleteWarning}>
                ⚠️ Warning: This will permanently delete your account and anonymize all your personal data.
              </Typography>
              
              <div className={styles.profile__field}>
                <label>Why are you leaving? (required)</label>
                <textarea
                  value={deletionReason}
                  onChange={(e) => setDeletionReason(e.target.value)}
                  placeholder="Please tell us why you're deleting your account..."
                  rows={3}
                  required
                />
              </div>

              <div className={styles.profile__deleteActions}>
                <Button 
                  variant="danger" 
                  onClick={handleDeleteAccount}
                  isLoading={isDeleting}
                >
                  Yes, Delete My Account
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletionReason('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className={styles.profile__footer}>
          <Typography variant="body-small">
            Member since: {new Date(profile.created_at).toLocaleDateString()}
          </Typography>
          <Typography variant="body-small">
            Total orders: {profile.total_orders || 0}
          </Typography>
        </div>
      </div>
    </div>
  );
}
