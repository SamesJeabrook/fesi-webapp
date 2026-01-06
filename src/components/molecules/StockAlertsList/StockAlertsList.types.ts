import type { StockAlert } from '@/types/stock.types';

export interface StockAlertsListProps {
  alerts: StockAlert[];
  onDismiss: (alertId: string) => void;
  maxVisible?: number;
  className?: string;
}
