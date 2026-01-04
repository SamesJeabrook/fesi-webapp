"use client";

import React, { useRef, useEffect, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { Button, Typography } from "@/components/atoms";
import styles from "./POSPaymentQR.module.scss";

interface POSPaymentQRProps {
  checkoutUrl: string;
  orderTotal: number;
  currency?: string;
  onPaymentComplete?: () => void;
  onCancel?: () => void;
}

const QR_SIZE = 300;

export const POSPaymentQR: React.FC<POSPaymentQRProps> = ({ 
  checkoutUrl, 
  orderTotal, 
  currency = 'GBP',
  onPaymentComplete,
  onCancel 
}) => {
  const qrWrapperRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes

  // Generate QR code with Fesi logo
  useEffect(() => {
    if (!checkoutUrl) return;

    const qrCode = new QRCodeStyling({
      width: QR_SIZE,
      height: QR_SIZE,
      data: checkoutUrl,
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

    if (qrWrapperRef.current) {
      qrWrapperRef.current.innerHTML = '';
      qrCode.append(qrWrapperRef.current);
    }
    
    qrCodeRef.current = qrCode;

    return () => {
      if (qrWrapperRef.current) {
        qrWrapperRef.current.innerHTML = '';
      }
    };
  }, [checkoutUrl]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100); // Amount is in pence/cents
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="heading-4">Scan to Pay</Typography>
        <Typography variant="body-large" className={styles.amount}>
          {formatCurrency(orderTotal)}
        </Typography>
      </div>

      <div className={styles.qrSection}>
        <div 
          className={styles.qrWrapper} 
          ref={qrWrapperRef} 
          style={{ width: QR_SIZE, height: QR_SIZE }}
        />
        
        <div className={styles.timer}>
          <Typography variant="body-small">
            QR expires in: <strong>{formatTime(timeRemaining)}</strong>
          </Typography>
        </div>
      </div>

      <div className={styles.instructions}>
        <Typography variant="body-medium">
          Customer should scan this QR code with their phone camera to complete payment
        </Typography>
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel Payment
        </Button>
      </div>

      {timeRemaining === 0 && (
        <div className={styles.expired}>
          <Typography variant="body-medium" color="error">
            QR code expired. Please generate a new payment link.
          </Typography>
        </div>
      )}
    </div>
  );
};
