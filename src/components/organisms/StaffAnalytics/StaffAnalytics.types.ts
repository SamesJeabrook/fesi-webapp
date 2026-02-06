export interface StaffMember {
  id: string;
  name: string;
  role: string;
  is_active: boolean;
  total_orders: string;
  total_revenue: string;
  average_order_value: string;
  tables_served: string;
  days_worked: string;
}

export interface StaffAnalyticsData {
  overview: {
    active_staff_count: string;
    total_orders: string;
    total_revenue: string;
    average_order_value: string;
  };
  staffPerformance: StaffMember[];
  topPerformers: StaffMember[];
}

export interface StaffAnalyticsProps {
  merchantId: string;
  operatingMode?: 'event_based' | 'static';
  className?: string;
}
