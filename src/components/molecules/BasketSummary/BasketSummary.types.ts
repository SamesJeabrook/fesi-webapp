export interface CustomizationSelection {
  sub_item_id: string;
  sub_item_name: string;
  price_modifier: number;
  quantity: number;
}

export interface BasketItem {
  menu_item_id: string;
  quantity: number;
  item_total: number;
  title: string;
  customizations?: CustomizationSelection[];
}

export interface BasketSummaryProps {
  items: BasketItem[];
  total: number;
}
