import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Typography } from '@/components/atoms';
import type { OrderQRCodeProps } from './OrderQRCode.types';
import styles from './OrderQRCode.module.scss';

export const OrderQRCode: React.FC<OrderQRCodeProps> = ({
  orderId,
  orderNumber,
  orderItems,
  merchantId,
  size = 200,
  showOrderInfo = true,
  className,
  'data-testid': dataTestId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const qrCodeClasses = classNames(styles.orderQRCode, className);

  // Generate QR code data - this contains order verification info
  const generateQRData = () => {
    const qrData = {
      orderId,
      orderNumber,
      orderItems: orderItems.map(item => ({
        name: item.name,
        quantity: item.quantity
      })),
      merchantId,
      timestamp: Date.now(),
      // Add a hash for basic verification (in production, use proper signing)
      hash: btoa(`${orderId}-${orderNumber}-${orderItems.length}`),
    };
    return JSON.stringify(qrData);
  };

  // Generate QR code using proper QR library
  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    try {
      // Import QR code library dynamically
      const QRCode = (await import('qrcode')).default;
      
      const canvas = canvasRef.current;
      const qrData = generateQRData();

      // Generate actual scannable QR code
      await QRCode.toCanvas(canvas, qrData, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

    } catch (error) {
      console.error('Error generating QR code:', error);
      
      // Fallback to placeholder if QR library fails
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = size;
      canvas.height = size;
      
      ctx.fillStyle = '#F3F4F6';
      ctx.fillRect(0, 0, size, size);
      
      ctx.fillStyle = '#6B7280';
      ctx.font = `${size * 0.08}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('QR Code', size / 2, size / 2 - 10);
      ctx.fillText('Error', size / 2, size / 2 + 10);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [orderId, orderNumber, size]);

  const qrData = generateQRData();

  return (
    <div className={qrCodeClasses} data-testid={dataTestId}>
      <div className={styles.qrContainer}>
        <canvas
          ref={canvasRef}
          className={styles.qrCanvas}
          style={{ width: size, height: size }}
        />
        
        {/* Fallback: Show QR data as text for development */}
        <div className={styles.qrDataFallback}>
          <Typography variant="caption" className={styles.fallbackText}>
            QR Data: {qrData.substring(0, 50)}...
          </Typography>
        </div>
      </div>

      {showOrderInfo && (
        <div className={styles.orderInfo}>
          <Typography variant="body-medium" className={styles.orderNumber}>
            Order #{orderNumber}
          </Typography>
          <div className={styles.itemsList}>
            {orderItems.map((item, index) => (
              <Typography key={index} variant="body-small" className={styles.orderItem}>
                {item.quantity}x {item.name}
              </Typography>
            ))}
          </div>
          <Typography variant="caption" className={styles.instructions}>
            Show this QR code to the merchant for pickup
          </Typography>
        </div>
      )}
    </div>
  );
};