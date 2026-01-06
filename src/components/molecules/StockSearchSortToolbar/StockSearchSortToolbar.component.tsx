'use client';

import React from 'react';
import { FormInput, Button } from '@/components/atoms';
import styles from './StockSearchSortToolbar.module.scss';
import type { StockSearchSortToolbarProps, SortField } from './StockSearchSortToolbar.types';

export const StockSearchSortToolbar: React.FC<StockSearchSortToolbarProps> = ({
  searchQuery,
  onSearchChange,
  sortField,
  sortDirection,
  onSortChange,
  categories,
  selectedCategory,
  onCategoryFilter,
}) => {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={styles.toolbar}>
      {/* Search Bar */}
      <div className={styles.toolbar__search}>
        <FormInput
          type="text"
          placeholder="Search stock items..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.toolbar__searchInput}
        />
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className={styles.toolbar__category}>
          <select
            value={selectedCategory || ''}
            onChange={(e) => onCategoryFilter(e.target.value || null)}
            className={styles.toolbar__categorySelect}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sort Buttons */}
      <div className={styles.toolbar__sort}>
        <span className={styles.toolbar__sortLabel}>Sort by:</span>
        <Button
          variant={sortField === 'name' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onSortChange('name')}
          className={styles.toolbar__sortButton}
        >
          Name {getSortIcon('name')}
        </Button>
        <Button
          variant={sortField === 'category' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onSortChange('category')}
          className={styles.toolbar__sortButton}
        >
          Category {getSortIcon('category')}
        </Button>
        <Button
          variant={sortField === 'quantity' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onSortChange('quantity')}
          className={styles.toolbar__sortButton}
        >
          Quantity {getSortIcon('quantity')}
        </Button>
        <Button
          variant={sortField === 'status' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onSortChange('status')}
          className={styles.toolbar__sortButton}
        >
          Status {getSortIcon('status')}
        </Button>
      </div>
    </div>
  );
};

export default StockSearchSortToolbar;
