'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Typography } from '@/components/atoms';
import { useWebSocket } from '@/hooks/useWebSocket';
import api from '@/utils/api';
import QRCodeStyling from 'qr-code-styling';
import styles from './display.module.scss';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  base_price: number;
  category_name: string;
  image_url?: string;
}

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

interface MerchantData {
  merchant: {
    id: string;
    name: string;
    description?: string;
    currency: string;
  };
  menu: Array<{
    name: string;
    display_order: number;
    items: MenuItem[];
  }>;
}

export default function CustomerDisplayPage() {
  const params = useParams();
  const merchantId = params?.merchantId as string;
  const [merchantData, setMerchantData] = useState<MerchantData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const qrWrapperRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // WebSocket for live order updates (optional - falls back to manual refresh)
  const { sendMessage } = useWebSocket({
    enabled: !!merchantId,
    onMessage: (message) => {
      if (message.type === 'NEW_ORDER' || message.type === 'ORDER_STATUS_UPDATE') {
        loadOrders();
      }
    },
    onOpen: () => {
      if (merchantId) {
        sendMessage({
          type: 'SUBSCRIBE_MERCHANT_ORDERS',
          merchantId: merchantId
        });
      }
    },
    onError: (error) => {
      console.log('WebSocket connection unavailable, using polling mode');
    },
    autoReconnect: false, // Don't auto-reconnect on display page to avoid errors
  });

  useEffect(() => {
    if (merchantId) {
      loadMerchantData();
      loadOrders();
      
      // Poll for order updates every 10 seconds as fallback
      const interval = setInterval(() => {
        loadOrders();
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [merchantId]);

  // Generate QR code after ref is ready
  useEffect(() => {
    if (merchantId && qrWrapperRef.current) {
      generateQRCode();
    }
  }, [merchantId, qrWrapperRef.current]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch (error) {
      console.error('Error entering fullscreen:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  };

  const handleScreenClick = () => {
    if (isFullscreen) {
      exitFullscreen();
    }
  };

  const loadMerchantData = async () => {
    try {
      const response = await api.get(`/api/menu/merchant/${merchantId}`);
      if (response.success && response.data) {
        setMerchantData(response.data);
      }
    } catch (error) {
      console.error('Failed to load merchant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await api.get(`/api/orders/merchant/${merchantId}/active`);
      // Handle API response structure
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
      // Don't fail the whole page if orders can't load
      setOrders([]);
    }
  };

  const generateQRCode = () => {
    if (!merchantId || typeof window === 'undefined' || !qrWrapperRef.current) return;

    const orderUrl = `${window.location.origin}/merchant/${merchantId}/order`;
    
    const qrCode = new QRCodeStyling({
      width: 250,
      height: 250,
      data: orderUrl,
      image: '/images/fesi-logo.png',
      imageOptions: {
        crossOrigin: 'anonymous',
        imageSize: 0.4,
        margin: 4,
      },
      dotsOptions: {
        color: '#111827',
        type: 'rounded',
      },
      backgroundOptions: {
        color: '#fff',
      },
      cornersSquareOptions: {
        color: '#111827',
        type: 'extra-rounded',
      },
      cornersDotOptions: {
        color: '#111827',
        type: 'dot',
      },
      qrOptions: {
        errorCorrectionLevel: 'H',
      },
    });

    // Clear any existing QR code first
    qrWrapperRef.current.innerHTML = '';
    qrCode.append(qrWrapperRef.current);
  };

  const formatPrice = (price: number) => {
    const currency = merchantData?.merchant.currency || 'GBP';
    const symbol = currency === 'GBP' ? '£' : '$';
    return `${symbol}${(price / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'preparing':
        return 'var(--color-primary-600)';
      case 'ready':
        return 'var(--color-success-600)';
      default:
        return 'var(--color-gray-600)';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready for Collection';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Typography variant="heading-3">Loading...</Typography>
      </div>
    );
  }

  if (!merchantData) {
    return (
      <div className={styles.loading}>
        <Typography variant="heading-3">Merchant not found</Typography>
      </div>
    );
  }

  return (
    <div className={styles.displayPage} onClick={handleScreenClick}>
      {/* Fullscreen Button - only show when not in fullscreen */}
      {!isFullscreen && (
        <button 
          className={styles.fullscreenButton}
          onClick={(e) => {
            e.stopPropagation();
            enterFullscreen();
          }}
          aria-label="Enter fullscreen mode"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
          Fullscreen
        </button>
      )}

      {/* Left Side - Menu */}
      <div className={styles.menuSection}>
        <div className={styles.header}>
          <Typography variant="heading-2" className={styles.merchantName}>
            {merchantData?.merchant?.name || 'Loading...'}
          </Typography>
          {merchantData?.merchant?.description && (
            <Typography variant="body-large" className={styles.description}>
              {merchantData.merchant.description}
            </Typography>
          )}
        </div>

        <div className={styles.menuContent}>
          {merchantData?.menu?.map((category) => (
            <div key={category.name} className={styles.category}>
              <Typography variant="heading-4" className={styles.categoryName}>
                {category.name}
              </Typography>
              <div className={styles.items}>
                {category.items.map((item) => (
                  <div key={item.id} className={styles.menuItem}>
                    <div className={styles.itemDetails}>
                      <Typography variant="body-large" weight="bold">
                        {item.name}
                      </Typography>
                      {item.description && (
                        <Typography variant="body-small" color="secondary">
                          {item.description}
                        </Typography>
                      )}
                    </div>
                    <Typography variant="body-large" weight="bold" className={styles.price}>
                      {formatPrice(item.base_price)}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* QR Code */}
        <div className={styles.qrSection}>
          <Typography variant="heading-4" className={styles.qrTitle}>
            Scan to Order
          </Typography>
          <div ref={qrWrapperRef} className={styles.qrCode} />
          <Typography variant="body-medium" className={styles.qrSubtitle}>
            Scan the code to order directly through Fesi.
          </Typography>
        </div>
      </div>

      {/* Right Side - Live Orders */}
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
                {orders.filter(o => o.status === 'preparing').length}
              </Typography>
            </div>
            <div className={styles.columnContent}>
              {orders.filter(o => o.status === 'preparing').length === 0 ? (
                <div className={styles.emptyColumn}>
                  <Typography variant="body-medium" color="secondary">
                    No orders preparing
                  </Typography>
                </div>
              ) : (
                orders.filter(o => o.status === 'preparing').map((order) => (
                  <div key={order.id} className={styles.orderCard}>
                    <Typography variant="heading-3" className={styles.orderNumber}>
                      #{order.order_number}
                    </Typography>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ready Column */}
          <div className={styles.orderColumn}>
            <div className={styles.columnHeader}>
              <Typography variant="heading-3">Ready for Collection</Typography>
              <Typography variant="body-medium" color="secondary">
                {orders.filter(o => o.status === 'ready').length}
              </Typography>
            </div>
            <div className={styles.columnContent}>
              {orders.filter(o => o.status === 'ready').length === 0 ? (
                <div className={styles.emptyColumn}>
                  <Typography variant="body-medium" color="secondary">
                    No orders ready
                  </Typography>
                </div>
              ) : (
                orders.filter(o => o.status === 'ready').map((order) => (
                  <div key={order.id} className={styles.orderCard}>
                    <Typography variant="heading-3" className={styles.orderNumber}>
                      #{order.order_number}
                    </Typography>
                    <div className={styles.readyBadge}>
                      <Typography variant="body-large" weight="bold">
                        Ready!
                      </Typography>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
