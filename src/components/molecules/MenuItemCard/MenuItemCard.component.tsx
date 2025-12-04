'use client'

import React from 'react';
import classNames from 'classnames';
import { Card } from '@/components/atoms';
import type { MenuItemCardProps } from './MenuItemCard.types';
import styles from './MenuItemCard.module.scss';
import { useBreakpointSSR } from '@/hooks/useBreakpoint';

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  menuItem,
  onViewDetails,
  className,
  'data-testid': dataTestId,
}) => {
  const { isAbove } = useBreakpointSSR('lg');

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(menuItem);
    }
  };

  const cardClasses = classNames(
    styles.menuItemCard,
    {
      [styles.unavailable]: !menuItem.isAvailable,
      // Card is always clickable when available
      [styles.clickable]: menuItem.isAvailable && onViewDetails,
    },
    className
  );

  return (
    <Card
      className={cardClasses}
      variant="default"
      padding="none"
      data-testid={dataTestId}
      onClick={menuItem.isAvailable && onViewDetails ? handleViewDetails : undefined}
    >
      <div className={styles.content}>
        {/* Content */}
        <div className={styles.details}>
          <div className={styles.header}>
            <h3 className={styles.name}>{menuItem.name}</h3>
            <span className={styles.price}>
              {menuItem.price}
            </span>
          </div>

          {menuItem.description && (
            <p className={styles.description}>
              {menuItem.description}
            </p>
          )}

          {/* Meta information */}
          {isAbove('sm') && (
            <>
                <div className={styles.meta}>
                    {menuItem.preparationTime && (
                    <span className={styles.prepTime}>
                        🕒 {menuItem.preparationTime} min
                    </span>
                    )}
                    
                    {menuItem.calories && (
                    <span className={styles.calories}>
                        🔥 {menuItem.calories} cal
                    </span>
                    )}
                </div>
                {/* Dietary info */}
                {menuItem.dietaryInfo && menuItem.dietaryInfo.length > 0 && (
                    <div className={styles.dietaryInfo}>
                    {menuItem.dietaryInfo.map((diet) => (
                        <span key={diet} className={styles.dietaryBadge}>
                        {diet}
                        </span>
                    ))}
                    </div>
                )}

                {/* Allergens */}
                {menuItem.allergens && menuItem.allergens.length > 0 && (
                    <div className={styles.allergens}>
                    <span className={styles.allergensLabel}>Contains:</span>
                    <span className={styles.allergensText}>
                        {menuItem.allergens.join(', ')}
                    </span>
                    </div>
                )}
            </>
          )}
        </div>

        {/* Image */}
        {menuItem.imageUrl && (
          <div className={styles.imageContainer}>
            <img
              src={menuItem.imageUrl}
              alt={menuItem.name}
              className={classNames(styles.image, {
                [styles.unavailable]: !menuItem.isAvailable
              })}
              loading="lazy"
            />
          </div>
        )}

        {/* Popular Star - positioned on the right side of the card */}
        {menuItem.isPopular && menuItem.isAvailable && (
          <div className={styles.popularStar}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
        )}

        {/* Add Button - only show if item is available */}
        {menuItem.isAvailable && (
          <span
            className={styles.addButton}
          >
            <svg
              className={styles.addIcon}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>
    </Card>
  );
};

MenuItemCard.displayName = 'MenuItemCard';
