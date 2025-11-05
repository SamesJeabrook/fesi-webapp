import React from 'react';
import { Typography, Input, Button } from '@/components/atoms';
import styles from './POSCartItem.module.scss';

export interface CartItemCustomization {
  sub_item_id: string;
  sub_item_name: string;
  price_modifier: number;
  quantity: number;
}

export interface POSCartItemProps {
  /** Unique ID for this cart item instance */
  id: string;
  /** The menu item name */
  menuItemName: string;
  /** Quantity of this item */
  quantity: number;
  /** Total price for this line item (includes customizations x quantity) in cents */
  itemTotal: number;
  /** Array of selected customizations */
  customizations?: CartItemCustomization[];
  /** Special instructions or notes */
  notes?: string;
  /** Handler for quantity changes */
  onQuantityChange?: (id: string, newQuantity: number) => void;
  /** Handler for notes changes */
  onNotesChange?: (id: string, notes: string) => void;
  /** Handler for removing the item */
  onRemove?: (id: string) => void;
}

export const POSCartItem: React.FC<POSCartItemProps> = ({
  id,
  menuItemName,
  quantity,
  itemTotal,
  customizations = [],
  notes = '',
  onQuantityChange,
  onNotesChange,
  onRemove
}) => {
  const formattedPrice = `£${(itemTotal / 100).toFixed(2)}`;

  const handleDecrement = () => {
    if (onQuantityChange) {
      onQuantityChange(id, Math.max(0, quantity - 1));
    }
  };

  const handleIncrement = () => {
    if (onQuantityChange) {
      onQuantityChange(id, quantity + 1);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(id);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onNotesChange) {
      onNotesChange(id, e.target.value);
    }
  };

  return (
    <div className={styles.cartItem}>
      <div className={styles.cartItem__header}>
        <div className={styles.cartItem__details}>
          <Typography variant="body-large" className={styles.cartItem__name}>
            {menuItemName}
          </Typography>
          {customizations.length > 0 && (
            <Typography 
              variant="body-small" 
              className={styles.cartItem__customizations}
            >
              {customizations.map(c => c.sub_item_name).join(', ')}
            </Typography>
          )}
        </div>
        <Typography variant="body-medium" className={styles.cartItem__price}>
          {formattedPrice}
        </Typography>
      </div>

      <div className={styles.cartItem__controls}>
        <div className={styles.cartItem__quantityControls}>
          <button
            type="button"
            onClick={handleDecrement}
            className={styles.cartItem__quantityBtn}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className={styles.cartItem__quantity}>{quantity}</span>
          <button
            type="button"
            onClick={handleIncrement}
            className={styles.cartItem__quantityBtn}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          className={styles.cartItem__removeBtn}
          aria-label={`Remove ${menuItemName} from cart`}
        >
          Remove
        </button>
      </div>

      <Input
        id={`notes-${id}`}
        type="text"
        placeholder="Special instructions..."
        value={notes}
        onChange={handleNotesChange}
        className={styles.cartItem__notes}
      />
    </div>
  );
};

export default POSCartItem;
