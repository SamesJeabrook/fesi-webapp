import React from 'react';
import styles from './POSCategoryFilter.module.scss';

export interface POSCategoryFilterProps {
  /** Array of category names */
  categories: string[];
  /** Currently selected category */
  selectedCategory: string;
  /** Handler for category change */
  onCategoryChange?: (category: string) => void;
  /** Optional CSS class name */
  className?: string;
}

export const POSCategoryFilter: React.FC<POSCategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  className = ''
}) => {
  const formatCategoryName = (category: string) => {
    if (!category || typeof category !== 'string') return 'Unknown';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const handleClick = (category: string) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  return (
    <div className={`${styles.filter} ${className}`} role="tablist">
      {categories.map(category => (
        <button
          key={category}
          type="button"
          role="tab"
          aria-selected={selectedCategory === category}
          className={`${styles.filter__tab} ${selectedCategory === category ? styles['filter__tab--active'] : ''}`}
          onClick={() => handleClick(category)}
        >
          {formatCategoryName(category)}
        </button>
      ))}
    </div>
  );
};

export default POSCategoryFilter;
