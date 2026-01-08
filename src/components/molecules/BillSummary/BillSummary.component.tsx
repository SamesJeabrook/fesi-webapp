'use client';

import React, { useState } from 'react';
import { Typography, Button } from '@/components/atoms';
import type { BillSummaryProps } from './BillSummary.types';
import styles from './BillSummary.module.scss';

export const BillSummary: React.FC<BillSummaryProps> = ({
  subtotal,
  taxRate = 0,
  serviceCharge = 0,
  discount = 0,
  total,
  paidAmount = 0,
  remainingAmount,
  showSplitOptions = false,
  guestCount = 2,
  onSplitEvenly,
  className = '',
}) => {
  const [splitCount, setSplitCount] = useState(guestCount);

  const formatCurrency = (amount: number) => {
    return `£${amount.toFixed(2)}`;
  };

  const taxAmount = subtotal * taxRate;
  const remaining = remainingAmount ?? (total - paidAmount);
  const perPersonAmount = total / splitCount;

  return (
    <div className={`${styles.billSummary} ${className}`}>
      <div className={styles.lineItem}>
        <Typography variant="body">Subtotal</Typography>
        <Typography variant="body">{formatCurrency(subtotal)}</Typography>
      </div>

      {taxRate > 0 && (
        <div className={styles.lineItem}>
          <Typography variant="body-small" className={styles.secondary}>
            Tax ({(taxRate * 100).toFixed(0)}%)
          </Typography>
          <Typography variant="body-small" className={styles.secondary}>
            {formatCurrency(taxAmount)}
          </Typography>
        </div>
      )}

      {serviceCharge > 0 && (
        <div className={styles.lineItem}>
          <Typography variant="body-small" className={styles.secondary}>
            Service Charge
          </Typography>
          <Typography variant="body-small" className={styles.secondary}>
            {formatCurrency(serviceCharge)}
          </Typography>
        </div>
      )}

      {discount > 0 && (
        <div className={styles.lineItem}>
          <Typography variant="body-small" className={styles.discount}>
            Discount
          </Typography>
          <Typography variant="body-small" className={styles.discount}>
            -{formatCurrency(discount)}
          </Typography>
        </div>
      )}

      <div className={styles.divider} />

      <div className={styles.lineItem}>
        <Typography variant="heading-6">Total</Typography>
        <Typography variant="heading-6" className={styles.total}>
          {formatCurrency(total)}
        </Typography>
      </div>

      {paidAmount > 0 && (
        <>
          <div className={styles.lineItem}>
            <Typography variant="body-small" className={styles.paid}>
              Paid
            </Typography>
            <Typography variant="body-small" className={styles.paid}>
              {formatCurrency(paidAmount)}
            </Typography>
          </div>

          <div className={styles.lineItem}>
            <Typography variant="body" className={styles.remaining}>
              Remaining
            </Typography>
            <Typography variant="body" className={styles.remaining}>
              {formatCurrency(remaining)}
            </Typography>
          </div>
        </>
      )}

      {showSplitOptions && onSplitEvenly && (
        <>
          <div className={styles.divider} />
          <div className={styles.splitSection}>
            <Typography variant="body" className={styles.splitLabel}>
              Split Bill Evenly
            </Typography>
            <div className={styles.splitControls}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
              >
                -
              </Button>
              <Typography variant="body" className={styles.splitCount}>
                {splitCount} people
              </Typography>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSplitCount(splitCount + 1)}
              >
                +
              </Button>
            </div>
            <div className={styles.perPerson}>
              <Typography variant="body-small" className={styles.secondary}>
                Per person:
              </Typography>
              <Typography variant="heading-6" className={styles.perPersonAmount}>
                {formatCurrency(perPersonAmount)}
              </Typography>
            </div>
            <Button
              variant="primary"
              fullWidth
              onClick={() => onSplitEvenly(splitCount)}
            >
              Apply Split
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
