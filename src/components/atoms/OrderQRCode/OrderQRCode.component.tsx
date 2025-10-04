import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Typography } from '@/components/atoms';
import type { OrderQRCodeProps } from './OrderQRCode.types';
import styles from './OrderQRCode.module.scss';

export const OrderQRCode: React.FC<OrderQRCodeProps> = ({
  orderId,
  orderNumber,
  customerId,
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
      customerId,
      merchantId,
      timestamp: Date.now(),
      // Add a hash for basic verification (in production, use proper signing)
      hash: btoa(`${orderId}-${orderNumber}-${customerId}`),
    };
    return JSON.stringify(qrData);
  };

  // Simple QR code generation using canvas
  // In production, you'd want to use a proper QR code library like 'qrcode'
  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    try {
      // For now, we'll create a simple visual placeholder
      // In production, install and use: npm install qrcode @types/qrcode
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = size;
      canvas.height = size;

      // Create a placeholder QR pattern
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);

      ctx.fillStyle = '#000000';
      const cellSize = size / 21; // 21x21 grid typical for QR codes

      // Create a simple pattern that looks like a QR code
      for (let row = 0; row < 21; row++) {
        for (let col = 0; col < 21; col++) {
          // Create finder patterns (corners)
          const isFinderPattern = 
            (row < 7 && col < 7) || 
            (row < 7 && col > 13) || 
            (row > 13 && col < 7);

          if (isFinderPattern) {
            const inBorder = (row < 6 && col < 6) || 
                           (row < 6 && col > 14) || 
                           (row > 14 && col < 6);
            const inCenter = (row > 1 && row < 5 && col > 1 && col < 5) ||
                           (row > 1 && row < 5 && col > 15 && col < 19) ||
                           (row > 15 && row < 19 && col > 1 && col < 5);

            if (inBorder || inCenter) {
              ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
          } else {
            // Add some pseudo-random pattern based on order data
            const hash = orderId.charCodeAt(0) + orderNumber.charCodeAt(0);
            if ((row + col + hash) % 3 === 0) {
              ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
          }
        }
      }

      // Add order info as text overlay for demo purposes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(size * 0.2, size * 0.4, size * 0.6, size * 0.2);
      
      ctx.fillStyle = '#000000';
      ctx.font = `${size * 0.06}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(`#${orderNumber}`, size / 2, size / 2);

    } catch (error) {
      console.error('Error generating QR code:', error);
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
          <Typography variant="body-small" className={styles.customerName}>
            Customer ID: {customerId}
          </Typography>
          <Typography variant="caption" className={styles.instructions}>
            Show this QR code to the merchant for pickup
          </Typography>
        </div>
      )}
    </div>
  );
};