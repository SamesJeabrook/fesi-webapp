/**
 * Type definitions for OptionGroupSelector component
 */

export interface SubItemGroup {
  id: string;
  merchant_id: string;
  name: string;
  description?: string;
  selection_type: 'single' | 'multiple';
  is_required: boolean;
  max_selections?: number;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  sub_items?: SubItem[];
}

export interface SubItem {
  id: string;
  group_id: string;
  name: string;
  additional_price: number;
  display_order: number;
  is_active: boolean;
}

export interface OptionGroupSelectorProps {
  /** Available option groups to choose from */
  availableGroups: SubItemGroup[];
  
  /** Currently selected/assigned option group IDs */
  selectedGroupIds: string[];
  
  /** Callback when selection changes */
  onChange: (selectedIds: string[]) => void;
  
  /** Whether the selector is disabled */
  disabled?: boolean;
  
  /** Whether to show loading state */
  loading?: boolean;
  
  /** Optional error message to display */
  error?: string;
}
