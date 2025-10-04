import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { OrderBoard } from '@/components/molecules/OrderBoard';
import { Typography, Button } from '@/components/atoms';
import type { MerchantOrderDashboardProps } from './MerchantOrderDashboard.types';
import styles from './MerchantOrderDashboard.module.scss';

export const MerchantOrderDashboard: React.FC<MerchantOrderDashboardProps> = ({
  merchant,
  orders,
  isLoading = false,
  error = null,
  onOrderStatusChange,
  onRefresh,
  className,
  'data-testid': dataTestId,
}) => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const socket = useRef<WebSocket | null>(null);

  const dashboardClasses = classNames(styles.merchantOrderDashboard, className);

  // WebSocket connection for real-time order updates
  useEffect(() => {
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'}/merchant-orders`;
    
    try {
      socket.current = new WebSocket(wsUrl);

      socket.current.onopen = () => {
        console.log('Merchant WebSocket connection established');
        
        // Subscribe to merchant's orders
        socket.current?.send(JSON.stringify({
          type: 'SUBSCRIBE_MERCHANT_ORDERS',
          merchantId: merchant.id
        }));
      };

      socket.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'NEW_ORDER' || data.type === 'ORDER_UPDATE') {
            // Refresh orders when new order comes in or order is updated
            onRefresh?.();
            setLastUpdated(new Date());
            
            // Show notification for new orders
            if (data.type === 'NEW_ORDER') {
              if ('Notification' in window && (window as any).Notification.permission === 'granted') {
                new (window as any).Notification(`New order received: #${data.payload.order_number}`);
              }
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.current.onerror = (error) => {
        console.error('Merchant WebSocket error:', error);
      };

      socket.current.onclose = () => {
        console.log('Merchant WebSocket connection closed');
      };

    } catch (error) {
      console.error('Failed to create merchant WebSocket connection:', error);
    }

    return () => {
      if (socket.current) {
        socket.current.close();
        socket.current = null;
      }
    };
  }, [merchant.id, onRefresh]);

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // Update order status via API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Call the parent handler
      onOrderStatusChange?.(orderId, newStatus);
      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error updating order status:', error);
      // You might want to show an error notification here
    }
  };

  const handleRefresh = () => {
    onRefresh?.();
    setLastUpdated(new Date());
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      active: orders.filter(o => ['accepted', 'preparing'].includes(o.status)).length,
      ready: orders.filter(o => o.status === 'ready').length,
    };
    return stats;
  };

  const stats = getOrderStats();

  return (
    <div className={dashboardClasses} data-testid={dataTestId}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.merchantInfo}>
            <Typography variant="heading-3" className={styles.merchantName}>
              {merchant.name}
            </Typography>
            <Typography variant="body-medium" className={styles.subtitle}>
              Order Management Dashboard
            </Typography>
          </div>
          
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <Typography variant="heading-6" className={styles.statValue}>
                {stats.total}
              </Typography>
              <Typography variant="caption" className={styles.statLabel}>
                Total Orders
              </Typography>
            </div>
            <div className={styles.statItem}>
              <Typography variant="heading-6" className={styles.statValue}>
                {stats.pending}
              </Typography>
              <Typography variant="caption" className={styles.statLabel}>
                Pending
              </Typography>
            </div>
            <div className={styles.statItem}>
              <Typography variant="heading-6" className={styles.statValue}>
                {stats.active}
              </Typography>
              <Typography variant="caption" className={styles.statLabel}>
                Active
              </Typography>
            </div>
            <div className={styles.statItem}>
              <Typography variant="heading-6" className={styles.statValue}>
                {stats.ready}
              </Typography>
              <Typography variant="caption" className={styles.statLabel}>
                Ready
              </Typography>
            </div>
          </div>
        </div>
        
        <div className={styles.headerActions}>
          <div className={styles.lastUpdated}>
            <Typography variant="caption">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Typography>
          </div>
          <Button 
            variant="secondary" 
            onClick={handleRefresh}
            isDisabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </header>

      <main className={styles.main}>
        <OrderBoard
          orders={orders}
          isReadOnly={false}
          onOrderStatusChange={handleOrderStatusChange}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
};