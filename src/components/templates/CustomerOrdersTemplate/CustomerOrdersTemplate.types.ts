// Customer Orders Template Types

export interface Order {
  id: string;
  order_number: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'complete' | 'cancelled' | 'rejected';
  total_amount: number;
  created_at: string;
  event_name?: string;
  merchant_name?: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  menu_item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  options?: OrderItemOption[];
}

export interface OrderItemOption {
  sub_group_name: string;
  option_name: string;
  price_adjustment: number;
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
