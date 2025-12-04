import React from 'react';
import classNames from 'classnames';
import { Typography } from '@/components/atoms';
import type { OrderCardProps } from './OrderCard.types';
import styles from './OrderCard.module.scss';

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  isDraggable = false,
  isDragging = false,
  onClick,
  className,
  'data-testid': dataTestId,
  ...props
}) => {
  const cardClasses = classNames(
    styles.orderCard,
    {
      [styles.draggable]: isDraggable,
      [styles.dragging]: isDragging,
      [styles.clickable]: onClick,
    },
    className
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return styles.pending;
      case 'accepted': return styles.accepted;
      case 'preparing': return styles.preparing;
      case 'ready': return styles.ready;
      case 'complete': return styles.complete;
      case 'cancelled': return styles.cancelled;
      default: return '';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTotalItems = () => {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };

  console.log(order);

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      data-testid={dataTestId}
      {...props}
    >
      <div className={styles.header}>
        <div className={styles.orderInfo}>
          <Typography variant="heading-6" className={styles.orderNumber}>
            #{order.order_number}
          </Typography>
          <div className={`${styles.status} ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </div>
        </div>
        <Typography variant="body-small" className={styles.time}>
          {formatTime(order.created_at)}
        </Typography>
      </div>

      <div className={styles.customer}>
        <Typography variant="body-medium" className={styles.customerName}>
          {order.first_name} {order.last_name}
        </Typography>
      </div>

      <div className={styles.items}>
        <Typography variant="body-small" className={styles.itemCount}>
          {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}
        </Typography>
        <div className={styles.itemList}>
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} className={styles.item}>
              <Typography variant="body-small">
                {item.quantity}x {item.menu_item_title}
              </Typography>
              {item.customizations && item.customizations.length > 0 && (
                <div className={styles.customizations}>
                  {item.customizations.map((custom, customIndex) => (
                    <Typography key={customIndex} variant="caption" className={styles.customization}>
                      + {custom.sub_item_name}
                    </Typography>
                  ))}
                </div>
              )}
            </div>
          ))}
          {order.items.length > 3 && (
            <Typography variant="body-small" className={styles.moreItems}>
              +{order.items.length - 3} more items
            </Typography>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <Typography variant="body-medium" className={styles.total}>
          £{(order.total_amount / 100).toFixed(2)}
        </Typography>
        {order.estimated_completion && (
          <Typography variant="body-small" className={styles.eta}>
            ETA: {formatTime(order.estimated_completion)}
          </Typography>
        )}
      </div>

      {order.notes && (
        <div className={styles.notes}>
          <Typography variant="caption" className={styles.notesLabel}>
            Notes:
          </Typography>
          <Typography variant="body-small" className={styles.notesText}>
            {order.notes}
          </Typography>
        </div>
      )}

      {isDraggable && (
        <div className={styles.dragHandle}>
          <div className={styles.dragDots}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </div>
  );
};