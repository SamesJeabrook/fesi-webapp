import React from 'react';
import styles from './MenuItemDetails.module.scss';
import type { MenuItemDetailsProps } from './MenuItemDetails.types';
import MenuOptionGroup from '../../molecules/MenuOptionGroup/MenuOptionGroup';
import { Button, Typography } from '@/components/atoms';
import { formatPrice } from '@/utils/menu';

const MenuItemDetails: React.FC<MenuItemDetailsProps> = ({ item, selectedOptions, onOptionsChange, onAddToOrder, onCancel, disabled }) => {
  if (!item) return (<Typography variant='heading-2' as='h2'>No item selected</Typography>)

  // Check if all required option groups have a selection
  const allRequiredSelected = item.option_groups
    .filter(group => group.is_required)
    .every(group => (selectedOptions[group.id] && selectedOptions[group.id].length > 0));

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
          <Typography variant="body-medium">{formatPrice(item.base_price)}</Typography>
        </div>
      </div>
      <div className={styles.options}>
        {item.option_groups.map(group => (
          <MenuOptionGroup
            key={group.id}
            group={group}
            selected={selectedOptions[group.id] || []}
            onChange={selected => onOptionsChange(group.id, selected)}
            disabled={disabled}
          />
        ))}
      </div>
      <div className={styles.actions}>
        <Button
          variant='primary'
          className={styles.addButton}
          onClick={onAddToOrder}
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
