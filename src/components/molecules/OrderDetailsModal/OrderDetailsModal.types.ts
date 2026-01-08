export interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    order_number: string;
    status: string;
    customer_name?: string;
    customer_email?: string;
    order_type?: 'delivery' | 'pickup';
    special_instructions?: string;
    notes?: string;
    created_at: string;
    items: OrderItem[];
    subtotal?: number;
    subtotal_amount?: number;
    delivery_fee?: number;
    platform_fee?: number;
    total?: number;
    total_amount?: number;
    payment_status?: string;
    delivery_address?: {
      line1: string;
      line2?: string;
      city: string;
      postcode: string;
    };
  };
  onRefund?: (orderId: string) => void;
  onRefire?: (orderId: string, itemIds?: string[], newStatus?: string, refiredAt?: string) => void;
  merchantId: string;
}

export interface OrderItem {
  id: string;
  menu_item_id: string;
  menu_item_name?: string;
  menu_item_title?: string; // API sometimes uses this field
  quantity: number;
  item_base_price?: number;
  item_total?: number;
  unit_price?: number; // API uses this field
  total_price?: number; // API uses this field
  customizations?: Array<{
    sub_item_id: string;
    sub_item_name: string;
    price_modifier?: number; // Frontend uses this
    unit_price?: number; // API uses this
    total_price?: number; // API uses this
    quantity: number;
  }>;
  special_instructions?: string;
}
