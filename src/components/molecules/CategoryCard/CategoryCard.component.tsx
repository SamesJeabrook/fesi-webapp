import React from 'react';
import { Typography, Button } from '@/components/atoms';
import styles from './CategoryCard.module.scss';

export interface CategoryCardProps {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive?: boolean;
  onEdit?: (id: string) => void;
  onToggleStatus?: (id: string, currentStatus: boolean) => void;
  showStatus?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  description,
  displayOrder,
  isActive = true,
  onEdit,
  onToggleStatus,
  showStatus = false,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.card__content}>
        <div className={styles.card__header}>
          <Typography variant="heading-5">{name}</Typography>
          {showStatus && (
            <span
              className={`${styles.card__status} ${
                isActive ? styles['card__status--active'] : styles['card__status--inactive']
              }`}
            >
              {isActive ? 'Active' : 'Inactive'}
            </span>
          )}
        </div>
        
        {description && (
          <Typography
            variant="body-medium"
            style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}
          >
            {description}
          </Typography>
        )}
        
        <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
          Order: {displayOrder}
        </Typography>
      </div>

      <div className={styles.card__actions}>
        {onToggleStatus && showStatus && (
          <Button variant="secondary" size="sm" onClick={() => onToggleStatus(id, isActive)}>
            {isActive ? 'Deactivate' : 'Activate'}
          </Button>
        )}
        {onEdit && (
          <Button variant="primary" size="sm" onClick={() => onEdit(id)}>
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
