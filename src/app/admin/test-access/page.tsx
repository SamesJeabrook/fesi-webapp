'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@/components/atoms';
import { Card } from '@/components/atoms/Card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { AdminPageHeader } from '@/components/molecules';
import api from '@/utils/api';
import styles from './testAccess.module.scss';

interface TestUser {
  merchant_id: string;
  name: string;
  email: string;
  subscription_tier: string;
  current_status: 'trial' | 'beta' | 'expired';
  granted_at: string;
  trial_ends_at?: string;
  days_remaining?: number;
  grant_notes?: string;
  granted_by_name?: string;
}

interface PendingBetaAccess {
  id: number;
  email: string;
  subscription_tier: string;
  notes: string;
  granted_at: string;
  granted_by_name?: string;
}

export default function TestAccessPage() {
  const [emails, setEmails] = useState('');
  const [accessType, setAccessType] = useState<'trial' | 'beta'>('trial');
  const [subscriptionTier, setSubscriptionTier] = useState('starter');
  const [durationDays, setDurationDays] = useState(90);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const [testUsers, setTestUsers] = useState<TestUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  
  const [pendingInvitations, setPendingInvitations] = useState<PendingBetaAccess[]>([]);
  const [isLoadingPending, setIsLoadingPending] = useState(true);

  useEffect(() => {
    fetchTestUsers();
    fetchPendingInvitations();
  }, []);

  const fetchTestUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const data = await api.get('/api/admin/test-access/active');
      setTestUsers(data.testUsers || []);
    } catch (error) {
      console.error('Error fetching test users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchPendingInvitations = async () => {
    try {
      setIsLoadingPending(true);
      const data = await api.get('/api/admin/test-access/pending');
      setPendingInvitations(data.pendingAccess || []);
    } catch (error) {
      console.error('Error fetching pending invitations:', error);
    } finally {
      setIsLoadingPending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emails.trim()) {
      alert('Please enter at least one email address');
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      // Split emails by comma, newline, or space
      const emailArray = emails
        .split(/[,\n\s]+/)
        .map(e => e.trim())
        .filter(e => e.length > 0);

      const response = await api.post('/api/admin/test-access/grant', {
        emails: emailArray,
        accessType,
        subscriptionTier,
        durationDays: accessType === 'trial' ? durationDays : undefined,
        notes: notes.trim() || undefined
      });

      setResult(response);
      setEmails('');
      setNotes('');
      
      // Refresh both lists
      await fetchTestUsers();
      await fetchPendingInvitations();

    } catch (error: any) {
      console.error('Error granting test access:', error);
      alert(`Error: ${error.message || 'Failed to grant test access'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async (merchantId: string) => {
    if (!confirm('Are you sure you want to revoke test access for this merchant?')) {
      return;
    }

    try {
      await api.post('/api/admin/test-access/revoke', {
        merchantId,
        reason: 'Revoked by admin'
      });

      alert('Test access revoked successfully');
      await fetchTestUsers();
    } catch (error: any) {
      console.error('Error revoking test access:', error);
      alert(`Error: ${error.message || 'Failed to revoke test access'}`);
    }
  };

  const handleExtend = async (merchantId: string) => {
    const days = prompt('How many days to extend the trial?', '30');
    if (!days) return;

    const additionalDays = parseInt(days);
    if (isNaN(additionalDays) || additionalDays <= 0) {
      alert('Please enter a valid number of days');
      return;
    }

    try {
      await api.post('/api/admin/test-access/extend', {
        merchantId,
        additionalDays,
        notes: 'Trial extended by admin'
      });

      alert(`Trial extended by ${additionalDays} days`);
      await fetchTestUsers();
    } catch (error: any) {
      console.error('Error extending trial:', error);
      alert(`Error: ${error.message || 'Failed to extend trial'}`);
    }
  };

  const handleRevokePending = async (email: string) => {
    if (!confirm(`Are you sure you want to revoke the pending invitation for ${email}?`)) {
      return;
    }

    try {
      await api.post('/api/admin/test-access/revoke-pending', {
        email
      });

      alert('Pending invitation revoked successfully');
      await fetchPendingInvitations();
    } catch (error: any) {
      console.error('Error revoking pending invitation:', error);
      alert(`Error: ${error.message || 'Failed to revoke invitation'}`);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string, daysRemaining?: number) => {
    if (status === 'beta') {
      return <span className={`${styles.badge} ${styles['badge--success']}`}>Beta User</span>;
    }
    if (status === 'trial') {
      if (daysRemaining && daysRemaining <= 7) {
        return <span className={`${styles.badge} ${styles['badge--warning']}`}>Expires in {daysRemaining}d</span>;
      }
      return <span className={`${styles.badge} ${styles['badge--info']}`}>Trial ({daysRemaining}d)</span>;
    }
    return <span className={`${styles.badge} ${styles['badge--danger']}`}>Expired</span>;
  };

  return (
    <ProtectedRoute requireRole={['admin']}>
      <div className={styles.page}>
        <AdminPageHeader
          backLink={{ href: '/admin', label: 'Back to Dashboard' }}
          adminContext="System Administration"
          title="Test Access Management"
          description="Grant trial or beta access to merchants for testing purposes"
        />

        {/* Grant Access Form */}
        <Card className={styles.grantCard}>
          <Typography variant="heading-4" style={{ marginBottom: '1rem' }}>
            Grant Test Access
          </Typography>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Email Addresses
                <span className={styles.labelHint}>Comma-separated or one per line</span>
              </label>
              <textarea
                className={styles.textarea}
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="user1@example.com, user2@example.com&#10;user3@example.com"
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Access Type</label>
                <select
                  className={styles.select}
                  value={accessType}
                  onChange={(e) => setAccessType(e.target.value as 'trial' | 'beta')}
                  disabled={isSubmitting}
                >
                  <option value="trial">Trial (Time-Limited)</option>
                  <option value="beta">Beta User (Permanent)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Subscription Tier</label>
                <select
                  className={styles.select}
                  value={subscriptionTier}
                  onChange={(e) => setSubscriptionTier(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="starter">Starter (£10/month)</option>
                  <option value="professional">Professional (£39/month)</option>
                  <option value="business">Business (£89/month)</option>
                </select>
              </div>

              {accessType === 'trial' && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Trial Duration (Days)</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={durationDays}
                    onChange={(e) => setDurationDays(parseInt(e.target.value))}
                    min={1}
                    max={365}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Notes
                <span className={styles.labelHint}>Optional - reason for granting access</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., TestFlight beta testers, Early adopters, etc."
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              isDisabled={isSubmitting || !emails.trim()}
              className={styles.submitButton}
            >
              {isSubmitting ? 'Granting Access...' : 'Grant Access'}
            </Button>
          </form>

          {/* Result Display */}
          {result && (
            <div className={styles.result}>
              <Typography variant="heading-6" style={{ marginBottom: '0.5rem' }}>
                Result
              </Typography>
              {result.granted && result.granted.length > 0 && (
                <div className={styles.resultSection}>
                  <strong>✅ Successfully Granted ({result.granted.length}):</strong>
                  <ul className={styles.resultList}>
                    {result.granted.map((item: any) => (
                      <li key={item.email}>
                        {item.email}
                        {item.status === 'pending' ? (
                          <span className={styles.pendingLabel}> - ⏳ Pending (will apply on signup)</span>
                        ) : (
                          <span> - {item.merchantName} ({item.subscriptionTier})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.failed && result.failed.length > 0 && (
                <div className={styles.resultSection}>
                  <strong>❌ Failed ({result.failed.length}):</strong>
                  <ul className={styles.resultList}>
                    {result.failed.map((item: any) => (
                      <li key={item.email}>
                        {item.email} - {item.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Pending Beta Invitations Table */}
        <Card className={styles.usersCard}>
          <div className={styles.usersHeader}>
            <Typography variant="heading-4">
              Pending Invitations ({pendingInvitations.length})
            </Typography>
            <Button variant="secondary" onClick={fetchPendingInvitations} isDisabled={isLoadingPending}>
              {isLoadingPending ? 'Loading...' : 'Refresh'}
            </Button>
          </div>

          <div className={styles.sectionDescription}>
            <Typography variant="body-small" style={{ color: 'var(--color-text-tertiary)' }}>
              Beta access invitations sent to emails that haven't created accounts yet.
              Access will be automatically applied when they sign up.
            </Typography>
          </div>

          {isLoadingPending ? (
            <div className={styles.loading}>Loading pending invitations...</div>
          ) : pendingInvitations.length === 0 ? (
            <div className={styles.empty}>No pending invitations</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Tier</th>
                    <th>Invited</th>
                    <th>Invited By</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingInvitations.map((invitation) => (
                    <tr key={invitation.id}>
                      <td>
                        <strong>{invitation.email}</strong>
                        <span className={styles.pendingBadge}>⏳ Awaiting Signup</span>
                      </td>
                      <td>
                        <span className={styles.tier}>
                          {invitation.subscription_tier}
                        </span>
                      </td>
                      <td>{formatDate(invitation.granted_at)}</td>
                      <td>{invitation.granted_by_name || '-'}</td>
                      <td>
                        <span className={styles.notes} title={invitation.notes || ''}>
                          {invitation.notes || '-'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={`${styles.actionButton} ${styles['actionButton--danger']}`}
                            onClick={() => handleRevokePending(invitation.email)}
                            title="Revoke Invitation"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Active Test Users Table */}
        <Card className={styles.usersCard}>
          <div className={styles.usersHeader}>
            <Typography variant="heading-4">
              Active Test Users ({testUsers.length})
            </Typography>
            <Button variant="secondary" onClick={fetchTestUsers} isDisabled={isLoadingUsers}>
              {isLoadingUsers ? 'Loading...' : 'Refresh'}
            </Button>
          </div>

          {isLoadingUsers ? (
            <div className={styles.loading}>Loading test users...</div>
          ) : testUsers.length === 0 ? (
            <div className={styles.empty}>No active test users</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Merchant</th>
                    <th>Email</th>
                    <th>Tier</th>
                    <th>Status</th>
                    <th>Granted</th>
                    <th>Expires</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testUsers.map((user) => (
                    <tr key={user.merchant_id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={styles.tier}>
                          {user.subscription_tier}
                        </span>
                      </td>
                      <td>{getStatusBadge(user.current_status, user.days_remaining)}</td>
                      <td>{formatDate(user.granted_at)}</td>
                      <td>
                        {user.trial_ends_at ? formatDate(user.trial_ends_at) : 'Never'}
                      </td>
                      <td>
                        <span className={styles.notes} title={user.grant_notes || ''}>
                          {user.grant_notes || '-'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          {user.current_status === 'trial' && (
                            <button
                              className={styles.actionButton}
                              onClick={() => handleExtend(user.merchant_id)}
                              title="Extend Trial"
                            >
                              ⏱️
                            </button>
                          )}
                          <button
                            className={`${styles.actionButton} ${styles['actionButton--danger']}`}
                            onClick={() => handleRevoke(user.merchant_id)}
                            title="Revoke Access"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </ProtectedRoute>
  );
}
