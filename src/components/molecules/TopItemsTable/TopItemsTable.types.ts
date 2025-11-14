export interface TopItemData {
  id: string;
  name: string;
  quantitySold: number;
  revenue: number;
}

export interface TopItemsTableProps {
  items: TopItemData[];
  maxItems?: number;
  showRevenue?: boolean;
  className?: string;
}
