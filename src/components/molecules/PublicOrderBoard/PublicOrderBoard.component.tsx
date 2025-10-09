'use client';

import React from 'react';
import classNames from 'classnames';
import { Typography } from '@/components/atoms';
import { PublicOrderCard } from '@/components/atoms/PublicOrderCard';
import type { PublicOrderBoardProps } from './PublicOrderBoard.types';
import styles from './PublicOrderBoard.module.scss';

export const PublicOrderBoard: React.FC<PublicOrderBoardProps> = ({
  orders,
  merchantName,
  isLoading = false,
  className,
  'data-testid': dataTestId,
}) => {
  const boardClasses = classNames(styles.publicOrderBoard, className);

  // Filter orders to exclude completed and cancelled for public view
  const activeOrders = orders.filter(order => 
    !['delivered', 'cancelled'].includes(order.status)
  );

  // Group orders by status
  const groupedOrders = {
    pending: activeOrders.filter(order => order.status === 'pending'),
    confirmed: activeOrders.filter(order => order.status === 'accepted'), 
    preparing: activeOrders.filter(order => order.status === 'preparing'),
    ready: activeOrders.filter(order => order.status === 'ready'),
  };

  const formatEstimatedTime = (estimatedTime?: string) => {
    if (!estimatedTime) return undefined;
    try {
      const date = new Date(estimatedTime);
      const now = new Date();
      const diffMs = date.getTime() - now.getTime();
      const diffMins = Math.round(diffMs / (1000 * 60));
      
      if (diffMins <= 0) return 'Soon';
      if (diffMins < 60) return `${diffMins} mins`;
      
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    } catch {
      return estimatedTime;
    }
  };

  if (isLoading) {
    return (
      <div className={boardClasses} data-testid={dataTestId}>
        <div className={styles.publicOrderBoard__header}>
          <Typography variant="heading-3">
            {merchantName ? `${merchantName} - Order Status` : 'Order Status'}
          </Typography>
        </div>
        <div className={styles.publicOrderBoard__loading}>
          <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Loading orders...
          </Typography>
        </div>
      </div>
    );
  }

  if (activeOrders.length === 0) {
    return (
      <div className={boardClasses} data-testid={dataTestId}>
        <div className={styles.publicOrderBoard__header}>
          <Typography variant="heading-3">
            {merchantName ? `${merchantName} - Order Status` : 'Order Status'}
          </Typography>
        </div>
        <div className={styles.publicOrderBoard__empty}>
          <Typography variant="heading-5" style={{ color: 'var(--color-text-secondary)' }}>
            No active orders
          </Typography>
          <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
            All orders are completed or there are no current orders
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={boardClasses} data-testid={dataTestId}>
      <div className={styles.publicOrderBoard__header}>
        <Typography variant="heading-3">
          {merchantName ? `${merchantName} - Order Status` : 'Order Status'}
        </Typography>
        <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
          Track your order progress • Updated in real-time
        </Typography>
      </div>

      <div className={styles.publicOrderBoard__columns}>
        {/* Order Received */}
        {/* {groupedOrders.pending.length > 0 && (
          <div className={styles.publicOrderBoard__column}>
            <div className={styles.publicOrderBoard__columnHeader}>
              <Typography variant="heading-5">
                📝 Order Received
              </Typography>
              <span className={styles.publicOrderBoard__count}>
                {groupedOrders.pending.length}
              </span>
            </div>
            <div className={styles.publicOrderBoard__cards}>
              {groupedOrders.pending.map((order) => (
                <PublicOrderCard
                  key={order.id}
                  orderNumber={order.orderNumber}
                  status={order.status}
                />
              ))}
            </div>
          </div>
        )} */}

        {/* Confirmed */}
        {groupedOrders.confirmed.length > 0 && (
          <div className={styles.publicOrderBoard__column}>
            <div className={styles.publicOrderBoard__columnHeader}>
              <Typography variant="heading-5">
                ✅ Confirmed
              </Typography>
              <span className={styles.publicOrderBoard__count}>
                {groupedOrders.confirmed.length}
              </span>
            </div>
            <div className={styles.publicOrderBoard__cards}>
              {groupedOrders.confirmed.map((order) => (
                <PublicOrderCard
                  key={order.id}
                  orderNumber={order.orderNumber}
                  status={order.status}
                />
              ))}
            </div>
          </div>
        )}

        {/* Preparing */}
        {groupedOrders.preparing.length > 0 && (
          <div className={styles.publicOrderBoard__column}>
            <div className={styles.publicOrderBoard__columnHeader}>
              <Typography variant="heading-5">
                👨‍🍳 Preparing
              </Typography>
              <span className={styles.publicOrderBoard__count}>
                {groupedOrders.preparing.length}
              </span>
            </div>
            <div className={styles.publicOrderBoard__cards}>
              {groupedOrders.preparing.map((order) => (
                <PublicOrderCard
                  key={order.id}
                  orderNumber={order.orderNumber}
                  status={order.status}
                  estimatedTime={formatEstimatedTime(order.estimatedDeliveryTime)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Ready */}
        {groupedOrders.ready.length > 0 && (
          <div className={styles.publicOrderBoard__column}>
            <div className={styles.publicOrderBoard__columnHeader}>
              <Typography variant="heading-5">
                🔔 Ready for Pickup
              </Typography>
              <span className={styles.publicOrderBoard__count}>
                {groupedOrders.ready.length}
              </span>
            </div>
            <div className={styles.publicOrderBoard__cards}>
              {groupedOrders.ready.map((order) => (
                <PublicOrderCard
                  key={order.id}
                  orderNumber={order.orderNumber}
                  status={order.status}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};