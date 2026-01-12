'use client';

import { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { api } from '@/utils/api';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import type { Reservation, Table } from '../ReservationsTemplate.types';
import styles from './ReservationModals.module.scss';

interface EditReservationModalProps {
  reservation: Reservation;
  tables: Table[];
  onClose: () => void;
  onSuccess: () => void;
}

export function EditReservationModal({ reservation, tables, onClose, onSuccess }: EditReservationModalProps) {
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState({
    tableIds: (reservation.table_ids || []) as string[],
    startTime: reservation.start_time.substring(0, 5),
    guestCount: reservation.guest_count,
    internalNotes: reservation.internal_notes || ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.patch(`/api/reservations/${reservation.id}`, {
        tableIds: formData.tableIds.length > 0 ? formData.tableIds : null,
        startTime: formData.startTime + ':00',
        guestCount: formData.guestCount,
        internalNotes: formData.internalNotes
      });

      onSuccess();
      showSuccess('Reservation updated successfully');
    } catch (error: any) {
      showError(error.response?.data?.error || 'Error updating reservation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <Typography variant="heading-4">Edit Reservation</Typography>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
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
              Select one or more tables for this reservation. Leave empty for unassigned.
            </p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="edit-startTime">Time</label>
            <input
              id="edit-startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="edit-guestCount">Guests</label>
            <input
              id="edit-guestCount"
              type="number"
              min="1"
              value={formData.guestCount}
              onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="edit-internalNotes">Internal Notes</label>
            <textarea
              id="edit-internalNotes"
              rows={3}
              value={formData.internalNotes}
              onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
              className={styles.textarea}
            />
          </div>

          <div className={styles.modalActions}>
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isDisabled={submitting}>
              {submitting ? 'Updating...' : 'Update Reservation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
