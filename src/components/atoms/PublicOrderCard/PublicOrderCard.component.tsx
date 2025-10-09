import React from 'react';
import classNames from 'classnames';
import { Typography } from '@/components/atoms';
import type { PublicOrderCardProps } from './PublicOrderCard.types';
import styles from './PublicOrderCard.module.scss';

const statusConfig = {
  pending: { label: 'Order Received', color: 'info', icon: '📝' },
  accepted: { label: 'Confirmed', color: 'success', icon: '✅' },
  preparing: { label: 'Preparing', color: 'warning', icon: '👨‍🍳' },
  ready: { label: 'Ready', color: 'success', icon: '🔔' },
  delivered: { label: 'Completed', color: 'success', icon: '✨' },
  cancelled: { label: 'Cancelled', color: 'error', icon: '❌' },
};

export const PublicOrderCard: React.FC<PublicOrderCardProps> = ({
  orderNumber,
  status,
  estimatedTime,
  className,
  'data-testid': dataTestId,
}) => {
  const statusInfo = statusConfig[status];
  const cardClasses = classNames(
    styles.publicOrderCard,
    styles[`publicOrderCard--${statusInfo.color}`],
    className
  );

  return (
    <div className={cardClasses} data-testid={dataTestId}>
      <div className={styles.publicOrderCard__header}>
        <div className={styles.publicOrderCard__number}>
          <Typography variant="heading-5">
            #{orderNumber}
          </Typography>
        </div>
        <div className={styles.publicOrderCard__icon}>
          <span>{statusInfo.icon}</span>
        </div>
      </div>
      
      <div className={styles.publicOrderCard__content}>
        <div className={styles.publicOrderCard__status}>
          <Typography variant="body-medium" className={styles.publicOrderCard__statusText}>
            {statusInfo.label}
          </Typography>
        </div>
        
        {estimatedTime && status === 'preparing' && (
          <div className={styles.publicOrderCard__time}>
            <Typography variant="body-small" className={styles.publicOrderCard__timeText}>
              Est. {estimatedTime}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};