import React from 'react';
import OrderItemList, { OrderItem } from '@/components/molecules/OrderItemList/OrderItemList';
import OrderCostBreakdown, { OrderCostBreakdownProps } from '@/components/molecules/OrderCostBreakdown/OrderCostBreakdown';
import OrderPaymentForm from '@/components/molecules/OrderPaymentForm/OrderPaymentForm';
import styles from './OrderSummary.module.scss';
import EmptyBasketNotice from '@/components/molecules/EmptyBasketNotice/EmptyBasketNotice';
import { Event } from '@/types';

export interface OrderSummaryProps {
  items: OrderItem[];
  costBreakdown: OrderCostBreakdownProps;
  onRemoveItem?: (menu_item_id: string) => void;
  clientSecret?: string;
  onPaymentSuccess?: (paymentIntentId: string) => void;
  onPaymentError?: (error: any) => void;
  event: Event;
  onOrderAccepted?: (order: {
    id: string;
    status: string;
    items: any[];
    total: number;
  }) => void;
}


const OrderSummary: React.FC<OrderSummaryProps> = ({ items, costBreakdown, onRemoveItem, clientSecret, onPaymentSuccess, onPaymentError, event }) => {
  return (
    <div className={styles.summary}>
      {items.length === 0 ? (
        <EmptyBasketNotice/>
      ) : (
        <>
          <OrderItemList items={items} onRemoveItem={onRemoveItem} />
          <OrderCostBreakdown {...costBreakdown} />
          <OrderPaymentForm
            onPaymentSuccess={onPaymentSuccess ?? (() => {})}
            onPaymentError={onPaymentError}
            costBreakdown={costBreakdown}
            eventData={event}
            basketItems={items}
            onOrderAccepted={typeof onOrderAccepted === 'function' ? onOrderAccepted : undefined}
          />
        </>
      )}
    </div>
  );
};

export default OrderSummary;
