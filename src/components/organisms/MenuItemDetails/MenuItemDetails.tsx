import React from 'react';
import styles from './MenuItemDetails.module.scss';
import type { MenuItemDetailsProps } from './MenuItemDetails.types';
import MenuOptionGroup from '../../molecules/MenuOptionGroup/MenuOptionGroup';
import { Typography } from '@/components/atoms';

const MenuItemDetails: React.FC<MenuItemDetailsProps> = ({ item, selectedOptions, onOptionsChange, disabled }) => {
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
            onChange={selected => onOptionsChange(group.id, selected)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuItemDetails;
