// Daily Schedule Card Component
// Molecule for managing individual daily schedules within multi-day events

import React from 'react';
import { Button, Typography } from '@/components/atoms';
import { DailySchedule } from '@/types/events';
import styles from './DailyScheduleCard.module.scss';

interface DailyScheduleCardProps {
  schedule: DailySchedule;
  onUpdate: (schedule: DailySchedule) => void;
  onRemove: () => void;
  canRemove?: boolean;
  dayLabel?: string;
}

export function DailyScheduleCard({
  schedule,
  onUpdate,
  onRemove,
  canRemove = true,
  dayLabel
}: DailyScheduleCardProps) {
  const handleFieldUpdate = (field: keyof DailySchedule, value: any) => {
    onUpdate({
      ...schedule,
      [field]: value
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`${styles.scheduleCard} ${!schedule.isActive ? styles.scheduleCard__inactive : ''}`}>
      <div className={styles.scheduleCard__header}>
        <div className={styles.scheduleCard__titleSection}>
          <Typography variant="heading-6" className={styles.scheduleCard__title}>
            📅 {dayLabel || `Day ${schedule.dayNumber}`}
            {schedule.date && (
              <span className={styles.scheduleCard__dateLabel}>
                ({formatDate(schedule.date)})
              </span>
            )}
          </Typography>
        </div>
        <div className={styles.scheduleCard__controls}>
          <label className={styles.scheduleCard__activeLabel}>
            <input
              type="checkbox"
              checked={schedule.isActive}
              onChange={(e) => handleFieldUpdate('isActive', e.target.checked)}
              className={styles.scheduleCard__activeCheckbox}
            />
            Active
          </label>
          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className={styles.scheduleCard__removeButton}
            >
              🗑️
            </Button>
          )}
        </div>
      </div>
      
      <div className={styles.scheduleCard__content}>
        <div className={styles.scheduleCard__field}>
          <label className={styles.scheduleCard__fieldLabel}>
            Date
          </label>
          <input
            type="date"
            value={schedule.date}
            onChange={(e) => handleFieldUpdate('date', e.target.value)}
            className={styles.scheduleCard__input}
            disabled={!schedule.isActive}
          />
        </div>

        <div className={styles.scheduleCard__timeFields}>
          <div className={styles.scheduleCard__field}>
            <label className={styles.scheduleCard__fieldLabel}>
              🕘 Start Time
            </label>
            <input
              type="time"
              value={schedule.startTime}
              onChange={(e) => handleFieldUpdate('startTime', e.target.value)}
              className={styles.scheduleCard__input}
              disabled={!schedule.isActive}
            />
          </div>
          
          <div className={styles.scheduleCard__field}>
            <label className={styles.scheduleCard__fieldLabel}>
              🕙 End Time
            </label>
            <input
              type="time"
              value={schedule.endTime}
              onChange={(e) => handleFieldUpdate('endTime', e.target.value)}
              className={styles.scheduleCard__input}
              disabled={!schedule.isActive}
            />
          </div>
        </div>

        {/* Time validation feedback */}
        {schedule.isActive && schedule.startTime && schedule.endTime && 
         schedule.startTime >= schedule.endTime && (
          <div className={styles.scheduleCard__error}>
            ⚠️ End time must be after start time
          </div>
        )}
      </div>
    </div>
  );
}