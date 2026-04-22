"use client";

import React, { useState, useRef, useEffect } from "react";
import QRCodeStyling from "qr-code-styling";
import { Button, Typography } from "@/components/atoms";
import styles from "./POSPendingPayments.module.scss";

interface PendingPayment {
  orderId: string;
  checkoutUrl: string;
  amount: number;
  timestamp: Date;
  timeRemaining: number;
}

interface POSPendingPaymentsProps {
  pendingPayments: PendingPayment[];
  onRemovePayment: (orderId: string) => void;
  onPaymentComplete?: (orderId: string) => void;
}

const QR_SIZE = 200;

export const POSPendingPayments: React.FC<POSPendingPaymentsProps> = ({
  pendingPayments,
  onRemovePayment,
  onPaymentComplete,
}) => {
  const [minimized, setMinimized] = useState(false);
  const [activePaymentIndex, setActivePaymentIndex] = useState(0);
  const qrWrapperRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);

  const activePayment = pendingPayments[activePaymentIndex];

  // Generate QR code for active payment
  useEffect(() => {
    if (!activePayment?.checkoutUrl) return;

    const qrCode = new QRCodeStyling({
      width: QR_SIZE,
      height: QR_SIZE,
      data: activePayment.checkoutUrl,
      image: '/images/Fesi-logo.png',
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
  }, [activePayment?.checkoutUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount / 100);
  };

  if (pendingPayments.length === 0) {
    return null;
  }

  if (minimized) {
    return (
      <div className={styles.minimized}>
        <button 
          className={styles.minimized__button}
          onClick={() => setMinimized(false)}
        >
          <span className={styles.minimized__badge}>
            {pendingPayments.length}
          </span>
          <Typography variant="body-small">
            Pending Payments
          </Typography>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.widget}>
      <div className={styles.widget__header}>
        <div className={styles.widget__title}>
          <Typography variant="body-medium" className={styles.widget__titleText}>
            Payment {activePaymentIndex + 1} of {pendingPayments.length}
          </Typography>
          {pendingPayments.length > 1 && (
            <div className={styles.widget__nav}>
              <button
                onClick={() => setActivePaymentIndex(Math.max(0, activePaymentIndex - 1))}
                disabled={activePaymentIndex === 0}
                className={styles.widget__navButton}
              >
                ‹
              </button>
              <button
                onClick={() => setActivePaymentIndex(Math.min(pendingPayments.length - 1, activePaymentIndex + 1))}
                disabled={activePaymentIndex === pendingPayments.length - 1}
                className={styles.widget__navButton}
              >
                ›
              </button>
            </div>
          )}
        </div>
        <button 
          className={styles.widget__minimize}
          onClick={() => setMinimized(true)}
        >
          _
        </button>
      </div>

      {activePayment && (
        <>
          <div className={styles.widget__amount}>
            <Typography variant="heading-5">
              {formatCurrency(activePayment.amount)}
            </Typography>
          </div>

          <div className={styles.widget__qr}>
            <div 
              ref={qrWrapperRef} 
              style={{ width: QR_SIZE, height: QR_SIZE }}
            />
          </div>

          <div className={styles.widget__timer}>
            <Typography variant="body-small">
              {formatTime(activePayment.timeRemaining)}
            </Typography>
          </div>

          <div className={styles.widget__actions}>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => onRemovePayment(activePayment.orderId)}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
