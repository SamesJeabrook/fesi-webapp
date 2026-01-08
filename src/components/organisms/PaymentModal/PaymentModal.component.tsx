'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/molecules';
import { Typography, Button, FormInput } from '@/components/atoms';
import { BillSummary } from '@/components/molecules';
import api from '@/utils/api';
import type { PaymentModalProps, PaymentMethod } from './PaymentModal.types';
import styles from './PaymentModal.module.scss';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  sessionId,
  totalAmount,
  paidAmount = 0,
  onPaymentSuccess,
  className = '',
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card_reader');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isPartialPayment, setIsPartialPayment] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remainingAmount = totalAmount - paidAmount;

  const handlePayment = async () => {
    setProcessing(true);
    setError(null);

    try {
      const paymentAmount = isPartialPayment 
        ? parseFloat(customAmount) 
        : remainingAmount;

      if (isPartialPayment && (!customAmount || paymentAmount <= 0 || paymentAmount > remainingAmount)) {
        throw new Error('Invalid payment amount');
      }

      await api.post(`/api/table-payments/${sessionId}/payment`, {
        amount: paymentAmount,
        payment_method: paymentMethod,
      });

      // Success
      onPaymentSuccess?.();
      onClose();
      resetForm();
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setPaymentMethod('card_reader');
    setCustomAmount('');
    setIsPartialPayment(false);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return `£${amount.toFixed(2)}`;
  };

  const footer = (
    <div className={styles.modalFooter}>
      <Button variant="outline" onClick={handleClose} disabled={processing}>
        Cancel
      </Button>
      <Button 
        variant="primary" 
        onClick={handlePayment}
        disabled={processing || (isPartialPayment && !customAmount)}
      >
        {processing ? 'Processing...' : `Pay ${formatCurrency(isPartialPayment ? parseFloat(customAmount || '0') : remainingAmount)}`}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Process Payment"
      size="medium"
      footer={footer}
      closeOnOverlayClick={!processing}
    >
      <div className={`${styles.paymentModal} ${className}`}>
        {error && (
          <div className={styles.error}>
            <Typography variant="body" className={styles.errorText}>
              ⚠️ {error}
            </Typography>
          </div>
        )}

        <div className={styles.billSection}>
          <BillSummary
            subtotal={totalAmount}
            total={totalAmount}
            paidAmount={paidAmount}
            remainingAmount={remainingAmount}
          />
        </div>

        <div className={styles.divider} />

        <div className={styles.paymentOptions}>
          <Typography variant="heading-6" className={styles.sectionTitle}>
            Payment Method
          </Typography>

          <div className={styles.methodButtons}>
            <button
              type="button"
              className={`${styles.methodButton} ${paymentMethod === 'card_reader' ? styles.active : ''}`}
              onClick={() => setPaymentMethod('card_reader')}
              disabled={processing}
            >
              <span className={styles.methodIcon}>💳</span>
              <Typography variant="body">Card Reader</Typography>
            </button>

            <button
              type="button"
              className={`${styles.methodButton} ${paymentMethod === 'cash' ? styles.active : ''}`}
              onClick={() => setPaymentMethod('cash')}
              disabled={processing}
            >
              <span className={styles.methodIcon}>💵</span>
              <Typography variant="body">Cash</Typography>
            </button>

            <button
              type="button"
              className={`${styles.methodButton} ${paymentMethod === 'online' ? styles.active : ''}`}
              onClick={() => setPaymentMethod('online')}
              disabled={processing}
            >
              <span className={styles.methodIcon}>🌐</span>
              <Typography variant="body">Online</Typography>
            </button>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.amountSection}>
          <Typography variant="heading-6" className={styles.sectionTitle}>
            Payment Amount
          </Typography>

          <div className={styles.amountOptions}>
            <button
              type="button"
              className={`${styles.amountButton} ${!isPartialPayment ? styles.active : ''}`}
              onClick={() => {
                setIsPartialPayment(false);
                setCustomAmount('');
              }}
              disabled={processing}
            >
              <Typography variant="body">Full Amount</Typography>
              <Typography variant="heading-6" className={styles.amount}>
                {formatCurrency(remainingAmount)}
              </Typography>
            </button>

            <button
              type="button"
              className={`${styles.amountButton} ${isPartialPayment ? styles.active : ''}`}
              onClick={() => setIsPartialPayment(true)}
              disabled={processing}
            >
              <Typography variant="body">Partial Payment</Typography>
            </button>
          </div>

          {isPartialPayment && (
            <div className={styles.customAmount}>
              <FormInput
                label="Custom Amount"
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="0.00"
                min="0.01"
                max={remainingAmount.toString()}
                step="0.01"
                disabled={processing}
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
