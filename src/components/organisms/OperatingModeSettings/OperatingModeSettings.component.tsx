'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button, FormInput } from '@/components/atoms';
import { Card } from '@/components/atoms/Card';
import { Modal } from '@/components/molecules/Modal/Modal';
import api from '@/utils/api';
import type { OperatingModeSettingsProps, LocationData } from './OperatingModeSettings.types';
import styles from './OperatingModeSettings.module.scss';

export const OperatingModeSettings: React.FC<OperatingModeSettingsProps> = ({
  merchantId,
  currentMode = 'event_based',
  isCurrentlyOpen = false,
  onModeChange,
  className = '',
}) => {
  const [mode, setMode] = useState<'event_based' | 'static'>(currentMode);
  const [isOpen, setIsOpen] = useState(isCurrentlyOpen);
  const [location, setLocation] = useState<LocationData>({ address: '' });
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showActiveOrdersModal, setShowActiveOrdersModal] = useState(false);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);

  useEffect(() => {
    setMode(currentMode);
    setIsOpen(isCurrentlyOpen);
  }, [currentMode, isCurrentlyOpen]);

  const handleModeChange = async (newMode: 'event_based' | 'static') => {
    if (newMode === 'static' && !location.address) {
      setError('Please enter a location before switching to static mode');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await api.put(`/api/merchants/${merchantId}/operating-mode`, {
        mode: newMode,
        location: newMode === 'static' ? location : null,
      });

      setMode(newMode);
      setSuccess(`Successfully switched to ${newMode === 'static' ? 'Static' : 'Event-Based'} mode`);
      onModeChange?.();
    } catch (err: any) {
      console.error('Error updating mode:', err);
      setError(err.message || 'Failed to update operating mode');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleOpen = async (force = false) => {
    setToggling(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await api.post(`/api/merchants/${merchantId}/toggle-open`, { force });
      setIsOpen(data.is_open);
      setSuccess(data.message);
      setShowActiveOrdersModal(false);
      onModeChange?.();
    } catch (err: any) {
      console.error('Error toggling status:', err);
      
      // Check if error is about active orders
      if (err.response?.data?.activeOrders && err.response?.data?.canForce) {
        setActiveOrdersCount(err.response.data.activeOrders);
        setShowActiveOrdersModal(true);
      } else {
        setError(err.message || err.response?.data?.error || 'Failed to toggle status');
      }
    } finally {
      setToggling(false);
    }
  };

  const handleForceClose = async () => {
    await handleToggleOpen(true);
  };

  return (
    <div className={`${styles.operatingModeSettings} ${className}`}>
      <Typography variant="heading-4" className={styles.title}>
        Operating Mode
      </Typography>

      {error && (
        <div className={styles.alert}>
          <Typography variant="body-medium" className={styles.errorText}>
            ⚠️ {error}
          </Typography>
        </div>
      )}

      {success && (
        <div className={`${styles.alert} ${styles.success}`}>
          <Typography variant="body-medium" className={styles.successText}>
            ✓ {success}
          </Typography>
        </div>
      )}

      <div className={styles.modeCards}>
        <Card
          className={`${styles.modeCard} ${mode === 'event_based' ? styles.active : ''}`}
          onClick={() => !saving && handleModeChange('event_based')}
          interactive
        >
          <div className={styles.modeIcon}>🎪</div>
          <Typography variant="heading-6">Event-Based</Typography>
          <Typography variant="body-small" className={styles.modeDescription}>
            For pop-ups, markets, and mobile vendors. Create events as needed.
          </Typography>
          {mode === 'event_based' && (
            <div className={styles.activeBadge}>
              <Typography variant="body-small">Active</Typography>
            </div>
          )}
        </Card>

        <Card
          className={`${styles.modeCard} ${mode === 'static' ? styles.active : ''}`}
          interactive
        >
          <div className={styles.modeIcon}>🏪</div>
          <Typography variant="heading-6">Static Restaurant</Typography>
          <Typography variant="body-small" className={styles.modeDescription}>
            For permanent restaurants with table service and fixed location.
          </Typography>
          {mode === 'static' && (
            <div className={styles.activeBadge}>
              <Typography variant="body-small">Active</Typography>
            </div>
          )}

          {mode !== 'static' && (
            <div className={styles.locationInput}>
              <FormInput
                label="Restaurant Address"
                value={location.address}
                onChange={(e) => setLocation({ ...location, address: e.target.value })}
                placeholder="123 Main Street, London"
                required
              />
              <Button
                variant="primary"
                fullWidth
                onClick={() => handleModeChange('static')}
                isDisabled={saving || !location.address}
              >
                {saving ? 'Switching...' : 'Switch to Static Mode'}
              </Button>
            </div>
          )}
        </Card>
      </div>

      {mode === 'static' && (
        <Card className={styles.statusCard}>
          <div className={styles.statusHeader}>
            <Typography variant="heading-5">Daily Operations</Typography>
            <div className={`${styles.statusIndicator} ${isOpen ? styles.open : styles.closed}`}>
              <span className={styles.dot}>●</span>
              <Typography variant="body-medium">
                {isOpen ? 'Open for Service' : 'Closed'}
              </Typography>
            </div>
          </div>

          <Typography variant="body-medium" className={styles.statusDescription}>
            Toggle your restaurant's daily open/closed status. This creates a session to track daily revenue and orders.
          </Typography>

          <Button
            variant={isOpen ? 'outline' : 'primary'}
            fullWidth
            onClick={handleToggleOpen}
            isDisabled={toggling}
            size="lg"
          >
            {toggling 
              ? 'Processing...' 
              : isOpen 
                ? 'Close for the Day' 
                : 'Open for Business'}
          </Button>
        </Card>
      )}

      <div className={styles.infoBox}>
        <Typography variant="body-small" className={styles.infoText}>
          <strong>Note:</strong> Switching operating modes affects how you manage orders and service. 
          Event-based mode requires creating events, while static mode enables table management and daily sessions.
        </Typography>
      </div>

      <Modal
        isOpen={showActiveOrdersModal}
        onClose={() => setShowActiveOrdersModal(false)}
        title="Active Orders Warning"
        footer={
          <>
            <Button 
              variant="secondary" 
              onClick={() => setShowActiveOrdersModal(false)}
              isDisabled={toggling}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleForceClose}
              isDisabled={toggling}
            >
              {toggling ? 'Closing...' : 'Force Close & Cancel Orders'}
            </Button>
          </>
        }
      >
        <div style={{ padding: '1rem 0' }}>
          <Typography variant="body-medium" style={{ marginBottom: '1rem' }}>
            ⚠️ You have <strong>{activeOrdersCount} active order{activeOrdersCount > 1 ? 's' : ''}</strong> that {activeOrdersCount > 1 ? 'are' : 'is'} still pending, preparing, or ready.
          </Typography>
          <Typography variant="body-medium" style={{ marginBottom: '1rem' }}>
            Closing now will automatically cancel these orders. This action cannot be undone.
          </Typography>
          <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
            <strong>Recommendation:</strong> Complete or manually cancel all active orders before closing for the day.
          </Typography>
        </div>
      </Modal>
    </div>
  );
};
