import React from 'react';
import { Badge } from '@/components/atoms';
import styles from './PreOrderBadge.module.scss';

export interface PreOrderBadgeProps {
  scheduledTime: string | Date; // ISO timestamp or Date
  variant?: 'default' | 'prominent';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showDate?: boolean;
  className?: string;
}

/**
 * PreOrderBadge Molecule
 * Displays a highlighted badge for pre-orders with scheduled time
 * Used to make pre-orders stand out in order lists
 */
export const PreOrderBadge: React.FC<PreOrderBadgeProps> = ({
  scheduledTime,
  variant = 'default',
  size = 'md',
  showIcon = true,
  showDate = false,
  className = ''
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';

    return date.toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric'
    });
  };

  const date = scheduledTime instanceof Date ? scheduledTime : new Date(scheduledTime);
  const timeString = formatTime(date);
  const dateString = showDate ? formatDate(date) : null;

  return (
    <div 
      className={`
        ${styles.preOrderBadge} 
        ${styles[`preOrderBadge--${variant}`]}
        ${styles[`preOrderBadge--${size}`]}
        ${className}
      `}
    >
      <Badge variant="warning" size={size} className={styles.preOrderBadge__badge}>
        {showIcon && <span className={styles.preOrderBadge__icon}>🕐</span>}
        <span className={styles.preOrderBadge__label}>PRE-ORDER</span>
      </Badge>
      
      <div className={styles.preOrderBadge__time}>
        {dateString && (
          <span className={styles.preOrderBadge__date}>{dateString}</span>
        )}
        <strong className={styles.preOrderBadge__timeValue}>{timeString}</strong>
      </div>
    </div>
  );
};

export default PreOrderBadge;
