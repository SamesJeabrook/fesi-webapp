'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { Button, Typography } from '@/components/atoms';
import api from '@/utils/api';
import styles from './OrderDetailsModal.module.scss';
import type { OrderDetailsModalProps } from './OrderDetailsModal.types';

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
  onRefund,
  onRefire,
  merchantId,
}) => {
  const [showRefireModal, setShowRefireModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isRefiring, setIsRefiring] = useState(false);

  const formatPrice = (amount: number) => {
    return `£${(amount / 100).toFixed(2)}`;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusClass = (status: string) => {
    return styles[`header__status--${status}`] || styles['header__status--pending'];
  };

  const handleRefundClick = () => {
    if (onRefund) {
      // TODO: Implement refund logic
      // For now, just show an alert
      alert('Refund functionality is not yet implemented. This will handle partial/full refunds and stock returns.');
    }
  };

  const handleRefireClick = () => {
    setSelectedItems(order.items.map(item => item.id));
    setShowRefireModal(true);
  };

  const handleRefireConfirm = async () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item to refire');
      return;
    }

    try {
      setIsRefiring(true);

      // Call API to refire items
      await api.post(`/api/orders/${order.id}/refire`, {
        item_ids: selectedItems,
        merchant_id: merchantId,
      });

      alert(`Successfully refired ${selectedItems.length} item(s). Stock has been deducted.`);
      setShowRefireModal(false);
      setSelectedItems([]);
      onRefire?.(order.id, selectedItems);
    } catch (error) {
      console.error('Error refiring items:', error);
      alert('Failed to refire items. Please try again.');
    } finally {
      setIsRefiring(false);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Order Details`}
        size="large"
      >
        <div className={styles.content}>
          {/* Header Section */}
          <div className={styles.header}>
            <div className={styles.header__info}>
              <div className={styles.header__orderNumber}>
                #{order.order_number}
              </div>
              <div className={styles.header__meta}>
                <div className={styles.header__metaItem}>
                  <span className={styles.header__label}>Time</span>
                  <span className={styles.header__value}>
                    {formatTime(order.created_at)}
                  </span>
                </div>
                <div className={styles.header__metaItem}>
                  <span className={styles.header__label}>Date</span>
                  <span className={styles.header__value}>
                    {formatDate(order.created_at)}
                  </span>
                </div>
                <div className={styles.header__metaItem}>
                  <span className={styles.header__label}>Type</span>
                  <span className={styles.header__value}>
                    {order.order_type || 'N/A'}
                  </span>
                </div>
                <div className={styles.header__metaItem}>
                  <span className={styles.header__label}>Payment</span>
                  <span className={styles.header__value}>
                    {order.payment_status || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <div className={`${styles.header__status} ${getStatusClass(order.status)}`}>
              {order.status}
            </div>
          </div>

          {/* Customer Information */}
          {(order.customer_name || order.customer_email || order.delivery_address) && (
            <div className={styles.customerInfo}>
              <div className={styles.customerInfo__title}>Customer Information</div>
              <div className={styles.customerInfo__details}>
                {order.customer_name && (
                  <div className={styles.customerInfo__row}>
                    <span className={styles.customerInfo__label}>Name:</span>
                    <span className={styles.customerInfo__value}>{order.customer_name}</span>
                  </div>
                )}
                {order.customer_email && (
                  <div className={styles.customerInfo__row}>
                    <span className={styles.customerInfo__label}>Email:</span>
                    <span className={styles.customerInfo__value}>{order.customer_email}</span>
                  </div>
                )}
                {order.delivery_address && (
                  <div className={styles.customerInfo__row}>
                    <span className={styles.customerInfo__label}>Address:</span>
                    <span className={styles.customerInfo__value}>
                      {order.delivery_address.line1}
                      {order.delivery_address.line2 && `, ${order.delivery_address.line2}`}
                      , {order.delivery_address.city} {order.delivery_address.postcode}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className={styles.items}>
            <div className={styles.items__title}>Order Items</div>
            <div className={styles.items__list}>
              {order.items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.item__header}>
                    <div>
                      <span className={styles.item__name}>
                        {item.menu_item_name || item.menu_item_title}
                      </span>
                      <span className={styles.item__quantity}>x{item.quantity}</span>
                    </div>
                    <span className={styles.item__price}>
                      {formatPrice(item.total_price || item.item_total || 0)}
                    </span>
                  </div>

                  {item.customizations && item.customizations.length > 0 && (
                    <div className={styles.item__customizations}>
                      {item.customizations.map((custom, idx) => {
                        const price = custom.price_modifier || custom.unit_price || 0;
                        return (
                          <div key={idx} className={styles.item__customization}>
                            <span className={styles.item__customizationName}>
                              • {custom.sub_item_name}
                              {custom.quantity > 1 && ` x${custom.quantity}`}
                            </span>
                            {price !== 0 && (
                              <span className={styles.item__customizationPrice}>
                                {price > 0 ? '+' : ''}
                                {formatPrice(price)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {item.special_instructions && (
                    <div className={styles.item__instructions}>
                      <span className={styles.item__instructionsLabel}>Note:</span>
                      {item.special_instructions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          {order.special_instructions && (
            <div className={styles.specialInstructions}>
              <div className={styles.specialInstructions__title}>
                ⚠️ Special Instructions
              </div>
              <div className={styles.specialInstructions__text}>
                {order.special_instructions}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className={styles.summary}>
            <div className={styles.summary__row}>
              <span className={styles.summary__label}>Subtotal</span>
              <span className={styles.summary__value}>{formatPrice(order.subtotal)}</span>
            </div>
            {order.delivery_fee !== undefined && order.delivery_fee > 0 && (
              <div className={styles.summary__row}>
                <span className={styles.summary__label}>Delivery Fee</span>
                <span className={styles.summary__value}>{formatPrice(order.delivery_fee)}</span>
              </div>
            )}
            {order.platform_fee !== undefined && order.platform_fee > 0 && (
              <div className={styles.summary__row}>
                <span className={styles.summary__label}>Platform Fee</span>
                <span className={styles.summary__value}>{formatPrice(order.platform_fee)}</span>
              </div>
            )}
            <div className={`${styles.summary__row} ${styles['summary__row--total']}`}>
              <span className={styles.summary__label}>Total</span>
              <span className={styles.summary__value}>{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <Button
              variant="outline"
              onClick={handleRefundClick}
              className={styles.actions__button}
            >
              💳 Refund
            </Button>
            <Button
              variant="primary"
              onClick={handleRefireClick}
              className={styles.actions__button}
            >
              🔥 Refire
            </Button>
          </div>
        </div>
      </Modal>

      {/* Refire Modal */}
      <Modal
        isOpen={showRefireModal}
        onClose={() => setShowRefireModal(false)}
        title="Refire Order Items"
        size="medium"
      >
        <div className={styles.refireModal__content}>
          <Typography variant="body-medium">
            Select the items you want to refire. Stock will be deducted again for selected items.
          </Typography>

          <div className={styles.refireModal__items}>
            {order.items.map((item) => (
              <div key={item.id} className={styles.refireModal__item}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItemSelection(item.id)}
                  />
                  <span>
                    {item.menu_item_name} x{item.quantity}
                  </span>
                </label>
              </div>
            ))}
          </div>

          <div className={styles.refireModal__actions}>
            <Button
              variant="secondary"
              onClick={() => setShowRefireModal(false)}
              isDisabled={isRefiring}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleRefireConfirm}
              isDisabled={isRefiring || selectedItems.length === 0}
            >
              {isRefiring ? 'Refiring...' : `Refire ${selectedItems.length} Item(s)`}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default OrderDetailsModal;
