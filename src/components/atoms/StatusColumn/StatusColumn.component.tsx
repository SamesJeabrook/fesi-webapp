import React from 'react';
import classNames from 'classnames';
import { Typography } from '@/components/atoms';
import type { StatusColumnProps } from './StatusColumn.types';
import styles from './StatusColumn.module.scss';

export const StatusColumn: React.FC<StatusColumnProps> = ({
  title,
  status,
  children,
  acceptsDrops = true,
  isDraggedOver = false,
  onDrop,
  onDragOver,
  onDragLeave,
  count = 0,
  className,
  'data-testid': dataTestId,
}) => {
  const columnClasses = classNames(
    styles.statusColumn,
    styles[status],
    {
      [styles.draggedOver]: isDraggedOver,
      [styles.acceptsDrops]: acceptsDrops,
    },
    className
  );

  const handleDragOver = (event: React.DragEvent) => {
    if (acceptsDrops) {
      event.preventDefault();
      onDragOver?.(event);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    if (acceptsDrops) {
      event.preventDefault();
      const orderId = event.dataTransfer.getData('text/plain');
      onDrop?.(orderId, status);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'accepted':
        return '✅';
      case 'preparing':
        return '👨‍🍳';
      case 'ready':
        return '🔔';
      case 'complete':
        return '✨';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  return (
    <div
      className={columnClasses}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={onDragLeave}
      data-testid={dataTestId}
    >
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <span className={styles.icon}>{getStatusIcon()}</span>
          <Typography variant="heading-6" className={styles.title}>
            {title}
          </Typography>
        </div>
        {count > 0 && (
          <div className={styles.badge}>
            <Typography variant="caption" className={styles.count}>
              {count}
            </Typography>
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        {children}
        {acceptsDrops && isDraggedOver && (
          <div className={styles.dropZone}>
            <Typography variant="body-small">Drop order here</Typography>
          </div>
        )}
        {React.Children.count(children) === 0 && !isDraggedOver && (
          <div className={styles.emptyState}>
            <Typography variant="body-small" className={styles.emptyText}>
              No orders
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};