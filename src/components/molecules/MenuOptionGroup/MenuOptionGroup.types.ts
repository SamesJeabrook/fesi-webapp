export type SelectionType = 'single' | 'multiple';

export interface MenuSubItem {
  id: string;
  name: string;
  additional_price: number;
  display_order: number;
}

export interface MenuOptionGroup {
  id: string;
  name: string;
  selection_type: SelectionType;
  is_required: boolean;
  max_selections?: number | null;
  sub_items: MenuSubItem[];
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
