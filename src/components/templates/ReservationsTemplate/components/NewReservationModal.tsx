'use client';

import { useState, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { api } from '@/utils/api';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import type { Table } from '../ReservationsTemplate.types';
import styles from './ReservationModals.module.scss';

interface NewReservationModalProps {
  merchantId: string;
  tables: Table[];
  onClose: () => void;
  onSuccess: () => void;
  prefilledTime?: string;
  prefilledTableId?: string;
  prefilledDate?: string;
}

export function NewReservationModal({ 
  merchantId, 
  tables, 
  onClose, 
  onSuccess,
  prefilledTime = '',
  prefilledTableId = '',
  prefilledDate = ''
}: NewReservationModalProps) {
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState({
    reservationDate: prefilledDate || new Date().toISOString().split('T')[0],
    startTime: prefilledTime,
    guestCount: 2,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    tableIds: prefilledTableId ? [prefilledTableId] : [] as string[],
    specialRequests: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [unavailableTables, setUnavailableTables] = useState<string[]>([]);

  // Check table availability when date/time changes
  useEffect(() => {
    if (formData.reservationDate && formData.startTime) {
      checkTableAvailability();
    }
  }, [formData.reservationDate, formData.startTime]);

  const checkTableAvailability = async () => {
    try {
      const endTime = calculateEndTime(formData.startTime, 90);
      const response = await api.get(
        `/api/reservations/merchant/${merchantId}/availability?date=${formData.reservationDate}&startTime=${formData.startTime}&endTime=${endTime}`
      );
      
      // Get IDs of tables that are already booked
      const bookedTableIds = response.unavailableTables || [];
      setUnavailableTables(bookedTableIds);
      
      // Remove any selected tables that are now unavailable
      setFormData(prev => ({
        ...prev,
        tableIds: prev.tableIds.filter(id => !bookedTableIds.includes(id))
      }));
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const endTime = calculateEndTime(formData.startTime, 90); // Default 90 min duration
      
      await api.post('/api/reservations', {
        merchantId,
        tableIds: formData.tableIds.length > 0 ? formData.tableIds : null,
        customerId: null,
        reservationDate: formData.reservationDate,
        startTime: formData.startTime,
        endTime,
        guestCount: formData.guestCount,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        specialRequests: formData.specialRequests
      });

      onSuccess();
      showSuccess('Reservation created successfully');
    } catch (error: any) {
      showError(error.response?.data?.error || 'Error creating reservation');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateEndTime = (start: string, duration: number) => {
    const [hours, minutes] = start.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <Typography variant="heading-4">New Reservation</Typography>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="reservationDate">Date *</label>
            <input
              id="reservationDate"
              type="date"
              required
              value={formData.reservationDate}
              onChange={(e) => setFormData({ ...formData, reservationDate: e.target.value })}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="startTime">Time *</label>
            <input
              id="startTime"
              type="time"
              required
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="guestCount">Number of Guests *</label>
            <input
              id="guestCount"
              type="number"
              required
              min={1}
              max={20}
              value={formData.guestCount}
              onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) || 0 })}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="guestName">Guest Name *</label>
            <input
              id="guestName"
              type="text"
              required
              value={formData.guestName}
              onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="guestEmail">Email</label>
            <input
              id="guestEmail"
              type="email"
              value={formData.guestEmail}
              onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="guestPhone">Phone</label>
            <input
              id="guestPhone"
              type="tel"
              value={formData.guestPhone}
              onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Table Selection</label>
            <div className={styles.tableSelectionGroup}>
              {tables
                .sort((a, b) => (a.table_number as number) - (b.table_number as number))
                .map((table) => {
                  const isUnavailable = unavailableTables.includes(table.id);
                  const selectedCapacity = formData.tableIds
                    .map(id => tables.find(t => t.id === id)?.capacity || 0)
                    .reduce((sum, cap) => sum + cap, 0);
                  
                  return (
                    <label 
                      key={table.id} 
                      className={`${styles.checkboxLabel} ${isUnavailable ? styles.unavailable : ''}`}
                      title={isUnavailable ? 'This table is already booked for this time' : ''}
                    >
                      <input
                        type="checkbox"
                        checked={formData.tableIds.includes(table.id)}
                        disabled={isUnavailable}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, tableIds: [...formData.tableIds, table.id] });
                          } else {
                            setFormData({ ...formData, tableIds: formData.tableIds.filter(id => id !== table.id) });
                          }
                        }}
                      />
                      <span>
                        Table {table.table_number} (Capacity: {table.capacity})
                        {isUnavailable && <span className={styles.bookedBadge}> - Already Booked</span>}
                      </span>
                    </label>
                  );
                })}
            </div>
            <p className={styles.helpText}>
              Select one or more tables to combine capacity for larger groups. Leave empty for auto-assignment.
              {formData.tableIds.length > 0 && (
                <span className={styles.successText}> Combined capacity: {
                  formData.tableIds
                    .map(id => tables.find(t => t.id === id)?.capacity || 0)
                    .reduce((sum, cap) => sum + cap, 0)
                } guests.</span>
              )}
              {unavailableTables.length > 0 && (
                <span className={styles.warningText}> Note: Some tables are unavailable at this time.</span>
              )}
            </p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="specialRequests">Special Requests</label>
            <textarea
              id="specialRequests"
              rows={3}
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              className={styles.textarea}
            />
          </div>

          <div className={styles.modalActions}>
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isDisabled={submitting}>
              {submitting ? 'Creating...' : 'Create Reservation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
