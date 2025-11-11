import React from 'react';
import { Typography, Button } from '@/components/atoms';
import styles from './CategoryCard.module.scss';

export interface CategoryCardProps {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  onEdit?: (id: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  description,
  displayOrder,
  onEdit,
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
        
        <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
          Order: {displayOrder}
        </Typography>
      </div>

      <div className={styles.card__actions}>
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
