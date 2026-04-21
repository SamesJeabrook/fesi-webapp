'use client';

import React from 'react';
import { Button } from '@/components/atoms';
import styles from './FloatingOrdersButton.module.scss';

export interface FloatingOrdersButtonProps {
  orderCount: number;
  onClick: () => void;
  hasActiveOrders?: boolean;
}

export const FloatingOrdersButton: React.FC<FloatingOrdersButtonProps> = ({
  orderCount,
  onClick,
  hasActiveOrders = false
}) => {
  if (orderCount === 0) return null;

  return (
    <div className={styles.floatingButton}>
      <Button
        variant="primary"
        onClick={onClick}
        className={styles.button}
      >
        <span className={styles.icon}>📋</span>
        <span className={styles.text}>
          {orderCount} {orderCount === 1 ? 'Order' : 'Orders'}
        </span>
        {hasActiveOrders && <span className={styles.pulse} />}
      </Button>
    </div>
  );
};

export default FloatingOrdersButton;
