'use client';

import React from 'react';
import { Typography, Button } from '@/components/atoms';
import styles from './MenuItemCard.module.scss';

export interface MenuItemCardProps {
  id: string;
  title: string;
  description?: string;
  basePrice: number;
  categoryName?: string;
  isActive: boolean;
  displayOrder: number;
  onToggleAvailability?: (id: string, currentStatus: boolean) => void;
  onEdit?: (id: string) => void;
  showOrder?: boolean;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  title,
  description,
  basePrice,
  categoryName,
  isActive,
  displayOrder,
  onToggleAvailability,
  onEdit,
  showOrder = true,
}) => {
  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  return (
    <div className={`${styles.card} ${!isActive ? styles['card--inactive'] : ''}`}>
      <div className={styles.card__content}>
        <div className={styles.card__header}>
          <div className={styles.card__title}>
            <Typography variant="heading-5">
              {title}
            </Typography>
            {categoryName && (
              <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                {categoryName}
              </Typography>
            )}
          </div>
          <div className={styles.card__meta}>
            <Typography variant="heading-5" style={{ color: 'var(--color-primary)' }}>
              £{formatPrice(basePrice)}
            </Typography>
            <span className={`${styles.card__status} ${
              isActive ? styles['card__status--available'] : styles['card__status--unavailable']
            }`}>
              {isActive ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>
        {description && (
          <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
            {description}
          </Typography>
        )}
        {showOrder && (
          <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
            Order: {displayOrder}
          </Typography>
        )}
      </div>
      <div className={styles.card__actions}>
        {onToggleAvailability && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onToggleAvailability(id, isActive)}
          >
            {isActive ? 'Make Unavailable' : 'Make Available'}
          </Button>
        )}
        {onEdit && (
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => onEdit(id)}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;
