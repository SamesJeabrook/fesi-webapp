'use client'

import React from 'react';
import classNames from 'classnames';
import { MenuItemCard } from '@/components/molecules';
import type { MenuCategoryProps } from './MenuCategory.types';
import styles from './MenuCategory.module.scss';

export const MenuCategory: React.FC<MenuCategoryProps> = ({
  name,
  items,
  onItemClick,
  className,
  'data-testid': dataTestId,
}) => {
  const categoryClasses = classNames(
    styles.menuCategory,
    className
  );

  const hasItems = items && items.length > 0;

  return (
    <section 
      className={categoryClasses}
      data-testid={dataTestId}
      aria-labelledby={`category-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <header className={styles.header}>
        <h3 
          className={styles.title}
          id={`category-${name.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {name}
        </h3>
      </header>

      {hasItems ? (
        <div className={styles.itemsContainer}>
          <div 
            className={styles.itemsGrid}
            role="group"
            aria-label={`${name} menu items`}
          >
            {items.map((item) => (
              <MenuItemCard
                key={item.id}
                menuItem={item}
                onViewDetails={onItemClick}
                data-testid={`menu-item-${item.id}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          No items available in this category
        </div>
      )}
    </section>
  );
};

MenuCategory.displayName = 'MenuCategory';
