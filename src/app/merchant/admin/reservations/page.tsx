'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMerchant } from '@/hooks/useMerchant';
import { api } from '@/utils/api';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import './reservations.scss';

interface Reservation {
  id: string;
  merchant_id: string;
  table_id: string | null;
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
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNewReservationModal, setShowNewReservationModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

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
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error confirming reservation');
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    const reason = prompt('Cancellation reason (optional):');
    
    try {
      await api.post(`/api/reservations/${reservationId}/cancel`, {
        reason,
        cancelledBy: 'merchant'
      });
      loadReservations();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error cancelling reservation');
    }
  };

  const handleSeatCustomer = async (reservationId: string) => {
    try {
      await api.post(`/api/reservations/${reservationId}/seat`);
      loadReservations();
      alert('Customer seated successfully! Table session created.');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error seating customer');
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

      {loading ? (
        <div className="loading">Loading reservations...</div>
      ) : reservations.length === 0 ? (
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

                {reservation.table_number && (
                  <div className="table-info">
                    Table {reservation.table_number}
                  </div>
                )}

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
                      disabled={!reservation.table_id}
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
  const [formData, setFormData] = useState({
    reservationDate: new Date().toISOString().split('T')[0],
    startTime: '',
    guestCount: 2,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    tableId: '',
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
        tableId: formData.tableId || null,
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
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error creating reservation');
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
            <label htmlFor="tableId">Table (optional)</label>
            <select
              id="tableId"
              value={formData.tableId}
              onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
            >
              <option value="">Auto-assign</option>
              {tables.filter((t: Table) => t.capacity >= formData.guestCount).map((table: Table) => (
                <option key={table.id} value={table.id}>
                  Table {table.table_number} (Capacity: {table.capacity})
                </option>
              ))}
            </select>
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
  const [formData, setFormData] = useState({
    tableId: reservation.table_id || '',
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
        tableId: formData.tableId || null,
        startTime: formData.startTime + ':00',
        guestCount: formData.guestCount,
        internalNotes: formData.internalNotes
      });

      onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error updating reservation');
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
            <label htmlFor="edit-tableId">Table</label>
            <select
              id="edit-tableId"
              value={formData.tableId}
              onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
            >
              <option value="">Unassigned</option>
              {tables.filter((t: Table) => t.capacity >= formData.guestCount).map((table: Table) => (
                <option key={table.id} value={table.id}>
                  Table {table.table_number} (Capacity: {table.capacity})
                </option>
              ))}
            </select>
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
