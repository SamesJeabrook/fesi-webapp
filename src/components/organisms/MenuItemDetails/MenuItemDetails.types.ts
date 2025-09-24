import type { MenuOptionGroup } from '../../molecules/MenuOptionGroup/MenuOptionGroup.types';

export interface MenuItem {
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

export interface MenuItemDetailsProps {
  item: MenuItem | null;
  selectedOptions: Record<string, string[]>;
  onOptionsChange: (groupId: string, selected: string[]) => void;
  onAddToOrder: () => void;
  onCancel?: () => void;
  disabled?: boolean;
}
