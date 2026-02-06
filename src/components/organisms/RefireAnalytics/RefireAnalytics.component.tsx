'use client';

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Typography } from '@/components/atoms';
import api from '@/utils/api';
import type {
  RefireAnalyticsProps,
  RefireOverview,
  RefiredItem,
  RefireHourlyData,
  RefireEventData,
} from './RefireAnalytics.types';
import styles from './RefireAnalytics.module.scss';

export const RefireAnalytics: React.FC<RefireAnalyticsProps> = ({
  merchantId,
  startDate,
  endDate,
  className,
}) => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<RefireOverview | null>(null);
  const [topItems, setTopItems] = useState<RefiredItem[]>([]);
  const [hourlyData, setHourlyData] = useState<RefireHourlyData[]>([]);
  const [eventData, setEventData] = useState<RefireEventData[]>([]);

  useEffect(() => {
    const fetchRefireAnalytics = async () => {
      try {
        setLoading(true);
        
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        const queryString = params.toString();
        const endpoint = `/api/analytics/refire/${merchantId}${queryString ? `?${queryString}` : ''}`;
        
        const data = await api.get(endpoint);
        
        setOverview(data.overview);
        setTopItems(data.topRefiredItems || []);
        setHourlyData(data.hourlyBreakdown || []);
        setEventData(data.eventBreakdown || []);
      } catch (error) {
        console.error('Error fetching refire analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (merchantId) {
      fetchRefireAnalytics();
    }
  }, [merchantId, startDate, endDate]);

  if (loading) {
    return (
      <div className={classNames(styles.refireAnalytics, className)}>
        <p>Loading refire analytics...</p>
      </div>
    );
  }

  if (!overview || overview.totalRefiredOrders === 0) {
    return (
      <div className={classNames(styles.refireAnalytics, className)}>
        <div className={styles.refireAnalytics__noData}>
          <p>🎉 No refired orders yet!</p>
          <small>This is a good sign - it means your kitchen is running smoothly.</small>
        </div>
      </div>
    );
  }

  const maxHourlyCount = Math.max(...hourlyData.map(h => h.refireCount));

  return (
    <div className={classNames(styles.refireAnalytics, className)}>
      <div className={styles.refireAnalytics__header}>
        <Typography variant="heading-2" as="h2" className={styles.refireAnalytics__title}>
          <span className={styles.refireAnalytics__fireIcon}>🔥</span>
          Refire Analytics
        </Typography>
        <Typography variant="body" className={styles.refireAnalytics__subtitle}>
          Track which items need to be remade and identify kitchen improvement opportunities
        </Typography>
      </div>

      {/* Overview Stats */}
      <div className={styles.refireAnalytics__overview}>
        <div className={classNames(styles.refireAnalytics__statCard, styles['refireAnalytics__statCard--alert'])}>
          <h3>Total Refired Orders</h3>
          <p>{overview.totalRefiredOrders}</p>
        </div>
        <div className={styles.refireAnalytics__statCard}>
          <h3>Total Refired Items</h3>
          <p>{overview.totalRefiredItems}</p>
        </div>
        <div className={styles.refireAnalytics__statCard}>
          <h3>Refire Rate</h3>
          <p>{overview.refireRatePercentage}%</p>
        </div>
      </div>

      {/* Top Refired Items */}
      {topItems.length > 0 && (
        <div className={styles.refireAnalytics__section}>
          <Typography variant="heading-3" as="h3" className={styles.refireAnalytics__sectionTitle}>
            Most Frequently Refired Items
          </Typography>
          <div className={styles.refireAnalytics__table}>
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Refire Count</th>
                  <th>Orders Affected</th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.refireAnalytics__itemName}>
                        <span className={styles.refireAnalytics__refireIcon}>🔥</span>
                        {item.name}
                      </div>
                    </td>
                    <td>
                      <span className={styles.refireAnalytics__count}>{item.refireCount}</span>
                    </td>
                    <td>{item.ordersAffected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hourly Breakdown */}
      {hourlyData.length > 0 && (
        <div className={styles.refireAnalytics__section}>
          <Typography variant="heading-3" as="h3" className={styles.refireAnalytics__sectionTitle}>
            Refire Times (by Hour)
          </Typography>
          <div className={styles.refireAnalytics__hourlyGrid}>
            {hourlyData.map((hour) => (
              <div
                key={hour.hour}
                className={classNames(styles.refireAnalytics__hourBlock, {
                  [styles['refireAnalytics__hourBlock--high']]: hour.refireCount >= maxHourlyCount * 0.7,
                })}
              >
                <div className={styles.refireAnalytics__hourBlock__time}>{hour.timeRange}</div>
                <div className={styles.refireAnalytics__hourBlock__count}>{hour.refireCount}</div>
              </div>
            ))}
          </div>
          <Typography variant="caption" className={styles.refireAnalytics__caption}>
            Highlighted hours indicate peak refire times
          </Typography>
        </div>
      )}

      {/* Event Breakdown */}
      {eventData.length > 0 && (
        <div className={styles.refireAnalytics__section}>
          <Typography variant="heading-3" as="h3" className={styles.refireAnalytics__sectionTitle}>
            Refire Breakdown by Event
          </Typography>
          <div className={styles.refireAnalytics__table}>
            <table>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Refired Orders</th>
                  <th>Refired Items</th>
                  <th>Refire Rate</th>
                </tr>
              </thead>
              <tbody>
                {eventData.map((event) => (
                  <tr key={event.id}>
                    <td>{event.name}</td>
                    <td>{new Date(event.startTime).toLocaleDateString()}</td>
                    <td>{event.refiredOrders}</td>
                    <td>{event.refiredItems}</td>
                    <td>{event.refireRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefireAnalytics;
