import type { MenuItem } from '@/types';

export interface SelectedOptionDetail {
  id: string;
  name: string;
  price: number;
}

export interface MenuItemDetailsProps {
  item: MenuItem | null;
  selectedOptions: Record<string, SelectedOptionDetail[]>;
  onOptionsChange: (groupId: string, selected: SelectedOptionDetail[]) => void;
  onAddToOrder: (quantity: number) => void;
  onCancel?: () => void;
  disabled?: boolean;
}
