import React from 'react';
import Link from 'next/link';
import { Typography } from '@/components/atoms/Typography';
import { StatCard } from '@/components/atoms/StatCard';
import { TopItemsTable } from '@/components/molecules/TopItemsTable';
import { EventAnalyticsPageTemplateProps } from './EventAnalyticsPageTemplate.types';
import styles from './EventAnalyticsPageTemplate.module.scss';

export const EventAnalyticsPageTemplate: React.FC<EventAnalyticsPageTemplateProps> = ({
  eventName,
  startDate,
  endDate,
  isOpen,
  stats,
  topItems,
  hourlyBreakdown,
  loading = false,
  backLink,
  className,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return `£${(amount / 100).toFixed(2)}`;
  };

  const dateRange = endDate 
    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
    : formatDate(startDate);

  const pageClasses = [
    styles.eventAnalyticsPageTemplate,
    className || ''
  ].filter(Boolean).join(' ');

  // Calculate max value for chart scaling
  const maxOrders = Math.max(...hourlyBreakdown.map(h => h.orders), 1);

  // Format hour label (e.g., "9am", "2pm")
  const formatHour = (hour: number) => {
    if (hour === 0) return '12am';
    if (hour === 12) return '12pm';
    if (hour < 12) return `${hour}am`;
    return `${hour - 12}pm`;
  };

  return (
    <div className={pageClasses}>
      {/* Header */}
      <div className={styles.eventAnalyticsPageTemplate__header}>
        {backLink && (
          <Link href={backLink} className={styles.eventAnalyticsPageTemplate__backLink}>
            ← Back to Analytics
          </Link>
        )}
        
        <div className={styles.eventAnalyticsPageTemplate__titleRow}>
          <Typography variant="heading-1" as="h1" className={styles.eventAnalyticsPageTemplate__title}>
            📊 {eventName}
          </Typography>
          <span className={`${styles.eventAnalyticsPageTemplate__badge} ${
            isOpen 
              ? styles['eventAnalyticsPageTemplate__badge--open'] 
              : styles['eventAnalyticsPageTemplate__badge--closed']
          }`}>
            {isOpen ? '🟢 Open' : '🔴 Closed'}
          </span>
        </div>
        
        <Typography variant="body-large" className={styles.eventAnalyticsPageTemplate__dateRange}>
          📅 {dateRange}
        </Typography>
      </div>

      {/* Overview Stats */}
      <div className={styles.eventAnalyticsPageTemplate__section}>
        <Typography variant="heading-2" as="h2" className={styles.eventAnalyticsPageTemplate__sectionTitle}>
          Event Performance
        </Typography>
        <div className={styles.eventAnalyticsPageTemplate__statsGrid}>
          <StatCard
            label="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon="💰"
            variant="success"
          />
          <StatCard
            label="Total Orders"
            value={stats.totalOrders.toString()}
            icon="📦"
            variant="primary"
          />
          <StatCard
            label="Average Order Value"
            value={formatCurrency(stats.averageOrderValue)}
            icon="📊"
            variant="primary"
          />
        </div>
      </div>

      {/* Top Selling Items */}
      {topItems.length > 0 && (
        <div className={styles.eventAnalyticsPageTemplate__section}>
          <Typography variant="heading-2" as="h2" className={styles.eventAnalyticsPageTemplate__sectionTitle}>
            🔥 Best Selling Items
          </Typography>
          <TopItemsTable items={topItems} maxItems={20} showRevenue={true} />
        </div>
      )}

      {/* Hourly Breakdown Chart */}
      {hourlyBreakdown.length > 0 && (
        <div className={styles.eventAnalyticsPageTemplate__section}>
          <Typography variant="heading-2" as="h2" className={styles.eventAnalyticsPageTemplate__sectionTitle}>
            📈 Orders by Hour
          </Typography>
          <div className={styles.eventAnalyticsPageTemplate__chartContainer}>
            <Typography variant="body-small">
              Peak ordering times throughout the event
            </Typography>
            <div className={styles.eventAnalyticsPageTemplate__hourlyChart}>
              {hourlyBreakdown.map((hourData) => {
                const heightPercentage = Math.max((hourData.orders / maxOrders) * 100, hourData.orders > 0 ? 5 : 0);
                
                return (
                  <div key={hourData.hour} className={styles.eventAnalyticsPageTemplate__hourBar}>
                    <div className={styles.eventAnalyticsPageTemplate__barContainer}>
                      <div 
                        className={styles.eventAnalyticsPageTemplate__bar}
                        style={{ height: `${heightPercentage}%` }}
                      >
                        <div className={styles.eventAnalyticsPageTemplate__tooltip}>
                          <div>{formatHour(hourData.hour)}</div>
                          <div><strong>{hourData.orders}</strong> orders</div>
                          <div>{formatCurrency(hourData.revenue)}</div>
                        </div>
                      </div>
                    </div>
                    <span className={styles.eventAnalyticsPageTemplate__barLabel}>
                      {formatHour(hourData.hour)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && stats.totalOrders === 0 && (
        <div className={styles.eventAnalyticsPageTemplate__emptyState}>
          <Typography variant="heading-3" as="h3">No Orders Yet</Typography>
          <Typography variant="body-large">
            This event hasn't received any completed orders yet.
          </Typography>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={styles.eventAnalyticsPageTemplate__loading}>
          <Typography variant="body-large">Loading event analytics...</Typography>
        </div>
      )}
    </div>
  );
};
