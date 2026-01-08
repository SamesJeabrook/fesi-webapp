import React from 'react';
import classNames from 'classnames';
import { Typography } from '@/components/atoms';
import type { TableCardProps } from './TableCard.types';
import styles from './TableCard.module.scss';

export const TableCard: React.FC<TableCardProps> = ({
  table,
  onClick,
  className,
  'data-testid': dataTestId,
}) => {
  const cardClasses = classNames(
    styles.tableCard,
    styles[table.status],
    {
      [styles.clickable]: onClick,
      [styles.hasSession]: table.current_session_id,
    },
    className
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return '✓';
      case 'occupied':
        return '👥';
      case 'reserved':
        return '🔒';
      case 'cleaning':
        return '🧹';
      default:
        return '';
    }
  };

  const formatElapsedTime = (seatedAt: string) => {
    const minutes = Math.floor((Date.now() - new Date(seatedAt).getTime()) / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      data-testid={dataTestId}
    >
      <div className={styles.statusIcon}>
        {getStatusIcon(table.status)}
      </div>
      
      <div className={styles.tableNumber}>
        <Typography variant="heading-5">
          {table.table_number}
        </Typography>
      </div>

      <div className={styles.capacity}>
        <Typography variant="body-small">
          {table.capacity} seats
        </Typography>
      </div>

      {table.current_session && (
        <div className={styles.sessionInfo}>
          <Typography variant="body-small" className={styles.guestCount}>
            {table.current_session.guest_count} guests
          </Typography>
          <Typography variant="body-small" className={styles.elapsed}>
            {formatElapsedTime(table.current_session.seated_at)}
          </Typography>
        </div>
      )}
    </div>
  );
};
