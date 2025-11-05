import React from 'react';
import { Typography } from '@/components/atoms';
import styles from './POSMenuItemCard.module.scss';

export interface POSMenuItemCardProps {
  /** The menu item ID */
  id: string;
  /** The name/title of the menu item */
  title: string;
  /** The base price in cents */
  basePrice: number;
  /** Whether this item has customizable options */
  hasOptions?: boolean;
  /** Optional image URL for the item */
  imageUrl?: string;
  /** Click handler when the card is clicked */
  onClick?: () => void;
  /** Optional CSS class name */
  className?: string;
}

export const POSMenuItemCard: React.FC<POSMenuItemCardProps> = ({
  id,
  title,
  basePrice,
  hasOptions = false,
  imageUrl,
  onClick,
  className = ''
}) => {
  const formattedPrice = `£${(basePrice / 100).toFixed(2)}`;

  return (
    <button
      className={`${styles.card} ${className}`}
      onClick={onClick}
      type="button"
      aria-label={`Add ${title} to order${hasOptions ? ' (customizable)' : ''}`}
    >
      {imageUrl && (
        <div className={styles.card__image}>
          <img src={imageUrl} alt={title} />
        </div>
      )}
      
      <div className={styles.card__content}>
        <Typography variant="body-large" className={styles.card__title}>
          {title}
          {hasOptions && (
            <span 
              className={styles.card__optionsIcon}
              aria-label="Customizable options available"
            >
              ⚙️
            </span>
          )}
        </Typography>
        
        <Typography variant="body-medium" className={styles.card__price}>
          {formattedPrice}
        </Typography>
      </div>
    </button>
  );
};

export default POSMenuItemCard;
