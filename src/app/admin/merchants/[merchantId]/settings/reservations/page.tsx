'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNotification } from '@/contexts/NotificationContext';
import { api } from '@/utils/api';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import './reservation-settings.scss';

interface Merchant {
  id: string;
  operating_mode?: 'event_based' | 'static';
  reservation_enabled?: boolean;
  min_reservation_duration?: number;
  max_reservation_duration?: number;
  min_guests_per_reservation?: number;
  max_guests_per_reservation?: number;
  reservation_interval?: number;
  advance_booking_days?: number;
  deposit_required?: boolean;
  deposit_percentage?: number;
  auto_confirm_reservations?: boolean;
  allow_multiple_tables?: boolean;
  require_staff_login?: boolean;
}

export default function AdminReservationSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const merchantId = params?.merchantId as string;
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [fetchingMerchant, setFetchingMerchant] = useState(true);
  const [formData, setFormData] = useState({
    reservationEnabled: false,
    minReservationDuration: 60,
    maxReservationDuration: 180,
    minGuestsPerReservation: 1,
    maxGuestsPerReservation: 10,
    reservationInterval: 30,
    advanceBookingDays: 30,
    depositRequired: false,
    depositPercentage: 20,
    autoConfirmReservations: false,
    allowMultipleTables: true,
    requireStaffLogin: false
  });

  useEffect(() => {
    const fetchMerchant = async () => {
      if (!merchantId) return;

      try {
        setFetchingMerchant(true);
        const merchantData = await api.get(`/api/merchants/${merchantId}`);
        setMerchant(merchantData.data);
      } catch (error) {
        console.error('Failed to fetch merchant:', error);
        showError('Failed to load merchant data');
      } finally {
        setFetchingMerchant(false);
      }
    };

    fetchMerchant();
  }, [merchantId, showError]);

  useEffect(() => {
    if (merchant) {
      setFormData({
        reservationEnabled: merchant.reservation_enabled || false,
        minReservationDuration: merchant.min_reservation_duration || 60,
        maxReservationDuration: merchant.max_reservation_duration || 180,
        minGuestsPerReservation: merchant.min_guests_per_reservation || 1,
        maxGuestsPerReservation: merchant.max_guests_per_reservation || 10,
        reservationInterval: merchant.reservation_interval || 30,
        advanceBookingDays: merchant.advance_booking_days || 30,
        depositRequired: merchant.deposit_required || false,
        depositPercentage: merchant.deposit_percentage || 20,
        autoConfirmReservations: merchant.auto_confirm_reservations || false,
        allowMultipleTables: merchant.allow_multiple_tables !== false, // Default to true
        requireStaffLogin: merchant.require_staff_login || false
      });
    }
  }, [merchant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) return;

    setLoading(true);
    try {
      await api.patch(`/api/merchants/${merchantId}/reservation-settings`, formData);
      
      // Refetch merchant data
      const merchantData = await api.get(`/api/merchants/${merchantId}`);
      setMerchant(merchantData.data);
      
      showSuccess('Reservation settings updated successfully!');
    } catch (error: any) {
      showError(error.message || 'Error updating settings');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingMerchant) {
    return (
      <ProtectedRoute requireRole={['admin']}>
        <div className="loading">Loading merchant data...</div>
      </ProtectedRoute>
    );
  }

  if (!merchant) {
    return (
      <ProtectedRoute requireRole={['admin']}>
        <div className="loading">Merchant not found</div>
      </ProtectedRoute>
    );
  }

  if (merchant.operating_mode !== 'static') {
    return (
      <ProtectedRoute requireRole={['admin']}>
        <div className="settings-disabled">
          <h1>Reservations Not Available</h1>
          <p>Reservations are only available for static (restaurant) locations. This merchant is in event-based mode.</p>
          <Link href={`/admin/merchants/${merchantId}/settings`} className="back-link">
            ← Back to Settings
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole={['admin']}>
      <div className="reservation-settings-page">
        <div className="page-header">
          <Link href={`/admin/merchants/${merchantId}/settings`} className="back-link">
            ← Back to Settings
          </Link>
          <h1>Reservation Settings</h1>
          <p>Configure how customers can book tables at this restaurant</p>
        </div>

        <form onSubmit={handleSubmit} className="settings-form">
          {/* Enable/Disable Reservations */}
          <div className="settings-section">
            <h2>General Settings</h2>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.reservationEnabled}
                  onChange={(e) => setFormData({ ...formData, reservationEnabled: e.target.checked })}
                />
                <span>Enable Online Reservations</span>
              </label>
              <p className="help-text">Allow customers to book tables through the website</p>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.autoConfirmReservations}
                  onChange={(e) => setFormData({ ...formData, autoConfirmReservations: e.target.checked })}
                />
                <span>Auto-Confirm Reservations</span>
              </label>
              <p className="help-text">Automatically confirm bookings without manual approval</p>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.allowMultipleTables}
                  onChange={(e) => setFormData({ ...formData, allowMultipleTables: e.target.checked })}
                />
                <span>Allow Multiple Tables per Reservation</span>
              </label>
              <p className="help-text">Enable for large parties that need tables joined together</p>
            </div>
          </div>

          {/* Staff Security Settings */}
          <div className="settings-section">
            <h2>Staff Security</h2>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.requireStaffLogin}
                  onChange={(e) => setFormData({ ...formData, requireStaffLogin: e.target.checked })}
                />
                <span>Require Staff PIN Login</span>
              </label>
              <p className="help-text">Require staff to enter their PIN before accessing POS and Table Service</p>
            </div>
          </div>

          {/* Duration Settings */}
          <div className="settings-section">
            <h2>Reservation Duration</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="minDuration">Minimum Duration (minutes)</label>
                <input
                  id="minDuration"
                  type="number"
                  min="15"
                  max="480"
                  step="15"
                  value={formData.minReservationDuration}
                  onChange={(e) => setFormData({ ...formData, minReservationDuration: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxDuration">Maximum Duration (minutes)</label>
                <input
                  id="maxDuration"
                  type="number"
                  min="30"
                  max="480"
                  step="15"
                  value={formData.maxReservationDuration}
                  onChange={(e) => setFormData({ ...formData, maxReservationDuration: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Guest Settings */}
          <div className="settings-section">
            <h2>Party Size</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="minGuests">Minimum Guests</label>
                <input
                  id="minGuests"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.minGuestsPerReservation}
                  onChange={(e) => setFormData({ ...formData, minGuestsPerReservation: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxGuests">Maximum Guests</label>
                <input
                  id="maxGuests"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.maxGuestsPerReservation}
                  onChange={(e) => setFormData({ ...formData, maxGuestsPerReservation: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Booking Settings */}
          <div className="settings-section">
            <h2>Booking Availability</h2>
            
            <div className="form-group">
              <label htmlFor="interval">Time Slot Interval (minutes)</label>
              <select
                id="interval"
                value={formData.reservationInterval}
                onChange={(e) => setFormData({ ...formData, reservationInterval: parseInt(e.target.value) })}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
              </select>
              <p className="help-text">How often time slots are available for booking</p>
            </div>

            <div className="form-group">
              <label htmlFor="advanceBooking">Advance Booking Window (days)</label>
              <input
                id="advanceBooking"
                type="number"
                min="1"
                max="365"
                value={formData.advanceBookingDays}
                onChange={(e) => setFormData({ ...formData, advanceBookingDays: parseInt(e.target.value) })}
                required
              />
              <p className="help-text">How far in advance customers can book</p>
            </div>
          </div>

          {/* Deposit Settings */}
          <div className="settings-section">
            <h2>Deposit & Payment</h2>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.depositRequired}
                  onChange={(e) => setFormData({ ...formData, depositRequired: e.target.checked })}
                />
                <span>Require Deposit for Reservations</span>
              </label>
              <p className="help-text">Charge a deposit to secure reservations</p>
            </div>

            {formData.depositRequired && (
              <div className="form-group">
                <label htmlFor="depositPercentage">Deposit Amount (%)</label>
                <input
                  id="depositPercentage"
                  type="number"
                  min="10"
                  max="100"
                  step="5"
                  value={formData.depositPercentage}
                  onChange={(e) => setFormData({ ...formData, depositPercentage: parseInt(e.target.value) })}
                  required
                />
                <p className="help-text">Percentage of estimated bill to charge as deposit</p>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
