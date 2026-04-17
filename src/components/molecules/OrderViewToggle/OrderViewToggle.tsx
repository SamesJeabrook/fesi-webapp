import React from 'react';
import styles from './OrderViewToggle.module.scss';

export type OrderView = 'all' | 'today' | 'preorders';

export interface OrderViewToggleProps {
  currentView: OrderView;
  onViewChange: (view: OrderView) => void;
  preOrderCount?: number;
  todayCount?: number;
  className?: string;
}

/**
 * OrderViewToggle Molecule
 * Toggle buttons for switching between different order views
 * Used in merchant dashboard to filter between all orders, today's orders, and pre-orders
 */
export const OrderViewToggle: React.FC<OrderViewToggleProps> = ({
  currentView,
  onViewChange,
  preOrderCount = 0,
  todayCount = 0,
  className = ''
}) => {
  return (
    <div className={`${styles.viewToggle} ${className}`}>
      <button
        className={`${styles.viewToggle__button} ${currentView === 'all' ? styles.active : ''}`}
        onClick={() => onViewChange('all')}
        type="button"
      >
        <span className={styles.viewToggle__label}>All Orders</span>
      </button>

      <button
        className={`${styles.viewToggle__button} ${currentView === 'today' ? styles.active : ''}`}
        onClick={() => onViewChange('today')}
        type="button"
      >
        <span className={styles.viewToggle__label}>Today</span>
        {todayCount > 0 && (
          <span className={styles.viewToggle__count}>{todayCount}</span>
        )}
      </button>

      <button
        className={`${styles.viewToggle__button} ${styles.preOrderButton} ${currentView === 'preorders' ? styles.active : ''}`}
        onClick={() => onViewChange('preorders')}
        type="button"
      >
        <span className={styles.viewToggle__icon}>🕐</span>
        <span className={styles.viewToggle__label}>Pre-Orders</span>
        {preOrderCount > 0 && (
          <span className={styles.viewToggle__count}>{preOrderCount}</span>
        )}
      </button>
    </div>
  );
};

export default OrderViewToggle;
