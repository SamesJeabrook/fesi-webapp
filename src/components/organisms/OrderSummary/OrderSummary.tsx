import React from 'react';
import OrderItemList, { OrderItem } from '@/components/molecules/OrderItemList/OrderItemList';
import OrderCostBreakdown, { OrderCostBreakdownProps } from '@/components/molecules/OrderCostBreakdown/OrderCostBreakdown';
import OrderPaymentForm from '@/components/molecules/OrderPaymentForm/OrderPaymentForm';
import styles from './OrderSummary.module.scss';
import EmptyBasketNotice from '@/components/molecules/EmptyBasketNotice/EmptyBasketNotice';

export interface OrderSummaryProps {
  items: OrderItem[];
  costBreakdown: OrderCostBreakdownProps;
  onRemoveItem?: (menu_item_id: string) => void;
  clientSecret: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError?: (error: any) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, costBreakdown, onRemoveItem, clientSecret, onPaymentSuccess, onPaymentError }) => (
  <div className={styles.summary}>
    {items.length === 0 ? (
        <EmptyBasketNotice/>
    ) : (
        <>
            <OrderItemList items={items} onRemoveItem={onRemoveItem} />
            <OrderCostBreakdown {...costBreakdown} />
            <OrderPaymentForm
            clientSecret={clientSecret}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
            />
        </>
    )}
  </div>
);

export default OrderSummary;
