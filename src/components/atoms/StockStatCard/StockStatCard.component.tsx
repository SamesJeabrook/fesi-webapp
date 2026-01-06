import React from 'react';
import styles from './StockStatCard.module.scss';
import type { StockStatCardProps } from './StockStatCard.types';

export const StockStatCard: React.FC<StockStatCardProps> = ({ 
  label,
  value,
  icon,
  variant = 'default',
  className = '' 
}) => {
  return (
    <div className={`${styles.card} ${styles[`card--${variant}`]} ${className}`}>
      <div className={styles.card__content}>
        <div className={styles.card__info}>
          <p className={styles.card__label}>{label}</p>
          <p className={styles.card__value}>{value}</p>
        </div>
        <div className={styles.card__icon}>{icon}</div>
      </div>
    </div>
  );
};

export default StockStatCard;
