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
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'}/orders`;
    
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
          
          if (data.type === 'NEW_ORDER' || data.type === 'ORDER_STATUS_UPDATE') {
            // Refresh orders when new order comes in or order is updated
            onRefresh?.();
            setLastUpdated(new Date());
            
            // Show notification for new orders
            if (data.type === 'NEW_ORDER') {
              if ('Notification' in window && (window as any).Notification.permission === 'granted') {
                new (window as any).Notification(`New order received: #${data.payload.order_number}`);
              }
            }
          } else if (data.type === 'SUBSCRIBED_MERCHANT') {
            console.log(`Subscribed to merchant orders: ${data.merchantId}`);
          } else if (data.type === 'ERROR') {
            console.error('WebSocket error:', data.message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.current.onerror = (error) => {
        console.error('Merchant WebSocket error:', error);
        // Fall back to polling on WebSocket error
        console.log('Falling back to polling due to WebSocket error');
        startPolling();
      };

      socket.current.onclose = () => {
        console.log('Merchant WebSocket connection closed');
        // Fall back to polling when connection closes
        console.log('Falling back to polling due to WebSocket close');
        startPolling();
      };

    } catch (error) {
      console.error('Failed to create merchant WebSocket connection:', error);
      // Fall back to polling if WebSocket creation fails
      startPolling();
    }

    // Fallback polling function
    function startPolling() {
      const interval = setInterval(() => {
        onRefresh?.();
        setLastUpdated(new Date());
      }, 30000);

      return () => clearInterval(interval);
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
      // Get auth token
      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Updating order status:', { orderId, newStatus, token: token.substring(0, 20) + '...' });

      // Update order status via API (let API handle version automatically)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus
          // Removed version - let API fetch current version automatically
        }),
      });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        
        if (response.status === 409) {
          throw new Error('Order was modified by another process. Please refresh and try again.');
        }
        throw new Error(`Failed to update order status: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Call the parent handler
      onOrderStatusChange?.(orderId, newStatus);
      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error updating order status:', error);
      // Show user-friendly error message
      alert(error instanceof Error ? error.message : 'Failed to update order status. Please try again.');
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