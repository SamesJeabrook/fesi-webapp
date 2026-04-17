import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { OrderBoard } from '@/components/molecules/OrderBoard';
import { OrderDetailsModal } from '@/components/molecules/OrderDetailsModal';
import { OrderViewToggle, OrderView } from '@/components/molecules/OrderViewToggle/OrderViewToggle';
import { PreOrderTimelineView } from '@/components/organisms/PreOrderTimelineView/PreOrderTimelineView';
import { Typography, Button } from '@/components/atoms';
import { useWebSocket } from '@/hooks/useWebSocket';
import api from '@/utils/api';
import type { MerchantOrderDashboardProps } from './MerchantOrderDashboard.types';
import styles from './MerchantOrderDashboard.module.scss';

export const MerchantOrderDashboard: React.FC<MerchantOrderDashboardProps> = ({
  merchant,
  orders,
  isLoading = false,
  error = null,
  onOrderStatusChange,
  onRefresh,
  getToken,
  backLink,
  pollingInterval = 30000, // Default 30 seconds
  className,
  'data-testid': dataTestId,
}) => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [currentView, setCurrentView] = useState<OrderView>('all');
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const dashboardClasses = classNames(styles.merchantOrderDashboard, className);

  console.log('MerchantOrderDashboard mounted with merchant:', merchant);

  // Use centralized WebSocket connection
  const { sendMessage, status: wsStatus } = useWebSocket({
    enabled: !!merchant?.id,
    onMessage: (message) => {
      if (message.type === 'NEW_ORDER' || message.type === 'ORDER_STATUS_UPDATE') {
        // Refresh orders when new order comes in or order is updated
        onRefresh?.();
        setLastUpdated(new Date());
        
        // Show notification for new orders
        if (message.type === 'NEW_ORDER') {
          if ('Notification' in window && (window as any).Notification.permission === 'granted') {
            new (window as any).Notification(`New order received: #${message.payload.order_number}`);
          }
        }
      } else if (message.type === 'SUBSCRIBED_MERCHANT') {
        console.log(`Subscribed to merchant orders: ${message.merchantId}`);
      } else if (message.type === 'ERROR') {
        console.error('WebSocket error:', message.message);
      }
    },
    onOpen: () => {
      console.log('Merchant WebSocket connected');
      // Clear any existing polling when WebSocket connects
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      
      // Subscribe to merchant's orders
      if (merchant?.id) {
        sendMessage({
          type: 'SUBSCRIBE_MERCHANT_ORDERS',
          merchantId: merchant.id
        });
      }
    },
    onClose: () => {
      console.log('Merchant WebSocket disconnected, starting polling');
      startPolling();
    },
    onError: (error) => {
      console.error('Merchant WebSocket error, starting polling');
      startPolling();
    },
    autoReconnect: true,
    reconnectDelay: 3000,
  });

  // Map WebSocket status to connection status display
  const connectionStatus = wsStatus === 'connected' ? 'connected' : 
                          wsStatus === 'connecting' ? 'connecting' :
                          wsStatus === 'error' || wsStatus === 'disconnected' ? 'polling' : 'polling';

  // Fallback polling function
  function startPolling() {
    // Clear any existing polling
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    
    pollingRef.current = setInterval(() => {
      onRefresh?.();
      setLastUpdated(new Date());
    }, pollingInterval);
  }

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, []);

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      console.log('Updating order status:', { orderId, newStatus });

      // Update order status via API with CSRF protection
      await api.put(`/api/orders/${orderId}/status`, {
        status: newStatus
      });

      console.log('Order status updated successfully');

      // Call the parent handler
      onOrderStatusChange?.(orderId, newStatus);
      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error updating order status:', error);
      
      // Handle specific error cases
      const errorMessage = error instanceof Error ? error.message : 'Failed to update order status';
      
      if (errorMessage.includes('409') || errorMessage.includes('conflict')) {
        alert('Order was modified by another process. Please refresh and try again.');
      } else {
        alert('Failed to update order status. Please try again.');
      }
    }
  };

  const handleRefresh = () => {
    onRefresh?.();
    setLastUpdated(new Date());
  };

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
  };

  const handleRefund = (orderId: string) => {
    // TODO: Implement refund logic
    console.log('Refund order:', orderId);
  };

  const handleRefire = (orderId: string, itemIds?: string[], newStatus?: string, refiredAt?: string) => {
    console.log('Refire completed:', { orderId, itemIds, newStatus, refiredAt });
    
    // Close the modal
    setSelectedOrder(null);
    
    // Refresh orders from parent to get updated data with refired_item_ids from DB
    onRefresh?.();
    setLastUpdated(new Date());
  };

  const getOrderStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      active: orders.filter(o => ['accepted', 'preparing'].includes(o.status)).length,
      ready: orders.filter(o => o.status === 'ready').length,
      preOrders: orders.filter(o => o.is_pre_order === true).length,
      today: orders.filter(o => {
        const orderDate = new Date(o.created_at);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      }).length,
    };
    return stats;
  };

  // Filter orders based on current view
  const getFilteredOrders = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (currentView) {
      case 'preorders':
        return orders.filter(o => o.is_pre_order === true);
      case 'today':
        return orders.filter(o => {
          const orderDate = new Date(o.created_at);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === today.getTime();
        });
      case 'all':
      default:
        return orders;
    }
  };

  const stats = getOrderStats();
  const filteredOrders = getFilteredOrders();

  return (
    <div className={dashboardClasses} data-testid={dataTestId}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.merchantInfo}>
            {backLink && (
              <a href={backLink.href} className={styles.backLink}>
                ← {backLink.label}
              </a>
            )}
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
          <div className={styles.connectionInfo}>
            <div className={styles.connectionStatus}>
              <span className={`${styles.statusIndicator} ${styles[connectionStatus]}`} />
              <Typography variant="caption">
                {connectionStatus === 'connected' ? 'Live' : 
                 connectionStatus === 'polling' ? `Polling (${Math.floor(pollingInterval / 60000)}m)` :
                 connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </Typography>
            </div>
            <div className={styles.lastUpdated}>
              <Typography variant="caption">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Typography>
            </div>
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
        <div className={styles.viewControl}>
          <OrderViewToggle
            currentView={currentView}
            onViewChange={setCurrentView}
            preOrderCount={stats.preOrders}
            todayCount={stats.today}
          />
        </div>

        {currentView === 'preorders' ? (
          <PreOrderTimelineView
            orders={filteredOrders}
            capacityType="orders" // TODO: Get from merchant settings
            onOrderClick={handleOrderClick}
            onOrderStatusChange={handleOrderStatusChange}
          />
        ) : (
          <OrderBoard
            orders={filteredOrders}
            isReadOnly={false}
            onOrderStatusChange={handleOrderStatusChange}
            onOrderClick={handleOrderClick}
            isLoading={isLoading}
            error={error}
          />
        )}
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
          onRefund={handleRefund}
          onRefire={handleRefire}
          merchantId={merchant.id}
        />
      )}
    </div>
  );
};