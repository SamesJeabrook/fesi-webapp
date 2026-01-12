export interface TableSession {
  id: string;
  table_id: string;
  table_number: string;
  guest_count: number;
  seated_at: string;
  status: string;
  total_amount: number;
  payment_status: string;
}

export interface CartItemCustomization {
  sub_item_id: string;
  sub_item_name: string;
  price_modifier: number;
  quantity: number;
}

export interface CartItem {
  menu_item_id: string;
  title: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  customizations: CartItemCustomization[];
  notes?: string;
}

export interface TableServiceTemplateProps {
  /**
   * Merchant ID to load data for
   */
  merchantId: string;
  
  /**
   * Show back link to dashboard
   * @default true
   */
  showBackLink?: boolean;
  
  /**
   * Back link URL
   * @default '/merchant/admin'
   */
  backLinkUrl?: string;
}
