export interface RefireOverview {
  totalRefiredOrders: number;
  totalRefiredItems: number;
  refireRatePercentage: number;
}

export interface RefiredItem {
  id: string;
  name: string;
  refireCount: number;
  ordersAffected: number;
}

export interface RefireHourlyData {
  hour: number;
  timeRange: string;
  refireCount: number;
}

export interface RefireDailyTrend {
  date: string;
  refiredOrders: number;
  refiredItems: number;
}

export interface RefireEventData {
  id: string;
  name: string;
  startTime: string;
  refiredOrders: number;
  refiredItems: number;
  refireRate: number;
}

export interface RefireAnalyticsProps {
  merchantId: string;
  startDate?: string;
  endDate?: string;
  className?: string;
}
