'use client';

import { useState } from 'react';
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
}

export function NewReservationModal({ merchantId, tables, onClose, onSuccess }: NewReservationModalProps) {
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState({
    reservationDate: new Date().toISOString().split('T')[0],
    startTime: '',
    guestCount: 2,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    tableIds: [] as string[],
    specialRequests: ''
  });
  const [submitting, setSubmitting] = useState(false);

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
              onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
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
                .filter((t) => t.capacity >= formData.guestCount)
                .map((table) => (
                  <label key={table.id} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.tableIds.includes(table.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, tableIds: [...formData.tableIds, table.id] });
                        } else {
                          setFormData({ ...formData, tableIds: formData.tableIds.filter(id => id !== table.id) });
                        }
                      }}
                    />
                    <span>Table {table.table_number} (Capacity: {table.capacity})</span>
                  </label>
                ))}
            </div>
            <p className={styles.helpText}>
              Select one or more tables for this reservation. Leave empty for auto-assignment.
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
