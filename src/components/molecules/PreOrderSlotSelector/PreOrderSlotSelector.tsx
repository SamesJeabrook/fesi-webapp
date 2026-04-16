import React from 'react';
import { FormSelect } from '@/components/atoms';
import styles from './PreOrderSlotSelector.module.scss';

export interface TimeSlot {
  id: string;
  slot_time: string; // ISO timestamp
  slot_end_time: string; // ISO timestamp
  capacity: number;
  booked_count: number;
  available_spots: number;
  status: 'available' | 'full' | 'closed';
}

export interface PreOrderSlotSelectorProps {
  slots: TimeSlot[];
  selectedSlotId?: string;
  onSelectSlot: (slotId: string) => void;
  label?: string;
  error?: string;
  helpText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

/**
 * PreOrderSlotSelector Molecule
 * Displays a dropdown of available pre-order time slots
 * Shows availability status and remaining spots
 */
export const PreOrderSlotSelector: React.FC<PreOrderSlotSelectorProps> = ({
  slots,
  selectedSlotId,
  onSelectSlot,
  label = 'Pickup Time',
  error,
  helpText = 'Select your preferred pickup time',
  disabled = false,
  required = false,
  className = ''
}) => {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSlotLabel = (slot: TimeSlot) => {
    const startTime = formatTime(slot.slot_time);
    const endTime = formatTime(slot.slot_end_time);
    const timeRange = `${startTime} - ${endTime}`;

    if (slot.status === 'full' || slot.available_spots === 0) {
      return `${timeRange} (Full)`;
    }

    if (slot.available_spots <= 2) {
      return `${timeRange} (${slot.available_spots} spot${slot.available_spots === 1 ? '' : 's'} left)`;
    }

    return timeRange;
  };

  return (
    <div className={`${styles.slotSelector} ${className}`}>
      <FormSelect
        label={label}
        value={selectedSlotId || ''}
        onChange={(e) => onSelectSlot(e.target.value)}
        error={error}
        helpText={helpText}
        disabled={disabled || slots.length === 0}
        required={required}
        placeholder={slots.length === 0 ? 'No slots available' : 'Select a time slot'}
        options={slots.map((slot) => ({
          value: slot.id,
          label: getSlotLabel(slot),
          disabled: slot.status === 'full' || slot.available_spots === 0
        }))}
      />

      {slots.length === 0 && (
        <div className={styles.slotSelector__emptyState}>
          <span className={styles.slotSelector__emptyIcon}>📅</span>
          <p className={styles.slotSelector__emptyText}>
            No time slots available for this date
          </p>
        </div>
      )}
    </div>
  );
};

export default PreOrderSlotSelector;
