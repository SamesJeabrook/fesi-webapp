import React from 'react';
import { Typography } from '@/components/atoms';
import type { SessionOrderListProps } from './SessionOrderList.types';
import styles from './SessionOrderList.module.scss';

export const SessionOrderList: React.FC<SessionOrderListProps> = ({
  orders,
  sessionTotal,
  className = '',
}) => {
  const formatCurrency = (amount: number) => {
    return `£${amount.toFixed(2)}`;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (orders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Typography variant="body-medium">
          No orders yet for this session.
        </Typography>
      </div>
    );
  }

  return (
    <div className={`${styles.sessionOrderList} ${className}`}>
      {orders.map((order) => (
        <div key={order.id} className={styles.orderCard}>
          <div className={styles.orderHeader}>
            <Typography variant="heading-6">
              Order #{order.order_number}
            </Typography>
            <Typography variant="body-small" className={styles.orderTime}>
              {formatTime(order.created_at)}
            </Typography>
          </div>

          <div className={styles.items}>
            {order.items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemInfo}>
                  <Typography variant="body-medium">
                    {item.quantity}x {item.menu_item_title}
                  </Typography>
                  {item.options && item.options.length > 0 && (
                    <div className={styles.options}>
                      {item.options.map((opt, idx) => (
                        <Typography key={idx} variant="body-small" className={styles.option}>
                          + {opt.option_title}
                        </Typography>
                      ))}
                    </div>
                  )}
                </div>
                <Typography variant="body-medium" className={styles.itemPrice}>
                  {formatCurrency(item.total_price)}
                </Typography>
              </div>
            ))}
          </div>

          <div className={styles.orderTotal}>
            <Typography variant="body-medium" className={styles.totalLabel}>
              Order Total:
            </Typography>
            <Typography variant="body-medium" className={styles.totalAmount}>
              {formatCurrency(order.total_amount)}
            </Typography>
          </div>
        </div>
      ))}

      <div className={styles.sessionTotal}>
        <Typography variant="heading-5">
          Session Total:
        </Typography>
        <Typography variant="heading-5" className={styles.totalAmount}>
          {formatCurrency(sessionTotal)}
        </Typography>
      </div>
    </div>
  );
};
