export interface EventAnalyticsPageTemplateProps {
  eventName: string;
  startDate: string;
  endDate: string;
  isOpen: boolean;
  stats: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  topItems: Array<{
    id: string;
    name: string;
    quantitySold: number;
    revenue: number;
  }>;
  hourlyBreakdown: Array<{
    hour: number;
    orders: number;
    revenue: number;
  }>;
  loading?: boolean;
  backLink?: string;
  className?: string;
}
