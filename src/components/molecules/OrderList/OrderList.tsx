import React from 'react';
import { formatPrice } from '@/utils/menu';
import { Typography } from '@/components/atoms/Typography/Typography.component';
import styles from './OrderList.module.scss';
import { MapPin } from '@/components/atoms';

export interface OrderListItem {
    id: string;
    status: string;
    items: Array<{
        menu_item_title: string;
        quantity: number;
        customizations?: Array<{ sub_item_name: string; price_modifier: number; quantity: number }>;
    }>;
    order_number: number;
    longitude: number;
    latitude: number;
    merchant_name: string;
    total: number;
}

export interface OrderListProps {
  orders: OrderListItem[];
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
    console.log(orders);
  if (!orders.length) return (
    <div className={styles.orderList}>
      <Typography variant="body-medium" as="p">No orders yet.</Typography>
    </div>
  );
  return (
    <div className={styles.orderList}>
      {orders.map(order => (
        <div key={order.id} className={styles.orderItem}>
          <div className={styles.orderHeader}>
            <Typography variant="heading-5" as="h3">{order.merchant_name}</Typography>
            <Typography variant="heading-6" as="span">Order #{order.order_number}</Typography>
            <Typography 
              variant="caption" 
              as="span" 
              className={
                `${styles.orderStatus} ` +
                (order.status === 'accepted' ? '' : order.status === 'pending' ? styles.pending : styles.rejected)
              }
            >
              {order.status}
            </Typography>
          </div>
          <div className={styles.orderSummary}>
            {order.items.map((item, idx) => (
              <div key={idx}>
                <Typography variant="body-small" as="span">
                  {item.quantity} x {item.menu_item_title}
                </Typography>
                {(item.customizations?.length ?? 0) > 0 && (
                  <Typography variant="caption" as="span"> (
                    {(item.customizations ?? []).map((c, i) => (
                      <span key={i}>{c.sub_item_name}{c.price_modifier ? ` (+${c.price_modifier})` : ''}{i < (item.customizations?.length ?? 0) - 1 ? ', ' : ''}</span>
                    ))}
                  )</Typography>
                )}
              </div>
            ))}
          </div>
          <div className={styles.orderTotal}>
            <Typography variant="body-medium" as="span">
              Total: {formatPrice(order.total)}
            </Typography>
          </div>
          {(order.status === 'preparing' || order.status === 'complete') && (
            <MapPin lat={order.latitude} lng={order.longitude} showUserLocation={order.status === 'complete'} />
          )} 
        </div>
      ))}
    </div>
  );
};

export default OrderList;
