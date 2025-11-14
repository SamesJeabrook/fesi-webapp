export interface EventReport {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  revenue: number;
  orders: number;
  isOpen: boolean;
}

export interface EventReportsTableProps {
  events: EventReport[];
  loading?: boolean;
  onEventClick?: (eventId: string) => void;
  showFilters?: boolean;
  className?: string;
}
