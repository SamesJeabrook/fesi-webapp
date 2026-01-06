import React from 'react';
import { Button } from '@/components/atoms';
import styles from './StockAlertsList.module.scss';
import type { StockAlertsListProps } from './StockAlertsList.types';

export const StockAlertsList: React.FC<StockAlertsListProps> = ({ 
  alerts,
  onDismiss,
  maxVisible = 3,
  className = '' 
}) => {
  if (alerts.length === 0) return null;

  const visibleAlerts = alerts.slice(0, maxVisible);
  const remainingCount = alerts.length - maxVisible;

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <span className={styles.icon}>⚠️</span>
        <div className={styles.headerContent}>
          <h3 className={styles.title}>Stock Alerts ({alerts.length})</h3>
          <div className={styles.alerts}>
            {visibleAlerts.map(alert => (
              <div key={alert.id} className={styles.alert}>
                <span className={styles.alert__text}>
                  <strong>{alert.stock_name}</strong>: {alert.current_quantity} {alert.unit}
                  {alert.alert_type === 'out_of_stock' ? ' (Out of stock!)' : ' (Low stock)'}
                </span>
                <button
                  onClick={() => onDismiss(alert.id)}
                  className={styles.alert__dismiss}
                  aria-label="Dismiss alert"
                >
                  Dismiss
                </button>
              </div>
            ))}
            {remainingCount > 0 && (
              <p className={styles.remaining}>+ {remainingCount} more alerts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAlertsList;
