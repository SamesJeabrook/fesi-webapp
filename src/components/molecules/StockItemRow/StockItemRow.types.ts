import type { StockItem } from '@/types/stock.types';

export interface StockItemRowProps {
  item: StockItem;
  onAdjust: (item: StockItem) => void;
  onEdit: (item: StockItem) => void;
  className?: string;
}
