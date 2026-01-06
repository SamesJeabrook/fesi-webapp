export type StockStatVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface StockStatCardProps {
  label: string;
  value: number | string;
  icon: string;
  variant?: StockStatVariant;
  className?: string;
}
