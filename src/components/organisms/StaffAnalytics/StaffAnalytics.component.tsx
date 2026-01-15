import React, { useState, useEffect } from 'react';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/atoms/Card';
import api from '@/utils/api';
import type { StaffAnalyticsProps, StaffAnalyticsData } from './StaffAnalytics.types';
import styles from './StaffAnalytics.module.scss';

export const StaffAnalytics: React.FC<StaffAnalyticsProps> = ({ merchantId, className }) => {
  const [data, setData] = useState<StaffAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaffAnalytics = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/staff/merchant/${merchantId}/analytics`);
        setData(response);
      } catch (err: any) {
        console.error('Error fetching staff analytics:', err);
        setError(err.message || 'Failed to load staff analytics');
      } finally {
        setLoading(false);
      }
    };

    if (merchantId) {
      fetchStaffAnalytics();
    }
  }, [merchantId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <Typography variant="body-medium">Loading staff analytics...</Typography>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        <Typography variant="body-medium" style={{ color: 'var(--color-error)' }}>
          {error || 'No staff analytics available'}
        </Typography>
      </div>
    );
  }

  const { overview, topPerformers, staffPerformance } = data;

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(num / 100);
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.header}>
        <Typography variant="heading-3">👥 Staff Performance</Typography>
        <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
          Track your team's performance and sales
        </Typography>
      </div>

      {/* Overview Stats */}
      <div className={styles.overview}>
        <Card className={styles.statCard}>
          <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
            Active Staff
          </Typography>
          <Typography variant="heading-2">{overview.active_staff_count || 0}</Typography>
        </Card>

        <Card className={styles.statCard}>
          <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
            Total Orders
          </Typography>
          <Typography variant="heading-2">{overview.total_orders || 0}</Typography>
        </Card>

        <Card className={styles.statCard}>
          <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
            Total Revenue
          </Typography>
          <Typography variant="heading-2">{formatCurrency(overview.total_revenue)}</Typography>
        </Card>

        <Card className={styles.statCard}>
          <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
            Avg Order Value
          </Typography>
          <Typography variant="heading-2">{formatCurrency(overview.average_order_value)}</Typography>
        </Card>
      </div>

      {/* Top Performers */}
      {topPerformers.length > 0 && (
        <div className={styles.section}>
          <Typography variant="heading-4" style={{ marginBottom: 'var(--spacing-md)' }}>
            🏆 Top Performers
          </Typography>
          <div className={styles.topPerformers}>
            {topPerformers.map((staff, index) => (
              <Card key={staff.id} className={styles.performerCard}>
                <div className={styles.rank}>#{index + 1}</div>
                <div className={styles.performerInfo}>
                  <Typography variant="heading-6">{staff.name}</Typography>
                  <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                    {staff.role}
                  </Typography>
                </div>
                <div className={styles.performerStats}>
                  <div className={styles.stat}>
                    <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                      Revenue
                    </Typography>
                    <Typography variant="body-large" style={{ fontWeight: 600 }}>
                      {formatCurrency(staff.total_revenue)}
                    </Typography>
                  </div>
                  <div className={styles.stat}>
                    <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                      Orders
                    </Typography>
                    <Typography variant="body-large" style={{ fontWeight: 600 }}>
                      {staff.total_orders}
                    </Typography>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Staff Performance Table */}
      <div className={styles.section}>
        <Typography variant="heading-4" style={{ marginBottom: 'var(--spacing-md)' }}>
          All Staff Performance
        </Typography>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Avg Order</th>
                <th>Tables Served</th>
                <th>Days Worked</th>
              </tr>
            </thead>
            <tbody>
              {staffPerformance.map((staff) => (
                <tr key={staff.id}>
                  <td>
                    <Typography variant="body-medium">{staff.name}</Typography>
                  </td>
                  <td>
                    <Typography variant="body-small" style={{ textTransform: 'capitalize' }}>
                      {staff.role}
                    </Typography>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${staff.is_active ? styles.badgeActive : styles.badgeInactive}`}>
                      {staff.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <Typography variant="body-medium">{staff.total_orders}</Typography>
                  </td>
                  <td>
                    <Typography variant="body-medium" style={{ fontWeight: 600 }}>
                      {formatCurrency(staff.total_revenue)}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="body-small">
                      {parseInt(staff.total_orders) > 0 ? formatCurrency(staff.average_order_value) : '-'}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="body-small">{staff.tables_served}</Typography>
                  </td>
                  <td>
                    <Typography variant="body-small">{staff.days_worked}</Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
