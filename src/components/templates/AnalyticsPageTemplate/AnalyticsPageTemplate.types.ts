import { EventReport } from '@/components/organisms/EventReportsTable';
import { TopItemData } from '@/components/molecules/TopItemsTable';
import { SubscriptionTier } from '@/components/molecules/SubscriptionBanner';

export interface OverviewStats {
  totalRevenue: number;
  totalOrders: number;
  totalEvents: number;
  averageOrderValue: number;
}

export interface MonthlyBreakdown {
  month: string;
  revenue: number;
  orders: number;
  topItems: TopItemData[];
}

export interface AnalyticsPageTemplateProps {
  merchantName: string;
  overviewStats: OverviewStats;
  recentEvents: EventReport[];
  monthlyBreakdowns: MonthlyBreakdown[];
  subscriptionTier?: SubscriptionTier;
  dataRetentionMonths?: number;
  isApproachingLimit?: boolean;
  loading?: boolean;
  onEventClick?: (eventId: string) => void;
  onUpgrade?: () => void;
  backLink?: string;
  className?: string;
}
