import React from 'react';
import { StockStatCard } from '@/components/atoms';
import styles from './StockSummaryGrid.module.scss';
import type { StockSummaryGridProps } from './StockSummaryGrid.types';

export const StockSummaryGrid: React.FC<StockSummaryGridProps> = ({ 
  summary,
  className = '' 
}) => {
  return (
    <div className={`${styles.grid} ${className}`}>
      <StockStatCard
        label="Total Items"
        value={summary.total_items}
        icon="📦"
        variant="info"
      />
      <StockStatCard
        label="Active Items"
        value={summary.active_items}
        icon="✅"
        variant="success"
      />
      <StockStatCard
        label="Low Stock"
        value={summary.low_stock_count}
        icon="⚠️"
        variant="warning"
      />
      <StockStatCard
        label="Out of Stock"
        value={summary.out_of_stock_count}
        icon="⛔"
        variant="danger"
      />
    </div>
  );
};

export default StockSummaryGrid;
