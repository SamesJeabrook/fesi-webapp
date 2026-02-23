'use client';

import { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Typography, Button } from '@/components/atoms';
import { api } from '@/utils/api';
import styles from './TableQrCodes.module.scss';

interface Table {
  id: string;
  table_number: string;
  capacity: number;
}

interface TableQrCodesProps {
  merchantId: string;
  merchantUsername: string;
}

const QR_SIZE = 200;

export function TableQrCodes({ merchantId, merchantUsername }: TableQrCodesProps) {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const qrRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await api.get(`/api/tables/merchant/${merchantId}`);
        setTables(response.tables || []);
      } catch (error) {
        console.error('Error loading tables:', error);
      } finally {
        setLoading(false);
      }
    };

    if (merchantId) {
      fetchTables();
    }
  }, [merchantId]);

  // Generate QR codes with Fesi logo branding
  useEffect(() => {
    if (tables.length === 0) return;

    tables.forEach((table) => {
      const qrWrapper = qrRefsMap.current.get(table.id);
      if (!qrWrapper) return;

      const qrValue = getTableUrl(table);
      const qrCode = new QRCodeStyling({
        width: QR_SIZE,
        height: QR_SIZE,
        data: qrValue,
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

      qrWrapper.innerHTML = '';
      qrCode.append(qrWrapper);
    });
  }, [tables, merchantUsername]);

  const getTableUrl = (table: Table) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/vendors/${merchantUsername}?table=${table.table_number}&table_id=${table.id}`;
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className={styles.loading}>Loading tables...</div>;
  }

  if (tables.length === 0) {
    return (
      <div className={styles.empty}>
        <Typography variant="body-medium">
          No tables configured. Add tables in Table Management first.
        </Typography>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="heading-3">Table QR Codes</Typography>
        <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
          Print these QR codes and place them on your tables. Customers can scan to order directly from their phones.
        </Typography>
        <div style={{ marginTop: '1rem' }}>
          <Button variant="primary" onClick={handlePrint}>
            🖨️ Print All QR Codes
          </Button>
        </div>
      </div>

      <div className={styles.grid}>
        {tables.map((table) => (
          <div key={table.id} className={styles.qrCard}>
            <div className={styles.qrHeader}>
              <Typography variant="heading-4">Table {table.table_number}</Typography>
              <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                Capacity: {table.capacity} guests
              </Typography>
            </div>
            
            <div className={styles.qrCode}>
              <div 
                ref={(el) => {
                  if (el) {
                    qrRefsMap.current.set(table.id, el);
                  }
                }}
                style={{ width: QR_SIZE, height: QR_SIZE }}
              />
            </div>

            <div className={styles.qrFooter}>
              <Typography variant="body-small" style={{ textAlign: 'center' }}>
                Scan to order from Table {table.table_number}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
