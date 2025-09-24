export interface MenuSubItem {
  id: string;
  name: string;
  additional_price: number;
  display_order: number;
}

export interface MenuOptionGroup {
  id: string;
  name: string;
  selection_type: 'single' | 'multiple';
  is_required: boolean;
  max_selections?: number | null;
  sub_items: MenuSubItem[];
}

export interface LegacyMenuItem {
  id: string;
  merchant_id: string;
  category_id: string;
  title: string;
  description: string;
  image_url: string;
  base_price: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name: string;
  option_groups: MenuOptionGroup[];
}

export interface SelectedOptionDetail {
  id: string;
  name: string;
  price: number;
}

export interface MenuItemDetailsProps {
  item: LegacyMenuItem | null;
  selectedOptions: Record<string, SelectedOptionDetail[]>;
  onOptionsChange: (groupId: string, selected: SelectedOptionDetail[]) => void;
  onAddToOrder: (quantity: number) => void;
  onCancel?: () => void;
  disabled?: boolean;
}
