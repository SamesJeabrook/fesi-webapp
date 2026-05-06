import React from 'react';
import { Typography, Button } from '@/components/atoms';
import styles from './CategoryCard.module.scss';

export interface CategoryCardProps {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  itemCount?: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  description,
  displayOrder,
  itemCount,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.card__content}>
        <div className={styles.card__header}>
          <Typography variant="heading-5">{name}</Typography>
        </div>
        
        {description && (
          <Typography
            variant="body-medium"
            style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}
          >
            {description}
          </Typography>
        )}
        
        <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
            Order: {displayOrder}
          </Typography>
          {itemCount !== undefined && (
            <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
              • {itemCount} item{itemCount !== 1 ? 's' : ''}
            </Typography>
          )}
        </div>
      </div>

      <div className={styles.card__actions}>
        {onEdit && (
          <Button variant="primary" size="sm" onClick={() => onEdit(id)}>
            Edit
          </Button>
        )}
        {onDelete && (
          <Button variant="danger" size="sm" onClick={() => onDelete(id)}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
