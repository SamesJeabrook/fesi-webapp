import React, { useState } from 'react';
import { Toggle, NumberInput, FormSelect, Alert } from '@/components/atoms';
import { Button, Card } from '@/components/atoms';
import styles from './PreOrderSettingsForm.module.scss';

export interface PreOrderSettings {
  enabled: boolean;
  slot_duration_minutes: number;
  orders_per_slot: number;
  min_advance_minutes: number;
  max_advance_hours: number;
  suspend_online_when_slots_full: boolean;
  max_concurrent_online_orders: number | null;
}

export interface PreOrderSettingsFormProps {
  settings?: PreOrderSettings;
  onSave: (settings: PreOrderSettings) => Promise<void> | void;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

const DEFAULT_SETTINGS: PreOrderSettings = {
  enabled: false,
  slot_duration_minutes: 15,
  orders_per_slot: 4,
  min_advance_minutes: 30,
  max_advance_hours: 48,
  suspend_online_when_slots_full: false,
  max_concurrent_online_orders: null
};

/**
 * PreOrderSettingsForm Organism
 * Complete form for configuring pre-order settings
 * Used in merchant dashboard settings page
 */
export const PreOrderSettingsForm: React.FC<PreOrderSettingsFormProps> = ({
  settings = DEFAULT_SETTINGS,
  onSave,
  onCancel,
  isLoading = false,
  className = ''
}) => {
  const [formData, setFormData] = useState<PreOrderSettings>(settings);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await onSave(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.settingsForm} ${className}`}>
      <Card className={styles.settingsForm__section}>
        <h3 className={styles.settingsForm__sectionTitle}>Pre-Order Availability</h3>
        
        <Toggle
          label="Enable Pre-Orders"
          helpText="Allow customers to schedule orders for specific time slots"
          checked={formData.enabled}
          onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
          disabled={isLoading}
        />

        {formData.enabled && (
          <Alert type="info" className={styles.settingsForm__alert}>
            <strong>Pre-orders are enabled.</strong> Configure your time slot settings below.
          </Alert>
        )}
      </Card>

      {formData.enabled && (
        <>
          <Card className={styles.settingsForm__section}>
            <h3 className={styles.settingsForm__sectionTitle}>Time Slot Configuration</h3>
            
            <div className={styles.settingsForm__row}>
              <FormSelect
                label="Slot Duration"
                value={formData.slot_duration_minutes}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  slot_duration_minutes: parseInt(e.target.value) 
                })}
                helpText="How long each time slot lasts"
                disabled={isLoading}
                required
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </FormSelect>

              <NumberInput
                label="Orders Per Slot"
                value={formData.orders_per_slot}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  orders_per_slot: parseInt(e.target.value) || 1 
                })}
                min={1}
                max={50}
                helpText="Maximum orders accepted per time slot"
                disabled={isLoading}
                required
              />
            </div>

            <div className={styles.settingsForm__example}>
              <strong>Example:</strong> With {formData.orders_per_slot} orders every{' '}
              {formData.slot_duration_minutes} minutes, you can manage up to{' '}
              {Math.floor(60 / formData.slot_duration_minutes) * formData.orders_per_slot} orders per hour.
            </div>
          </Card>

          <Card className={styles.settingsForm__section}>
            <h3 className={styles.settingsForm__sectionTitle}>Booking Time Window</h3>
            
            <div className={styles.settingsForm__row}>
              <NumberInput
                label="Minimum Advance Notice"
                value={formData.min_advance_minutes}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  min_advance_minutes: parseInt(e.target.value) || 0 
                })}
                min={0}
                max={1440}
                suffix="minutes"
                helpText="Customers must order at least this far in advance"
                disabled={isLoading}
                required
              />

              <NumberInput
                label="Maximum Advance Booking"
                value={formData.max_advance_hours}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  max_advance_hours: parseInt(e.target.value) || 1 
                })}
                min={1}
                max={168}
                suffix="hours"
                helpText="How far in advance customers can book (max 7 days)"
                disabled={isLoading}
                required
              />
            </div>
          </Card>

          <Card className={styles.settingsForm__section}>
            <h3 className={styles.settingsForm__sectionTitle}>Online Order Management</h3>
            
            <Toggle
              label="Suspend Online Orders When Slots Full"
              helpText="Stop accepting online orders when all pre-order slots are booked"
              checked={formData.suspend_online_when_slots_full}
              onChange={(e) => setFormData({ 
                ...formData, 
                suspend_online_when_slots_full: e.target.checked 
              })}
              disabled={isLoading}
            />

            <div className={styles.settingsForm__field}>
              <NumberInput
                label="Maximum Concurrent Online Orders"
                value={formData.max_concurrent_online_orders || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  max_concurrent_online_orders: e.target.value ? parseInt(e.target.value) : null 
                })}
                min={1}
                max={100}
                helpText="Limit total active online orders (leave empty for unlimited)"
                disabled={isLoading}
                placeholder="Unlimited"
              />
            </div>
          </Card>
        </>
      )}

      {error && (
        <Alert type="error" className={styles.settingsForm__alert}>
          {error}
        </Alert>
      )}

      <div className={styles.settingsForm__actions}>
        {onCancel && (
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  );
};

export default PreOrderSettingsForm;
