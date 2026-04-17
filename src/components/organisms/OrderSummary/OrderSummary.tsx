import React from 'react';
import OrderItemList, { OrderItem } from '@/components/molecules/OrderItemList/OrderItemList';
import OrderCostBreakdown, { OrderCostBreakdownProps } from '@/components/molecules/OrderCostBreakdown/OrderCostBreakdown';
import OrderPaymentForm from '@/components/molecules/OrderPaymentForm/OrderPaymentForm';
import styles from './OrderSummary.module.scss';
import EmptyBasketNotice from '@/components/molecules/EmptyBasketNotice/EmptyBasketNotice';
import { Event } from '@/types';
import { OrderListItem } from '@/components/molecules/OrderList/OrderList';

interface PreOrderSettings {
  enabled: boolean;
  require_time_slot_selection: boolean;
  slot_duration_minutes: number;
  orders_per_slot: number;
  min_advance_minutes: number;
  max_advance_hours: number;
}

interface SelectedPreOrderSlot {
  id: string;
  time: string;
}

export interface OrderSummaryProps {
  items: OrderItem[];
  costBreakdown: OrderCostBreakdownProps;
  onRemoveItem?: (menu_item_id: string) => void;
  clientSecret?: string;
  onPaymentSuccess?: (paymentIntentId: string) => void;
  onPaymentError?: (error: any) => void;
  event: Event;
  onOrderAccepted?: (order: OrderListItem) => void;
  tableId?: string;
  tableNumber?: string;
  preOrderSettings?: PreOrderSettings | null;
  selectedPreOrderSlot?: SelectedPreOrderSlot | null;
  onPreOrderSlotSelected?: (slotId: string, slotTime: string) => void;
}


const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  items, 
  costBreakdown, 
  onRemoveItem, 
  clientSecret, 
  onPaymentSuccess, 
  onPaymentError, 
  event, 
  onOrderAccepted, 
  tableId, 
  tableNumber,
  preOrderSettings,
  selectedPreOrderSlot,
  onPreOrderSlotSelected,
}) => {
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
            tableId={tableId}
            tableNumber={tableNumber}
            preOrderSettings={preOrderSettings}
            selectedPreOrderSlot={selectedPreOrderSlot}
            onPreOrderSlotSelected={onPreOrderSlotSelected}
          />
        </>
      )}
    </div>
  );
};

export default OrderSummary;
