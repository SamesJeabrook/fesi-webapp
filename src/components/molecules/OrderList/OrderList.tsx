import React from 'react';
import styles from './OrderList.module.scss';

export interface OrderListItem {
  id: string;
  status: string;
  items: Array<{
    menu_item_name: string;
    quantity: number;
    customizations?: Array<{ sub_item_name: string; price_modifier: number; quantity: number }>;
  }>;
  total: number;
}

export interface OrderListProps {
  orders: OrderListItem[];
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  if (!orders.length) return <div className={styles.orderList}>No orders yet.</div>;
  return (
    <div className={styles.orderList}>
      {orders.map(order => (
        <div key={order.id} className={styles.orderItem}>
          <div className={styles.orderHeader}>
            <span>Order #{order.id}</span>
            <span className={
              `${styles.orderStatus} ` +
              (order.status === 'accepted' ? '' : order.status === 'pending' ? styles.pending : styles.rejected)
            }>
              {order.status}
            </span>
          </div>
          <div className={styles.orderSummary}>
            {order.items.map((item, idx) => (
              <div key={idx}>
                {item.menu_item_name} x{item.quantity}
                {(item.customizations?.length ?? 0) > 0 && (
                  <span> (
                    {(item.customizations ?? []).map((c, i) => (
                      <span key={i}>{c.sub_item_name}{c.price_modifier ? ` (+${c.price_modifier})` : ''}{i < (item.customizations?.length ?? 0) - 1 ? ', ' : ''}</span>
                    ))}
                  )</span>
                )}
              </div>
            ))}
          </div>
          <div className={styles.orderTotal}>
            Total: £{(order.total / 100).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
