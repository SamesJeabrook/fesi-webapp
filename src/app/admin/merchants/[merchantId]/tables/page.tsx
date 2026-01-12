'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Typography, Button } from '@/components/atoms';
import { api } from '@/utils/api';
import styles from './tables.module.scss';

interface Table {
  id: string;
  table_number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  current_session_id?: string;
  session_start?: string;
  session_total?: number;
  customer_name?: string;
}

export default function AdminMerchantTablesPage() {
  const params = useParams();
  const merchantId = params?.merchantId as string;
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [merchant, setMerchant] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [merchantData, tablesData] = await Promise.all([
          api.get(`/api/merchants/${merchantId}`),
          api.get(`/api/tables/merchant/${merchantId}`)
        ]);
        
        setMerchant(merchantData.data);
        setTables(tablesData.tables || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (merchantId) {
      fetchData();
    }
  }, [merchantId]);

  if (loading) {
    return (
      <ProtectedRoute requireRole={['admin']}>
        <div className={styles.loading}>Loading tables...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['admin']}>
      <div className={styles.tablesPage}>
        <div className={styles.header}>
          <div>
            <Link href={`/admin/merchants/${merchantId}`} className={styles.backLink}>
              ← Back to Merchant Dashboard
            </Link>
            <Typography variant="heading-2">
              Table Management
              {merchant && ` - ${merchant.business_name || merchant.name}`}
            </Typography>
            <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
              Manage restaurant tables and active dining sessions
            </Typography>
          </div>
        </div>

        <div className={styles.tablesGrid}>
          {tables.map((table) => (
            <div key={table.id} className={`${styles.tableCard} ${styles[`tableCard--${table.status}`]}`}>
              <div className={styles.tableHeader}>
                <span className={styles.tableNumber}>Table {table.table_number}</span>
                <span className={`${styles.status} ${styles[`status--${table.status}`]}`}>
                  {table.status}
                </span>
              </div>
              
              <div className={styles.tableInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Capacity:</span>
                  <span className={styles.value}>👥 {table.capacity}</span>
                </div>
                
                {table.status === 'occupied' && table.current_session_id && (
                  <>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Session:</span>
                      <span className={styles.value}>{table.session_start ? new Date(table.session_start).toLocaleTimeString() : 'Active'}</span>
                    </div>
                    {table.session_total && (
                      <div className={styles.infoRow}>
                        <span className={styles.label}>Total:</span>
                        <span className={styles.value}>${(table.session_total / 100).toFixed(2)}</span>
                      </div>
                    )}
                    {table.customer_name && (
                      <div className={styles.infoRow}>
                        <span className={styles.label}>Guest:</span>
                        <span className={styles.value}>{table.customer_name}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {table.status === 'occupied' && table.current_session_id && (
                <div className={styles.tableActions}>
                  <Link 
                    href={`/admin/merchants/${merchantId}/table-service`}
                    className={styles.viewSessionBtn}
                  >
                    View Session →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {tables.length === 0 && (
          <div className={styles.emptyState}>
            <Typography variant="body-large">No tables configured</Typography>
            <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Tables can be added in the merchant settings
            </Typography>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
