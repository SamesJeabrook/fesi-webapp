import React, { useState, useEffect } from 'react';
import { Toggle, Alert, FormSelect } from '@/components/atoms';
import styles from './Event PreOrderConfig.module.scss';

export interface EventPreOrderConfigProps {
  eventId?: string;
  merchantId: string;
  defaultMenuId?: string;
  preOrdersEnabled?: boolean;
  preOrderMenuId?: string | null;
  availableMenus?: Array<{ id: string; name: string }>;
  hasCustomSettings?: boolean;
  onChange: (config: { preOrdersEnabled: boolean; preOrderMenuId: string | null; }) => void;
  onManageSettings?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * EventPreOrderConfig Organism
 * Configuration panel for enabling pre-orders on an event
 * Shows in event create/edit forms
 */
export const EventPreOrderConfig: React.FC<EventPreOrderConfigProps> = ({
  eventId,
  merchantId,
  defaultMenuId,
  preOrdersEnabled = false,
  preOrderMenuId = null,
  availableMenus = [],
  hasCustomSettings = false,
  onChange,
  onManageSettings,
  disabled = false,
  className = ''
}) => {
  const [enabled, setEnabled] = useState(preOrdersEnabled);
  const [selectedMenuId, setSelectedMenuId] = useState(preOrderMenuId || defaultMenuId || '');

  useEffect(() => {
    onChange({
      preOrdersEnabled: enabled,
      preOrderMenuId: enabled ? (selectedMenuId || null) : null
    });
  }, [enabled, selectedMenuId, onChange]);

  return (
    <div className={`${styles.preOrderConfig} ${className}`}>
      <div className={styles.preOrderConfig__header}>
        <h3 className={styles.preOrderConfig__title}>Pre-Orders</h3>
        <Toggle
          label="Enable Pre-Orders for This Event"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          disabled={disabled}
        />
      </div>

      {enabled && (
        <>
          {!hasCustomSettings && (
            <Alert type="warning" className={styles.preOrderConfig__alert}>
              <strong>Using System Defaults</strong>
              <p>
                You're using the default pre-order settings (4 orders every 15 minutes).{' '}
                {onManageSettings && (
                  <button 
                    type="button"
                    onClick={onManageSettings} 
                    className={styles.preOrderConfig__settingsLink}
                  >
                    Configure pre-order settings →
                  </button>
                )}
              </p>
            </Alert>
          )}

          <div className={styles.preOrderConfig__menuSelect}>
            <FormSelect
              label="Pre-Order Menu"
              value={selectedMenuId}
              onChange={(e) => setSelectedMenuId(e.target.value)}
              helpText="Which menu should be available for pre-orders"
              disabled={disabled || availableMenus.length === 0}
              required
            >
              {availableMenus.length === 0 ? (
                <option value="">No menus available</option>
              ) : (
                <>
                  <option value="">Select a menu</option>
                  {availableMenus.map((menu) => (
                    <option key={menu.id} value={menu.id}>
                      {menu.name}
                    </option>
                  ))}
                </>
              )}
            </FormSelect>
          </div>

          {hasCustomSettings && (
            <div className={styles.preOrderConfig__info}>
              <Alert type="success">
                <strong>Custom Settings Applied</strong>
                <p>
                  This event is using your customized pre-order settings.{' '}
                  {onManageSettings && (
                    <button 
                      type="button"
                      onClick={onManageSettings} 
                      className={styles.preOrderConfig__settingsLink}
                    >
                      View settings →
                    </button>
                  )}
                </p>
              </Alert>
            </div>
          )}

          <div className={styles.preOrderConfig__features}>
            <h4 className={styles.preOrderConfig__featuresTitle}>Pre-Order Features:</h4>
            <ul className={styles.preOrderConfig__featuresList}>
              <li>✓ Customers can schedule pickup times</li>
              <li>✓ Control capacity with time slots</li>
              <li>✓ Pre-orders highlighted in order dashboard</li>
              <li>✓ Reduce wait times and manage workflow</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default EventPreOrderConfig;
