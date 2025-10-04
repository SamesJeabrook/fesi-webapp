import { OrderCardProps } from '@/components/atoms/OrderCard/OrderCard.types';

export interface CustomerOrderTrackerProps {
  /** Customer's order */
  order: OrderCardProps['order'];
  /** All orders in the queue (for position tracking) */
  queueOrders?: OrderCardProps['order'][];
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string | null;
  /** Handler for refreshing order status */
  onRefresh?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}