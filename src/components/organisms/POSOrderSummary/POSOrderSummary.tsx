import React from 'react';
import { Typography, Button, Input } from '@/components/atoms';
import { POSCartItem, CartItemCustomization } from '@/components/molecules/POSCartItem';
import styles from './POSOrderSummary.module.scss';

export interface Event {
  id: string;
  name: string;
}

export interface CartItem {
  id: string;
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  item_base_price: number;
  customizations: CartItemCustomization[];
  item_total: number;
  notes?: string;
}

export interface POSOrderSummaryProps {
  /** Array of cart items */
  cart: CartItem[];
  /** Customer email */
  customerEmail: string;
  /** Customer name (optional) */
  customerName: string;
  /** Customer phone (optional) */
  customerPhone: string;
  /** Array of events (for multi-event merchants) */
  events?: Event[];
  /** Selected event ID */
  selectedEvent?: string;
  /** Whether the order is being submitted */
  isSubmitting?: boolean;
  /** Handler for customer email change */
  onCustomerEmailChange: (email: string) => void;
  /** Handler for customer name change */
  onCustomerNameChange: (name: string) => void;
  /** Handler for customer phone change */
  onCustomerPhoneChange: (phone: string) => void;
  /** Handler for event selection change */
  onEventChange?: (eventId: string) => void;
  /** Handler for cart item quantity change */
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  /** Handler for cart item notes change */
  onNotesChange: (itemId: string, notes: string) => void;
  /** Handler for clearing the cart */
  onClearCart: () => void;
  /** Handler for submitting the order */
  onSubmitOrder: () => void;
}

export const POSOrderSummary: React.FC<POSOrderSummaryProps> = ({
  cart,
  customerEmail,
  customerName,
  customerPhone,
  events = [],
  selectedEvent,
  isSubmitting = false,
  onCustomerEmailChange,
  onCustomerNameChange,
  onCustomerPhoneChange,
  onEventChange,
  onQuantityChange,
  onNotesChange,
  onClearCart,
  onSubmitOrder
}) => {
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.item_total, 0);
  };

  return (
    <div className={styles.summary}>
      <Typography variant="heading-4" className={styles.summary__title}>
        Current Order
      </Typography>

      {events.length > 1 && onEventChange && (
        <div className={styles.summary__eventSelector}>
          <select 
            value={selectedEvent} 
            onChange={(e) => onEventChange(e.target.value)}
            className={styles.summary__select}
          >
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.summary__customerInfo}>
        <Input
          id="customer-email"
          type="email"
          placeholder="Customer Email (optional)"
          value={customerEmail}
          onChange={(e) => onCustomerEmailChange(e.target.value)}
        />
        <Input
          id="customer-name"
          type="text"
          placeholder="Customer Name (optional)"
          value={customerName}
          onChange={(e) => onCustomerNameChange(e.target.value)}
        />
        <Input
          id="customer-phone"
          type="tel"
          placeholder="Phone (optional)"
          value={customerPhone}
          onChange={(e) => onCustomerPhoneChange(e.target.value)}
        />
      </div>

      <div className={styles.summary__cartItems}>
        {cart.length === 0 ? (
          <Typography 
            variant="body-medium" 
            className={styles.summary__emptyMessage}
          >
            Cart is empty
          </Typography>
        ) : (
          cart.map(item => (
            <POSCartItem
              key={item.id}
              id={item.id}
              menuItemName={item.menu_item_name}
              quantity={item.quantity}
              itemTotal={item.item_total}
              customizations={item.customizations}
              notes={item.notes}
              onQuantityChange={onQuantityChange}
              onNotesChange={onNotesChange}
              onRemove={(id) => onQuantityChange(id, 0)}
            />
          ))
        )}
      </div>

      <div className={styles.summary__footer}>
        <div className={styles.summary__total}>
          <Typography variant="heading-4">Total:</Typography>
          <Typography variant="heading-4">
            £{(calculateTotal() / 100).toFixed(2)}
          </Typography>
        </div>

        <div className={styles.summary__actions}>
          <Button
            onClick={onClearCart}
            variant="secondary"
            fullWidth
            isDisabled={cart.length === 0}
          >
            Clear Cart
          </Button>
          <Button
            onClick={onSubmitOrder}
            variant="primary"
            fullWidth
            isDisabled={cart.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Complete Order'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default POSOrderSummary;
