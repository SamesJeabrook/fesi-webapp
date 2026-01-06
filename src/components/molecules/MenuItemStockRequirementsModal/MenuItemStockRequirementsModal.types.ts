import type { StockItem, MenuItemStockRequirement, SubItemStockRequirement } from '@/types/stock.types';

export interface StockRequirementFormData {
  stock_item_id: string;
  quantity_required: number;
  is_optional: boolean;
}

export interface MenuItemStockRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItemId: string;
  menuItemName: string;
  merchantId: string;
}

export interface StockRequirementListProps {
  requirements: MenuItemStockRequirement[] | SubItemStockRequirement[];
  onRemove: (requirementId: string) => void;
  isLoading?: boolean;
}

export interface AddStockRequirementFormProps {
  availableStockItems: StockItem[];
  onAdd: (data: StockRequirementFormData) => Promise<void>;
  isLoading?: boolean;
}
