'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMerchant } from '@/hooks/useMerchant';
import { api } from '@/utils/api';
import './reservation-settings.scss';

export default function ReservationSettingsPage() {
  const { merchant, refetchMerchant } = useMerchant();
  const [loading, setLoading] = useState(false);
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
    autoConfirmReservations: false
  });

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
        autoConfirmReservations: merchant.auto_confirm_reservations || false
      });
    }
  }, [merchant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant?.id) return;

    setLoading(true);
    try {
      await api.patch(`/api/merchants/${merchant.id}/reservation-settings`, formData);
      await refetchMerchant();
      alert('Reservation settings updated successfully!');
    } catch (error: any) {
      alert(error.message || 'Error updating settings');
    } finally {
      setLoading(false);
    }
  };

  if (!merchant) {
    return <div className="loading">Loading merchant data...</div>;
  }

  if (merchant.operating_mode !== 'static') {
    return (
      <div className="settings-disabled">
        <h1>Reservations Not Available</h1>
        <p>Reservations are only available for static (restaurant) locations. Your merchant is in event-based mode.</p>
      </div>
    );
  }

  return (
    <div className="reservation-settings-page">
      <div className="page-header">
        <Link href="/merchant/admin/settings" className="back-link">
          ← Back to Settings
        </Link>
        <h1>Reservation Settings</h1>
        <p>Configure how customers can book tables at your restaurant</p>
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
            <p className="help-text">Allow customers to book tables through your website</p>
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
  );
}
