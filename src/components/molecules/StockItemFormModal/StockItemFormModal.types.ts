import type { StockItem, StockUnit } from '@/types/stock.types';

export interface StockItemFormData {
  name: string;
  description?: string;
  category?: string;
  unit: StockUnit;
  current_quantity: number;
  low_stock_threshold: number;
  reorder_quantity?: number;
  cost_per_unit?: number;
  supplier?: string;
  is_active: boolean;
}

export interface StockItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StockItemFormData) => Promise<void>;
  initialData?: StockItem;
  mode: 'create' | 'edit';
  existingCategories?: string[];
}

export interface StockItemFormProps {
  initialData?: StockItem;
  onSubmit: (data: StockItemFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  existingCategories?: string[];
}
