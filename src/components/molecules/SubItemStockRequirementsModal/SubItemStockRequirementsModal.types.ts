export interface SubItemStockRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subItemId: string;
  subItemName: string;
  merchantId: string;
}

export interface StockRequirementFormData {
  stock_item_id: string;
  quantity_required: number;
  is_optional: boolean;
}
