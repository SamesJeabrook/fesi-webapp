
"use client";

import React, { useState, useRef, useEffect } from "react";
import QRCodeStyling from "qr-code-styling";
import styles from "./MerchantQrModal.module.scss";
import { Button } from "@/components/atoms";
// No static import for qr-logo

interface Merchant {
  id: string;
  business_name: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  status: string;
  created_at: string;
}

interface MerchantQrModalProps {
  merchant: Merchant;
  open: boolean;
  onClose: () => void;
}


const QR_SIZE = 256;

export const MerchantQrModal: React.FC<MerchantQrModalProps> = ({ merchant, open, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const qrWrapperRef = useRef<HTMLDivElement>(null);

  let qrCode: QRCodeStyling;


  // Generate QR code with logo using qr-code-with-logo
  useEffect(() => {
    if (!merchant) return;
    let objectUrl: string | null = null;
    const qrValue = `${process.env.NEXT_PUBLIC_WEBAPP_URL || 'http://localhost:3000'}/menu/${merchant.id}`;
    qrCode = new QRCodeStyling({
      width: QR_SIZE,
      height: QR_SIZE,
      data: qrValue,
      image: '/images/fesi-logo.png',
      imageOptions: {
        crossOrigin: 'anonymous',
        imageSize: 0.5,
      },
      dotsOptions: {
        color: '#111827',
        type: 'dots',
      },
      backgroundOptions: {
        color: '#fff',
      },
      qrOptions: {
        errorCorrectionLevel: 'H',
      },
    });

    if (qrWrapperRef.current) {
      qrWrapperRef.current.innerHTML = '';
      qrCode.append(qrWrapperRef.current);
    }
  }, [merchant]);

  const handleDownloadQr = () => {
  if (!qrCode) return;
    qrCode.download({ name: 'fesi-qr', extension: 'png' });
  };

  if (!merchant) return null;

  return (
    <div className={styles.overlay} style={{ display: open ? undefined : 'none' }}>
      <div className={styles.modal}>
        <div className={styles.title}>{merchant.business_name || merchant.name}</div>
        <div className={styles.qrWrapper} ref={qrWrapperRef} style={{width: QR_SIZE, height: QR_SIZE }}>
          {!qrDataUrl && (
            <div className={styles.qrPlaceholder} style={{ width: QR_SIZE, height: QR_SIZE}}>
              Generating QR...
            </div>
          )}
        </div>
        <div className={styles.actions}>
          <Button variant="primary" onClick={handleDownloadQr}>Download QR</Button>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
        <div className={styles.instructions}>
          Scan to order directly from this merchant's menu
        </div>
      </div>
    </div>
  );
};
