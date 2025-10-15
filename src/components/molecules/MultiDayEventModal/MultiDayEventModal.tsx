"use client";

// Multi-Day Event Modal Component
// Molecule for creating and editing multi-day events

import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@/components/atoms';
import { Modal } from '@/components/molecules';
import { DailyScheduleCard } from '@/components/molecules/DailyScheduleCard';
import { DailySchedule, EventFormData, Event } from '@/types/events';
import styles from './MultiDayEventModal.module.scss';

interface MultiDayEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => Promise<void>;
  initialData?: Event;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

export function MultiDayEventModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  mode = 'create'
}: MultiDayEventModalProps) {
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    eventType: 'multi_day',
    isOpen: false,
    schedules: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        groupEventId: initialData.group_event_id,
        isOpen: initialData.is_open,
        eventType: initialData.event_type,
        schedules: initialData.schedules?.map((schedule, index) => ({
          dayNumber: index + 1,
          date: schedule.date,
          startTime: schedule.start_time,
          endTime: schedule.end_time,
          isActive: schedule.is_active
        })) || []
      });
    } else {
      // Reset form for new event
      setFormData({
        name: '',
        eventType: 'multi_day',
        isOpen: false,
        schedules: [createDefaultSchedule(1)]
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const createDefaultSchedule = (dayNumber: number): DailySchedule => ({
    dayNumber,
    date: new Date().toISOString().split('T')[0], // Today's date
    startTime: '09:00',
    endTime: '17:00',
    isActive: true
  });

  const addScheduleDay = () => {
    const newDay = (formData.schedules?.length || 0) + 1;
    const lastDate = formData.schedules?.[formData.schedules.length - 1]?.date;
    const nextDate = lastDate 
      ? new Date(new Date(lastDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    setFormData(prev => ({
      ...prev,
      schedules: [
        ...(prev.schedules || []),
        { ...createDefaultSchedule(newDay), date: nextDate }
      ]
    }));
  };

  const updateSchedule = (index: number, schedule: DailySchedule) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules?.map((s, i) => 
        i === index ? { ...schedule, dayNumber: i + 1 } : s
      ) || []
    }));
  };

  const removeSchedule = (index: number) => {
    if ((formData.schedules?.length || 0) <= 1) return; // Keep at least one schedule
    
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules?.filter((_, i) => i !== index)
        .map((schedule, i) => ({ ...schedule, dayNumber: i + 1 })) || []
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    }

    if (!formData.schedules || formData.schedules.length === 0) {
      newErrors.schedules = 'At least one schedule is required';
    } else {
      // Validate each active schedule
      formData.schedules.forEach((schedule, index) => {
        if (schedule.isActive) {
          if (!schedule.date) {
            newErrors[`schedule-${index}-date`] = 'Date is required';
          }
          if (!schedule.startTime) {
            newErrors[`schedule-${index}-startTime`] = 'Start time is required';
          }
          if (!schedule.endTime) {
            newErrors[`schedule-${index}-endTime`] = 'End time is required';
          }
          if (schedule.startTime && schedule.endTime && schedule.startTime >= schedule.endTime) {
            newErrors[`schedule-${index}-time`] = 'End time must be after start time';
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to submit event:', error);
      setErrors({ submit: 'Failed to save event. Please try again.' });
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      eventType: 'multi_day',
      isOpen: false,
      schedules: [createDefaultSchedule(1)]
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'create' ? 'Create Multi-Day Event' : 'Edit Multi-Day Event'}
    >
      <div className={styles.multiDayModal__content}>
        <Typography variant="body-medium" className={styles.multiDayModal__description}>
          Set up an event that spans multiple days with different schedules for each day.
        </Typography>

        <div className={styles.multiDayModal__form}>
          {/* Basic Event Info */}
          <div className={styles.multiDayModal__section}>
            <Typography variant="heading-5">Event Details</Typography>
            
            <div className={styles.multiDayModal__field}>
              <label className={styles.multiDayModal__label}>Event Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter event name"
                className={`${styles.multiDayModal__input} ${errors.name ? styles.multiDayModal__input__error : ''}`}
              />
              {errors.name && (
                <span className={styles.multiDayModal__error}>{errors.name}</span>
              )}
            </div>

            <div className={styles.multiDayModal__checkboxField}>
              <label className={styles.multiDayModal__checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.isOpen}
                  onChange={(e) => setFormData(prev => ({ ...prev, isOpen: e.target.checked }))}
                />
                Event is open for orders
              </label>
            </div>
          </div>

          {/* Daily Schedules */}
          <div className={styles.multiDayModal__section}>
            <div className={styles.multiDayModal__sectionHeader}>
              <Typography variant="heading-5">Daily Schedules</Typography>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addScheduleDay}
              >
                ➕ Add Day
              </Button>
            </div>

            {errors.schedules && (
              <span className={styles.multiDayModal__error}>{errors.schedules}</span>
            )}

            <div className={styles.multiDayModal__schedules}>
              {formData.schedules?.map((schedule, index) => (
                <DailyScheduleCard
                  key={index}
                  schedule={schedule}
                  onUpdate={(updatedSchedule) => updateSchedule(index, updatedSchedule)}
                  onRemove={() => removeSchedule(index)}
                  canRemove={(formData.schedules?.length || 0) > 1}
                  dayLabel={`Day ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {errors.submit && (
          <div className={styles.multiDayModal__submitError}>
            {errors.submit}
          </div>
        )}

        <div className={styles.multiDayModal__actions}>
          <Button variant="secondary" onClick={handleClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            isDisabled={isLoading || !formData.name.trim()}
          >
            {isLoading ? 'Saving...' : mode === 'create' ? 'Create Event' : 'Update Event'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}