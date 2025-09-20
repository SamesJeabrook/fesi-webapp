'use client'

import React from 'react';
import classNames from 'classnames';
import { Card } from '@/components/atoms';
import type { MenuItemCardProps } from './MenuItemCard.types';
import styles from './MenuItemCard.module.scss';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  menuItem,
  onViewDetails,
  className,
  'data-testid': dataTestId,
}) => {
  const { isAbove } = useBreakpoint();

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
              className={styles.image}
              loading="lazy"
            />
            {menuItem.isPopular && (
              <div className={styles.popularBadge}>
                Popular
              </div>
            )}
            {!menuItem.isAvailable && (
              <div className={styles.unavailableBadge}>
                Unavailable
              </div>
            )}
          </div>
        )}

        {/* Add Button - only show if item is available */}
        {menuItem.isAvailable && (
          <button
            className={styles.addButton}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when clicking add button
              if (onViewDetails) {
                onViewDetails(menuItem);
              }
            }}
            aria-label={`Add ${menuItem.name} to cart`}
            data-testid={`add-${menuItem.id}`}
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
          </button>
        )}
      </div>
    </Card>
  );
};

MenuItemCard.displayName = 'MenuItemCard';
