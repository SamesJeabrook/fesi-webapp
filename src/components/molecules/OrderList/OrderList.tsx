import React, { useState } from 'react';
import { formatPrice } from '@/utils/menu';
import { Typography, Button } from '@/components/atoms';
import { OrderQRCode } from '@/components/atoms/OrderQRCode';
import { CancelOrderModal } from '@/components/molecules/CancelOrderModal';
import styles from './OrderList.module.scss';
import { MapPin } from '@/components/atoms';

export interface OrderListItem {
    id: string;
    status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'complete' | 'cancelled';
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
    completed_at?: string; // ISO timestamp when order was completed
    scheduled_time?: string; // ISO timestamp for pre-order pickup time
    is_pre_order?: boolean;
}

export interface OrderListProps {
  orders: OrderListItem[];
  onOrderCancelled?: (orderId: string) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onOrderCancelled }) => {
  const [qrModalOrder, setQrModalOrder] = useState<OrderListItem | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<OrderListItem | null>(null);
  
  // Filter out orders that were completed more than 12 hours ago
  const filteredOrders = orders.filter(order => {
    if (order.status === 'complete' && order.completed_at) {
      const completedTime = new Date(order.completed_at).getTime();
      const twelveHoursAgo = Date.now() - (12 * 60 * 60 * 1000); // 12 hours in milliseconds
      return completedTime > twelveHoursAgo;
    }
    return true; // Show all non-completed orders or completed orders without timestamp
  });
  
  if (!filteredOrders.length) return (
    <div className={styles.orderList}>
      <Typography variant="body-medium" as="p">No orders yet.</Typography>
    </div>
  );
  return (
    <div className={styles.orderList}>
      {filteredOrders.map(order => (
        <div key={order.id} className={styles.orderItem}>
          <div className={styles.orderHeader}>
            <Typography variant="heading-5" as="h3">{order.merchant_name}</Typography>
            <Typography variant="heading-6" as="span">Order #{order.order_number}</Typography>
            <Typography 
              variant="caption" 
              as="span" 
              className={
                `${styles.orderStatus} ` +
                (order.status === 'accepted' ? '' : 
                 order.status === 'pending' ? styles.pending : 
                 order.status === 'preparing' ? styles.preparing :
                 order.status === 'ready' ? styles.ready :
                 order.status === 'complete' ? styles.complete :
                 styles.rejected)
              }
            >
              {order.status}
            </Typography>
            {order.is_pre_order && order.scheduled_time && (
              <Typography variant="caption" as="span" className={styles.pickupTime}>
                🕐 {new Date(order.scheduled_time).toLocaleString('en-GB', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
            )}
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
            <div className={styles.orderActions}>
              {order.status === 'ready' && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setQrModalOrder(order)}
                  className={styles.qrButton}
                >
                  Show QR Code
                </Button>
              )}
              {['pending', 'accepted', 'preparing'].includes(order.status) && (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setCancelModalOrder(order)}
                  className={styles.cancelButton}
                >
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
          {(order.status === 'preparing' || order.status === 'ready') && (
            <MapPin
                lat={order.latitude}
                lng={order.longitude}
                showUserLocation={order.status === 'ready'}
                height={order.status === 'preparing' ? '200px' : '300px'}
            />
          )} 
        </div>
      ))}
      
      {/* Fullscreen QR Code Modal */}
      {qrModalOrder && (
        <div className={styles.qrModal}>
          <div className={styles.qrModalContent}>
            <button 
              className={styles.closeButton}
              onClick={() => setQrModalOrder(null)}
              aria-label="Close QR Code"
            >
              ×
            </button>
            
            <div className={styles.qrModalHeader}>
              <Typography variant="heading-4" as="h2">
                Order Ready for Pickup
              </Typography>
              <Typography variant="body-medium" as="p">
                Show this QR code to {qrModalOrder.merchant_name}
              </Typography>
            </div>
            
            <div className={styles.qrCodeContainer}>
              <OrderQRCode
                orderId={qrModalOrder.id}
                orderNumber={qrModalOrder.order_number.toString()}
                orderItems={qrModalOrder.items.map(item => ({
                  name: item.menu_item_title,
                  quantity: item.quantity
                }))}
                size={300}
                showOrderInfo={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModalOrder && (
        <CancelOrderModal
          orderId={cancelModalOrder.id}
          orderNumber={cancelModalOrder.order_number.toString()}
          onClose={() => setCancelModalOrder(null)}
          onCancelled={() => {
            setCancelModalOrder(null);
            if (onOrderCancelled) {
              onOrderCancelled(cancelModalOrder.id);
            }
          }}
          userRole="customer"
          skipAuth={true} // Allow guest users to cancel
        />
      )}
    </div>
  );
};

export default OrderList;
