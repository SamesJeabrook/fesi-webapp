'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNotification } from '@/contexts/NotificationContext';
import { api } from '@/utils/api';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import type {
  ReservationsTemplateProps,
  Reservation,
  Table
} from './ReservationsTemplate.types';
import { NewReservationModal, EditReservationModal } from './components';
import styles from './ReservationsTemplate.module.scss';

export function ReservationsTemplate({
  merchantId,
  reservationsEnabled,
  showBackLink = true,
  backLinkUrl = '/merchant/admin',
  tablesPageUrl = '/merchant/admin/tables'
}: ReservationsTemplateProps) {
  const { showSuccess, showError } = useNotification();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNewReservationModal, setShowNewReservationModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  useEffect(() => {
    if (merchantId) {
      loadReservations();
      loadTables();
    }
  }, [merchantId, selectedDate, filterStatus]);

  const loadReservations = async () => {
    if (!merchantId) return;
    
    try {
      let url = `/api/reservations/merchant/${merchantId}?date=${selectedDate}`;
      if (filterStatus !== 'all') {
        url += `&status=${filterStatus}`;
      }
      
      const response = await api.get(url);
      setReservations(response.reservations || []);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTables = async () => {
    if (!merchantId) return;
    
    try {
      const response = await api.get(`/api/tables/merchant/${merchantId}`);
      setTables(response.tables || []);
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  };

  const handleConfirmReservation = async (reservationId: string) => {
    try {
      await api.post(`/api/reservations/${reservationId}/confirm`);
      loadReservations();
      showSuccess('Reservation confirmed successfully');
    } catch (error: any) {
      showError(error.response?.data?.error || 'Error confirming reservation');
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      await api.post(`/api/reservations/${reservationId}/cancel`, {
        cancelledBy: 'merchant'
      });
      loadReservations();
      showSuccess('Reservation cancelled');
    } catch (error: any) {
      showError(error.response?.data?.error || 'Error cancelling reservation');
    }
  };

  const handleSeatCustomer = async (reservationId: string) => {
    try {
      await api.post(`/api/reservations/${reservationId}/seat`);
      loadReservations();
      showSuccess('Customer seated successfully! Table session created.');
    } catch (error: any) {
      showError(error.response?.data?.error || 'Error seating customer');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'var(--color-warning)';
      case 'confirmed': return 'var(--color-success)';
      case 'seated': return 'var(--color-info)';
      case 'completed': return 'var(--color-neutral-600)';
      case 'cancelled': return 'var(--color-danger)';
      case 'no_show': return 'var(--color-danger)';
      default: return 'var(--color-neutral-500)';
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!reservationsEnabled) {
    return (
      <div className={styles.reservationsDisabled}>
        <Typography variant="heading-2">Reservations Not Enabled</Typography>
        <Typography variant="body-large">
          Please enable reservations in your merchant settings to use this feature.
        </Typography>
      </div>
    );
  }

  return (
    <div className={styles.reservations}>
      <div className={styles.reservations__header}>
        <div>
          {showBackLink && (
            <Link href={backLinkUrl} className={styles.backLink}>
              ← Back to Dashboard
            </Link>
          )}
          <Typography variant="heading-2">Reservations</Typography>
        </div>
        <Button 
          variant="primary"
          size="md"
          onClick={() => setShowNewReservationModal(true)}
        >
          + New Reservation
        </Button>
      </div>

      <div className={styles.controlsBar}>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List View
          </button>
          <button
            className={`${styles.toggleBtn} ${viewMode === 'table' ? styles.active : ''}`}
            onClick={() => setViewMode('table')}
          >
            🪑 Table View
          </button>
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label htmlFor="date-filter">Date</label>
            <input
              id="date-filter"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={styles.filterInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="seated">Seated</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading reservations...</div>
      ) : viewMode === 'list' ? (
        reservations.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No reservations found for {formatDate(selectedDate)}</p>
          </div>
        ) : (
          <div className={styles.reservationsList}>
            {reservations.map((reservation) => (
              <div key={reservation.id} className={styles.reservationCard}>
                <div className={styles.reservationCard__header}>
                  <div className={styles.timeInfo}>
                    <span className={styles.time}>{formatTime(reservation.start_time)}</span>
                    <span className={styles.duration}>{reservation.duration_minutes} min</span>
                  </div>
                  <div 
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(reservation.status) }}
                  >
                    {reservation.status}
                  </div>
                </div>

                <div className={styles.reservationCard__body}>
                  <div className={styles.guestInfo}>
                    <strong>
                      {reservation.customer_first_name 
                        ? `${reservation.customer_first_name} ${reservation.customer_last_name}`
                        : reservation.guest_name}
                    </strong>
                    <span className={styles.guestCount}>👥 {reservation.guest_count} guests</span>
                  </div>

                  {(reservation.table_ids && reservation.table_ids.length > 0) ? (
                    <div className={styles.tableInfo}>
                      {reservation.table_ids.length === 1 
                        ? `Table ${tables.find(t => t.id === reservation.table_ids![0])?.table_number || reservation.table_number}`
                        : `Tables ${reservation.table_ids!.map(tid => tables.find(t => t.id === tid)?.table_number).filter(Boolean).join(', ')}`
                      }
                    </div>
                  ) : reservation.table_number ? (
                    <div className={styles.tableInfo}>
                      Table {reservation.table_number}
                    </div>
                  ) : null}

                  {reservation.special_requests && (
                    <div className={styles.specialRequests}>
                      <em>"{reservation.special_requests}"</em>
                    </div>
                  )}

                  {reservation.internal_notes && (
                    <div className={styles.internalNotes}>
                      <strong>Notes:</strong> {reservation.internal_notes}
                    </div>
                  )}
                </div>

                <div className={styles.reservationCard__actions}>
                  {reservation.status === 'pending' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleConfirmReservation(reservation.id)}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancelReservation(reservation.id)}
                      >
                        Decline
                      </Button>
                    </>
                  )}

                  {reservation.status === 'confirmed' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSeatCustomer(reservation.id)}
                        isDisabled={!reservation.table_id && (!reservation.table_ids || reservation.table_ids.length === 0)}
                      >
                        Seat Customer
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedReservation(reservation)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancelReservation(reservation.id)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}

                  {reservation.status === 'seated' && reservation.has_session && (
                    <a
                      href={tablesPageUrl}
                      className={styles.btnLink}
                    >
                      View Table Session →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className={styles.tableView}>
          <div className={styles.tablesGrid}>
            {tables.map((table) => {
              const tableReservations = reservations.filter(r => 
                r.table_id === table.id || (r.table_ids && r.table_ids.includes(table.id))
              );
              const nextReservation = tableReservations
                .filter(r => ['pending', 'confirmed'].includes(r.status))
                .sort((a, b) => a.start_time.localeCompare(b.start_time))[0];

              return (
                <div
                  key={table.id}
                  className={`${styles.tableCard} ${selectedTableId === table.id ? styles.selected : ''} ${styles[`status-${table.status}`]}`}
                  onClick={() => setSelectedTableId(selectedTableId === table.id ? null : table.id)}
                >
                  <div className={styles.tableCard__header}>
                    <span className={styles.tableNumber}>Table {table.table_number}</span>
                    <span className={styles.capacity}>👥 {table.capacity}</span>
                  </div>
                  <div className={styles.tableCard__status}>
                    <span className={`${styles.statusDot} ${styles[`status-${table.status}`]}`}></span>
                    {table.status}
                  </div>
                  {tableReservations.length > 0 && (
                    <div className={styles.bookingCount}>
                      {tableReservations.length} booking{tableReservations.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  {nextReservation && (
                    <div className={styles.nextBooking}>
                      Next: {formatTime(nextReservation.start_time)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedTableId && (
            <div className={styles.tableBookingsPanel}>
              <div className={styles.panelHeader}>
                <Typography variant="heading-4">
                  Table {tables.find(t => t.id === selectedTableId)?.table_number} Bookings
                </Typography>
                <button className={styles.closeBtn} onClick={() => setSelectedTableId(null)}>×</button>
              </div>
              <div className={styles.bookingsList}>
                {reservations
                  .filter(r => r.table_id === selectedTableId || (r.table_ids && r.table_ids.includes(selectedTableId)))
                  .sort((a, b) => a.start_time.localeCompare(b.start_time))
                  .map((reservation) => (
                    <div key={reservation.id} className={styles.bookingItem}>
                      <div className={styles.bookingTime}>
                        <strong>{formatTime(reservation.start_time)}</strong>
                        <span className={styles.bookingDuration}>{reservation.duration_minutes}min</span>
                      </div>
                      <div className={styles.bookingDetails}>
                        <div className={styles.bookingGuest}>
                          {reservation.customer_first_name 
                            ? `${reservation.customer_first_name} ${reservation.customer_last_name}`
                            : reservation.guest_name}
                        </div>
                        <div className={styles.bookingInfo}>
                          <span>👥 {reservation.guest_count}</span>
                          <span className={`${styles.statusBadgeSmall} ${styles[`status-${reservation.status}`]}`}>
                            {reservation.status}
                          </span>
                        </div>
                        {reservation.special_requests && (
                          <div className={styles.specialRequestsSmall}>
                            {reservation.special_requests}
                          </div>
                        )}
                      </div>
                      <div className={styles.bookingActions}>
                        {reservation.status === 'pending' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleConfirmReservation(reservation.id)}
                          >
                            Confirm
                          </Button>
                        )}
                        {reservation.status === 'confirmed' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSeatCustomer(reservation.id)}
                          >
                            Seat
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                {reservations.filter(r => r.table_id === selectedTableId || (r.table_ids && r.table_ids.includes(selectedTableId))).length === 0 && (
                  <div className={styles.noBookings}>
                    <p>No bookings for this table today</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {showNewReservationModal && (
        <NewReservationModal
          merchantId={merchantId}
          tables={tables}
          onClose={() => setShowNewReservationModal(false)}
          onSuccess={() => {
            setShowNewReservationModal(false);
            loadReservations();
          }}
        />
      )}

      {selectedReservation && (
        <EditReservationModal
          reservation={selectedReservation}
          tables={tables}
          onClose={() => setSelectedReservation(null)}
          onSuccess={() => {
            setSelectedReservation(null);
            loadReservations();
          }}
        />
      )}
    </div>
  );
}
