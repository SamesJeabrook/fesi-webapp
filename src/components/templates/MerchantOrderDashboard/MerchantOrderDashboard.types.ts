import { OrderCardProps } from '@/components/atoms/OrderCard/OrderCard.types';

export interface MerchantOrderDashboardProps {
  /** Merchant information */
  merchant: {
    id: string;
    name: string;
    email: string;
  };
  /** Array of orders to display */
  orders: OrderCardProps['order'][];
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string | null;
  /** Handler for when an order status is updated */
  onOrderStatusChange?: (orderId: string, newStatus: string) => void;
  /** Handler for refreshing orders */
  onRefresh?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}