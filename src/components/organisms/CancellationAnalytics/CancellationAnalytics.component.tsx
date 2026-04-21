'use client';

import React, { useState, useEffect } from 'react';
import { Typography } from '@/components/atoms';
import api from '@/utils/api';
import styles from './CancellationAnalytics.module.scss';

interface CancellationAnalyticsProps {
  merchantId: string;
}

interface CancellationStats {
  total_cancelled_orders: number;
  total_cancelled_revenue: number;
  avg_hours_to_cancellation: number;
  customer_cancellations: number;
  merchant_cancellations: number;
  admin_cancellations: number;
  total_orders: number;
  cancellation_rate_percentage: number;
  cancellation_reasons: { [key: string]: number };
}

interface CancelledOrder {
  order_number: string;
  total_amount: number;
  cancelled_at: string;
  cancellation_type: string;
  cancellation_reason: string;
  hours_to_cancellation: number;
  refund_status: string;
}

export const CancellationAnalytics: React.FC<CancellationAnalyticsProps> = ({ merchantId }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CancellationStats | null>(null);
  const [recentCancellations, setRecentCancellations] = useState<CancelledOrder[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [merchantId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/merchants/${merchantId}/cancellation-analytics`);
      
      if (response.success) {
        setStats(response.data.statistics);
        setRecentCancellations(response.data.recentCancellations);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.analytics}>
        <Typography variant="body-medium">Loading cancellation analytics...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.analytics}>
        <div className={styles.analytics__error}>
          <Typography variant="body-medium">❌ {error}</Typography>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={styles.analytics}>
        <Typography variant="body-medium">No cancellation data available yet.</Typography>
      </div>
    );
  }

  return (
    <div className={styles.analytics}>
      <div className={styles.analytics__header}>
        <Typography variant="heading-4">Cancellation Analytics</Typography>
        <Typography variant="body-medium" className={styles.analytics__description}>
          Insights into order cancellations and patterns
        </Typography>
      </div>

      {/* Summary Stats */}
      <div className={styles.analytics__stats}>
        <div className={styles.analytics__statCard}>
          <Typography variant="heading-2" className={styles.analytics__statValue}>
            {stats.total_cancelled_orders || 0}
          </Typography>
          <Typography variant="body-small" className={styles.analytics__statLabel}>
            Total Cancellations
          </Typography>
        </div>

        <div className={styles.analytics__statCard}>
          <Typography variant="heading-2" className={styles.analytics__statValue}>
            {stats.cancellation_rate_percentage?.toFixed(1) || 0}%
          </Typography>
          <Typography variant="body-small" className={styles.analytics__statLabel}>
            Cancellation Rate
          </Typography>
          <Typography variant="body-small" className={styles.analytics__statHelp}>
            {stats.total_cancelled_orders || 0} of {stats.total_orders || 0} orders
          </Typography>
        </div>

        <div className={styles.analytics__statCard}>
          <Typography variant="heading-2" className={styles.analytics__statValue}>
            £{((stats.total_cancelled_revenue || 0) / 100).toFixed(2)}
          </Typography>
          <Typography variant="body-small" className={styles.analytics__statLabel}>
            Lost Revenue
          </Typography>
        </div>

        <div className={styles.analytics__statCard}>
          <Typography variant="heading-2" className={styles.analytics__statValue}>
            {stats.avg_hours_to_cancellation?.toFixed(1) || 0}h
          </Typography>
          <Typography variant="body-small" className={styles.analytics__statLabel}>
            Avg. Time to Cancel
          </Typography>
          <Typography variant="body-small" className={styles.analytics__statHelp}>
            Hours from order to cancellation
          </Typography>
        </div>
      </div>

      {/* Cancellation by Type */}
      <div className={styles.analytics__section}>
        <Typography variant="body-large" className={styles.analytics__sectionTitle}>
          Cancellations by Type
        </Typography>
        <div className={styles.analytics__typeBreakdown}>
          <div className={styles.analytics__typeItem}>
            <div className={styles.analytics__typeBar} style={{ width: `${(stats.customer_cancellations / stats.total_cancelled_orders * 100) || 0}%` }}></div>
            <Typography variant="body-medium">
              👤 Customer: <strong>{stats.customer_cancellations || 0}</strong>
            </Typography>
          </div>
          <div className={styles.analytics__typeItem}>
            <div className={styles.analytics__typeBar} style={{ width: `${(stats.merchant_cancellations / stats.total_cancelled_orders * 100) || 0}%`, backgroundColor: 'rgb(245, 158, 11)' }}></div>
            <Typography variant="body-medium">
              🏪 Merchant: <strong>{stats.merchant_cancellations || 0}</strong>
            </Typography>
          </div>
          <div className={styles.analytics__typeItem}>
            <div className={styles.analytics__typeBar} style={{ width: `${(stats.admin_cancellations / stats.total_cancelled_orders * 100) || 0}%`, backgroundColor: 'rgb(239, 68, 68)' }}></div>
            <Typography variant="body-medium">
              🔧 Admin: <strong>{stats.admin_cancellations || 0}</strong>
            </Typography>
          </div>
        </div>
      </div>

      {/* Recent Cancellations */}
      {recentCancellations.length > 0 && (
        <div className={styles.analytics__section}>
          <Typography variant="body-large" className={styles.analytics__sectionTitle}>
            Recent Cancellations ({recentCancellations.length})
          </Typography>
          <div className={styles.analytics__table}>
            <div className={styles.analytics__tableHeader}>
              <div className={styles.analytics__tableCell}>Order</div>
              <div className={styles.analytics__tableCell}>Amount</div>
              <div className={styles.analytics__tableCell}>Type</div>
              <div className={styles.analytics__tableCell}>Reason</div>
              <div className={styles.analytics__tableCell}>Refund</div>
            </div>
            {recentCancellations.slice(0, 10).map((order) => (
              <div key={order.order_number} className={styles.analytics__tableRow}>
                <div className={styles.analytics__tableCell}>
                  <Typography variant="body-small">{order.order_number}</Typography>
                </div>
                <div className={styles.analytics__tableCell}>
                  <Typography variant="body-small">£{(order.total_amount / 100).toFixed(2)}</Typography>
                </div>
                <div className={styles.analytics__tableCell}>
                  <span className={`${styles.analytics__badge} ${styles[`analytics__badge--${order.cancellation_type}`]}`}>
                    {order.cancellation_type}
                  </span>
                </div>
                <div className={styles.analytics__tableCell}>
                  <Typography variant="body-small" className={styles.analytics__reason}>
                    {order.cancellation_reason || 'No reason provided'}
                  </Typography>
                </div>
                <div className={styles.analytics__tableCell}>
                  <span className={`${styles.analytics__badge} ${styles[`analytics__badge--${order.refund_status}`]}`}>
                    {order.refund_status || 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
