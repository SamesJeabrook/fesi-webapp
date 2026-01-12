'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMerchant } from '@/hooks/useMerchant';
import { useNotification } from '@/contexts/NotificationContext';
import { api } from '@/utils/api';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import './reservations.scss';

interface Reservation {
  id: string;
  merchant_id: string;
  table_id: string | null;
  table_ids?: string[]; // Multiple tables support
  customer_id: string | null;
  reservation_date: string;
  start_time: string;
  end_time: string;
  guest_count: number;
  duration_minutes: number;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';
  table_number: string | null;
  customer_first_name: string | null;
  customer_last_name: string | null;
  customer_email: string | null;
  has_session: string | null;
  special_requests: string | null;
  internal_notes: string | null;
  created_at: string;
}

interface Table {
  id: string;
  table_number: string;
  capacity: number;
  status: string;
}

export default function ReservationsPage() {
  const { merchant } = useMerchant();
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
    if (merchant?.id) {
      loadReservations();
      loadTables();
    }
  }, [merchant?.id, selectedDate, filterStatus]);

  const loadReservations = async () => {
    if (!merchant?.id) return;
    
    try {
      let url = `/api/reservations/merchant/${merchant.id}?date=${selectedDate}`;
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
    if (!merchant?.id) return;
    
    try {
      const response = await api.get(`/api/tables/merchant/${merchant.id}`);
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
    // Note: For now we'll skip the reason prompt. Can be added to a custom modal later.
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

  if (!merchant) {
    return <div className="loading">Loading merchant data...</div>;
  }

  if (!merchant.reservation_enabled) {
    return (
      <div className="reservations-disabled">
        <Typography variant="heading-2">Reservations Not Enabled</Typography>
        <Typography variant="body-large">Please enable reservations in your merchant settings to use this feature.</Typography>
      </div>
    );
  }

  return (
    <div className="reservations-page">
      <div className="page-header">
        <div>
          <Link href="/merchant/admin" className="back-link">
            ← Back to Dashboard
          </Link>
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

      <div className="controls-bar">
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List View
          </button>
          <button
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            🪑 Table View
          </button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label htmlFor="date-filter">Date</label>
            <input
              id="date-filter"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
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
        <div className="loading">Loading reservations...</div>
      ) : viewMode === 'list' ? (
        reservations.length === 0 ? (
          <div className="empty-state">
            <p>No reservations found for {formatDate(selectedDate)}</p>
          </div>
        ) : (
          <div className="reservations-list">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="reservation-card">
              <div className="reservation-header">
                <div className="time-info">
                  <span className="time">{formatTime(reservation.start_time)}</span>
                  <span className="duration">{reservation.duration_minutes} min</span>
                </div>
                <div 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(reservation.status) }}
                >
                  {reservation.status}
                </div>
              </div>

              <div className="reservation-body">
                <div className="guest-info">
                  <strong>
                    {reservation.customer_first_name 
                      ? `${reservation.customer_first_name} ${reservation.customer_last_name}`
                      : reservation.guest_name}
                  </strong>
                  <span className="guest-count">👥 {reservation.guest_count} guests</span>
                </div>

                {(reservation.table_ids && reservation.table_ids.length > 0) ? (
                  <div className="table-info">
                    {reservation.table_ids.length === 1 
                      ? `Table ${tables.find(t => t.id === reservation.table_ids[0])?.table_number || reservation.table_number}`
                      : `Tables ${reservation.table_ids.map(tid => tables.find(t => t.id === tid)?.table_number).filter(Boolean).join(', ')}`
                    }
                  </div>
                ) : reservation.table_number ? (
                  <div className="table-info">
                    Table {reservation.table_number}
                  </div>
                ) : null}

                {reservation.special_requests && (
                  <div className="special-requests">
                    <em>"{reservation.special_requests}"</em>
                  </div>
                )}

                {reservation.internal_notes && (
                  <div className="internal-notes">
                    <strong>Notes:</strong> {reservation.internal_notes}
                  </div>
                )}
              </div>

              <div className="reservation-actions">
                {reservation.status === 'pending' && (
                  <>
                    <Button
                      variant="success"
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
                      disabled={!reservation.table_id && (!reservation.table_ids || reservation.table_ids.length === 0)}
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
                    href={`/merchant/admin/tables`}
                    className="btn-link"
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
        <div className="table-view">
          <div className="tables-grid">
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
                  className={`table-card ${selectedTableId === table.id ? 'selected' : ''} ${table.status}`}
                  onClick={() => setSelectedTableId(selectedTableId === table.id ? null : table.id)}
                >
                  <div className="table-header">
                    <span className="table-number">Table {table.table_number}</span>
                    <span className="capacity">👥 {table.capacity}</span>
                  </div>
                  <div className="table-status">
                    <span className={`status-dot ${table.status}`}></span>
                    {table.status}
                  </div>
                  {tableReservations.length > 0 && (
                    <div className="booking-count">
                      {tableReservations.length} booking{tableReservations.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  {nextReservation && (
                    <div className="next-booking">
                      Next: {formatTime(nextReservation.start_time)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedTableId && (
            <div className="table-bookings-panel">
              <div className="panel-header">
                <Typography variant="heading-4">
                  Table {tables.find(t => t.id === selectedTableId)?.table_number} Bookings
                </Typography>
                <button className="close-btn" onClick={() => setSelectedTableId(null)}>×</button>
              </div>
              <div className="bookings-list">
                {reservations
                  .filter(r => r.table_id === selectedTableId || (r.table_ids && r.table_ids.includes(selectedTableId)))
                  .sort((a, b) => a.start_time.localeCompare(b.start_time))
                  .map((reservation) => (
                    <div key={reservation.id} className="booking-item">
                      <div className="booking-time">
                        <strong>{formatTime(reservation.start_time)}</strong>
                        <span className="duration">{reservation.duration_minutes}min</span>
                      </div>
                      <div className="booking-details">
                        <div className="guest-name">
                          {reservation.customer_first_name 
                            ? `${reservation.customer_first_name} ${reservation.customer_last_name}`
                            : reservation.guest_name}
                        </div>
                        <div className="guest-info">
                          <span>👥 {reservation.guest_count}</span>
                          <span className={`status-badge-small ${reservation.status}`}>
                            {reservation.status}
                          </span>
                        </div>
                        {reservation.special_requests && (
                          <div className="special-requests-small">
                            {reservation.special_requests}
                          </div>
                        )}
                      </div>
                      <div className="booking-actions">
                        {reservation.status === 'pending' && (
                          <Button
                            variant="success"
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
                  <div className="no-bookings">
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
          merchant={merchant}
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

// New Reservation Modal Component
function NewReservationModal({ merchant, tables, onClose, onSuccess }: any) {
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
      const endTime = calculateEndTime(formData.startTime, merchant.min_reservation_duration);
      
      await api.post('/api/reservations', {
        merchantId: merchant.id,
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <Typography variant="heading-4">New Reservation</Typography>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reservationDate">Date *</label>
            <input
              id="reservationDate"
              type="date"
              required
              value={formData.reservationDate}
              onChange={(e) => setFormData({ ...formData, reservationDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="startTime">Time *</label>
            <input
              id="startTime"
              type="time"
              required
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="guestCount">Number of Guests *</label>
            <input
              id="guestCount"
              type="number"
              required
              min={merchant.min_guests_per_reservation}
              max={merchant.max_guests_per_reservation}
              value={formData.guestCount}
              onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="guestName">Guest Name *</label>
            <input
              id="guestName"
              type="text"
              required
              value={formData.guestName}
              onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="guestEmail">Email</label>
            <input
              id="guestEmail"
              type="email"
              value={formData.guestEmail}
              onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="guestPhone">Phone</label>
            <input
              id="guestPhone"
              type="tel"
              value={formData.guestPhone}
              onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Table Selection</label>
            <div className="table-selection-group">
              {tables
                .filter((t: Table) => t.capacity >= formData.guestCount)
                .map((table: Table) => (
                  <label key={table.id} className="checkbox-label">
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
            <p className="help-text">
              Select one or more tables for this reservation. Leave empty for auto-assignment.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="specialRequests">Special Requests</label>
            <textarea
              id="specialRequests"
              rows={3}
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Reservation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Reservation Modal Component
function EditReservationModal({ reservation, tables, onClose, onSuccess }: any) {
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <Typography variant="heading-4">Edit Reservation</Typography>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Table Selection</label>
            <div className="table-selection-group">
              {tables
                .filter((t: Table) => t.capacity >= formData.guestCount)
                .map((table: Table) => (
                  <label key={table.id} className="checkbox-label">
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
            <p className="help-text">
              Select one or more tables for this reservation. Leave empty for unassigned.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="edit-startTime">Time</label>
            <input
              id="edit-startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-guestCount">Guests</label>
            <input
              id="edit-guestCount"
              type="number"
              min="1"
              value={formData.guestCount}
              onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-internalNotes">Internal Notes</label>
            <textarea
              id="edit-internalNotes"
              rows={3}
              value={formData.internalNotes}
              onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Reservation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
