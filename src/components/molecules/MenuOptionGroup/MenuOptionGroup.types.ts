export type SelectionType = 'single' | 'multiple';

// Legacy structure (from API)
export interface MenuSubItem {
  id: string;
  name: string;
  additional_price: number;
  display_order: number;
}

// New structure (from types)
export interface MenuItemChoice {
  id: string;
  name: string;
  priceModifier: number;
  isDefault?: boolean;
}

// Unified type that supports both structures
export interface MenuOptionGroup {
  id: string;
  name: string;
  // Support both old and new property names
  selection_type?: SelectionType;
  type?: SelectionType;
  is_required?: boolean;
  required?: boolean;
  max_selections?: number | null;
  maxSelections?: number;
  // Support both old and new choice arrays
  sub_items?: MenuSubItem[];
  choices?: MenuItemChoice[];
}

export interface SelectedOptionDetail {
  id: string;
  name: string;
  price: number;
}

export interface MenuOptionGroupProps {
  group: MenuOptionGroup;
  selected: SelectedOptionDetail[];
  onChange: (selected: SelectedOptionDetail[]) => void;
  disabled?: boolean;
}
