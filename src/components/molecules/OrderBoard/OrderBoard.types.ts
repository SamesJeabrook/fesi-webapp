import { OrderCardProps } from '@/components/atoms/OrderCard/OrderCard.types';

export interface OrderBoardProps {
  /** Array of orders to display */
  orders: OrderCardProps['order'][];
  /** Whether the board is in read-only mode (customer view) */
  isReadOnly?: boolean;
  /** Handler for when an order status is updated */
  onOrderStatusChange?: (orderId: string, newStatus: string) => void;
  /** Handler for when an order is clicked */
  onOrderClick?: (order: OrderCardProps['order']) => void;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string | null;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}

export interface ColumnConfig {
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'complete' | 'cancelled';
  title: string;
  acceptsDrops: boolean;
}