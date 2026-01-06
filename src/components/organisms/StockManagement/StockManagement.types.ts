import type { StockItem } from '@/types/stock.types';

export interface StockManagementProps {
  merchantId: string;
}

export interface StockManagementState {
  stockItems: StockItem[];
  isLoading: boolean;
  selectedItem: StockItem | null;
  showCreateModal: boolean;
  filter: 'all' | 'low' | 'out';
}
