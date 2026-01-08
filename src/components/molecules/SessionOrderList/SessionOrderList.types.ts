export interface SessionOrderListProps {
  orders: Array<{
    id: string;
    order_number: string;
    items: Array<{
      id: string;
      menu_item_title: string;
      quantity: number;
      unit_price: number;
      total_price: number;
      options?: Array<{
        option_group: string;
        option_title: string;
        price: number;
      }>;
    }>;
    total_amount: number;
    status: string;
    created_at: string;
  }>;
  sessionTotal: number;
  className?: string;
}
