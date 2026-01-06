/**
 * MenuCard Component
 * Displays a menu card with name, description, item count, and default badge
 */

import React from 'react';
import { Typography, Button } from '@/components/atoms';
import { Menu } from '@/types/menu.types';
import styles from './MenuCard.module.scss';

export interface MenuCardProps {
  /** The menu data */
  menu: Menu;
  /** Handler for edit action */
  onEdit: (menuId: string) => void;
  /** Handler for delete action */
  onDelete: (menuId: string) => void;
  /** Handler for set as default action */
  onSetDefault: (menuId: string) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  menu,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.card__header}>
        <div className={styles.card__title}>
          <Typography variant="heading-5">{menu.name}</Typography>
          {menu.is_default && (
            <span className={styles.card__badge}>Default</span>
          )}
          {!menu.is_active && (
            <span className={`${styles.card__badge} ${styles['card__badge--inactive']}`}>
              Inactive
            </span>
          )}
        </div>
        <div className={styles.card__meta}>
          <Typography variant="body-small">
            {menu.item_count || 0} item{menu.item_count !== 1 ? 's' : ''}
          </Typography>
        </div>
      </div>

      {menu.description && (
        <div className={styles.card__description}>
          <Typography variant="body-small">
            {menu.description}
          </Typography>
        </div>
      )}

      <div className={styles.card__actions}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(menu.id)}
        >
          Edit
        </Button>
        {!menu.is_default && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSetDefault(menu.id)}
          >
            Set as Default
          </Button>
        )}
        {!menu.is_default && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(menu.id)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
