'use client'

import React from 'react';
import classNames from 'classnames';
import { MenuCategory } from '@/components/organisms';
import type { MenuDisplayProps } from './MenuDisplay.types';
import styles from './MenuDisplay.module.scss';

export const MenuDisplay: React.FC<MenuDisplayProps> = ({
  merchant,
  categories,
  onItemClick,
  isLoading = false,
  error,
  className,
  'data-testid': dataTestId,
}) => {
  const menuDisplayClasses = classNames(
    styles.menuDisplay,
    className
  );

  // Sort categories by display order
  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);

  // Loading state
  if (isLoading) {
    return (
      <div className={menuDisplayClasses} data-testid={dataTestId}>
        <div className={styles.loadingState}>
          <div aria-live="polite" aria-label="Loading menu">
            ⏳
          </div>
          <p className={styles.loadingText}>Loading menu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={menuDisplayClasses} data-testid={dataTestId}>
        <div className={styles.errorState} role="alert">
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Unable to load menu</h2>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!categories || categories.length === 0) {
    return (
      <div className={menuDisplayClasses} data-testid={dataTestId}>
        <header className={styles.merchantHeader}>
          <h1 className={styles.merchantName}>{merchant.name}</h1>
          {merchant.description && (
            <p className={styles.merchantDescription}>{merchant.description}</p>
          )}
        </header>
        
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🍽️</div>
          <h2 className={styles.emptyTitle}>No menu available</h2>
          <p className={styles.emptyMessage}>
            This restaurant hasn't added their menu yet. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={menuDisplayClasses} data-testid={dataTestId}>
      <header className={styles.merchantHeader}>
        {merchant.imageUrl && (
          <img 
            src={merchant.imageUrl}
            alt={`${merchant.name} restaurant`}
            className={styles.merchantImage}
          />
        )}
        <h1 className={styles.merchantName}>{merchant.name}</h1>
        {merchant.description && (
          <p className={styles.merchantDescription}>{merchant.description}</p>
        )}
      </header>

      <main className={styles.menuContent}>
        {sortedCategories.map((category) => (
          <MenuCategory
            key={`${category.name}-${category.displayOrder}`}
            name={category.name}
            items={category.items}
            onItemClick={onItemClick}
            data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
          />
        ))}
      </main>
    </div>
  );
};

MenuDisplay.displayName = 'MenuDisplay';
