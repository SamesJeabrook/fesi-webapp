// Customer Orders Template Types

export interface Order {
  id: string;
  order_number: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'complete' | 'cancelled' | 'rejected';
  total_amount: number;
  created_at: string;
  scheduled_time?: string;
  event_name?: string;
  merchant_name?: string;
  merchant_id?: string;
  customer_name?: string;
  customer_email?: string;
  notes?: string;
  special_instructions?: string;
  vendor_latitude?: number;
  vendor_longitude?: number;
  vendor_address?: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  menu_item_id: string;
  menu_item_title: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  customizations?: OrderItemCustomization[];
}

export interface OrderItemCustomization {
  sub_item_id: string;
  sub_item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CustomerOrdersTemplateProps {
  /**
   * Customer ID to fetch orders for
   */
  customerId?: string;
  
  /**
   * Page title
   */
  pageTitle?: string;
  
  /**
   * Whether to show the customer navigation
   */
  showNavigation?: boolean;
}

export type OrderStatus = Order['status'];

export interface OrderStatusConfig {
  label: string;
  color: string;
  icon: string;
}
