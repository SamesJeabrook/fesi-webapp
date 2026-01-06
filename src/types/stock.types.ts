// Stock Management Types

export type StockUnit = 'portions' | 'kg' | 'liters' | 'units' | 'grams' | 'ml' | 'pieces';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export type StockTransactionType = 
  | 'restock' 
  | 'deduct' 
  | 'adjust' 
  | 'restore' 
  | 'waste' 
  | 'transfer';

export interface StockItem {
  id: string;
  merchant_id: string;
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
  created_at: string;
  updated_at: string;
  stock_status?: StockStatus;
  stock_percentage?: number;
  unacknowledged_alerts?: number;
}

export interface StockTransaction {
  id: string;
  stock_item_id: string;
  transaction_type: StockTransactionType;
  quantity_change: number;
  previous_quantity: number;
  new_quantity: number;
  related_order_id?: string;
  notes?: string;
  created_at: string;
  created_by: string;
}

export interface MenuItemStockRequirement {
  id: string;
  menu_item_id: string;
  stock_item_id: string;
  quantity_required: number;
  is_optional: boolean;
  stock_name?: string;
  unit?: StockUnit;
  current_quantity?: number;
  created_at: string;
  updated_at: string;
}

export interface SubItemStockRequirement {
  id: string;
  sub_item_id: string;
  stock_item_id: string;
  quantity_required: number;
  is_optional: boolean;
  stock_name?: string;
  unit?: StockUnit;
  current_quantity?: number;
  created_at: string;
  updated_at: string;
}

export interface StockAlert {
  id: string;
  stock_item_id: string;
  alert_type: 'low_stock' | 'out_of_stock' | 'expiring';
  is_acknowledged: boolean;
  acknowledged_at?: string;
  acknowledged_by?: string;
  created_at: string;
  stock_name?: string;
  current_quantity?: number;
  low_stock_threshold?: number;
  unit?: StockUnit;
}

export interface StockSummary {
  out_of_stock_count: number;
  low_stock_count: number;
  total_items: number;
  active_items: number;
}

export interface MenuItemAvailability {
  menu_item_id: string;
  menu_item_name: string;
  merchant_id: string;
  is_available: boolean;
  stock_requirements: Array<{
    stock_item_id: string;
    stock_item_name: string;
    quantity_required: number;
    current_quantity: number;
    unit: StockUnit;
    is_optional: boolean;
    is_sufficient: boolean;
  }>;
}

export interface CreateStockItemDTO {
  name: string;
  description?: string;
  category?: string;
  unit: StockUnit;
  current_quantity: number;
  low_stock_threshold: number;
  reorder_quantity?: number;
  cost_per_unit?: number;
  supplier?: string;
}

export interface UpdateStockItemDTO {
  name?: string;
  description?: string;
  category?: string;
  unit?: StockUnit;
  low_stock_threshold?: number;
  reorder_quantity?: number;
  cost_per_unit?: number;
  supplier?: string;
  is_active?: boolean;
}

export interface AdjustStockDTO {
  quantity_change: number;
  notes?: string;
}

export interface SetStockRequirementsDTO {
  stockRequirements: Array<{
    stock_item_id: string;
    quantity_required: number;
    is_optional?: boolean;
  }>;
}

export interface BatchRestockDTO {
  restockItems: Array<{
    stockItemId: string;
    quantity: number;
    notes?: string;
  }>;
}
