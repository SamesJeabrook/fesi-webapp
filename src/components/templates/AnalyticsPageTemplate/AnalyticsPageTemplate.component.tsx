import React from 'react';
import Link from 'next/link';
import { Typography } from '@/components/atoms/Typography';
import { StatCard } from '@/components/atoms/StatCard';
import { EventReportCard } from '@/components/molecules/EventReportCard';
import { TopItemsTable } from '@/components/molecules/TopItemsTable';
import { SubscriptionBanner } from '@/components/molecules/SubscriptionBanner';
import { EventReportsTable } from '@/components/organisms/EventReportsTable';
import { StaffAnalytics } from '@/components/organisms/StaffAnalytics';
import { RefireAnalytics } from '@/components/organisms/RefireAnalytics';
import { AnalyticsPageTemplateProps } from './AnalyticsPageTemplate.types';
import styles from './AnalyticsPageTemplate.module.scss';

export const AnalyticsPageTemplate: React.FC<AnalyticsPageTemplateProps> = ({
  merchantId,
  merchantName,
  operatingMode = 'event_based',
  overviewStats,
  recentEvents,
  monthlyBreakdowns,
  subscriptionTier = 'starter',
  dataRetentionMonths = 1,
  isApproachingLimit = false,
  loading = false,
  onEventClick,
  onUpgrade,
  backLink,
  className,
}) => {
  const formatCurrency = (amount: number) => {
    return `£${(amount / 100).toFixed(2)}`;
  };

  const pageClasses = [
    styles.analyticsPageTemplate,
    className || ''
  ].filter(Boolean).join(' ');

  const topItemsAcrossAllEvents = monthlyBreakdowns
    .flatMap(month => month.topItems)
    .reduce((acc, item) => {
      const existing = acc.find(i => i.id === item.id);
      if (existing) {
        existing.quantitySold += item.quantitySold;
        existing.revenue += item.revenue;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, [] as typeof monthlyBreakdowns[0]['topItems'])
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return (
    <div className={pageClasses}>
      {/* Header */}
      <div className={styles.analyticsPageTemplate__header}>
        {backLink && (
          <Link href={backLink} className={styles.analyticsPageTemplate__backLink}>
            ← Back
          </Link>
        )}
        <Typography variant="heading-1" as="h1" className={styles.analyticsPageTemplate__title}>
          📊 Analytics & Reports
        </Typography>
        <Typography variant="body-large" className={styles.analyticsPageTemplate__subtitle}>
          {merchantName}
        </Typography>
      </div>

      {/* Subscription Banner */}
      {subscriptionTier && (
        <div className={styles.analyticsPageTemplate__section}>
          <SubscriptionBanner
            currentTier={subscriptionTier}
            dataRetentionMonths={dataRetentionMonths}
            isApproachingLimit={isApproachingLimit}
            onUpgrade={onUpgrade}
          />
        </div>
      )}

      {/* Overview Stats */}
      <div className={styles.analyticsPageTemplate__section}>
        <Typography variant="heading-2" as="h2" className={styles.analyticsPageTemplate__sectionTitle}>
          Overview
        </Typography>
        <div className={styles.analyticsPageTemplate__statsGrid}>
          <StatCard
            label="Total Revenue"
            value={formatCurrency(overviewStats.totalRevenue)}
            icon="💰"
            variant="success"
          />
          <StatCard
            label="Total Orders"
            value={overviewStats.totalOrders.toString()}
            icon="📦"
            variant="primary"
          />
          <StatCard
            label="Total Events"
            value={overviewStats.totalEvents.toString()}
            icon="📅"
            variant="secondary"
          />
          <StatCard
            label="Avg Order Value"
            value={formatCurrency(overviewStats.averageOrderValue)}
            icon="📊"
            variant="primary"
          />
        </div>
      </div>

      {/* Top Items */}
      {topItemsAcrossAllEvents.length > 0 && (
        <div className={styles.analyticsPageTemplate__section}>
          <Typography variant="heading-2" as="h2" className={styles.analyticsPageTemplate__sectionTitle}>
            🔥 Best Selling Items
          </Typography>
          <TopItemsTable items={topItemsAcrossAllEvents} maxItems={10} showRevenue={true} />
        </div>
      )}

      {/* Recent Events */}
      {recentEvents.length > 0 && (
        <div className={styles.analyticsPageTemplate__section}>
          <Typography variant="heading-2" as="h2" className={styles.analyticsPageTemplate__sectionTitle}>
            Recent Events
          </Typography>
          <div className={styles.analyticsPageTemplate__eventsGrid}>
            {recentEvents.slice(0, 3).map((event) => (
              <EventReportCard
                key={event.id}
                eventId={event.id}
                eventName={event.name}
                startDate={event.startDate}
                endDate={event.endDate}
                revenue={event.revenue}
                orders={event.orders}
                onClick={onEventClick ? () => onEventClick(event.id) : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Events Table */}
      <div className={styles.analyticsPageTemplate__section}>
        <Typography variant="heading-2" as="h2" className={styles.analyticsPageTemplate__sectionTitle}>
          All Events
        </Typography>
        <EventReportsTable
          events={recentEvents}
          loading={loading}
          onEventClick={onEventClick}
          showFilters={true}
        />
      </div>

      {/* Staff Performance Analytics - Only for premium tiers */}
      {subscriptionTier !== 'starter' && (
        <div className={styles.analyticsPageTemplate__section}>
          <StaffAnalytics merchantId={merchantId} operatingMode={operatingMode} />
        </div>
      )}

      {/* Refire Analytics */}
      <div className={styles.analyticsPageTemplate__section}>
        <RefireAnalytics merchantId={merchantId} />
      </div>

      {/* Monthly Breakdown */}
      {monthlyBreakdowns.length > 0 && (
        <div className={styles.analyticsPageTemplate__section}>
          <Typography variant="heading-2" as="h2" className={styles.analyticsPageTemplate__sectionTitle}>
            📅 Monthly Breakdown
          </Typography>
          <div className={styles.analyticsPageTemplate__monthlyBreakdowns}>
            {monthlyBreakdowns.map((month, index) => (
              <div key={index} className={styles.analyticsPageTemplate__monthCard}>
                <div className={styles.analyticsPageTemplate__monthHeader}>
                  <Typography variant="heading-3" as="h3" className={styles.analyticsPageTemplate__monthTitle}>
                    {month.month}
                  </Typography>
                  <div className={styles.analyticsPageTemplate__monthStats}>
                    <Typography variant="body-medium" className={styles.analyticsPageTemplate__monthStat}>
                      💰 {formatCurrency(month.revenue)}
                    </Typography>
                    <Typography variant="body-medium" className={styles.analyticsPageTemplate__monthStat}>
                      📦 {month.orders} orders
                    </Typography>
                  </div>
                </div>
                {month.topItems.length > 0 && (
                  <TopItemsTable
                    items={month.topItems}
                    maxItems={5}
                    showRevenue={false}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className={styles.analyticsPageTemplate__loading}>
          <Typography variant="body-large">Loading analytics data...</Typography>
        </div>
      )}
    </div>
  );
};
