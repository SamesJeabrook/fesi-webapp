import React, { useEffect, useRef } from 'react';
import { Typography } from '@/components/atoms';
import { DisplayOrderCard } from '@/components/atoms/DisplayOrderCard';
import { useWebSocket } from '@/hooks/useWebSocket';
import api from '@/utils/api';
import styles from './DisplayOrdersSection.module.scss';

interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'complete';
  items: Array<{
    name: string;
    quantity: number;
  }>;
  created_at: string;
}

interface DisplayOrdersSectionProps {
  merchantId: string;
  initialOrders?: Order[];
}

export const DisplayOrdersSection: React.FC<DisplayOrdersSectionProps> = ({ 
  merchantId,
  initialOrders = [] 
}) => {
  const [orders, setOrders] = React.useState<Order[]>(initialOrders);
  const [wsConnected, setWsConnected] = React.useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // WebSocket for live order updates
  const { sendMessage } = useWebSocket({
    enabled: !!merchantId,
    onMessage: (message) => {
      if (message.type === 'NEW_ORDER' || message.type === 'ORDER_STATUS_UPDATE') {
        loadOrders();
      }
    },
    onOpen: () => {
      setWsConnected(true);
      if (merchantId) {
        sendMessage({
          type: 'SUBSCRIBE_MERCHANT_ORDERS',
          merchantId: merchantId
        });
      }
    },
    onClose: () => {
      setWsConnected(false);
      console.log('WebSocket disconnected, switching to polling mode');
    },
    onError: () => {
      setWsConnected(false);
      console.log('WebSocket error, using polling mode');
    },
    autoReconnect: true,
  });

  // Load initial orders
  useEffect(() => {
    if (merchantId) {
      loadOrders();
    }
  }, [merchantId]);

  // Manage polling based on WebSocket connection status
  useEffect(() => {
    // Clear any existing polling interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    // Only poll if WebSocket is not connected
    if (merchantId && !wsConnected) {
      console.log('Starting polling for orders (WebSocket not connected)');
      pollingIntervalRef.current = setInterval(() => {
        loadOrders();
      }, 10000);
    } else if (wsConnected) {
      console.log('WebSocket connected, polling disabled');
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [merchantId, wsConnected]);

  const loadOrders = async () => {
    try {
      const response = await api.get(`/api/orders/merchant/${merchantId}/active`);
      const ordersData = response.data || response;
      const ordersArray = Array.isArray(ordersData) ? ordersData : [];
      // Filter to only show preparing and ready orders
      const activeOrders = ordersArray.filter((order: Order) => 
        order.status === 'preparing' || order.status === 'ready'
      );
      setOrders(activeOrders);
    } catch (error: any) {
      // Display page is public - if orders can't load due to auth, just skip
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        console.log('Orders require authentication, skipping for public display');
      } else {
        console.error('Failed to load orders:', error);
      }
      setOrders([]);
    }
  };

  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className={styles.ordersSection}>
      <div className={styles.ordersHeader}>
        <Typography variant="heading-2">Order Status</Typography>
        <Typography variant="body-large" color="secondary">
          {orders.length} active {orders.length === 1 ? 'order' : 'orders'}
        </Typography>
      </div>

      <div className={styles.ordersColumns}>
        {/* Preparing Column */}
        <div className={styles.orderColumn}>
          <div className={styles.columnHeader}>
            <Typography variant="heading-3">Preparing</Typography>
            <Typography variant="body-medium" color="secondary">
              {preparingOrders.length}
            </Typography>
          </div>
          <div className={styles.columnContent}>
            {preparingOrders.length === 0 ? (
              <div className={styles.emptyColumn}>
                <Typography variant="body-medium" color="secondary">
                  No orders preparing
                </Typography>
              </div>
            ) : (
              preparingOrders.map((order) => (
                <DisplayOrderCard key={order.id} orderNumber={order.order_number} />
              ))
            )}
          </div>
        </div>

        {/* Ready Column */}
        <div className={styles.orderColumn}>
          <div className={styles.columnHeader}>
            <Typography variant="heading-3">Ready for Collection</Typography>
            <Typography variant="body-medium" color="secondary">
              {readyOrders.length}
            </Typography>
          </div>
          <div className={styles.columnContent}>
            {readyOrders.length === 0 ? (
              <div className={styles.emptyColumn}>
                <Typography variant="body-medium" color="secondary">
                  No orders ready
                </Typography>
              </div>
            ) : (
              readyOrders.map((order) => (
                <DisplayOrderCard key={order.id} orderNumber={order.order_number} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
