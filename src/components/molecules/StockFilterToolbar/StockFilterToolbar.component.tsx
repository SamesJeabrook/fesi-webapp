import React from 'react';
import { Button } from '@/components/atoms';
import styles from './StockFilterToolbar.module.scss';
import type { StockFilterToolbarProps, FilterType } from './StockFilterToolbar.types';

export const StockFilterToolbar: React.FC<StockFilterToolbarProps> = ({ 
  currentFilter,
  onFilterChange,
  counts,
  onAddClick,
  className = '' 
}) => {
  const filters: { label: string; value: FilterType; count: number }[] = [
    { label: 'All Items', value: 'all', count: counts.all },
    { label: 'Low Stock', value: 'low', count: counts.low },
    { label: 'Out of Stock', value: 'out', count: counts.out },
  ];

  return (
    <div className={`${styles.toolbar} ${className}`}>
      <div className={styles.filters}>
        {filters.map(filter => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`${styles.filter} ${currentFilter === filter.value ? styles['filter--active'] : ''}`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>
      
      <Button
        onClick={onAddClick}
        variant="primary"
        size="md"
      >
        + Add Stock Item
      </Button>
    </div>
  );
};

export default StockFilterToolbar;
