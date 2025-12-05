import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { OrderBoard } from '@/components/molecules/OrderBoard';
import { OrderCard } from '@/components/atoms/OrderCard';
import { Typography, Button } from '@/components/atoms';
import { useWebSocket } from '@/hooks/useWebSocket';
import type { CustomerOrderTrackerProps } from './CustomerOrderTracker.types';
import styles from './CustomerOrderTracker.module.scss';

export const CustomerOrderTracker: React.FC<CustomerOrderTrackerProps> = ({
  order,
  queueOrders = [],
  isLoading = false,
  error = null,
  onRefresh,
  className,
  'data-testid': dataTestId,
}) => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const trackerClasses = classNames(styles.customerOrderTracker, className);

  // Use centralized WebSocket connection
  const { sendMessage } = useWebSocket({
    enabled: true,
    onMessage: (message) => {
      if (message.type === 'ORDER_STATUS_UPDATE' && message.payload.id === order.id) {
        // Refresh order when status changes
        onRefresh?.();
        setLastUpdated(new Date());
        
        // Show notification for status changes
        if (message.payload.status === 'ready') {
          if ('Notification' in window && (window as any).Notification.permission === 'granted') {
            new (window as any).Notification(`Your order #${order.order_number} is ready for collection!`);
          }
        }
      }
    },
    onOpen: () => {
      console.log('Customer WebSocket connected');
      // Subscribe to order updates
      sendMessage({
        type: 'SUBSCRIBE_ORDERS',
        orderIds: [order.id]
      });
    },
    autoReconnect: true,
    reconnectDelay: 3000,
  });

  const getQueuePosition = () => {
    if (!queueOrders.length) return null;
    
    // Calculate position based on orders with same or earlier status
    const statusOrder = ['pending', 'accepted', 'preparing', 'ready', 'complete'];
    const currentStatusIndex = statusOrder.indexOf(order.status);
    
    if (currentStatusIndex === -1) return null;
    
    // Count orders ahead in queue (same status but created earlier, or earlier status)
    const ordersAhead = queueOrders.filter(queueOrder => {
      if (queueOrder.id === order.id) return false;
      
      const queueStatusIndex = statusOrder.indexOf(queueOrder.status);
      
      // Orders with earlier status are ahead
      if (queueStatusIndex < currentStatusIndex) return true;
      
      // Orders with same status but created earlier are ahead
      if (queueStatusIndex === currentStatusIndex) {
        return new Date(queueOrder.created_at) < new Date(order.created_at);
      }
      
      return false;
    });
    
    return ordersAhead.length + 1;
  };

  const getStatusMessage = () => {
    switch (order.status) {
      case 'pending':
        return 'Your order has been received and is waiting for confirmation.';
      case 'accepted':
        return 'Your order has been accepted and will be prepared shortly.';
      case 'preparing':
        return 'Your order is currently being prepared.';
      case 'ready':
        return 'Your order is ready for collection!';
      case 'complete':
        return 'Your order has been completed. Thank you!';
      case 'cancelled':
        return 'Your order has been cancelled.';
      default:
        return 'Order status unknown.';
    }
  };

  const getEstimatedTime = () => {
    if (order.estimated_completion) {
      const eta = new Date(order.estimated_completion);
      const now = new Date();
      const diffMs = eta.getTime() - now.getTime();
      const diffMins = Math.ceil(diffMs / (1000 * 60));
      
      if (diffMins > 0) {
        return `Estimated completion in ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
      } else {
        return 'Should be ready now';
      }
    }
    return null;
  };

  const queuePosition = getQueuePosition();
  const estimatedTime = getEstimatedTime();

  if (isLoading) {
    return (
      <div className={trackerClasses} data-testid={dataTestId}>
        <div className={styles.loadingState}>
          <Typography variant="heading-5">Loading order details...</Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={trackerClasses} data-testid={dataTestId}>
        <div className={styles.errorState}>
          <Typography variant="heading-5" className={styles.errorTitle}>
            Error loading order
          </Typography>
          <Typography variant="body-medium" className={styles.errorMessage}>
            {error}
          </Typography>
          <Button variant="primary" onClick={onRefresh}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={trackerClasses} data-testid={dataTestId}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Typography variant="heading-3" className={styles.title}>
            Order #{order.order_number}
          </Typography>
          <Typography variant="body-medium" className={styles.statusMessage}>
            {getStatusMessage()}
          </Typography>
        </div>
        
        <div className={styles.headerInfo}>
          {queuePosition && order.status !== 'ready' && order.status !== 'complete' && order.status !== 'cancelled' && (
            <div className={styles.queueInfo}>
              <Typography variant="body-medium" className={styles.queuePosition}>
                Position in queue: #{queuePosition}
              </Typography>
            </div>
          )}
          {estimatedTime && (
            <div className={styles.timeInfo}>
              <Typography variant="body-medium" className={styles.estimatedTime}>
                {estimatedTime}
              </Typography>
            </div>
          )}
          <div className={styles.lastUpdated}>
            <Typography variant="caption">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Typography>
            <Button 
              variant="secondary" 
              onClick={() => {
                onRefresh?.();
                setLastUpdated(new Date());
              }}
              isDisabled={isLoading}
            >
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.orderDetails}>
          <OrderCard
            order={order}
            isDraggable={false}
            onClick={() => {}}
          />
        </div>
        
        {queueOrders.length > 0 && (
          <div className={styles.queueView}>
            <Typography variant="heading-5" className={styles.queueTitle}>
              Order Queue
            </Typography>
            <Typography variant="body-small" className={styles.queueDescription}>
              See where your order stands in the queue
            </Typography>
            <OrderBoard
              orders={queueOrders}
              isReadOnly={true}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>
    </div>
  );
};