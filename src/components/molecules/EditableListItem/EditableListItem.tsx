import React, { useState } from 'react';
import { Button, Typography } from '@/components/atoms';
import { Badge } from '@/components/atoms/Badge';
import styles from './EditableListItem.module.scss';

export interface EditableListItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  badges?: Array<{
    text: string;
    variant?: 'default' | 'single' | 'multiple' | 'required' | 'optional' | 'success' | 'warning' | 'error' | 'info';
  }>;
  price?: number;
  currency?: string;
  isEditing?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: (data: any) => void;
  onCancel?: () => void;
  editForm?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const EditableListItem: React.FC<EditableListItemProps> = ({
  title,
  subtitle,
  description,
  badges = [],
  price,
  currency = '$',
  isEditing = false,
  canEdit = true,
  canDelete = false,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  editForm,
  actions,
  className = ''
}) => {
  const formatPrice = (amount: number) => {
    if (amount === 0) return 'No charge';
    const formattedAmount = Math.abs(amount / 100).toFixed(2);
    return amount >= 0 ? `+${currency}${formattedAmount}` : `-${currency}${formattedAmount}`;
  };

  return (
    <div className={`${styles.editableListItem} ${className}`}>
      {isEditing ? (
        <div className={styles.editableListItem__editMode}>
          {editForm}
        </div>
      ) : (
        <div className={styles.editableListItem__viewMode}>
          <div className={styles.editableListItem__content}>
            <div className={styles.editableListItem__header}>
              <div className={styles.editableListItem__titleSection}>
                <Typography variant="body-large" className={styles.editableListItem__title}>
                  {title}
                </Typography>
                {price !== undefined && (
                  <Typography 
                    variant="body-medium" 
                    className={`${styles.editableListItem__price} ${
                      price >= 0 ? styles['editableListItem__price--positive'] : styles['editableListItem__price--negative']
                    }`}
                  >
                    {formatPrice(price)}
                  </Typography>
                )}
              </div>
              
              {subtitle && (
                <Typography variant="body-small" className={styles.editableListItem__subtitle}>
                  {subtitle}
                </Typography>
              )}
            </div>
            
            {badges.length > 0 && (
              <div className={styles.editableListItem__badges}>
                {badges.map((badge, index) => (
                  <Badge key={index} variant={badge.variant} size="sm">
                    {badge.text}
                  </Badge>
                ))}
              </div>
            )}
            
            {description && (
              <Typography variant="body-small" className={styles.editableListItem__description}>
                {description}
              </Typography>
            )}
          </div>
          
          <div className={styles.editableListItem__actions}>
            {actions}
            {canEdit && onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit}>
                Edit
              </Button>
            )}
            {canDelete && onDelete && (
              <Button variant="ghost" size="sm" onClick={onDelete} className={styles.editableListItem__deleteButton}>
                Delete
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableListItem;