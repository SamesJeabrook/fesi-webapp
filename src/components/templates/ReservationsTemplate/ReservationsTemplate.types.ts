export interface Reservation {
  id: string;
  merchant_id: string;
  table_id: string | null;
  table_ids?: string[];
  customer_id: string | null;
  reservation_date: string;
  start_time: string;
  end_time: string;
  guest_count: number;
  duration_minutes: number;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';
  table_number: string | null;
  customer_first_name: string | null;
  customer_last_name: string | null;
  customer_email: string | null;
  has_session: string | null;
  special_requests: string | null;
  internal_notes: string | null;
  created_at: string;
}

export interface Table {
  id: string;
  table_number: string;
  capacity: number;
  status: string;
}

export interface ReservationsTemplateProps {
  /**
   * Merchant ID to load reservations for
   */
  merchantId: string;
  
  /**
   * Whether reservations are enabled for this merchant
   */
  reservationsEnabled: boolean;
  
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
  
  /**
   * Table management page URL
   * @default '/merchant/admin/tables'
   */
  tablesPageUrl?: string;
}
