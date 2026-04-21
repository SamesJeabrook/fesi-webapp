import React, { useState } from 'react';
import styles from './MenuItemDetails.module.scss';
import type { MenuItemDetailsProps } from './MenuItemDetails.types';
import MenuOptionGroup from '../../molecules/MenuOptionGroup/MenuOptionGroup';
import { Button, Typography } from '@/components/atoms';
import { formatPrice } from '@/utils/menu';

const MenuItemDetails: React.FC<MenuItemDetailsProps> = ({ item, selectedOptions, onOptionsChange, onAddToOrder, onCancel, disabled }) => {
  const [quantity, setQuantity] = useState(1);
  
  if (!item) return (<Typography variant='heading-2' as='h2'>No item selected</Typography>)

  // Check if all required option groups have a selection
  const allRequiredSelected = (item.option || [])
    .filter((group: any) => group.required)
    .every((group: any) => (selectedOptions[group.id] && selectedOptions[group.id].length > 0));

  const handleDecrease = () => {
    setQuantity(q => Math.max(1, q - 1));
  };
  const handleIncrease = () => {
    setQuantity(q => q + 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className={styles.image} />
        ) : (
          <div className={styles.image} />
        )}
        <div className={styles.details}>
          <Typography variant="heading-4" as="h2">{item.name}</Typography>
          <Typography variant="body-medium">{item.description}</Typography>
          <Typography variant="body-medium">{formatPrice(item.basePrice || 0)}</Typography>

          {/* Dietary & Allergen Information */}
          {((item.dietaryInfo && item.dietaryInfo.length > 0) || (item.allergens && item.allergens.length > 0)) && (
            <div style={{ 
              padding: '12px', 
              background: 'var(--color-background-secondary, #f9fafb)', 
              borderRadius: '8px',
              marginTop: '12px',
              border: '1px solid var(--color-border-primary, #e5e7eb)'
            }}>
              {/* Dietary badges */}
              {item.dietaryInfo && item.dietaryInfo.length > 0 && (
                <div style={{ marginBottom: item.allergens && item.allergens.length > 0 ? '8px' : '0' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {item.dietaryInfo.map(diet => {
                      const badges: Record<string, { emoji: string; label: string; bg: string; color: string }> = {
                        'vegan': { emoji: '🌱', label: 'Vegan', bg: 'var(--color-success-lightest, #d1fae5)', color: 'var(--color-success-dark, #065f46)' },
                        'vegetarian': { emoji: '🥬', label: 'Vegetarian', bg: 'var(--color-success-lightest, #d1fae5)', color: 'var(--color-success-dark, #065f46)' },
                        'gluten-free': { emoji: '🌾', label: 'Gluten Free', bg: 'var(--color-warning-lightest, #fef3c7)', color: 'var(--color-warning-dark, #92400e)' },
                        'dairy-free': { emoji: '🥛', label: 'Dairy Free', bg: 'var(--color-info-lightest, #dbeafe)', color: 'var(--color-info-dark, #1e40af)' },
                      };
                      const badge = badges[diet];
                      if (!badge) return null;
                      return (
                        <span key={diet} style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px', 
                          background: badge.bg, 
                          color: badge.color,
                          borderRadius: '4px', 
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {badge.emoji} {badge.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Allergen warning */}
              {item.allergens && item.allergens.length > 0 && (
                <div style={{ fontSize: '0.875rem' }}>
                  <strong style={{ color: 'var(--color-warning-dark, #92400e)' }}>⚠️ May contain:</strong>{' '}
                  <span style={{ color: 'var(--color-text-primary)' }}>
                    {item.allergens.join(', ')}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.options}>
        {(item.option || []).map((group: any) => (
          <MenuOptionGroup
            key={group.id}
            group={group}
            selected={selectedOptions[group.id] || []}
            onChange={selected => onOptionsChange(group.id, selected)}
            disabled={disabled}
          />
        ))}
      </div>
      <div className={styles.quantitySelector}>
        <Button variant="secondary" onClick={handleDecrease} isDisabled={disabled || quantity <= 1}>-</Button>
        <span className={styles.quantityValue}>{quantity}</span>
        <Button variant="secondary" onClick={handleIncrease} isDisabled={disabled}>+</Button>
      </div>
      <div className={styles.actions}>
        <Button
          variant='primary'
          className={styles.addButton}
          onClick={() => onAddToOrder(quantity)}
          isDisabled={disabled || !allRequiredSelected}
        >
          Add to Order
        </Button>
        <Button variant='secondary' className={styles.cancelButton} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default MenuItemDetails;
