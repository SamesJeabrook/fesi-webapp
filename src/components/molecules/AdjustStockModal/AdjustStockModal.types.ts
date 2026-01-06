import type { StockItem, StockTransactionType } from '@/types/stock.types';

export interface AdjustStockFormData {
  transaction_type: StockTransactionType;
  quantity_change: number;
  notes?: string;
}

export interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdjustStockFormData) => Promise<void>;
  stockItem: StockItem;
}

export interface AdjustStockFormProps {
  stockItem: StockItem;
  onSubmit: (data: AdjustStockFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}
