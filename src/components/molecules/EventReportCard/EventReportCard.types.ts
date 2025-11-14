export interface EventReportCardProps {
  eventId: string;
  eventName: string;
  startDate: string;
  endDate?: string;
  revenue: number;
  orders: number;
  topItemsSummary?: string[];
  className?: string;
  onClick?: () => void;
}
