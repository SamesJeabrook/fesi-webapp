import React, { useState, useEffect } from 'react';
import { Typography, Alert, ActivityIndicator } from '@/components/atoms';
import { Button } from '@/components/atoms';
import api from '@/utils/api';
import styles from './PreOrderSlotSelector.module.scss';

interface PreOrderSlot {
  id: string;
  slot_time: string;
  slot_end_time: string;
  capacity: number;
  booked_count: number;
  available_spots: number;
  status: string;
}

interface PreOrderSlotSelectorProps {
  eventId: string;
  onSlotSelected: (slotId: string, slotTime: string) => void;
  onCancel?: () => void;
  initialSlotId?: string;
}

/**
 * PreOrderSlotSelector
 * Displays available time slots for pre-ordering
 * Allows customer to select a preferred time slot for their order
 */
export const PreOrderSlotSelector: React.FC<PreOrderSlotSelectorProps> = ({
  eventId,
  onSlotSelected,
  onCancel,
  initialSlotId,
}) => {
  const [slots, setSlots] = useState<PreOrderSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(initialSlotId || null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Fetch available slots when date changes
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(
          `/api/pre-orders/events/${eventId}/slots/available?date=${selectedDate}`
        );

        if (response.success && response.slots) {
          setSlots(response.slots);
          
          // If no slots available, show message
          if (response.slots.length === 0) {
            setError('No available slots for this date. Please try another date.');
          }
        } else {
          setError('Failed to load available slots');
        }
      } catch (err) {
        console.error('Error fetching slots:', err);
        setError('Unable to load time slots. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [eventId, selectedDate]);

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
  };

  const handleConfirm = () => {
    if (!selectedSlotId) {
      setError('Please select a time slot');
      return;
    }

    const selectedSlot = slots.find(s => s.id === selectedSlotId);
    if (!selectedSlot) {
      setError('Invalid slot selection');
      return;
    }

    onSlotSelected(selectedSlotId, selectedSlot.slot_time);
  };

  // Get minimum date (today or tomorrow if after cutoff)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  // Get maximum date (30 days from today for pre-orders)
  const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('en-GB', { 
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className={styles.slotSelector}>
      <Typography as="h3" variant="heading-4" className={styles.slotSelector__title}>
        Select Your Pickup Time
      </Typography>

      <Typography variant="body-small" className={styles.slotSelector__subtitle}>
        Choose a preferred time slot for your order
      </Typography>

      {/* Date Selector */}
      <div className={styles.slotSelector__dateSelector}>
        <label htmlFor="pickup-date" className={styles.slotSelector__label}>
          Delivery Date
        </label>
        <input
          id="pickup-date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={minDate}
          max={maxDate}
          className={styles.slotSelector__dateInput}
        />
        <Typography variant="caption" className={styles.slotSelector__dateHelper}>
          {formatDate(selectedDate)}
        </Typography>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={styles.slotSelector__loading}>
          <ActivityIndicator />
          <Typography variant="body-small">Loading available slots...</Typography>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert type="error" className={styles.slotSelector__error}>
          {error}
        </Alert>
      )}

      {/* Slots Grid */}
      {!loading && slots.length > 0 && (
        <div className={styles.slotSelector__slotsGrid}>
          {slots.map((slot) => (
            <button
              key={slot.id}
              className={`${styles.slotSelector__slot} ${
                selectedSlotId === slot.id ? styles['slotSelector__slot--selected'] : ''
              } ${slot.available_spots === 0 ? styles['slotSelector__slot--full'] : ''}`}
              onClick={() => handleSlotSelect(slot.id)}
              disabled={slot.available_spots === 0}
              type="button"
            >
              <div className={styles.slotSelector__slotTime}>
                <Typography variant="body-medium" className={styles.slotSelector__slotMain}>
                  {formatTime(slot.slot_time)}
                </Typography>
              </div>

              <div className={styles.slotSelector__slotCapacity}>
                <Typography variant="caption" className={styles.slotSelector__slotSpots}>
                  {slot.available_spots > 0 
                    ? `${slot.available_spots} spot${slot.available_spots === 1 ? '' : 's'} available` 
                    : 'Fully booked'
                  }
                </Typography>
              </div>

              {selectedSlotId === slot.id && (
                <div className={styles.slotSelector__slotBadge}>✓</div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && slots.length === 0 && !error && (
        <Alert type="warning" className={styles.slotSelector__empty}>
          No slots available for {formatDate(selectedDate)}. Try another date.
        </Alert>
      )}

      {/* Action Buttons */}
      <div className={styles.slotSelector__actions}>
        {onCancel && (
          <Button 
            variant="secondary" 
            onClick={onCancel}
            className={styles.slotSelector__cancelButton}
          >
            Cancel
          </Button>
        )}
        <Button 
          variant="primary" 
          onClick={handleConfirm}
          isDisabled={!selectedSlotId || loading}
          className={styles.slotSelector__confirmButton}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default PreOrderSlotSelector;
