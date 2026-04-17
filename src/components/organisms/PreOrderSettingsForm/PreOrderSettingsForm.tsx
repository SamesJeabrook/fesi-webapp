import React, { useState, useEffect } from 'react';
import { Toggle, NumberInput, FormSelect, Alert } from '@/components/atoms';
import { Button, Card } from '@/components/atoms';
import styles from './PreOrderSettingsForm.module.scss';

export interface PreOrderSettings {
  enabled: boolean;
  require_time_slot_selection: boolean; // Force all orders to use time slots (not just pre-orders)
  slot_duration_minutes: number;
  orders_per_slot: number;
  capacity_type: 'orders' | 'items';
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
  require_time_slot_selection: false,
  slot_duration_minutes: 15,
  orders_per_slot: 4,
  capacity_type: 'orders',
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

  // Update form data when settings prop changes
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

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
          helpText="Allow customers to schedule orders for future dates"
          checked={formData.enabled}
          onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
          disabled={isLoading}
        />

        <Toggle
          label="Require Time Slot Selection"
          helpText="Force all orders to use time slots (including today) - customers must pick a delivery/pickup time"
          checked={formData.require_time_slot_selection}
          onChange={(e) => setFormData({ ...formData, require_time_slot_selection: e.target.checked })}
          disabled={isLoading}
        />

        {(formData.enabled || formData.require_time_slot_selection) && (
          <Alert type="info" className={styles.settingsForm__alert}>
            {formData.require_time_slot_selection ? (
              <><strong>Slot-based ordering is active.</strong> All customers must select a time slot. Configure your time slot settings below.</>
            ) : (
              <><strong>Pre-orders are enabled.</strong> Configure your time slot settings below.</>
            )}
          </Alert>
        )}
      </Card>

      {(formData.enabled || formData.require_time_slot_selection) && (
        <>
          <Card className={styles.settingsForm__section}>
            <h3 className={styles.settingsForm__sectionTitle}>Time Slot Configuration</h3>
            
            <div className={styles.settingsForm__row}>
              <FormSelect
                label="Slot Duration"
                value={formData.slot_duration_minutes.toString()}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  slot_duration_minutes: parseInt(e.target.value) 
                })}
                helpText="How long each time slot lasts"
                disabled={isLoading}
                required
                options={[
                  { value: '15', label: '15 minutes' },
                  { value: '30', label: '30 minutes' },
                  { value: '45', label: '45 minutes' },
                  { value: '60', label: '1 hour' },
                  { value: '90', label: '1.5 hours' },
                  { value: '120', label: '2 hours' }
                ]}
              />

              <FormSelect
                label="Capacity Type"
                value={formData.capacity_type}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  capacity_type: e.target.value as 'orders' | 'items'
                })}
                helpText={formData.capacity_type === 'orders' 
                  ? 'Limit by number of orders' 
                  : 'Limit by total item quantity'}
                disabled={isLoading}
                required
                options={[
                  { value: 'orders', label: 'Orders (count of orders)' },
                  { value: 'items', label: 'Items (quantity of items)' }
                ]}
              />
            </div>

            <div className={styles.settingsForm__row}>
              <NumberInput
                label={formData.capacity_type === 'orders' ? 'Orders Per Slot' : 'Items Per Slot'}
                value={formData.orders_per_slot}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  orders_per_slot: parseInt(e.target.value) || 1 
                })}
                min={1}
                max={50}
                helpText={formData.capacity_type === 'orders'
                  ? 'Maximum orders accepted per time slot'
                  : 'Maximum total items (e.g., pizzas) per time slot'}
                disabled={isLoading}
                required
              />
            </div>

            <div className={styles.settingsForm__example}>
              <strong>Example:</strong> 
              {formData.capacity_type === 'orders' ? (
                <> With {formData.orders_per_slot} orders every{' '}
                {formData.slot_duration_minutes} minutes, you can manage up to{' '}
                {Math.floor(60 / formData.slot_duration_minutes) * formData.orders_per_slot} orders per hour.</>
              ) : (
                <> With {formData.orders_per_slot} items every{' '}
                {formData.slot_duration_minutes} minutes, you can produce up to{' '}
                {Math.floor(60 / formData.slot_duration_minutes) * formData.orders_per_slot} items per hour.
                An order with 4 pizzas will use 4 slots of capacity.</>
              )}
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
            isDisabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          variant="primary"
          isDisabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  );
};

export default PreOrderSettingsForm;
