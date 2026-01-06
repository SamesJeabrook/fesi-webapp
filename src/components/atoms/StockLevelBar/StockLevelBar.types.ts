import type { StockStatus } from '../StockStatusBadge/StockStatusBadge.types';

export interface StockLevelBarProps {
  percentage: number;
  status?: StockStatus;
  showPercentage?: boolean;
  className?: string;
}
