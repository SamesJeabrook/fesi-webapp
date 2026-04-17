import React from 'react';
import classNames from 'classnames';
import { Typography } from '@/components/atoms';
import { PreOrderBadge } from '@/components/molecules/PreOrderBadge';
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
      [styles.refired]: order.refired_at && ['accepted', 'preparing', 'ready'].includes(order.status),
      [styles.paymentPending]: order.payment_status === 'pending',
      [styles.preOrder]: order.is_pre_order === true,
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

  // Debug refired items
  if (order.refired_at) {
    console.log('Refired order:', {
      orderId: order.id,
      orderNumber: order.order_number,
      refired_at: order.refired_at,
      refired_item_ids: order.refired_item_ids,
      items: order.items.map(i => ({ id: i.id, title: i.menu_item_title || i.menu_item_name }))
    });
  }

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
            {order.table_number ? `Table ${order.table_number}` : `#${order.order_number}`}
          </Typography>
          <div className={`${styles.status} ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </div>
        </div>
        <Typography variant="body-small" className={styles.time}>
          {formatTime(order.created_at)}
        </Typography>
      </div>

      {/* Pre-Order Badge */}
      {order.is_pre_order && order.scheduled_time && (
        <div className={styles.preOrderBadge}>
          <PreOrderBadge scheduledTime={order.scheduled_time} />
        </div>
      )}

      <div className={styles.customer}>
        <Typography variant="body-medium" className={styles.customerName}>
          {order.first_name} {order.last_name}
        </Typography>
        {order.table_number && (
          <Typography variant="body-small" className={styles.tableNumber}>
            🪑 Table {order.table_number}
          </Typography>
        )}
      </div>

      <div className={styles.items}>
        <Typography variant="body-small" className={styles.itemCount}>
          {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}
          {order.refired_at && order.refired_item_ids && order.refired_item_ids.length > 0 && (
            <span className={styles.refiredBadge}> 🔥 {order.refired_item_ids.length} refired</span>
          )}
        </Typography>
        <div className={styles.itemList}>
          {order.items.slice(0, 3).map((item, index) => {
            const isRefired = order.refired_item_ids?.includes(item.id || '');
            
            // Debug logging
            if (order.refired_at && index === 0) {
              console.log('OrderCard item check:', {
                orderId: order.id,
                itemId: item.id,
                itemTitle: item.menu_item_title || item.menu_item_name,
                refired_item_ids: order.refired_item_ids,
                isRefired,
                refiredItemIdsType: typeof order.refired_item_ids,
                refiredItemIdsArray: Array.isArray(order.refired_item_ids)
              });
            }
            
            return (
              <div key={index} className={classNames(styles.item, {
                [styles.refiredItem]: isRefired
              })}>
                <Typography variant="body-small">
                  {isRefired && <span className={styles.fireIcon}>🔥 </span>}
                  {item.quantity}x {item.menu_item_title || item.menu_item_name}
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
            );
          })}
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