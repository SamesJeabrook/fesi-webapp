import React, { useRef, useEffect } from 'react';
import { Typography } from '@/components/atoms';
import QRCodeStyling from 'qr-code-styling';
import styles from './DisplayMenuSection.module.scss';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  base_price: number;
  category_name: string;
  image_url?: string;
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

interface DisplayMenuSectionProps {
  merchantData: MerchantData;
  merchantId: string;
}

export const DisplayMenuSection: React.FC<DisplayMenuSectionProps> = ({ 
  merchantData, 
  merchantId 
}) => {
  const qrWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (merchantId && qrWrapperRef.current) {
      generateQRCode();
    }
  }, [merchantId]);

  const generateQRCode = () => {
    if (!merchantId || typeof window === 'undefined' || !qrWrapperRef.current) return;

    const orderUrl = `${window.location.origin}/merchant/${merchantId}/order`;
    
    const qrCode = new QRCodeStyling({
      width: 120,
      height: 120,
      data: orderUrl,
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

    // Clear any existing QR code first
    qrWrapperRef.current.innerHTML = '';
    qrCode.append(qrWrapperRef.current);
  };

  const formatPrice = (price: number) => {
    const currency = merchantData.merchant.currency || 'GBP';
    const symbol = currency === 'GBP' ? '£' : '$';
    return `${symbol}${(price / 100).toFixed(2)}`;
  };

  return (
    <div className={styles.menuSection}>
      <div className={styles.header}>
        <Typography variant="heading-2" className={styles.merchantName}>
          {merchantData.merchant.name}
        </Typography>
        {merchantData.merchant.description && (
          <Typography variant="body-large" className={styles.description}>
            {merchantData.merchant.description}
          </Typography>
        )}
      </div>

      <div className={styles.menuContent}>
        {merchantData.menu.map((category) => (
          <div key={category.name} className={styles.category}>
            <Typography variant="heading-4" className={styles.categoryName}>
              {category.name}
            </Typography>
            <div className={styles.items}>
              {category.items.map((item) => (
                <div key={item.id} className={styles.menuItem}>
                  <div className={styles.itemDetails}>
                    <Typography variant="body-large">
                      {item.name}
                    </Typography>
                    {item.description && (
                      <Typography variant="body-small">
                        {item.description}
                      </Typography>
                    )}
                  </div>
                  <Typography variant="body-large" className={styles.price}>
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
  );
};
