export interface TableSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
  sessionId?: string;
  onSessionUpdate?: () => void;
  className?: string;
}

export interface TableSession {
  id: string;
  table_id: string;
  table_number: string;
  guest_count: number;
  seated_at: string;
  server_id?: string;
  server_name?: string;
  payment_status: 'pending' | 'partial' | 'complete';
  total_amount: number;
  paid_amount: number;
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
}
