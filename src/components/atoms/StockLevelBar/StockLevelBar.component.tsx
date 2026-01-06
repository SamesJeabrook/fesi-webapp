import React from 'react';
import styles from './StockLevelBar.module.scss';
import type { StockLevelBarProps } from './StockLevelBar.types';

export const StockLevelBar: React.FC<StockLevelBarProps> = ({ 
  percentage,
  status = 'in_stock',
  showPercentage = true,
  className = '' 
}) => {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.track}>
        <div 
          className={`${styles.fill} ${styles[`fill--${status}`]}`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      {showPercentage && (
        <span className={styles.label}>{Math.round(clampedPercentage)}%</span>
      )}
    </div>
  );
};

export default StockLevelBar;
