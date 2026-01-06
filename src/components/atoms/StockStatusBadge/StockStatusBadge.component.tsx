import React from 'react';
import styles from './StockStatusBadge.module.scss';
import type { StockStatusBadgeProps } from './StockStatusBadge.types';

export const StockStatusBadge: React.FC<StockStatusBadgeProps> = ({ 
  status = 'in_stock',
  className = '' 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'out_of_stock': return '⛔';
      case 'low_stock': return '⚠️';
      default: return '✅';
    }
  };

  const getStatusText = () => {
    return status.replace('_', ' ');
  };

  return (
    <span className={`${styles.badge} ${styles[`badge--${status}`]} ${className}`}>
      <span className={styles.badge__icon}>{getStatusIcon()}</span>
      <span className={styles.badge__text}>{getStatusText()}</span>
    </span>
  );
};

export default StockStatusBadge;
