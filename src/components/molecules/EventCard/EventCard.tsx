// Event Card Component
// Molecule for displaying event information in lists and grids

import React from 'react';
import { Card, Button, Typography, Badge } from '@/components/atoms';
import { Event } from '@/types/events';
import styles from './EventCard.module.scss';

interface EventCardProps {
  event: Event;
  onView?: (event: Event) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  onToggleStatus?: (event: Event, isOpen: boolean) => void;
  showActions?: boolean;
  compact?: boolean;
}

export function EventCard({
  event,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  showActions = true,
  compact = false
}: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEventStatus = () => {
    const now = new Date();
    const startDate = new Date(event.event_start_date || event.start_time);
    const endDate = new Date(event.event_end_date || event.end_time);

    if (now < startDate) return { label: 'Upcoming', variant: 'info' as const };
    if (now > endDate) return { label: 'Ended', variant: 'default' as const };
    if (event.is_open) return { label: 'Active', variant: 'success' as const };
    return { label: 'Scheduled', variant: 'info' as const };
  };

  const status = getEventStatus();

  return (
    <Card className={`${styles.eventCard} ${compact ? styles.eventCard__compact : ''}`}>
      <div className={styles.eventCard__header}>
        <div className={styles.eventCard__titleSection}>
          <Typography variant="heading-6" className={styles.eventCard__title}>
            {event.name || 'Unnamed Event'}
            {event.merchant_name && (
              <span className={styles.eventCard__merchantName}>
                by {event.merchant_name}
              </span>
            )}
          </Typography>
          <div className={styles.eventCard__badges}>
            <Badge variant={status.variant}>
              {status.label}
            </Badge>
            <Badge variant="default">
              {event.event_type === 'multi_day' ? `${event.total_days} days` : 'Single day'}
            </Badge>
            {event.is_open && (
              <Badge variant="error">
                Open for Orders
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className={styles.eventCard__content}>
        {/* Date and Time Information */}
        <div className={styles.eventCard__info}>
          {event.event_type === 'multi_day' ? (
            <div className={styles.eventCard__dateRange}>
              📅 {formatDate(event.event_start_date!)} - {formatDate(event.event_end_date!)}
            </div>
          ) : (
            <div className={styles.eventCard__singleDate}>
              <span>📅 {formatDate(event.start_time)}</span>
              <span>
                🕒 {formatTime(event.start_time.split('T')[1])} - {formatTime(event.end_time.split('T')[1])}
              </span>
            </div>
          )}

          {/* Location Information */}
          <div className={styles.eventCard__location}>
            📍 Lat: {event.latitude.toFixed(4)}, Lng: {event.longitude.toFixed(4)}
          </div>
        </div>

        {/* Schedule Preview for Multi-day Events */}
        {event.event_type === 'multi_day' && event.schedules && event.schedules.length > 0 && !compact && (
          <div className={styles.eventCard__schedules}>
            <Typography variant="body-small" className={styles.eventCard__schedulesTitle}>
              Daily Schedules
            </Typography>
            <div className={styles.eventCard__schedulesList}>
              {event.schedules.slice(0, 3).map((schedule) => (
                <div key={schedule.id} className={styles.eventCard__scheduleItem}>
                  <span className={styles.eventCard__scheduleDay}>
                    Day {schedule.day_number} ({formatDate(schedule.date)})
                  </span>
                  <span className={`${styles.eventCard__scheduleTime} ${!schedule.is_active ? styles.eventCard__scheduleTime__inactive : ''}`}>
                    {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                  </span>
                </div>
              ))}
              {event.schedules.length > 3 && (
                <div className={styles.eventCard__scheduleMore}>
                  + {event.schedules.length - 3} more days
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {showActions && (
          <div className={styles.eventCard__actions}>
            {onView && (
              <Button variant="secondary" size="sm" onClick={() => onView(event)}>
                👁️ View
              </Button>
            )}
            {onEdit && (
              <Button variant="secondary" size="sm" onClick={() => onEdit(event)}>
                ✏️ Edit
              </Button>
            )}
            {onToggleStatus && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => onToggleStatus(event, !event.is_open)}
              >
                {event.is_open ? '⏸️ Close' : '▶️ Open'}
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => onDelete(event)}
                className={styles.eventCard__deleteButton}
              >
                🗑️ Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}