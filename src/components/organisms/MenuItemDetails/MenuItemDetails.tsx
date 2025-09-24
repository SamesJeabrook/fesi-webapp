import React from 'react';
import styles from './MenuItemDetails.module.scss';
import type { MenuItemDetailsProps } from './MenuItemDetails.types';
import MenuOptionGroup from '../../molecules/MenuOptionGroup/MenuOptionGroup';
import { Button, Typography } from '@/components/atoms';

interface MenuItemDetailsProps {
  item: any;
  selectedOptions: Record<string, string[]>;
  onOptionsChange: (groupId: string, selected: string[]) => void;
  onAddToOrder: () => void;
  onCancel?: () => void;
  disabled?: boolean;
}

const MenuItemDetails: React.FC<MenuItemDetailsProps> = ({ item, selectedOptions, onOptionsChange, onAddToOrder, onCancel, disabled }) => {
  if (!item) return (<Typography variant='heading-2' as='h2'>No item selected</Typography>)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} className={styles.image} />
        ) : (
          <div className={styles.image} />
        )}
        <div className={styles.details}>
          <Typography variant="heading-4" as="h2">{item.title}</Typography>
          <Typography variant="heading-6">{item.category_name}</Typography>
          <Typography variant="body-medium">{item.description}</Typography>
          <Typography variant="body-medium">Base Price: {item.base_price}</Typography>
        </div>
      </div>
      <div className={styles.options}>
        {item.option_groups.map(group => (
          <MenuOptionGroup
            key={group.id}
            group={group}
            selected={selectedOptions[group.id] || []}
            onChange={customizations => onOptionsChange(group.id, customizations)}
            disabled={disabled}
          />
        ))}
      </div>
      <div className={styles.actions}>
        <Button variant='primary' className={styles.addButton} onClick={onAddToOrder} isDisabled={disabled}>
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
