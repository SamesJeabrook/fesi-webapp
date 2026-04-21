// Cancel Order Modal Component
// Allows customers/merchants to cancel orders with automatic refunds

import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@/components/atoms';
import api from '@/utils/api';
import styles from './CancelOrderModal.module.scss';

interface CancellationEligibility {
  canCancel: boolean;
  reason: string;
  willRefund?: boolean;
  deadlineHours?: number;
  hoursRemaining?: string;
  contactRequired?: boolean;
  requiresMerchantContact?: boolean;
}

interface CancelOrderModalProps {
  orderId: string;
  orderNumber: string;
  onClose: () => void;
  onCancelled: () => void;
  userRole?: 'customer' | 'merchant' | 'admin';
  skipAuth?: boolean; // For guest users
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  orderId,
  orderNumber,
  onClose,
  onCancelled,
  userRole = 'customer',
  skipAuth = false
}) => {
  const [eligibility, setEligibility] = useState<CancellationEligibility | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkEligibility();
  }, [orderId]);

  const checkEligibility = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/orders/${orderId}/cancellation-eligibility`,
        skipAuth ? { skipAuth: true } : undefined
      );
      setEligibility(response);
    } catch (err: any) {
      setError(err.message || 'Failed to check cancellation eligibility');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!eligibility?.canCancel && userRole !== 'admin' && userRole !== 'merchant') {
      return;
    }

    try {
      setCancelling(true);
      setError(null);

      const response = await api.post(
        `/api/orders/${orderId}/cancel`,
        {
          reason: reason || 'Cancelled by ' + userRole
        },
        skipAuth ? { skipAuth: true } : undefined
      );

      if (response.success) {
        onCancelled();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.modal}>
        <div className={styles.modal__overlay} onClick={onClose} />
        <div className={styles.modal__content}>
          <Typography variant="body-medium">Checking cancellation eligibility...</Typography>
        </div>
      </div>
    );
  }

  const canProceed = eligibility?.canCancel || userRole === 'admin' || userRole === 'merchant';

  return (
    <div className={styles.modal}>
      <div className={styles.modal__overlay} onClick={onClose} />
      <div className={styles.modal__content}>
        <div className={styles.modal__header}>
          <Typography variant="heading-4">Cancel Order</Typography>
          <button 
            className={styles.modal__close}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.modal__body}>
          <Typography variant="body-medium" className={styles.modal__orderNumber}>
            Order #{orderNumber}
          </Typography>

          {eligibility && (
            <div className={styles.modal__eligibility}>
              <div className={`${styles.modal__status} ${canProceed ? styles['modal__status--success'] : styles['modal__status--error']}`}>
                <Typography variant="body-medium">
                  {eligibility.reason}
                </Typography>
              </div>

              {eligibility.hoursRemaining && (
                <Typography variant="body-small" className={styles.modal__info}>
                  Time until pickup: {eligibility.hoursRemaining} hours
                </Typography>
              )}

              {eligibility.deadlineHours && (
                <Typography variant="body-small" className={styles.modal__info}>
                  Cancellation deadline: {eligibility.deadlineHours} hours before pickup
                </Typography>
              )}

              {eligibility.willRefund && (
                <div className={styles.modal__refundInfo}>
                  <Typography variant="body-medium" className={styles.modal__refundTitle}>
                    ✅ Full Refund
                  </Typography>
                  <Typography variant="body-small">
                    You will receive a full refund to your original payment method within 5-10 business days.
                  </Typography>
                </div>
              )}

              {eligibility.requiresMerchantContact && (
                <div className={styles.modal__warning}>
                  <Typography variant="body-small">
                    ⚠️ This is a cash order. Please contact the merchant directly to arrange a refund.
                  </Typography>
                </div>
              )}

              {eligibility.contactRequired && (
                <div className={styles.modal__warning}>
                  <Typography variant="body-small">
                    Please contact the merchant directly to discuss cancellation options.
                  </Typography>
                </div>
              )}
            </div>
          )}

          {canProceed && (
            <div className={styles.modal__reasonSection}>
              <Typography variant="body-medium" className={styles.modal__label}>
                Reason for cancellation (optional)
              </Typography>
              <textarea
                className={styles.modal__textarea}
                placeholder="Let us know why you're cancelling..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {error && (
            <div className={styles.modal__error}>
              <Typography variant="body-small">
                ❌ {error}
              </Typography>
            </div>
          )}

          {/* Admin/Merchant Override Notice */}
          {!eligibility?.canCancel && (userRole === 'admin' || userRole === 'merchant') && (
            <div className={styles.modal__override}>
              <Typography variant="body-small">
                🔧 {userRole.toUpperCase()} OVERRIDE: You can cancel this order even though the deadline has passed.
              </Typography>
            </div>
          )}
        </div>

        <div className={styles.modal__footer}>
          <Button
            variant="secondary"
            onClick={onClose}
            isDisabled={cancelling}
          >
            Keep Order
          </Button>
          <Button
            variant="danger"
            onClick={handleCancel}
            isDisabled={!canProceed || cancelling}
            isLoading={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </Button>
        </div>
      </div>
    </div>
  );
};
