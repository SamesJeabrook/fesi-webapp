import React from 'react';
import { Typography } from '@/components/atoms';
import styles from './PreOrderNotificationBar.module.scss';

interface PreOrderNotificationBarProps {
  merchantName: string;
  upcomingEventDate?: string;
  upcomingEventTime?: string;
  upcomingEventName?: string;
}

/**
 * PreOrderNotificationBar
 * Displays a notification when pre-orders are enabled and the business is currently closed
 * Shows information about the upcoming event and encourages pre-ordering
 */
export const PreOrderNotificationBar: React.FC<PreOrderNotificationBarProps> = ({
  merchantName,
  upcomingEventDate,
  upcomingEventTime,
  upcomingEventName,
}) => {
  const formatEventDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });
    } catch {
      return null;
    }
  };

  const eventDate = formatEventDate(upcomingEventDate);

  return (
    <div className={styles.preOrderBar}>
      <div className={styles.preOrderBar__content}>
        <div className={styles.preOrderBar__icon}>📅</div>
        
        <div className={styles.preOrderBar__text}>
          <Typography 
            variant="body-medium" 
            className={styles.preOrderBar__title}
          >
            {merchantName} is Closed – Pre-Orders Available
          </Typography>
          
          <Typography 
            variant="body-small" 
            className={styles.preOrderBar__description}
          >
            Book your time slot for{' '}
            {upcomingEventName && <strong>{upcomingEventName} </strong>}
            {eventDate && <>{eventDate}{upcomingEventTime && ` at ${upcomingEventTime}`}. </>}
            {!eventDate && 'the upcoming event. '}
            Browse the menu and select your items to choose a pickup time.
          </Typography>
        </div>

        <div className={styles.preOrderBar__badge}>
          <span className={styles.preOrderBar__badgeText}>Pre-Order</span>
        </div>
      </div>
    </div>
  );
};

export default PreOrderNotificationBar;
