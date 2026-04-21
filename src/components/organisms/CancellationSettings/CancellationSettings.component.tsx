'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@/components/atoms';
import api from '@/utils/api';
import styles from './CancellationSettings.module.scss';

interface CancellationSettingsProps {
  merchantId: string;
}

export const CancellationSettings: React.FC<CancellationSettingsProps> = ({ merchantId }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allowCustomerCancellation, setAllowCustomerCancellation] = useState(true);
  const [cancellationDeadlineHours, setCancellationDeadlineHours] = useState(24);
  const [cancellationAllowedStatuses, setCancellationAllowedStatuses] = useState<string[]>(['pending', 'accepted']);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, [merchantId]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/merchants/${merchantId}/cancellation-settings`);
      
      if (response.success) {
        setAllowCustomerCancellation(response.data.allowCustomerCancellation);
        setCancellationDeadlineHours(response.data.cancellationDeadlineHours);
        setCancellationAllowedStatuses(response.data.cancellationAllowedStatuses || ['pending', 'accepted']);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await api.put(`/api/merchants/${merchantId}/cancellation-settings`, {
        allowCustomerCancellation,
        cancellationDeadlineHours,
        cancellationAllowedStatuses
      });

      if (response.success) {
        setSuccess('Cancellation settings saved successfully');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = (status: string) => {
    if (cancellationAllowedStatuses.includes(status)) {
      // Don't allow removing all statuses
      if (cancellationAllowedStatuses.length === 1) {
        setError('At least one status must be selected');
        setTimeout(() => setError(null), 3000);
        return;
      }
      setCancellationAllowedStatuses(cancellationAllowedStatuses.filter(s => s !== status));
    } else {
      setCancellationAllowedStatuses([...cancellationAllowedStatuses, status]);
    }
  };

  if (loading) {
    return (
      <div className={styles.settings}>
        <Typography variant="body-medium">Loading cancellation settings...</Typography>
      </div>
    );
  }

  return (
    <div className={styles.settings}>
      <div className={styles.settings__header}>
        <Typography variant="heading-4">Order Cancellation Policy</Typography>
        <Typography variant="body-medium" className={styles.settings__description}>
          Control when and how customers can cancel their orders
        </Typography>
      </div>

      <div className={styles.settings__content}>
        {/* Allow Customer Cancellations Toggle */}
        <div className={styles.settings__section}>
          <div className={styles.settings__toggle}>
            <div className={styles.settings__toggleInfo}>
              <Typography variant="body-large" className={styles.settings__label}>
                Allow Customer Cancellations
              </Typography>
              <Typography variant="body-small" className={styles.settings__help}>
                Let customers cancel orders themselves. If disabled, they must contact you directly.
              </Typography>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={allowCustomerCancellation}
                onChange={(e) => setAllowCustomerCancellation(e.target.checked)}
              />
              <span className={styles.toggle__slider}></span>
            </label>
          </div>
        </div>

        {/* Allowed Statuses */}
        {allowCustomerCancellation && (
          <div className={styles.settings__section}>
            <Typography variant="body-large" className={styles.settings__label}>
              Cancellation by Order Status
            </Typography>
            <Typography variant="body-small" className={styles.settings__help}>
              Choose which order statuses allow customer self-service cancellation
            </Typography>

            <div className={styles.settings__statusOptions}>
              <div 
                className={`${styles.settings__statusCard} ${
                  cancellationAllowedStatuses.includes('pending') ? styles['settings__statusCard--active'] : ''
                }`}
                onClick={() => toggleStatus('pending')}
              >
                <div className={styles.settings__statusHeader}>
                  <Typography variant="body-medium" className={styles.settings__statusTitle}>
                    ⏳ Pending
                  </Typography>
                  <div className={styles.settings__checkbox}>
                    {cancellationAllowedStatuses.includes('pending') && '✓'}
                  </div>
                </div>
                <Typography variant="body-small" className={styles.settings__statusDescription}>
                  Order placed but not yet accepted by merchant
                </Typography>
              </div>

              <div 
                className={`${styles.settings__statusCard} ${
                  cancellationAllowedStatuses.includes('accepted') ? styles['settings__statusCard--active'] : ''
                }`}
                onClick={() => toggleStatus('accepted')}
              >
                <div className={styles.settings__statusHeader}>
                  <Typography variant="body-medium" className={styles.settings__statusTitle}>
                    ✅ Accepted
                  </Typography>
                  <div className={styles.settings__checkbox}>
                    {cancellationAllowedStatuses.includes('accepted') && '✓'}
                  </div>
                </div>
                <Typography variant="body-small" className={styles.settings__statusDescription}>
                  Order accepted but not yet being prepared
                </Typography>
              </div>

              <div 
                className={`${styles.settings__statusCard} ${
                  cancellationAllowedStatuses.includes('preparing') ? styles['settings__statusCard--active'] : ''
                }`}
                onClick={() => toggleStatus('preparing')}
              >
                <div className={styles.settings__statusHeader}>
                  <Typography variant="body-medium" className={styles.settings__statusTitle}>
                    👨‍🍳 Preparing
                  </Typography>
                  <div className={styles.settings__checkbox}>
                    {cancellationAllowedStatuses.includes('preparing') && '✓'}
                  </div>
                </div>
                <Typography variant="body-small" className={styles.settings__statusDescription}>
                  Order is actively being prepared (not recommended)
                </Typography>
              </div>
            </div>

            <div className={styles.settings__statusNote}>
              <Typography variant="body-small">
                💡 <strong>Recommendation:</strong> Allow cancellation for "Pending" and "Accepted" only. 
                Once preparation starts, customer should contact you directly to avoid food waste.
              </Typography>
            </div>
          </div>
        )}

        {/* Cancellation Deadline */}
        {allowCustomerCancellation && (
          <div className={styles.settings__section}>
            <Typography variant="body-large" className={styles.settings__label}>
              Cancellation Deadline
            </Typography>
            <Typography variant="body-small" className={styles.settings__help}>
              Minimum hours before scheduled pickup time that customers can cancel
            </Typography>

            <div className={styles.settings__deadlineOptions}>
              {[1, 2, 4, 6, 12, 24, 48, 72].map((hours) => (
                <button
                  key={hours}
                  className={`${styles.settings__deadlineButton} ${
                    cancellationDeadlineHours === hours ? styles['settings__deadlineButton--active'] : ''
                  }`}
                  onClick={() => setCancellationDeadlineHours(hours)}
                >
                  {hours} {hours === 1 ? 'hour' : 'hours'}
                </button>
              ))}
            </div>

            <div className={styles.settings__customDeadline}>
              <Typography variant="body-small">Or enter custom hours:</Typography>
              <input
                type="number"
                min="0"
                max="168"
                value={cancellationDeadlineHours}
                onChange={(e) => setCancellationDeadlineHours(Math.max(0, Math.min(168, parseInt(e.target.value) || 0)))}
                className={styles.settings__input}
              />
              <Typography variant="body-small" className={styles.settings__inputHelp}>
                (Maximum: 168 hours / 7 days)
              </Typography>
            </div>
          </div>
        )}

        {/* Policy Preview */}
        <div className={styles.settings__preview}>
          <Typography variant="body-medium" className={styles.settings__previewTitle}>
            📋 Policy Preview
          </Typography>
          <div className={styles.settings__previewContent}>
            {allowCustomerCancellation ? (
              <>
                <Typography variant="body-medium">
                  Customers can cancel orders when the order status is{' '}
                  <strong>
                    {cancellationAllowedStatuses.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' or ')}
                  </strong>
                  , up to <strong>{cancellationDeadlineHours} hours</strong> before scheduled pickup time, 
                  and receive a full refund.
                </Typography>
                <Typography variant="body-small" style={{ marginTop: 'var(--spacing-sm)' }}>
                  Once the order moves to a later status, customers must contact you directly.
                </Typography>
              </>
            ) : (
              <Typography variant="body-medium">
                Customer self-service cancellations are <strong>disabled</strong>. Customers must contact you directly to request cancellations.
              </Typography>
            )}
          </div>
        </div>

        {/* Important Notes */}
        <div className={styles.settings__notes}>
          <Typography variant="body-small" className={styles.settings__notesTitle}>
            ℹ️ Important Notes:
          </Typography>
          <ul className={styles.settings__notesList}>
            <li>
              <Typography variant="body-small">
                <strong>Status-based cancellation:</strong> Customers can only cancel orders in selected statuses. 
                Once an order progresses beyond these statuses, they must contact you.
              </Typography>
            </li>
            <li>
              <Typography variant="body-small">
                <strong>Time-based deadline:</strong> For pre-orders and scheduled pickups, customers must also 
                cancel before the deadline (e.g., 24 hours before pickup).
              </Typography>
            </li>
            <li>
              <Typography variant="body-small">
                <strong>Automatic refunds:</strong> Approved cancellations automatically issue full refunds to 
                the customer's original payment method
              </Typography>
            </li>
            <li>
              <Typography variant="body-small">
                Refunds typically take 5-10 business days to appear in the customer's account
              </Typography>
            </li>
            <li>
              <Typography variant="body-small">
                You (as merchant) and admins can override both status and time restrictions to cancel orders at any time
              </Typography>
            </li>
            <li>
              <Typography variant="body-small">
                Stock will be automatically restored when orders are cancelled
              </Typography>
            </li>
            <li>
              <Typography variant="body-small">
                <strong>Cancelled orders:</strong> Moved to a separate "Cancelled" section in your orders dashboard 
                and tracked in analytics
              </Typography>
            </li>
          </ul>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className={styles.settings__error}>
            <Typography variant="body-small">❌ {error}</Typography>
          </div>
        )}

        {success && (
          <div className={styles.settings__success}>
            <Typography variant="body-small">✅ {success}</Typography>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className={styles.settings__footer}>
        <Button
          variant="primary"
          onClick={handleSave}
          isDisabled={saving}
          isLoading={saving}
        >
          {saving ? 'Saving...' : 'Save Cancellation Settings'}
        </Button>
      </div>
    </div>
  );
};
