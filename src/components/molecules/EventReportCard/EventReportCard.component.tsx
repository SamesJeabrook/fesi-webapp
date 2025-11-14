import React from 'react';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/atoms/Card';
import { EventReportCardProps } from './EventReportCard.types';
import styles from './EventReportCard.module.scss';

export const EventReportCard: React.FC<EventReportCardProps> = ({
  eventId,
  eventName,
  startDate,
  endDate,
  revenue,
  orders,
  topItemsSummary = [],
  className,
  onClick,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    return `£${(amount / 100).toFixed(2)}`;
  };

  const dateRange = endDate 
    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
    : formatDate(startDate);

  const cardClasses = [
    styles.eventReportCard,
    onClick ? styles['eventReportCard--clickable'] : '',
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      <Card variant="outlined">
        <div className={styles.eventReportCard__header}>
          <Typography variant="heading-4" className={styles.eventReportCard__title}>
            {eventName}
          </Typography>
          <Typography variant="body-small" className={styles.eventReportCard__date}>
            📅 {dateRange}
          </Typography>
        </div>

        <div className={styles.eventReportCard__stats}>
          <div className={styles.eventReportCard__stat}>
            <Typography variant="body-small" className={styles.eventReportCard__statLabel}>
              Revenue
            </Typography>
            <Typography variant="heading-3" className={styles.eventReportCard__statValue}>
              {formatCurrency(revenue)}
            </Typography>
          </div>

          <div className={styles.eventReportCard__stat}>
            <Typography variant="body-small" className={styles.eventReportCard__statLabel}>
              Orders
            </Typography>
            <Typography variant="heading-3" className={styles.eventReportCard__statValue}>
              {orders}
            </Typography>
          </div>
        </div>

        {topItemsSummary.length > 0 && (
          <div className={styles.eventReportCard__topItems}>
            <Typography variant="body-small" className={styles.eventReportCard__topItemsLabel}>
              🔥 Top Items
            </Typography>
            <ul className={styles.eventReportCard__topItemsList}>
              {topItemsSummary.slice(0, 3).map((item, index) => (
                <li key={index} className={styles.eventReportCard__topItem}>
                  <Typography variant="body-small">{item}</Typography>
                </li>
              ))}
            </ul>
          </div>
        )}

        {onClick && (
          <div className={styles.eventReportCard__footer}>
            <Typography variant="body-small" className={styles.eventReportCard__viewDetails}>
              View Details →
            </Typography>
          </div>
        )}
      </Card>
    </div>
  );
};
