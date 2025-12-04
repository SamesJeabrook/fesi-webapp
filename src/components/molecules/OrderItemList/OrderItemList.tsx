import React from 'react';
import { Typography } from '@/components/atoms';
import { formatPrice } from '@/utils/menu';
import styles from './OrderItemList.module.scss';

export interface OrderItem {
  menu_item_id: string;
  menu_item_title: string;
  quantity: number;
  item_total: number;
  customizations?: {
    sub_item_id: string;
    sub_item_name: string;
    price_modifier: number;
    quantity: number;
  }[];
}

export interface OrderItemListProps {
  items: OrderItem[];
  onRemoveItem?: (menu_item_id: string) => void;
}

const OrderItemList: React.FC<OrderItemListProps> = ({ items, onRemoveItem }) => (
  <div className={styles.list}>
    <Typography variant="heading-5">Order Items</Typography>
    <ul className={styles.items}>
      {items.map((item, idx) => (
        <li key={item.menu_item_id + idx} className={styles.item}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="heading-6">{item.quantity} x {item.menu_item_title}</Typography>
            {onRemoveItem && (
              <button className={styles.removeBtn} onClick={() => onRemoveItem(item.menu_item_id)} aria-label="Remove item">✕</button>
            )}
          </div>
          <Typography variant="heading-6">{formatPrice(item.item_total)}</Typography>
          {item.customizations && item.customizations.length > 0 && (
            <ul className={styles.customizations}>
              {item.customizations.map((sub, subIdx) => (
                <li key={sub.sub_item_id + subIdx} className={styles.customization}>
                  <Typography variant="body-large">{sub.sub_item_name}</Typography>
                  {sub.price_modifier !== 0 && (
                    <Typography variant="body-large">
                      {sub.price_modifier > 0 ? '+' : ''}{formatPrice(sub.price_modifier)}
                    </Typography>
                  )}
                  {sub.quantity > 1 && (
                    <Typography variant="body-large"> x{sub.quantity}</Typography>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default OrderItemList;
