import { Order } from '@/types';

export interface PublicOrderBoardProps {
  orders: Order[];
  merchantName?: string;
  isLoading?: boolean;
  className?: string;
  'data-testid'?: string;
}