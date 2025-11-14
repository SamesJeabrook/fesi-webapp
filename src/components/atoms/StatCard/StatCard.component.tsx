import React from 'react';
import classNames from 'classnames';
import { Typography } from '@/components/atoms';
import type { StatCardProps } from './StatCard.types';
import styles from './StatCard.module.scss';

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  subtitle,
  variant = 'primary',
  className,
}) => {
  const cardClasses = classNames(
    styles.statCard,
    styles[`statCard--${variant}`],
    className
  );

  const trendClasses = classNames(
    styles.statCard__trend,
    trend && styles[`statCard__trend--${trend.direction}`]
  );

  return (
    <div className={cardClasses}>
      <div className={styles.statCard__header}>
        {icon && <span className={styles.statCard__icon}>{icon}</span>}
        <Typography variant="body-medium" className={styles.statCard__label}>
          {label}
        </Typography>
      </div>
      
      <div className={styles.statCard__content}>
        <Typography variant="heading-2" className={styles.statCard__value}>
          {value}
        </Typography>
        
        {trend && (
          <div className={trendClasses}>
            <span className={styles.statCard__trendIcon}>
              {trend.direction === 'up' ? '↑' : '↓'}
            </span>
            <Typography variant="body-small">
              {Math.abs(trend.value)}%
            </Typography>
          </div>
        )}
      </div>
      
      {subtitle && (
        <Typography variant="body-small" className={styles.statCard__subtitle}>
          {subtitle}
        </Typography>
      )}
    </div>
  );
};
