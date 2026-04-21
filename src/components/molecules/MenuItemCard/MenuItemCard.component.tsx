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

          {/* Dietary badges - show on all screen sizes */}
          {menuItem.dietaryInfo && menuItem.dietaryInfo.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
              {menuItem.dietaryInfo.map((diet) => {
                const badges: Record<string, { emoji: string; label: string }> = {
                  'vegan': { emoji: '🌱', label: 'Vegan' },
                  'vegetarian': { emoji: '🥬', label: 'Vegetarian' },
                  'gluten-free': { emoji: '🌾', label: 'GF' },
                  'dairy-free': { emoji: '🥛', label: 'DF' },
                };
                const badge = badges[diet];
                if (!badge) return null;
                return (
                  <span 
                    key={diet} 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--color-success-dark, #065f46)',
                    }}
                    title={badge.label}
                  >
                    {badge.emoji} {badge.label}
                  </span>
                );
              })}
            </div>
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

                {/* Allergens - only on larger screens */}
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

        {/* Age Restriction Badge - positioned at top-right of card */}
        {menuItem.isAgeRestricted && (
          <div className={styles.restrictionBadge} title={menuItem.restrictionWarning || `Age restricted - ${menuItem.minimumAge || 18}+`}>
            <span className={styles.restrictionIcon}>⚠️</span>
            <span className={styles.restrictionLabel}>{menuItem.minimumAge || 18}+</span>
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
