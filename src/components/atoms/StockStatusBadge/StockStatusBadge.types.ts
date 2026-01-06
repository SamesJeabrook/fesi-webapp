export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface StockStatusBadgeProps {
  status?: StockStatus;
  className?: string;
}
